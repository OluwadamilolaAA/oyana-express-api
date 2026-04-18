import { ApiProperty } from '@nestjs/swagger';
import { ResetPasswordRequest } from '@package/packages';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto implements ResetPasswordRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'newPassword123' })
  @MinLength(8)
  newPassword!: string;
}
