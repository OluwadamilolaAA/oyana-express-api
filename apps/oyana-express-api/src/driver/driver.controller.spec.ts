import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('DriverController', () => {
  let controller: DriverController;
  let driverService: {
    createDriver: jest.Mock;
    getDriver: jest.Mock;
    updateDriver: jest.Mock;
    listDrivers: jest.Mock;
  };

  beforeEach(async () => {
    driverService = {
      createDriver: jest.fn(),
      getDriver: jest.fn(),
      updateDriver: jest.fn(),
      listDrivers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: DriverService,
          useValue: driverService,
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
