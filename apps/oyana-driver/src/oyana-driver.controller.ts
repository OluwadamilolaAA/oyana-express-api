import { Controller } from '@nestjs/common';
import { OyanaDriverService } from './oyana-driver.service';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateDriverRequest,
  CreateDriverResponse,
  DriverServiceController,
  DriverServiceControllerMethods,
  GetDriverRequest,
  GetDriverResponse,
  ListDriversRequest,
  ListDriversResponse,
  UpdateDriverRequest,
  UpdateDriverResponse,
} from '@package/packages';

@Controller()
@DriverServiceControllerMethods()
export class OyanaDriverController implements DriverServiceController {
  constructor(private readonly oyanaDriverService: OyanaDriverService) {}

  createDriver(
    request: CreateDriverRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateDriverResponse>
    | Observable<CreateDriverResponse>
    | CreateDriverResponse {
    return this.oyanaDriverService.createDriver(request);
  }

  getDriver(
    request: GetDriverRequest,
    metadata?: Metadata,
  ):
    | Promise<GetDriverResponse>
    | Observable<GetDriverResponse>
    | GetDriverResponse {
    return this.oyanaDriverService.getDriver(request);
  }

  updateDriver(
    request: UpdateDriverRequest,
    metadata?: Metadata,
  ):
    | Promise<UpdateDriverResponse>
    | Observable<UpdateDriverResponse>
    | UpdateDriverResponse {
    return this.oyanaDriverService.updateDriver(request);
  }

  listDrivers(
    request: ListDriversRequest,
    metadata?: Metadata,
  ):
    | Promise<ListDriversResponse>
    | Observable<ListDriversResponse>
    | ListDriversResponse {
    return this.oyanaDriverService.listDrivers(request);
  }
}
