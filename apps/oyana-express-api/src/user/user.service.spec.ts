import { Test, TestingModule } from '@nestjs/testing';
import type { ClientGrpc } from '@nestjs/microservices';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let client: { getService: jest.Mock };

  beforeEach(async () => {
    client = {
      getService: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_SERVICE',
          useValue: client as unknown as ClientGrpc,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
