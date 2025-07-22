import { Module } from '@nestjs/common';
import { ChatMessageService } from './services/chat-message.service';
import { ChatMessageController } from './controllers/chat-message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './shemas/chat-message.scheme';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }])
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
})
export class ChatMessageModule {}
