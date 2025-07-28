import { UserInterface } from '../interfaces/user.interface';
import { EntityVO } from '../../shared/vo/entity.vo';
import { UsernameVO } from './username.vo';
import { EmailVO } from './email.vo';
import { PasswordVO } from './password.vo';

export class UserVO extends EntityVO<UserInterface> {
    getId() {
        return this.value.id;
    }

    getUsername(): UsernameVO {
        return this.value.username;
    }

    getEmail(): EmailVO {
        return this.value.email;
    }

    getPassword(): PasswordVO {
        return this.value.password;
    }

    isValid(value: UserInterface): boolean {
        //TODO: validate
        return true;
    }
}
