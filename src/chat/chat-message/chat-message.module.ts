import { Module } from '@nestjs/common';
import { ChatMessageService } from './services/chat-message.service';
import { ChatMessageController } from './controllers/chat-message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './shemas/chat-message.scheme';
import { ChatRoomModule } from '../chat-room/chat-room.module';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
      ChatRoomModule,
  ],
  controllers: [ChatMessageController],
  providers: [
      ChatMessageService,
  ],
    exports: [ChatMessageService],
})
export class ChatMessageModule {}
