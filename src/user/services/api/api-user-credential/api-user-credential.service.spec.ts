import { Test, TestingModule } from '@nestjs/testing';
import { ApiUserCredentialService } from './api-user-credential.service';

describe('ApiUserCredentialService', () => {
  let service: ApiUserCredentialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiUserCredentialService],
    }).compile();

    service = module.get<ApiUserCredentialService>(ApiUserCredentialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
