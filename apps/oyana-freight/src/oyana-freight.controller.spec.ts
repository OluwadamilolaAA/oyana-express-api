import { Test, TestingModule } from '@nestjs/testing';
import { OyanaFreightController } from './oyana-freight.controller';
import { OyanaFreightService } from './oyana-freight.service';

describe('OyanaFreightController', () => {
  let oyanaFreightController: OyanaFreightController;
  let oyanaFreightService: { getOverview: jest.Mock };

  beforeEach(async () => {
    oyanaFreightService = {
      getOverview: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaFreightController],
      providers: [
        {
          provide: OyanaFreightService,
          useValue: oyanaFreightService,
        },
      ],
    }).compile();

    oyanaFreightController = app.get<OyanaFreightController>(
      OyanaFreightController,
    );
  });

  it('should be defined', () => {
    expect(oyanaFreightController).toBeDefined();
  });

  it('delegates overview requests to the freight service', () => {
    const response = { service: 'oyana-freight', domain: 'freight-logistics' };
    oyanaFreightService.getOverview.mockReturnValue(response);

    expect(oyanaFreightController.getOverview()).toEqual(response);
    expect(oyanaFreightService.getOverview).toHaveBeenCalled();
  });
});
