import { Controller } from '@nestjs/common';
import { OyanaDriverService } from './oyana-driver.service';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  AssignVehicleRequest,
  AssignVehicleResponse,
  CreateDriverRequest,
  CreateDriverResponse,
  DriverServiceController,
  DriverServiceControllerMethods,
  GetDriverProfileRequest,
  GetDriverProfileResponse,
  GetDriverRequest,
  GetDriverResponse,
  GetDriverStatusRequest,
  GetDriverStatusResponse,
  ListDriverDocumentsRequest,
  ListDriverDocumentsResponse,
  ListDriversRequest,
  ListDriversResponse,
  ListVehiclesRequest,
  ListVehiclesResponse,
  ListVehicleTypesRequest,
  ListVehicleTypesResponse,
  ReviewDriverRequest,
  ReviewDriverResponse,
  UnassignVehicleRequest,
  UnassignVehicleResponse,
  UpdateDriverProfileRequest,
  UpdateDriverProfileResponse,
  UpdateDriverRequest,
  UpdateDriverResponse,
  UpsertDriverDocumentRequest,
  UpsertDriverDocumentResponse,
  UpsertDriverStatusRequest,
  UpsertDriverStatusResponse,
  UpsertVehicleRequest,
  UpsertVehicleResponse,
  UpsertVehicleTypeRequest,
  UpsertVehicleTypeResponse,
} from '@package/packages/generated/driver';

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
    void metadata;
    return this.oyanaDriverService.createDriver(request);
  }

  getDriver(
    request: GetDriverRequest,
    metadata?: Metadata,
  ):
    | Promise<GetDriverResponse>
    | Observable<GetDriverResponse>
    | GetDriverResponse {
    void metadata;
    return this.oyanaDriverService.getDriver(request);
  }

  updateDriver(
    request: UpdateDriverRequest,
    metadata?: Metadata,
  ):
    | Promise<UpdateDriverResponse>
    | Observable<UpdateDriverResponse>
    | UpdateDriverResponse {
    void metadata;
    return this.oyanaDriverService.updateDriver(request);
  }

  listDrivers(
    request: ListDriversRequest,
    metadata?: Metadata,
  ):
    | Promise<ListDriversResponse>
    | Observable<ListDriversResponse>
    | ListDriversResponse {
    void metadata;
    return this.oyanaDriverService.listDrivers(request);
  }

  getDriverProfile(
    request: GetDriverProfileRequest,
    metadata?: Metadata,
  ):
    | Promise<GetDriverProfileResponse>
    | Observable<GetDriverProfileResponse>
    | GetDriverProfileResponse {
    void metadata;
    return this.oyanaDriverService.getDriverProfile(request);
  }

  updateDriverProfile(
    request: UpdateDriverProfileRequest,
    metadata?: Metadata,
  ):
    | Promise<UpdateDriverProfileResponse>
    | Observable<UpdateDriverProfileResponse>
    | UpdateDriverProfileResponse {
    void metadata;
    return this.oyanaDriverService.updateDriverProfile(request);
  }

  reviewDriver(
    request: ReviewDriverRequest,
    metadata?: Metadata,
  ):
    | Promise<ReviewDriverResponse>
    | Observable<ReviewDriverResponse>
    | ReviewDriverResponse {
    void metadata;
    return this.oyanaDriverService.reviewDriver(request);
  }

  getDriverStatus(
    request: GetDriverStatusRequest,
    metadata?: Metadata,
  ):
    | Promise<GetDriverStatusResponse>
    | Observable<GetDriverStatusResponse>
    | GetDriverStatusResponse {
    void metadata;
    return this.oyanaDriverService.getDriverStatus(request);
  }

  upsertDriverStatus(
    request: UpsertDriverStatusRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertDriverStatusResponse>
    | Observable<UpsertDriverStatusResponse>
    | UpsertDriverStatusResponse {
    void metadata;
    return this.oyanaDriverService.upsertDriverStatus(request);
  }

  listDriverDocuments(
    request: ListDriverDocumentsRequest,
    metadata?: Metadata,
  ):
    | Promise<ListDriverDocumentsResponse>
    | Observable<ListDriverDocumentsResponse>
    | ListDriverDocumentsResponse {
    void metadata;
    return this.oyanaDriverService.listDriverDocuments(request);
  }

  upsertDriverDocument(
    request: UpsertDriverDocumentRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertDriverDocumentResponse>
    | Observable<UpsertDriverDocumentResponse>
    | UpsertDriverDocumentResponse {
    void metadata;
    return this.oyanaDriverService.upsertDriverDocument(request);
  }

  listVehicleTypes(
    request: ListVehicleTypesRequest,
    metadata?: Metadata,
  ):
    | Promise<ListVehicleTypesResponse>
    | Observable<ListVehicleTypesResponse>
    | ListVehicleTypesResponse {
    void metadata;
    return this.oyanaDriverService.listVehicleTypes(request);
  }

  upsertVehicleType(
    request: UpsertVehicleTypeRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertVehicleTypeResponse>
    | Observable<UpsertVehicleTypeResponse>
    | UpsertVehicleTypeResponse {
    void metadata;
    return this.oyanaDriverService.upsertVehicleType(request);
  }

  listVehicles(
    request: ListVehiclesRequest,
    metadata?: Metadata,
  ):
    | Promise<ListVehiclesResponse>
    | Observable<ListVehiclesResponse>
    | ListVehiclesResponse {
    void metadata;
    return this.oyanaDriverService.listVehicles(request);
  }

  upsertVehicle(
    request: UpsertVehicleRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertVehicleResponse>
    | Observable<UpsertVehicleResponse>
    | UpsertVehicleResponse {
    void metadata;
    return this.oyanaDriverService.upsertVehicle(request);
  }

  assignVehicle(
    request: AssignVehicleRequest,
    metadata?: Metadata,
  ):
    | Promise<AssignVehicleResponse>
    | Observable<AssignVehicleResponse>
    | AssignVehicleResponse {
    void metadata;
    return this.oyanaDriverService.assignVehicle(request);
  }

  unassignVehicle(
    request: UnassignVehicleRequest,
    metadata?: Metadata,
  ):
    | Promise<UnassignVehicleResponse>
    | Observable<UnassignVehicleResponse>
    | UnassignVehicleResponse {
    void metadata;
    return this.oyanaDriverService.unassignVehicle(request);
  }
}
