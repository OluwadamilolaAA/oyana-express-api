import { Test, TestingModule } from '@nestjs/testing';
import { OyanaLocationController } from './oyana-location.controller';
import { OyanaLocationService } from './oyana-location.service';

describe('OyanaLocationController', () => {
  let oyanaLocationController: OyanaLocationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaLocationController],
      providers: [OyanaLocationService],
    }).compile();

    oyanaLocationController = app.get<OyanaLocationController>(
      OyanaLocationController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaLocationController.getHello()).toBe('Hello World!');
    });
  });
});
