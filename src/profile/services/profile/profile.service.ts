import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../../user/services/user/user.service';

@Injectable()
export class ProfileService {
    @Inject(UserService) userService: UserService;

    async get(uid: string) {
        return await this.userService.findOneByUid(uid);
    }
}
