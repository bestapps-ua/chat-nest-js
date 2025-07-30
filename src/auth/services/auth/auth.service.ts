import {
    Inject,
    Injectable,
    NotAcceptableException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../../user/services/user/user.service';
import { UserVO } from '../../../user/vo/user.vo';
import { UserCredentialType } from '../../../user/types/user.credential.type';
import { ApiUserService } from 'src/user/services/api/api-user/api-user.service';
import { CreateUserEntityDto } from '../../../user/dto/create-user-entity.dto';
import { SessionService } from '../../../shared/services/session/session.service';
import { ConfigService } from '@nestjs/config';
import { ProfileKeyService } from '../../../profile/services/profile-key/profile-key.service';
import { CreateProfileKeyDto } from '../../../profile/dto/create-profile-key.dto';

@Injectable()
export class AuthService {
    @Inject(UserService) userService: UserService;
    @Inject(SessionService) sessionService: SessionService;
    @Inject(ApiUserService) apiUserService: ApiUserService;
    @Inject(ConfigService) configService: ConfigService;
    @Inject(ProfileKeyService) profileKeyService: ProfileKeyService;

    async signIn(
        email: string,
        password: string,
    ): Promise<{ accessToken: string; user: UserVO }> {
        const user = await this.userService.findOneByEmail(email);
        const pass = await this.userService.encryptPassword(password);
        if (!user || user.password !== pass) {
            throw new UnauthorizedException();
        }

        return this.getPayload(user.uid);
    }

    async signUp(email: string, username: string, publicKey: string, password: string) {
        const user = await this.userService.findOneByEmail(email);
        const pass = await this.userService.encryptPassword(password);

        if (user) {
            throw new NotAcceptableException('account exists');
        }

        let params = [
            {
                key: 'role',
                value: this.configService.get('auth').userRole,
            },
        ];
        let credentials = [
            {
                type: UserCredentialType.Username,
                credential: username,
            },
            {
                type: UserCredentialType.Email,
                credential: email,
            },
        ];
        try {
            let apiUser = await this.apiUserService.create(params, credentials);
            if (!apiUser) {
                throw new Error('Internal error');
            }

            await this.apiUserService.setPassword(apiUser.uid, password);
            let dto: CreateUserEntityDto = {
                uid: apiUser.uid,
            };

            await this.userService.create<CreateUserEntityDto>(dto);

            let profileKeyDto: CreateProfileKeyDto = {
                userId: apiUser.uid,
                publicKey,
            };

            await this.profileKeyService.create(profileKeyDto);

            return this.getPayload(apiUser.uid);
        } catch (err) {
            throw err;
        }
    }

    private async getPayload(
        uid: string,
    ): Promise<{ accessToken: string; user: UserVO }> {
        let userVO = (await this.userService.getVO(uid)) as UserVO;
        const payload = {
            email: userVO.getEmail().value,
            sub: userVO.getUid().value,
        };
        return {
            accessToken: this.sessionService.sign(payload),
            user: userVO,
        };
    }
}
