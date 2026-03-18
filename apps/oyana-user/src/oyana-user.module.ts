import { Module } from '@nestjs/common';
import { OyanaUserController } from './oyana-user.controller';
import { OyanaUserService } from './oyana-user.service';

@Module({
  imports: [],
  controllers: [OyanaUserController],
  providers: [OyanaUserService],
})
export class OyanaUserModule {}
