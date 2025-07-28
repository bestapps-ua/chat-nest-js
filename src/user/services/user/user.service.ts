import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { SQLEntityService } from '../../../shared/services/entity/SQLEntityService';
import { ApiUserService } from '../api/api-user/api-user.service';
import { UserVO } from '../../vo/user.vo';
import { ApiUserCredentialService } from '../api/api-user-credential/api-user-credential.service';
import { ApiUserParamService } from '../api/api-user-param/api-user-param.service';
import { EmailVO } from '../../vo/email.vo';
import { UsernameVO } from '../../vo/username.vo';
import { PasswordVO } from '../../vo/password.vo';
import { UserCredentialType } from '../../types/user.credential.type';
import { EntityVO } from '../../../shared/vo/entity.vo';
import { EntityInterface } from '../../../shared/interfaces/entity.interface';
import { VO } from '../../../shared/vo/vo';
import { NumberVO } from '../../../shared/vo/number.vo';

@Injectable()
export class UserService extends SQLEntityService<UserEntity> {
    @InjectRepository(UserEntity)
    declare protected repository: Repository<UserEntity>;
    @Inject(ApiUserService) private apiUserService: ApiUserService;
    @Inject(ApiUserParamService) private apiUserParamsService: ApiUserParamService;
    @Inject(ApiUserCredentialService) private apiUserCredentialService: ApiUserCredentialService;

    uidPrefix: string = 'user';

    async findOneByEmail(email: string) {
        return await this.apiUserService.findByEmail(email);
    }

    async encryptPassword(password: string) {
        return await this.apiUserService.encryptPassword(password);
    }

    async getVO(uid: string): Promise<EntityVO<EntityInterface> | VO<string>> {
        let user = await this.findOneByUid(uid);
        let apiUser = await this.apiUserService.get(uid);
        //let apiUserParams = await this.apiUserParamsService.getAll(uid);
        let apiUserCredentials =
            await this.apiUserCredentialService.getAll(uid);

        let emailCredential = apiUserCredentials.find(
            (credential) => credential.type === UserCredentialType.Email,
        );
        let usernameCredential = apiUserCredentials.find(
            (credential) => credential.type === UserCredentialType.Username,
        );

        let emailVo = EmailVO.create(emailCredential?.credential);
        let usernameVo = UsernameVO.create(usernameCredential?.credential);
        let passwordVo = PasswordVO.create(apiUser?.password);
        let updatedVo = NumberVO.create(user?.updated);
        let createdVo = NumberVO.create(user?.created);

        return UserVO.create({
            id: user?.id,
            uid: await super.getVO(uid),
            email: emailVo,
            username: usernameVo,
            password: passwordVo,
            updated: updatedVo,
            created: createdVo,
        });
    }
}
