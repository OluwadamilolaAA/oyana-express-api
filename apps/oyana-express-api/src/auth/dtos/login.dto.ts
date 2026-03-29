import { IsEmail, IsString, MinLength } from 'class-validator';
import type { LoginRequest } from '@package/packages';

export class LoginDto implements LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
