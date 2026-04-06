import { Test, TestingModule } from '@nestjs/testing';
import { OyanaRideController } from './oyana-ride.controller';
import { OyanaRideService } from './oyana-ride.service';

describe('OyanaRideController', () => {
  let oyanaRideController: OyanaRideController;
  let oyanaRideService: { getOverview: jest.Mock };

  beforeEach(async () => {
    oyanaRideService = {
      getOverview: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaRideController],
      providers: [
        {
          provide: OyanaRideService,
          useValue: oyanaRideService,
        },
      ],
    }).compile();

    oyanaRideController = app.get<OyanaRideController>(OyanaRideController);
  });

  it('should be defined', () => {
    expect(oyanaRideController).toBeDefined();
  });

  it('delegates overview requests to the ride service', () => {
    const response = { service: 'oyana-ride', domain: 'ride-booking' };
    oyanaRideService.getOverview.mockReturnValue(response);

    expect(oyanaRideController.getOverview()).toEqual(response);
    expect(oyanaRideService.getOverview).toHaveBeenCalled();
  });
});
