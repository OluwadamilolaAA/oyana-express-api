import { Test, TestingModule } from '@nestjs/testing';
import { OyanaAuthController } from './oyana-auth.controller';
import { OyanaAuthService } from './services/oyana-auth.service';

describe('OyanaAuthController', () => {
  let oyanaAuthController: OyanaAuthController;
  let oyanaAuthService: {
    login: jest.Mock;
    register: jest.Mock;
    validateToken: jest.Mock;
    refreshToken: jest.Mock;
    logout: jest.Mock;
    sendOtp: jest.Mock;
    verifyOtp: jest.Mock;
    getAuthContext: jest.Mock;
  };

  beforeEach(async () => {
    oyanaAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      validateToken: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      sendOtp: jest.fn(),
      verifyOtp: jest.fn(),
      getAuthContext: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OyanaAuthController],
      providers: [
        {
          provide: OyanaAuthService,
          useValue: oyanaAuthService,
        },
      ],
    }).compile();

    oyanaAuthController = app.get<OyanaAuthController>(OyanaAuthController);
  });

  it('should be defined', () => {
    expect(oyanaAuthController).toBeDefined();
  });

  it('delegates login to the auth service', async () => {
    const request = { email: 'user@example.com', password: 'password123' };
    const response = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      sessionId: 'session-id',
    };
    oyanaAuthService.login.mockResolvedValue(response);

    await expect(oyanaAuthController.login(request)).resolves.toEqual(response);
    expect(oyanaAuthService.login).toHaveBeenCalledWith(request);
  });

  it('delegates token validation to the auth service', async () => {
    const request = { token: 'token-value' };
    const response = {
      isValid: true,
      userId: 'user-id',
      email: 'user@example.com',
      role: 'customer',
      sessionId: 'session-id',
    };
    oyanaAuthService.validateToken.mockResolvedValue(response);

    await expect(oyanaAuthController.validateToken(request)).resolves.toEqual(
      response,
    );
    expect(oyanaAuthService.validateToken).toHaveBeenCalledWith(request);
  });
});
