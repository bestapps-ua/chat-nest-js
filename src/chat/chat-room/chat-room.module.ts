import { Module } from '@nestjs/common';
import { ChatRoomService } from './services/chat-room.service';
import { ChatRoomController } from './controllers/chat-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { UserModule } from '../../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([ChatRoomEntity]), UserModule],
    controllers: [ChatRoomController],
    providers: [ChatRoomService],
})
export class ChatRoomModule {}
