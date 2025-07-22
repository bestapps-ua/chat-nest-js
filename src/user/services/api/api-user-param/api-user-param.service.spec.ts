import { Test, TestingModule } from '@nestjs/testing';
import { ApiUserParamService } from './api-user-param.service';

describe('ApiUserParamService', () => {
  let service: ApiUserParamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiUserParamService],
    }).compile();

    service = module.get<ApiUserParamService>(ApiUserParamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
