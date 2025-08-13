import { Injectable } from '@nestjs/common';
import { NOSQLEntityService } from '../../../shared/services/entity/NOSQLEntityService';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { ProfileKey } from '../../schemas/profile-key.scheme';
import { CreateProfileKeyDto } from '../../dto/create-profile-key.dto';

@Injectable()
export class ProfileKeyService extends NOSQLEntityService {

    uidPrefix: string = 'profileKey';

    @InjectModel(ProfileKey.name) declare protected model: Model<ProfileKey>;

    async create<CreateDtoType>(
        entityDto: CreateDtoType,
    ): Promise<ObjectLiteral> {
        let dto = entityDto as CreateProfileKeyDto;
        let data = {
            uid: await this.generateUid(),
            userId: dto.userId,
            publicKey: dto.publicKey,
        };
        return super.create(data);
    }

    async findOneByUserId(userId: string): Promise<ProfileKey | null> {
        return await this.model.findOne({
            userId,
        }).exec();
    }
}
