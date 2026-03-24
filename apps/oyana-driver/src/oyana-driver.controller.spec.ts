import { Test, TestingModule } from '@nestjs/testing';
import { OyanaDriverController } from './oyana-driver.controller';
import { OyanaDriverService } from './oyana-driver.service';

describe('OyanaDriverController', () => {
  let oyanaDriverController: OyanaDriverController;
  let oyanaDriverService: {
    createDriver: jest.Mock;
    getDriver: jest.Mock;
    updateDriver: jest.Mock;
    listDrivers: jest.Mock;
  };

  beforeEach(async () => {
    oyanaDriverService = {
      createDriver: jest.fn(),
      getDriver: jest.fn(),
      updateDriver: jest.fn(),
      listDrivers: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaDriverController],
      providers: [
        {
          provide: OyanaDriverService,
          useValue: oyanaDriverService,
        },
      ],
    }).compile();

    oyanaDriverController = app.get<OyanaDriverController>(
      OyanaDriverController,
    );
  });

  it('should be defined', () => {
    expect(oyanaDriverController).toBeDefined();
  });

  it('delegates createDriver to the driver service', async () => {
    const request = {
      userId: 'user-id',
      vehicleType: 'Bike',
      licenseNumber: 'LIC-123',
    };
    const response = {
      driver: {
        userId: request.userId,
        vehicleType: request.vehicleType,
        licenseNumber: request.licenseNumber,
        isAvailable: true,
      },
    };
    oyanaDriverService.createDriver.mockResolvedValue(response);

    await expect(oyanaDriverController.createDriver(request)).resolves.toEqual(
      response,
    );
    expect(oyanaDriverService.createDriver).toHaveBeenCalledWith(request);
  });
});
