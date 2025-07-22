import { StringVO } from '../../../shared/vo/string.vo';
import { EntityInterface } from '../../../shared/interfaces/entity.interface';
import { UserVO } from '../../../user/vo/user.vo';

export interface ChatRoomInterface extends EntityInterface {
  id: number;
  owner: UserVO;
  name: StringVO;
  type: StringVO;
  status: StringVO;
}
