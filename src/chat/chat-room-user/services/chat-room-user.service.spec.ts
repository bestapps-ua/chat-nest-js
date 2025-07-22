import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomUserService } from './chat-room-user.service';

describe('ChatRoomUserService', () => {
  let service: ChatRoomUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoomUserService],
    }).compile();

    service = module.get<ChatRoomUserService>(ChatRoomUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
