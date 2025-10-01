import { Injectable } from '@nestjs/common';

import { NOSQLEntityService } from '../../../shared/services/entity/NOSQLEntityService';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from '../shemas/chat-message.scheme';
import { Model } from 'mongoose';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { ChatRoomEntity } from '../../chat-room/entities/chat-room.entity';
import { CursorListDto } from '../../../shared/dto/cursor.list.dto';

@Injectable()
export class ChatMessageService extends NOSQLEntityService {
    uidPrefix: string = 'charRoomMessage';

    @InjectModel(ChatMessage.name) declare protected model: Model<ChatMessage>;

    async create<CreateDtoType>(
        entityDto: CreateDtoType,
    ): Promise<ObjectLiteral> {
        let dto = entityDto as CreateChatMessageDto;
        let data = {
            uid: await this.generateUid(),
            ownerId: dto.ownerId,
            roomId: dto.roomUid,
            encryptedContent: dto.message,
            encryptedSymmetricKeys: dto.encryptedSymmetricKeys,
            type: dto.type,
            status: dto.status,
        };
        return super.create(data);
    }

    async findByChatRoom(roomId: string, limit: number = 20, cursor?: string): Promise<CursorListDto> {
        const query: any = { roomId };

        if (cursor) {
            query._id = { $lt: cursor }; // load messages "before" cursor
        }

        const items = await this.model
            .find(query)
            .sort({ _id: -1 }) // newest first
            .limit(limit + 1) // fetch one extra to detect "hasNextPage"
            .exec();

        const hasNext = items.length > limit;
        if (hasNext) {
            items.pop(); // remove the extra
        }

        const next = hasNext ? items[items.length - 1]._id : null;
        return new CursorListDto(items, next !== null ? next.toString() : null);

    }
}
