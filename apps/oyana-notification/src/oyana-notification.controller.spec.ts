import { Test, TestingModule } from '@nestjs/testing';
import { OyanaNotificationController } from './oyana-notification.controller';
import { OyanaNotificationService } from './oyana-notification.service';

describe('OyanaNotificationController', () => {
  let oyanaNotificationController: OyanaNotificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaNotificationController],
      providers: [OyanaNotificationService],
    }).compile();

    oyanaNotificationController = app.get<OyanaNotificationController>(
      OyanaNotificationController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaNotificationController.getHello()).toBe('Hello World!');
    });
  });
});
