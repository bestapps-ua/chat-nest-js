import { EntityVO } from '../../../shared/vo/entity.vo';
import { StringVO } from '../../../shared/vo/string.vo';
import { ChatRoomInterface } from '../../chat-room-user/interfaces/chat-room.interface';
import { UserVO } from '../../../user/vo/user.vo';

export class RoomVO extends EntityVO<ChatRoomInterface> {
    getId() {
        return this.value.id;
    }

    getName(): StringVO {
        return this.value.name;
    }

    getOwner(): UserVO {
        return this.value.owner;
    }
}
