import { DataSource, DeepPartial, EventSubscriber, FindOptionsWhere, InsertEvent, Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

import { BaseEntity, EntityServiceInterface } from '../../interfaces/entity-service.interface';
import { UidVO } from '../../vo/uid.vo';
import { EntityVO } from '../../vo/entity.vo';
import { VO } from '../../vo/vo';
import { EntityInterface } from '../../interfaces/entity.interface';
import { SharedEventType } from '../../types/event.type';
import { Inject } from '@nestjs/common';
import { OutboxEventService } from '../outbox-event/outbox-event.service';
import { OutboxEventStatusType } from '../../types/outbox-event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityType } from '../../types/entity-type.type';
import { EntityCreatedEvent } from '../../events/entity.created.event';
import { v7 as uuidv7 } from 'uuid';


@EventSubscriber()
export class SQLEntityService<ET extends BaseEntity> implements EntityServiceInterface {
    protected repository: Repository<ET>;

    protected uidPrefix: string = '';
    private dataSource: DataSource;
    @Inject(OutboxEventService) private outboxEventService: OutboxEventService;
    @Inject(EventEmitter2) public eventEmitter: EventEmitter2;

    protected relations: string[] = [];

    constructor(@Inject(DataSource) dataSource: DataSource) {
        this.dataSource = dataSource;
        this.dataSource.subscribers.push(this);
    }

    async findAll(): Promise<ET[]> {
        return await this.repository.find();
    }

    async findOneByUid(uid: string): Promise<ET | null> {
        return await this.repository.findOne({
            where: { uid } as FindOptionsWhere<ET>,
            relations: this.relations,
        });
    }

    async create<CreateDtoType>(entityDto: CreateDtoType): Promise<ObjectLiteral> {
        return this.dataSource.transaction(
            async (transactionalEntityManager) => {
                let entity = transactionalEntityManager.create(this.repository.metadata.target, entityDto as DeepPartial<ET>) as ET;
                await transactionalEntityManager.save(entity);

                const outbox = await this.sendCreated(entity);
                await transactionalEntityManager.save(outbox);
                return entity;
            },
        );
    }

    async remove(uid: string): Promise<ObjectLiteral[] | undefined> {
        let entity = await this.findOneByUid(uid);
        if (entity) {
            return await this.repository.remove([entity]);
        }
    }

    async update<UpdateDtoType>(
        uid: string,
        entityDto: UpdateDtoType,
    ): Promise<ObjectLiteral | undefined> {
        let entity = await this.findOneByUid(uid);
        if (entity) {
            Object.assign(entity, entityDto);
            return await this.repository.save(entity);
        }
    }

    async getVO(uid: string): Promise<EntityVO<EntityInterface> | VO<string>> {
        return UidVO.create(uid);
    }

    private async sendCreated(entity: ObjectLiteral) {
        return await this.outboxEventService.init({
            aggregateType: entity.constructor.name,
            aggregateId: entity.uid,
            eventType: SharedEventType.EntityCreated,
            payload: entity,
            status: OutboxEventStatusType.Pending,
        });
    }

    async generateUid() {
        let uid = this.uidPrefix + '.' + uuidv7();
        let entity = await this.findOneByUid(uid);
        if (!entity) {
            return uid;
        }
        return await this.generateUid();
    }

    async afterInsert(event: InsertEvent<any>) {
        if (
            event.entity.uid.substring(0, this.uidPrefix.length + 1) ===
            this.uidPrefix + '.'
        ) {
            setTimeout(async () => {
                try {
                    let vo: EntityVO<EntityInterface> = (await this.getVO(
                        event.entity.uid,
                    )) as EntityVO<EntityInterface>;

                    this.eventEmitter.emit(
                        SharedEventType.EntityCreated,
                        new EntityCreatedEvent<EntityInterface>(EntityType.SQL, vo),
                    );
                } catch (err) {
                    console.error(err);
                }
            }, 100);
        }
    }
}
