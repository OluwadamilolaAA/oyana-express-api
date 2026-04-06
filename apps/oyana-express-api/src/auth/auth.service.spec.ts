import { Test, TestingModule } from '@nestjs/testing';
import type { ClientGrpc } from '@nestjs/microservices';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let client: { getService: jest.Mock };

  beforeEach(async () => {
    client = {
      getService: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'AUTH_SERVICE',
          useValue: client as unknown as ClientGrpc,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
