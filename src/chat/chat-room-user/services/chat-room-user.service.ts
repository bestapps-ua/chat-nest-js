import { Injectable } from '@nestjs/common';
import { CreateChatRoomUserDto } from '../dto/create-chat-room-user.dto';
import { UpdateChatRoomUserDto } from '../dto/update-chat-room-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/entities/user.entity';
import { ChatRoomUserEntity } from '../entities/chat-room-user.entity';
import { Repository } from 'typeorm';
import { SQLEntityService } from '../../../shared/services/entity/SQLEntityService';
import { ChatRoomEntity } from '../../chat-room/entities/chat-room.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { SharedEventType } from '../../../shared/types/event.type';
import { EntityCreatedEvent } from '../../../shared/events/entity.created.event';
import { EntityInterface } from '../../../shared/interfaces/entity.interface';
import { RoomVO } from '../../chat-room/vo/room.vo';

@Injectable()
export class ChatRoomUserService extends SQLEntityService<ChatRoomUserEntity> {

  @InjectRepository(ChatRoomUserEntity) declare protected repository: Repository<ChatRoomUserEntity>;

  uidPrefix: string = 'chatRoomUser';

    @OnEvent(SharedEventType.EntityCreated)
    async handleOrderCreatedEvent(payload: EntityCreatedEvent<EntityInterface>) {
        if (payload.entity instanceof RoomVO) {
            let roomUserEntity = {
                uid: await this.generateUid(),
                roomId: payload.entity.getId(),
                userId: payload.entity.getOwner().getId(),
                status: 'owner',
            }
            this.create(roomUserEntity);
        }
    }
}
