import { Module } from '@nestjs/common';
import { OyanaChatController } from './oyana-chat.controller';
import { chatProviders } from './provider/chat.providers';
import { OyanaChatService } from './oyana-chat.service';

@Module({
  imports: [],
  controllers: [OyanaChatController],
  providers: [...chatProviders, OyanaChatService],
})
export class OyanaChatModule {}
