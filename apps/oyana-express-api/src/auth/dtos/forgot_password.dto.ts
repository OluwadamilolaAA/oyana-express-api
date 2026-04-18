import { ApiProperty } from '@nestjs/swagger';
import { ForgotPasswordRequest } from '@package/packages';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto implements ForgotPasswordRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;
}
