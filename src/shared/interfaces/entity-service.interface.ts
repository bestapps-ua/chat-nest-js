import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import mongoose from 'mongoose';

export interface BaseEntity extends ObjectLiteral {
    uid: string;
    // Add other common properties that all your entities might share (e.g., id, createdAt, updatedAt)
}

export interface EntityServiceInterface {
  findAll(): Promise<ObjectLiteral[]>;
  findOneByUid(uid: string): Promise<ObjectLiteral | null>;
  create<CreateDtoType>(entityDto: CreateDtoType): Promise<ObjectLiteral>;
  remove(uid: string): Promise<ObjectLiteral[] | mongoose.DeleteResult | undefined>;
  update<UpdateDtoType>(uid: string, entityDto: UpdateDtoType): Promise<ObjectLiteral | undefined>;
}
