import { Module } from '@nestjs/common';
import { OyanaUserController } from './oyana-user.controller';
import { OyanaUserService } from './oyana-user.service';
import { DatabaseModule } from './database.module';
import { userProviders } from './user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaUserController],
  providers: [...userProviders, OyanaUserService],
})
export class OyanaUserModule {}
