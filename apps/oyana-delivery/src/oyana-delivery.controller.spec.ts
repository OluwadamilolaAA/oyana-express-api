import { Test, TestingModule } from '@nestjs/testing';
import { OyanaDeliveryController } from './oyana-delivery.controller';
import { OyanaDeliveryService } from './oyana-delivery.service';

describe('OyanaDeliveryController', () => {
  let oyanaDeliveryController: OyanaDeliveryController;
  let oyanaDeliveryService: { getOverview: jest.Mock };

  beforeEach(async () => {
    oyanaDeliveryService = {
      getOverview: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaDeliveryController],
      providers: [
        {
          provide: OyanaDeliveryService,
          useValue: oyanaDeliveryService,
        },
      ],
    }).compile();

    oyanaDeliveryController = app.get<OyanaDeliveryController>(
      OyanaDeliveryController,
    );
  });

  it('should be defined', () => {
    expect(oyanaDeliveryController).toBeDefined();
  });

  it('delegates overview requests to the delivery service', () => {
    const response = { service: 'oyana-delivery', domain: 'parcel-delivery' };
    oyanaDeliveryService.getOverview.mockReturnValue(response);

    expect(oyanaDeliveryController.getOverview()).toEqual(response);
    expect(oyanaDeliveryService.getOverview).toHaveBeenCalled();
  });
});
