import { Test, TestingModule } from '@nestjs/testing';
import { OyanaAdminController } from './oyana-admin.controller';
import { OyanaAdminService } from './oyana-admin.service';

describe('OyanaAdminController', () => {
  let oyanaAdminController: OyanaAdminController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaAdminController],
      providers: [OyanaAdminService],
    }).compile();

    oyanaAdminController = app.get<OyanaAdminController>(OyanaAdminController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oyanaAdminController.getHello()).toBe('Hello World!');
    });
  });
});
