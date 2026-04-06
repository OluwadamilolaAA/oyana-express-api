import { Test, TestingModule } from '@nestjs/testing';
import { OyanaDeliveryController } from './oyana-delivery.controller';
import { OyanaDeliveryService } from './oyana-delivery.service';

describe('OyanaDeliveryController', () => {
  let oyanaDeliveryController: OyanaDeliveryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaDeliveryController],
      providers: [OyanaDeliveryService],
    }).compile();

    oyanaDeliveryController = app.get<OyanaDeliveryController>(OyanaDeliveryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaDeliveryController.getHello()).toBe('Hello World!');
    });
  });
});
