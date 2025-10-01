import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { UserVO } from '../../../user/vo/user.vo';
import { RoomVO } from '../vo/room.vo';
import { ChatRoomService } from '../services/chat-room.service';

@Injectable()
export class ChatParticipantGuard implements CanActivate {
    constructor(
        private chatRoomService: ChatRoomService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (isRabbitContext(context)) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: UserVO = request['user'];

        try {
            const roomUid =  request.params['roomUid'] || request.params['uid'] || request.body?.roomUid;


            if (!roomUid) {
                throw new UnauthorizedException('roomUid not provided');
            }

            let chatRoom = await this.chatRoomService.getVO(roomUid) as RoomVO;
            if(chatRoom.getOwner().value !== user.value) {
                //TODO: check participant also!
            }
            request['chatRoom'] = chatRoom;
        } catch(error) {
            console.log(error);
            throw error;
        }

        return true;
    }
}
