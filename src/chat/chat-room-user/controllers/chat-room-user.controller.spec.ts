import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomUserController } from './chat-room-user.controller';
import { ChatRoomUserService } from '../services/chat-room-user.service';

describe('ChatRoomUserController', () => {
  let controller: ChatRoomUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoomUserController],
      providers: [ChatRoomUserService],
    }).compile();

    controller = module.get<ChatRoomUserController>(ChatRoomUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
