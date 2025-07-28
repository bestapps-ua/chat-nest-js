import {
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

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private sessionService: SessionService,
        private apiUserService: ApiUserService,
        private configService: ConfigService,
    ) {}

    async signIn(email: string, password: string) {
        const user = await this.userService.findOneByEmail(email);
        const pass = await this.userService.encryptPassword(password);
        if (!user || user.password !== pass) {
            throw new UnauthorizedException();
        }

        return this.getPayload(user.uid);
    }

    async signUp(email: string, username: string, password: string) {
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
            return this.getPayload(apiUser.uid);
        } catch (err) {
            throw err;
        }
    }

    private async getPayload(uid: string): Promise<{ access_token: string, user: UserVO }> {
        let userVO = (await this.userService.getVO(uid)) as UserVO;
        const payload = {
            email: userVO.getEmail().value,
            sub: userVO.getUid().value,
        };
        return {
            access_token: this.sessionService.sign(payload),
            user: userVO,
        };
    }
}
