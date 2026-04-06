import { Test, TestingModule } from '@nestjs/testing';
import { OyanaRideController } from './oyana-ride.controller';
import { OyanaRideService } from './oyana-ride.service';

describe('OyanaRideController', () => {
  let oyanaRideController: OyanaRideController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaRideController],
      providers: [OyanaRideService],
    }).compile();

    oyanaRideController = app.get<OyanaRideController>(OyanaRideController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaRideController.getHello()).toBe('Hello World!');
    });
  });
});
