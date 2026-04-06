import { Module } from '@nestjs/common';
import { OyanaAdminController } from './oyana-admin.controller';
import { OyanaAdminService } from './oyana-admin.service';

@Module({
  imports: [],
  controllers: [OyanaAdminController],
  providers: [OyanaAdminService],
})
export class OyanaAdminModule {}
