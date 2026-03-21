import { Test, TestingModule } from '@nestjs/testing';
import { OyanaUserController } from './oyana-user.controller';
import { OyanaUserService } from './oyana-user.service';

describe('OyanaUserController', () => {
  let oyanaUserController: OyanaUserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaUserController],
      providers: [OyanaUserService],
    }).compile();

    oyanaUserController = app.get<OyanaUserController>(OyanaUserController);
  });


});
