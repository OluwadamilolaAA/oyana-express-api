import { Test, TestingModule } from '@nestjs/testing';
import { OyanaUserController } from './oyana-user.controller';
import { OyanaUserService } from './oyana-user.service';

describe('OyanaUserController', () => {
  let oyanaUserController: OyanaUserController;
  let oyanaUserService: {
    createUser: jest.Mock;
    getUserById: jest.Mock;
    validateUser: jest.Mock;
  };

  beforeEach(async () => {
    oyanaUserService = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      validateUser: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaUserController],
      providers: [
        {
          provide: OyanaUserService,
          useValue: oyanaUserService,
        },
      ],
    }).compile();

    oyanaUserController = app.get<OyanaUserController>(OyanaUserController);
  });

  it('should be defined', () => {
    expect(oyanaUserController).toBeDefined();
  });

  it('delegates createUser to the user service', async () => {
    const request = {
      email: 'user@example.com',
      password: 'password123',
      name: 'Test User',
    };
    const response = {
      user: {
        id: 'user-id',
        email: request.email,
        name: request.name,
        phone: '',
        role: 'customer',
      },
    };
    oyanaUserService.createUser.mockResolvedValue(response);

    await expect(oyanaUserController.createUser(request)).resolves.toEqual(
      response,
    );
    expect(oyanaUserService.createUser).toHaveBeenCalledWith(request);
  });
});
