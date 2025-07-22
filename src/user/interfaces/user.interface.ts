import { UsernameVO } from '../vo/username.vo';
import { EmailVO } from '../vo/email.vo';
import { PasswordVO } from '../vo/password.vo';
import { EntityInterface } from '../../shared/interfaces/entity.interface';

export interface UserInterface extends EntityInterface {
  id: number;
  username: UsernameVO;
  email: EmailVO;
  password: PasswordVO;
}
