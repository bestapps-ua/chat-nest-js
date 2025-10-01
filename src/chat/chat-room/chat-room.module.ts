import { Module } from '@nestjs/common';
import { ChatRoomService } from './services/chat-room.service';
import { ChatRoomController } from './controllers/chat-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { UserModule } from '../../user/user.module';
import { ChatRoomUserService } from '../chat-room-user/services/chat-room-user.service';
import { ChatRoomUserModule } from '../chat-room-user/chat-room-user.module';
import { ChatParticipantGuard } from './guards/chatParticipant.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoomEntity]),
        UserModule,
        ChatRoomUserModule,
    ],
    controllers: [ChatRoomController],
    providers: [
        ChatRoomService,
        ChatParticipantGuard,
    ],
    exports: [ChatRoomService],
})
export class ChatRoomModule {}
