import { Test, TestingModule } from '@nestjs/testing';
import { OyanaDriverController } from './oyana-driver.controller';
import { OyanaDriverService } from './oyana-driver.service';

describe('OyanaDriverController', () => {
  let oyanaDriverController: OyanaDriverController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaDriverController],
      providers: [OyanaDriverService],
    }).compile();

    oyanaDriverController = app.get<OyanaDriverController>(OyanaDriverController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaDriverController.getHello()).toBe('Hello World!');
    });
  });
});
