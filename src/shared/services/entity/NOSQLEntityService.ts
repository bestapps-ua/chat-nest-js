
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

import { CreateDto } from '../../dto/dto';
import { EntityServiceInterface } from '../../interfaces/entity-service.interface';
import { UidVO } from '../../vo/uid.vo';
import { EntityVO } from '../../vo/entity.vo';
import { VO } from '../../vo/vo';
import { EntityInterface } from '../../interfaces/entity.interface';
import mongoose, { Connection, Model, Schema } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { v7 as uuidv7 } from 'uuid';


export class NOSQLEntityService implements EntityServiceInterface {
    protected model: mongoose.Model<any>;
    @InjectConnection() protected connection: Connection;

    protected uidPrefix: string = '';

    async findAll(): Promise<ObjectLiteral[]> {
        return await this.model.find().exec();
    }

    async findOneByUid(uid: string): Promise<ObjectLiteral | null> {
        return await this.model.findOne({
            uid,
        }).exec();
    }

    async create<CreateDtoType>(entityDto: CreateDtoType): Promise<ObjectLiteral> {
        const entity = new this.model(entityDto as CreateDto);
        return entity.save();
    }

    async remove(uid: string): Promise<mongoose.DeleteResult | undefined> {
        let entity = await this.findOneByUid(uid);
        if (entity) {
            return await this.model.deleteOne({ uid }).exec();
        }
    }

    async update<UpdateDtoType>(
        uid: string,
        entityDto: UpdateDtoType,
    ): Promise<ObjectLiteral | undefined> {
        let entity = await this.findOneByUid(uid);
        if (entity) {
            for (const key in entityDto) {
                entity[key] = entityDto[key];
            }
            return await this.model.updateOne({uid}, {$set: entity}).exec();
        }
    }

    async getVO(uid: string): Promise<EntityVO<EntityInterface> | VO<string>> {
        return UidVO.create(uid);
    }

    async generateUid() {
        let uid = this.uidPrefix + '.' + uuidv7();
        let entity = await this.findOneByUid(uid);
        if (!entity) {
            return uid;
        }
        return await this.generateUid();
    }
}
