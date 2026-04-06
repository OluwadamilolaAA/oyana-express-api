import { Test, TestingModule } from '@nestjs/testing';
import type { ClientGrpc } from '@nestjs/microservices';
import { DriverService } from './driver.service';

describe('DriverService', () => {
  let service: DriverService;
  let client: { getService: jest.Mock };

  beforeEach(async () => {
    client = {
      getService: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: 'DRIVER_SERVICE',
          useValue: client as unknown as ClientGrpc,
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
