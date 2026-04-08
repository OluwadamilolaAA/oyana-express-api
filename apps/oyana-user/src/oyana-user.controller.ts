import { Controller } from '@nestjs/common';
import { OyanaUserService } from './oyana-user.service';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteEmergencyContactRequest,
  DeleteEmergencyContactResponse,
  DeleteUserAddressRequest,
  DeleteUserAddressResponse,
  GetKycProfileRequest,
  GetKycProfileResponse,
  GetUserPreferenceRequest,
  GetUserPreferenceResponse,
  GetUserRequest,
  GetUserResponse,
  ListEmergencyContactsRequest,
  ListEmergencyContactsResponse,
  ListUserAddressesRequest,
  ListUserAddressesResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  UpsertEmergencyContactRequest,
  UpsertEmergencyContactResponse,
  UpsertKycProfileRequest,
  UpsertKycProfileResponse,
  UpsertUserAddressRequest,
  UpsertUserAddressResponse,
  UpsertUserPreferenceRequest,
  UpsertUserPreferenceResponse,
  UserServiceController,
  UserServiceControllerMethods,
  ValidateUserRequest,
  ValidateUserResponse,
} from '@package/packages/generated/user';

@Controller()
@UserServiceControllerMethods()
export class OyanaUserController implements UserServiceController {
  constructor(private readonly oyanaUserService: OyanaUserService) {}

  createUser(
    request: CreateUserRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse {
    void metadata;
    return this.oyanaUserService.createUser(request);
  }

  getUser(
    request: GetUserRequest,
    metadata?: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse {
    void metadata;
    return this.oyanaUserService.getUser(request);
  }

  validateUser(
    request: ValidateUserRequest,
    metadata?: Metadata,
  ):
    | Promise<ValidateUserResponse>
    | Observable<ValidateUserResponse>
    | ValidateUserResponse {
    void metadata;
    return this.oyanaUserService.validateUser(request);
  }

  updateUserProfile(
    request: UpdateUserProfileRequest,
    metadata?: Metadata,
  ):
    | Promise<UpdateUserProfileResponse>
    | Observable<UpdateUserProfileResponse>
    | UpdateUserProfileResponse {
    void metadata;
    return this.oyanaUserService.updateUserProfile(request);
  }

  listUserAddresses(
    request: ListUserAddressesRequest,
    metadata?: Metadata,
  ):
    | Promise<ListUserAddressesResponse>
    | Observable<ListUserAddressesResponse>
    | ListUserAddressesResponse {
    void metadata;
    return this.oyanaUserService.listUserAddresses(request);
  }

  upsertUserAddress(
    request: UpsertUserAddressRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertUserAddressResponse>
    | Observable<UpsertUserAddressResponse>
    | UpsertUserAddressResponse {
    void metadata;
    return this.oyanaUserService.upsertUserAddress(request);
  }

  deleteUserAddress(
    request: DeleteUserAddressRequest,
    metadata?: Metadata,
  ):
    | Promise<DeleteUserAddressResponse>
    | Observable<DeleteUserAddressResponse>
    | DeleteUserAddressResponse {
    void metadata;
    return this.oyanaUserService.deleteUserAddress(request);
  }

  getUserPreference(
    request: GetUserPreferenceRequest,
    metadata?: Metadata,
  ):
    | Promise<GetUserPreferenceResponse>
    | Observable<GetUserPreferenceResponse>
    | GetUserPreferenceResponse {
    void metadata;
    return this.oyanaUserService.getUserPreference(request);
  }

  upsertUserPreference(
    request: UpsertUserPreferenceRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertUserPreferenceResponse>
    | Observable<UpsertUserPreferenceResponse>
    | UpsertUserPreferenceResponse {
    void metadata;
    return this.oyanaUserService.upsertUserPreference(request);
  }

  listEmergencyContacts(
    request: ListEmergencyContactsRequest,
    metadata?: Metadata,
  ):
    | Promise<ListEmergencyContactsResponse>
    | Observable<ListEmergencyContactsResponse>
    | ListEmergencyContactsResponse {
    void metadata;
    return this.oyanaUserService.listEmergencyContacts(request);
  }

  upsertEmergencyContact(
    request: UpsertEmergencyContactRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertEmergencyContactResponse>
    | Observable<UpsertEmergencyContactResponse>
    | UpsertEmergencyContactResponse {
    void metadata;
    return this.oyanaUserService.upsertEmergencyContact(request);
  }

  deleteEmergencyContact(
    request: DeleteEmergencyContactRequest,
    metadata?: Metadata,
  ):
    | Promise<DeleteEmergencyContactResponse>
    | Observable<DeleteEmergencyContactResponse>
    | DeleteEmergencyContactResponse {
    void metadata;
    return this.oyanaUserService.deleteEmergencyContact(request);
  }

  getKycProfile(
    request: GetKycProfileRequest,
    metadata?: Metadata,
  ):
    | Promise<GetKycProfileResponse>
    | Observable<GetKycProfileResponse>
    | GetKycProfileResponse {
    void metadata;
    return this.oyanaUserService.getKycProfile(request);
  }

  upsertKycProfile(
    request: UpsertKycProfileRequest,
    metadata?: Metadata,
  ):
    | Promise<UpsertKycProfileResponse>
    | Observable<UpsertKycProfileResponse>
    | UpsertKycProfileResponse {
    void metadata;
    return this.oyanaUserService.upsertKycProfile(request);
  }
}
