import { Test, TestingModule } from '@nestjs/testing';
import { OyanaPricingController } from './oyana-pricing.controller';
import { OyanaPricingService } from './oyana-pricing.service';

describe('OyanaPricingController', () => {
  let oyanaPricingController: OyanaPricingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaPricingController],
      providers: [OyanaPricingService],
    }).compile();

    oyanaPricingController = app.get<OyanaPricingController>(OyanaPricingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaPricingController.getHello()).toBe('Hello World!');
    });
  });
});
