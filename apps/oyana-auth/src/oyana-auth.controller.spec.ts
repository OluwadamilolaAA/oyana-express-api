import { Test, TestingModule } from '@nestjs/testing';
import { OyanaAuthController } from './oyana-auth.controller';
import { OyanaAuthService } from './oyana-auth.service';

describe('OyanaAuthController', () => {
  let oyanaAuthController: OyanaAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaAuthController],
      providers: [OyanaAuthService],
    }).compile();

    oyanaAuthController = app.get<OyanaAuthController>(OyanaAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaAuthController.getHello()).toBe('Hello World!');
    });
  });
});
