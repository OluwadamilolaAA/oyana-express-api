import type {
  CreateUserRequest,
  DeleteEmergencyContactRequest,
  DeleteUserAddressRequest,
  EmergencyContact,
  GetKycProfileRequest,
  GetUserPreferenceRequest,
  GetUserRequest,
  KycProfile,
  ListEmergencyContactsRequest,
  ListUserAddressesRequest,
  UpdateUserProfileRequest,
  UpsertEmergencyContactRequest,
  UpsertKycProfileRequest,
  UpsertUserAddressRequest,
  UpsertUserPreferenceRequest,
  UserAddress,
  UserPreference,
  ValidateUserRequest,
} from '@package/packages/generated/user';

export class CreateUserRequestDto implements CreateUserRequest {
  email!: string;
  password!: string;
  name!: string;
}

export class GetUserRequestDto implements GetUserRequest {
  userId!: string;
}

export class ValidateUserRequestDto implements ValidateUserRequest {
  email!: string;
  password!: string;
}

export class UpdateUserProfileRequestDto implements UpdateUserProfileRequest {
  userId!: string;
  name?: string;
  phone?: string;
  role?: string;
}

export class ListUserAddressesRequestDto implements ListUserAddressesRequest {
  userId!: string;
}

export class UpsertUserAddressRequestDto implements UpsertUserAddressRequest {
  address!: UserAddress;
}

export class DeleteUserAddressRequestDto implements DeleteUserAddressRequest {
  addressId!: string;
  userId!: string;
}

export class GetUserPreferenceRequestDto implements GetUserPreferenceRequest {
  userId!: string;
}

export class UpsertUserPreferenceRequestDto implements UpsertUserPreferenceRequest {
  preference!: UserPreference;
}

export class ListEmergencyContactsRequestDto implements ListEmergencyContactsRequest {
  userId!: string;
}

export class UpsertEmergencyContactRequestDto implements UpsertEmergencyContactRequest {
  contact!: EmergencyContact;
}

export class DeleteEmergencyContactRequestDto implements DeleteEmergencyContactRequest {
  contactId!: string;
  userId!: string;
}

export class GetKycProfileRequestDto implements GetKycProfileRequest {
  userId!: string;
}

export class UpsertKycProfileRequestDto implements UpsertKycProfileRequest {
  profile!: KycProfile;
}
