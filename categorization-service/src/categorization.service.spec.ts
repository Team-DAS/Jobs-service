import { Test, TestingModule } from '@nestjs/testing';
import { CategorizationService } from './categorization.service';

describe('CategorizationService', () => {
  let service: CategorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorizationService],
    }).compile();

    service = module.get<CategorizationService>(CategorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
