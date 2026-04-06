import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsString, MinLength } from 'class-validator';

const OTP_TYPES = [
  'EMAIL_VERIFICATION',
  'PHONE_VERIFICATION',
  'PASSWORD_RESET',
] as const;

export class GatewayServiceEndpointsDto {
  @ApiProperty({ example: 'localhost:50051' })
  auth!: string;

  @ApiProperty({ example: 'localhost:50052' })
  user!: string;

  @ApiProperty({ example: 'localhost:50053' })
  driver!: string;
}

export class GatewayOverviewResponseDto {
  @ApiProperty({ example: 'oyana-express-api-gateway' })
  name!: string;

  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 3000 })
  httpPort!: number;

  @ApiProperty({ type: GatewayServiceEndpointsDto })
  services!: GatewayServiceEndpointsDto;
}

export class GatewayHealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: '2026-04-06T08:00:00.000Z' })
  timestamp!: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  sessionId!: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'Registration successful' })
  message!: string;

  @ApiProperty({ example: 'success' })
  status!: string;
}

export class ValidateTokenDto {
  @ApiProperty()
  @IsString()
  token!: string;
}

export class ValidateTokenResponseDto {
  @ApiProperty({ example: true })
  isValid!: boolean;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ example: 'customer' })
  role!: string;

  @ApiProperty()
  sessionId!: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken!: string;

  @ApiProperty()
  @IsString()
  sessionId!: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}

export class LogoutDto {
  @ApiProperty()
  @IsString()
  sessionId!: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message!: string;
}

export class SendOtpDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty({ enum: OTP_TYPES, example: 'EMAIL_VERIFICATION' })
  @IsString()
  @IsIn(OTP_TYPES)
  type!: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code!: string;

  @ApiProperty({ enum: OTP_TYPES, example: 'EMAIL_VERIFICATION' })
  @IsString()
  @IsIn(OTP_TYPES)
  type!: string;
}

export class VerifyOtpResponseDto {
  @ApiProperty({ example: true })
  verified!: boolean;
}

export class UserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: '' })
  phone!: string;

  @ApiProperty({ example: 'customer' })
  role!: string;
}

export class UserResponseDto {
  @ApiPropertyOptional({ type: UserDto })
  user?: UserDto;
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;
}

export class DriverDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty({ example: 'Bike' })
  vehicleType!: string;

  @ApiProperty({ example: 'ABC-12345' })
  licenseNumber!: string;

  @ApiProperty({ example: true })
  isAvailable!: boolean;
}

export class DriverResponseDto {
  @ApiPropertyOptional({ type: DriverDto })
  driver?: DriverDto;
}

export class DriverListResponseDto {
  @ApiProperty({ type: [DriverDto] })
  drivers!: DriverDto[];
}

export class CreateDriverDto {
  @ApiProperty({ example: 'Bike' })
  @IsString()
  vehicleType!: string;

  @ApiProperty({ example: 'ABC-12345' })
  @IsString()
  licenceNumber!: string;
}

export class UpdateDriverDto {
  @ApiProperty({ example: 'Bike' })
  @IsString()
  vehicleType!: string;

  @ApiProperty({ example: 'ABC-12345' })
  @IsString()
  licenseNumber!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isAvailable!: boolean;
}
