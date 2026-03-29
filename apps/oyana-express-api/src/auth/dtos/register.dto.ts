import { IsEmail, IsString, MinLength } from 'class-validator';
import type { RegisterRequest } from '@package/packages';

export class RegisterDto implements RegisterRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}
