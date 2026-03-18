import { Module } from '@nestjs/common';
import { OyanaAuthController } from './oyana-auth.controller';
import { OyanaAuthService } from './oyana-auth.service';

@Module({
  imports: [],
  controllers: [OyanaAuthController],
  providers: [OyanaAuthService],
})
export class OyanaAuthModule {}
