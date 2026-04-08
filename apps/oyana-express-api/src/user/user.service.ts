import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserResponse,
  DEFAULT_PORTS,
  getCloudRunGrpcMetadata,
  getGrpcClientAudience,
  UserServiceClient,
} from '@package/packages';
import { firstValueFrom } from 'rxjs';
import {
  UpdateUserProfileDto,
  UpsertEmergencyContactDto,
  UpsertKycProfileDto,
  UpsertUserAddressDto,
  UpsertUserPreferenceDto,
} from './dtos/user.dto';
import {
  DeleteEmergencyContactResponse,
  DeleteUserAddressResponse,
  GetKycProfileResponse,
  GetUserPreferenceResponse,
  ListEmergencyContactsResponse,
  ListUserAddressesResponse,
  UpdateUserProfileResponse,
  UpsertEmergencyContactResponse,
  UpsertKycProfileResponse,
  UpsertUserAddressResponse,
  UpsertUserPreferenceResponse,
} from '@package/packages/generated/user';

@Injectable()
export class UserService implements OnModuleInit {
  private userService!: UserServiceClient;
  private readonly userServiceAudience = getGrpcClientAudience(
    'USER_GRPC_URL',
    DEFAULT_PORTS.userGrpc,
  );

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService =
      this.userClient.getService<UserServiceClient>('UserService');
  }

  private async getRequestMetadata() {
    return getCloudRunGrpcMetadata(this.userServiceAudience);
  }

  async getUser(userId: string) {
    const user = this.userService.getUser(
      { userId },
      await this.getRequestMetadata(),
    );
    return firstValueFrom(user);
  }

  async updateUserProfile(
    userId: string,
    dto: UpdateUserProfileDto,
  ): Promise<UpdateUserProfileResponse> {
    return firstValueFrom(
      this.userService.updateUserProfile(
        {
          userId,
          name: dto.name,
          phone: dto.phone,
          role: dto.role,
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async listUserAddresses(userId: string): Promise<ListUserAddressesResponse> {
    return firstValueFrom(
      this.userService.listUserAddresses(
        { userId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async createUserAddress(
    userId: string,
    dto: UpsertUserAddressDto,
  ): Promise<UpsertUserAddressResponse> {
    return firstValueFrom(
      this.userService.upsertUserAddress(
        {
          address: {
            id: '',
            userId,
            label: dto.label,
            line1: dto.line1,
            line2: dto.line2,
            city: dto.city,
            state: dto.state,
            country: dto.country,
            postalCode: dto.postalCode,
            latitude: dto.latitude,
            longitude: dto.longitude,
            isDefault: dto.isDefault ?? false,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async updateUserAddress(
    userId: string,
    addressId: string,
    dto: UpsertUserAddressDto,
  ): Promise<UpsertUserAddressResponse> {
    return firstValueFrom(
      this.userService.upsertUserAddress(
        {
          address: {
            id: addressId,
            userId,
            label: dto.label,
            line1: dto.line1,
            line2: dto.line2,
            city: dto.city,
            state: dto.state,
            country: dto.country,
            postalCode: dto.postalCode,
            latitude: dto.latitude,
            longitude: dto.longitude,
            isDefault: dto.isDefault ?? false,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async deleteUserAddress(
    userId: string,
    addressId: string,
  ): Promise<DeleteUserAddressResponse> {
    return firstValueFrom(
      this.userService.deleteUserAddress(
        { userId, addressId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async getUserPreference(userId: string): Promise<GetUserPreferenceResponse> {
    return firstValueFrom(
      this.userService.getUserPreference(
        { userId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async upsertUserPreference(
    userId: string,
    dto: UpsertUserPreferenceDto,
  ): Promise<UpsertUserPreferenceResponse> {
    return firstValueFrom(
      this.userService.upsertUserPreference(
        {
          preference: {
            id: '',
            userId,
            language: dto.language ?? 'en',
            currency: dto.currency ?? 'NGN',
            notificationChannels: dto.notificationChannels ?? [],
            preferredVehicleTypes: dto.preferredVehicleTypes ?? [],
            marketingOptIn: dto.marketingOptIn ?? false,
            darkMode: dto.darkMode ?? false,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async createEmergencyContact(
    userId: string,
    dto: UpsertEmergencyContactDto,
  ): Promise<UpsertEmergencyContactResponse> {
    return firstValueFrom(
      this.userService.upsertEmergencyContact(
        {
          contact: {
            id: '',
            userId,
            name: dto.name,
            phone: dto.phone,
            relationship: dto.relationship,
            isPrimary: dto.isPrimary ?? false,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async listEmergencyContacts(
    userId: string,
  ): Promise<ListEmergencyContactsResponse> {
    return firstValueFrom(
      this.userService.listEmergencyContacts(
        { userId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async updateEmergencyContact(
    userId: string,
    contactId: string,
    dto: UpsertEmergencyContactDto,
  ): Promise<UpsertEmergencyContactResponse> {
    return firstValueFrom(
      this.userService.upsertEmergencyContact(
        {
          contact: {
            id: contactId,
            userId,
            name: dto.name,
            phone: dto.phone,
            relationship: dto.relationship,
            isPrimary: dto.isPrimary ?? false,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async deleteEmergencyContact(
    userId: string,
    contactId: string,
  ): Promise<DeleteEmergencyContactResponse> {
    return firstValueFrom(
      this.userService.deleteEmergencyContact(
        { userId, contactId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async getKycProfile(userId: string): Promise<GetKycProfileResponse> {
    return firstValueFrom(
      this.userService.getKycProfile(
        { userId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async upsertKycProfile(
    userId: string,
    dto: UpsertKycProfileDto,
  ): Promise<UpsertKycProfileResponse> {
    return firstValueFrom(
      this.userService.upsertKycProfile(
        {
          profile: {
            id: '',
            userId,
            fullName: dto.fullName,
            dateOfBirth: dto.dateOfBirth,
            idType: dto.idType,
            idNumber: dto.idNumber,
            verificationStatus: dto.verificationStatus ?? 'PENDING',
            selfieUrl: dto.selfieUrl,
            documentFrontUrl: dto.documentFrontUrl,
            documentBackUrl: dto.documentBackUrl,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }
}
