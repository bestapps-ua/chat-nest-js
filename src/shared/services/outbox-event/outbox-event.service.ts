import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OutboxEventEntity } from '../../entities/outbox-event.entity';
import {
    OutboxEventStatusType,
    OutboxEventType,
} from '../../types/outbox-event.type';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageBrokerService } from '../message-broker/message-broker.service';
import { v7 as uuidv7 } from 'uuid';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

@Injectable()
export class OutboxEventService {
    @InjectRepository(OutboxEventEntity)
    declare protected repository: Repository<OutboxEventEntity>;

    private readonly logger = new Logger(OutboxEventService.name);
    @Inject(DataSource) private dataSource: DataSource;
    @Inject(EventEmitter2) public eventEmitter: EventEmitter2;
    @Inject(MessageBrokerService)
    public messageBrokerService: MessageBrokerService;

    private processing: boolean = false;

    constructor() {
        process.nextTick(() => {
            this.process();
        });
    }

    async init(data: Partial<OutboxEventType>) {
        data.uid = await this.generateUid();
        return this.repository.create(data);
    }

    async getNext() {
        return await this.repository.find({
            where: { status: OutboxEventStatusType.Pending },
            order: { created: 'ASC' },
            take: 10,
        });
    }

    async process() {
        if (this.processing) {
            return;
        }
        this.processing = true;
        const pendingEvents = await this.getNext();

        for (const event of pendingEvents) {
            try {
                await this.dataSource.transaction(
                    async (transactionalEntityManager) => {
                        event.status = OutboxEventStatusType.Processing;
                        await transactionalEntityManager.save(event);

                        await this.messageBrokerService.publishTopicMessage(
                            'event.' + event.eventType,
                            event.payload,
                        );

                        event.status = OutboxEventStatusType.Completed;
                        event.processed = new Date().getTime() / 1000;
                        await transactionalEntityManager.save(event);
                    },
                );
            } catch (error) {
                this.logger.error(
                    `Failed to publish outbox event ${event.id}: ${error.message}`,
                    error.stack,
                );
                event.status = OutboxEventStatusType.Failed;
                await this.repository.save(event);
            }
        }

        this.processing = false;

        let t = setTimeout(() => {
            this.process();
        }, 1000);
    }

    async findOneByUid(uid: string): Promise<ObjectLiteral | null> {
        return await this.repository.findOne({
            where: {
                uid,
            },
        });
    }

    async generateUid() {
        let uid = 'outboxEvent.' + uuidv7();
        let entity = await this.findOneByUid(uid);
        if(!entity) {
            return uid;
        }
        return await this.generateUid();
    }
}
