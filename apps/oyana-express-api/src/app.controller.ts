import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  GatewayHealthResponseDto,
  GatewayOverviewResponseDto,
} from './swagger/swagger.dto';

@ApiTags('Gateway')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get gateway overview' })
  @ApiOkResponse({ type: GatewayOverviewResponseDto })
  getOverview() {
    return this.appService.getOverview();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get gateway health status' })
  @ApiOkResponse({ type: GatewayHealthResponseDto })
  getHealth() {
    return this.appService.getHealth();
  }
}
