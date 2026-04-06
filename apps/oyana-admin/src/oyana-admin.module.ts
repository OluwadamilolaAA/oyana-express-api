import { Module } from '@nestjs/common';
import { OyanaAdminController } from './oyana-admin.controller';
import { adminProviders } from './provider/admin.providers';
import { OyanaAdminService } from './oyana-admin.service';

@Module({
  imports: [],
  controllers: [OyanaAdminController],
  providers: [...adminProviders, OyanaAdminService],
})
export class OyanaAdminModule {}
