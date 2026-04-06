import { Test, TestingModule } from '@nestjs/testing';
import { OyanaChatController } from './oyana-chat.controller';
import { OyanaChatService } from './oyana-chat.service';

describe('OyanaChatController', () => {
  let oyanaChatController: OyanaChatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaChatController],
      providers: [OyanaChatService],
    }).compile();

    oyanaChatController = app.get<OyanaChatController>(OyanaChatController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaChatController.getHello()).toBe('Hello World!');
    });
  });
});
