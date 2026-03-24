import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: {
    getOverview: jest.Mock;
    getHealth: jest.Mock;
  };

  beforeEach(async () => {
    appService = {
      getOverview: jest.fn(),
      getHealth: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('delegates overview requests to the app service', () => {
    const response = { name: 'gateway', status: 'ok' };
    appService.getOverview.mockReturnValue(response);

    expect(appController.getOverview()).toEqual(response);
    expect(appService.getOverview).toHaveBeenCalled();
  });

  it('delegates health requests to the app service', () => {
    const response = { status: 'ok', timestamp: '2026-03-24T00:00:00.000Z' };
    appService.getHealth.mockReturnValue(response);

    expect(appController.getHealth()).toEqual(response);
    expect(appService.getHealth).toHaveBeenCalled();
  });
});
