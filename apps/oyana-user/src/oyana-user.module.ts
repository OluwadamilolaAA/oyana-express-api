import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { OyanaUserController } from './oyana-user.controller';
import { OyanaUserService } from './oyana-user.service';
import { DatabaseModule } from './database.module';
import { userProviders } from './provider/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaUserController, HealthController],
  providers: [...userProviders, OyanaUserService],
})
export class OyanaUserModule {}
