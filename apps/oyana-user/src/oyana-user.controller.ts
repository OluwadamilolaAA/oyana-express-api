import { Controller, Get } from '@nestjs/common';
import { OyanaUserService } from './oyana-user.service';
import { UserController } from 'libs/packages/generated/user';

@Controller()
export class OyanaUserController {
  constructor(private readonly oyanaUserService: OyanaUserService) {}

}
