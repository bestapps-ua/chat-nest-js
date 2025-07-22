import { Injectable } from '@nestjs/common';

import { NOSQLEntityService } from '../../../shared/services/entity/NOSQLEntityService';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from '../shemas/chat-message.scheme';
import { Model } from 'mongoose';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';

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
            encryptedSymmetricKeys: [
                {
                    userId: dto.ownerId,
                    key: 'test',
                },
            ],
            type: dto.type,
            status: dto.status,
        };
        return super.create(data);
    }
}
