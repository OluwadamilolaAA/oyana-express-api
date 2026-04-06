import { Test, TestingModule } from '@nestjs/testing';
import { OyanaDispatchController } from './oyana-dispatch.controller';
import { OyanaDispatchService } from './oyana-dispatch.service';

describe('OyanaDispatchController', () => {
  let oyanaDispatchController: OyanaDispatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaDispatchController],
      providers: [OyanaDispatchService],
    }).compile();

    oyanaDispatchController = app.get<OyanaDispatchController>(OyanaDispatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaDispatchController.getHello()).toBe('Hello World!');
    });
  });
});
