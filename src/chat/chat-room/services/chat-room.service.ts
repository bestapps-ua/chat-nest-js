import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomEntity } from '../entities/chat-room.entity';
import { SQLEntityService } from '../../../shared/services/entity/SQLEntityService';
import { EntityInterface } from '../../../shared/interfaces/entity.interface';
import { EntityVO } from '../../../shared/vo/entity.vo';
import { VO } from '../../../shared/vo/vo';
import { RoomVO } from '../vo/room.vo';
import { StringVO } from '../../../shared/vo/string.vo';
import { UserService } from '../../../user/services/user/user.service';

@Injectable()
export class ChatRoomService extends SQLEntityService<ChatRoomEntity> {
    @InjectRepository(ChatRoomEntity)
    declare protected repository: Repository<ChatRoomEntity>;

    @Inject(UserService) readonly userService: UserService;

    uidPrefix: string = 'chatRoom';

    protected relations: string[] = ['owner'];

    async getVO(uid: string): Promise<EntityVO<EntityInterface> | VO<string>> {
        let room: ChatRoomEntity = await this.findOneByUid(uid) as ChatRoomEntity;
        if(!room) {
            throw new Error(`Room not found ${uid}`);
        }
        return RoomVO.create({
            id: room?.id,
            uid: await super.getVO(uid),
            owner: await this.userService.getVO(room.owner.uid),
            name: StringVO.create(room?.name, {max: 255}),
            type: StringVO.create(room?.type, {max: 50}),
            status: StringVO.create(room?.type, {max: 50}),
        });
    }
}
