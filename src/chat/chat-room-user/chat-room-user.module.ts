import { Module } from '@nestjs/common';
import { ChatRoomUserService } from './services/chat-room-user.service';
import { ChatRoomUserController } from './controllers/chat-room-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomUserEntity } from './entities/chat-room-user.entity';
import { UserModule } from '../../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([ChatRoomUserEntity]), UserModule],
    controllers: [ChatRoomUserController],
    providers: [ChatRoomUserService],
    exports: [ChatRoomUserService],
})
export class ChatRoomUserModule {}
