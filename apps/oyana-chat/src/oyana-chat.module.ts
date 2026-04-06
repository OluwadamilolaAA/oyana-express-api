import { Module } from '@nestjs/common';
import { OyanaChatController } from './oyana-chat.controller';
import { OyanaChatService } from './oyana-chat.service';

@Module({
  imports: [],
  controllers: [OyanaChatController],
  providers: [OyanaChatService],
})
export class OyanaChatModule {}
