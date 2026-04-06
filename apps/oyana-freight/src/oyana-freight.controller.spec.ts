import { Test, TestingModule } from '@nestjs/testing';
import { OyanaFreightController } from './oyana-freight.controller';
import { OyanaFreightService } from './oyana-freight.service';

describe('OyanaFreightController', () => {
  let oyanaFreightController: OyanaFreightController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaFreightController],
      providers: [OyanaFreightService],
    }).compile();

    oyanaFreightController = app.get<OyanaFreightController>(OyanaFreightController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaFreightController.getHello()).toBe('Hello World!');
    });
  });
});
