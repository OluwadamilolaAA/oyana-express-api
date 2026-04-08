import { Test, TestingModule } from '@nestjs/testing';
import { OyanaPaymentController } from './oyana-payment.controller';
import { OyanaPaymentService } from './oyana-payment.service';

describe('OyanaPaymentController', () => {
  let oyanaPaymentController: OyanaPaymentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaPaymentController],
      providers: [OyanaPaymentService],
    }).compile();

    oyanaPaymentController = app.get<OyanaPaymentController>(
      OyanaPaymentController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaPaymentController.getHello()).toBe('Hello World!');
    });
  });
});
