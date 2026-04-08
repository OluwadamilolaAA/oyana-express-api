import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import {
  requireEmail,
  requireNonEmptyString,
  requirePassword,
} from '@package/packages';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';
import type {
  CreateUserRequest,
  CreateUserResponse,
  DeleteEmergencyContactRequest,
  DeleteEmergencyContactResponse,
  DeleteUserAddressRequest,
  DeleteUserAddressResponse,
  EmergencyContact as EmergencyContactDto,
  GetKycProfileRequest,
  GetKycProfileResponse,
  GetUserPreferenceRequest,
  GetUserPreferenceResponse,
  GetUserRequest,
  GetUserResponse,
  KycProfile as KycProfileDto,
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
  User as UserDto,
  UserAddress as UserAddressDto,
  UserPreference as UserPreferenceDto,
  ValidateUserRequest,
  ValidateUserResponse,
} from '@package/packages/generated/user';
import {
  EmergencyContactEntity,
  KycProfileEntity,
  UserAddressEntity,
  UserEntity,
  UserPreferenceEntity,
} from './entity/user.entity';
import {
  USER_ADDRESS_REPOSITORY,
  USER_EMERGENCY_CONTACT_REPOSITORY,
  USER_KYC_PROFILE_REPOSITORY,
  USER_PREFERENCE_REPOSITORY,
  USER_REPOSITORY,
} from './provider/user.providers';

@Injectable()
export class OyanaUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: MongoRepository<UserEntity>,
    @Inject(USER_ADDRESS_REPOSITORY)
    private readonly userAddressRepository: MongoRepository<UserAddressEntity>,
    @Inject(USER_PREFERENCE_REPOSITORY)
    private readonly userPreferenceRepository: MongoRepository<UserPreferenceEntity>,
    @Inject(USER_EMERGENCY_CONTACT_REPOSITORY)
    private readonly emergencyContactRepository: MongoRepository<EmergencyContactEntity>,
    @Inject(USER_KYC_PROFILE_REPOSITORY)
    private readonly kycProfileRepository: MongoRepository<KycProfileEntity>,
  ) {}

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const email = requireEmail(data.email);
    const password = requirePassword(data.password);
    const name = requireNonEmptyString(data.name, 'Name');

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      phone: '',
      role: 'customer',
    });

    const savedUser = await this.userRepository.save(user);

    return {
      user: this.toGrpcUser(savedUser),
    };
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const { userId } = request;

    if (!ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: this.toGrpcUser(user),
    };
  }

  async validateUser(
    request: ValidateUserRequest,
  ): Promise<ValidateUserResponse> {
    const email = requireEmail(request.email);
    const password = requirePassword(request.password);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: this.toGrpcUser(user),
    };
  }

  async updateUserProfile(
    request: UpdateUserProfileRequest,
  ): Promise<UpdateUserProfileResponse> {
    const user = await this.getRequiredUserEntity(request.userId);

    if (request.name !== undefined) {
      user.name = requireNonEmptyString(request.name, 'Name');
    }

    if (request.phone !== undefined) {
      user.phone = request.phone.trim();
    }

    if (request.role !== undefined) {
      user.role = requireNonEmptyString(request.role, 'Role');
    }

    const savedUser = await this.userRepository.save(user);

    return {
      user: this.toGrpcUser(savedUser),
    };
  }

  async listUserAddresses(
    request: ListUserAddressesRequest,
  ): Promise<ListUserAddressesResponse> {
    const user = await this.getRequiredUserEntity(request.userId);
    const addresses = await this.userAddressRepository.find({
      where: { userId: user.id },
    });

    return {
      addresses: addresses.map((address) => this.toGrpcUserAddress(address)),
    };
  }

  async upsertUserAddress(
    request: UpsertUserAddressRequest,
  ): Promise<UpsertUserAddressResponse> {
    const address = request.address;

    if (!address) {
      throw new BadRequestException('Address payload is required');
    }

    const user = await this.getRequiredUserEntity(address.userId);
    const existingAddress = await this.getExistingAddress(address.id, user.id);
    const timestamp = this.createTimestamp();
    const entity = existingAddress ?? this.userAddressRepository.create();

    entity.userId = user.id;
    entity.label = requireNonEmptyString(address.label, 'Address label');
    entity.line1 = requireNonEmptyString(address.line1, 'Address line 1');
    entity.line2 = this.normalizeOptionalString(address.line2);
    entity.city = requireNonEmptyString(address.city, 'City');
    entity.state = this.normalizeOptionalString(address.state);
    entity.country = requireNonEmptyString(address.country, 'Country');
    entity.postalCode = this.normalizeOptionalString(address.postalCode);
    entity.latitude = this.normalizeOptionalNumber(address.latitude);
    entity.longitude = this.normalizeOptionalNumber(address.longitude);
    entity.isDefault = Boolean(address.isDefault);
    entity.createdAt = entity.createdAt ?? address.createdAt ?? timestamp;
    entity.updatedAt = timestamp;

    const savedAddress = await this.userAddressRepository.save(entity);

    return {
      address: this.toGrpcUserAddress(savedAddress),
    };
  }

  async deleteUserAddress(
    request: DeleteUserAddressRequest,
  ): Promise<DeleteUserAddressResponse> {
    const user = await this.getRequiredUserEntity(request.userId);
    const addressId = this.parseObjectId(request.addressId, 'Address ID');
    const address = await this.userAddressRepository.findOne({
      where: { _id: addressId, userId: user.id },
    });

    if (!address) {
      return { deleted: false };
    }

    await this.userAddressRepository.remove(address);

    return { deleted: true };
  }

  async getUserPreference(
    request: GetUserPreferenceRequest,
  ): Promise<GetUserPreferenceResponse> {
    const user = await this.getRequiredUserEntity(request.userId);
    const preference = await this.userPreferenceRepository.findOne({
      where: { userId: user.id },
    });

    return {
      preference: preference
        ? this.toGrpcUserPreference(preference)
        : undefined,
    };
  }

  async upsertUserPreference(
    request: UpsertUserPreferenceRequest,
  ): Promise<UpsertUserPreferenceResponse> {
    const preference = request.preference;

    if (!preference) {
      throw new BadRequestException('Preference payload is required');
    }

    const user = await this.getRequiredUserEntity(preference.userId);
    const existingPreference = await this.userPreferenceRepository.findOne({
      where: { userId: user.id },
    });
    const timestamp = this.createTimestamp();
    const entity = existingPreference ?? this.userPreferenceRepository.create();

    entity.userId = user.id;
    entity.language =
      this.normalizeOptionalString(preference.language) ??
      entity.language ??
      'en';
    entity.currency =
      this.normalizeOptionalString(preference.currency) ??
      entity.currency ??
      'NGN';
    entity.notificationChannels = this.normalizeStringArray(
      preference.notificationChannels,
    );
    entity.preferredVehicleTypes = this.normalizeStringArray(
      preference.preferredVehicleTypes,
    );
    entity.marketingOptIn = Boolean(preference.marketingOptIn);
    entity.darkMode = Boolean(preference.darkMode);
    entity.createdAt = entity.createdAt ?? preference.createdAt ?? timestamp;
    entity.updatedAt = timestamp;

    const savedPreference = await this.userPreferenceRepository.save(entity);

    return {
      preference: this.toGrpcUserPreference(savedPreference),
    };
  }

  async listEmergencyContacts(
    request: ListEmergencyContactsRequest,
  ): Promise<ListEmergencyContactsResponse> {
    const user = await this.getRequiredUserEntity(request.userId);
    const contacts = await this.emergencyContactRepository.find({
      where: { userId: user.id },
    });

    return {
      contacts: contacts.map((contact) => this.toGrpcEmergencyContact(contact)),
    };
  }

  async upsertEmergencyContact(
    request: UpsertEmergencyContactRequest,
  ): Promise<UpsertEmergencyContactResponse> {
    const contact = request.contact;

    if (!contact) {
      throw new BadRequestException('Emergency contact payload is required');
    }

    const user = await this.getRequiredUserEntity(contact.userId);
    const existingContact = await this.getExistingEmergencyContact(
      contact.id,
      user.id,
    );
    const timestamp = this.createTimestamp();
    const entity = existingContact ?? this.emergencyContactRepository.create();

    entity.userId = user.id;
    entity.name = requireNonEmptyString(contact.name, 'Contact name');
    entity.phone = requireNonEmptyString(contact.phone, 'Contact phone');
    entity.relationship = requireNonEmptyString(
      contact.relationship,
      'Relationship',
    );
    entity.isPrimary = Boolean(contact.isPrimary);
    entity.createdAt = entity.createdAt ?? contact.createdAt ?? timestamp;

    const savedContact = await this.emergencyContactRepository.save(entity);

    return {
      contact: this.toGrpcEmergencyContact(savedContact),
    };
  }

  async deleteEmergencyContact(
    request: DeleteEmergencyContactRequest,
  ): Promise<DeleteEmergencyContactResponse> {
    const user = await this.getRequiredUserEntity(request.userId);
    const contactId = this.parseObjectId(request.contactId, 'Contact ID');
    const contact = await this.emergencyContactRepository.findOne({
      where: { _id: contactId, userId: user.id },
    });

    if (!contact) {
      return { deleted: false };
    }

    await this.emergencyContactRepository.remove(contact);

    return { deleted: true };
  }

  async getKycProfile(
    request: GetKycProfileRequest,
  ): Promise<GetKycProfileResponse> {
    const user = await this.getRequiredUserEntity(request.userId);
    const profile = await this.kycProfileRepository.findOne({
      where: { userId: user.id },
    });

    return {
      profile: profile ? this.toGrpcKycProfile(profile) : undefined,
    };
  }

  async upsertKycProfile(
    request: UpsertKycProfileRequest,
  ): Promise<UpsertKycProfileResponse> {
    const profile = request.profile;

    if (!profile) {
      throw new BadRequestException('KYC profile payload is required');
    }

    const user = await this.getRequiredUserEntity(profile.userId);
    const existingProfile = await this.getExistingKycProfile(
      profile.id,
      user.id,
    );
    const timestamp = this.createTimestamp();
    const entity = existingProfile ?? this.kycProfileRepository.create();

    entity.userId = user.id;
    entity.fullName = requireNonEmptyString(profile.fullName, 'Full name');
    entity.dateOfBirth = this.normalizeOptionalString(profile.dateOfBirth);
    entity.idType = requireNonEmptyString(profile.idType, 'ID type');
    entity.idNumber = requireNonEmptyString(profile.idNumber, 'ID number');
    entity.verificationStatus =
      this.normalizeOptionalString(profile.verificationStatus) ??
      entity.verificationStatus ??
      'PENDING';
    entity.selfieUrl = this.normalizeOptionalString(profile.selfieUrl);
    entity.documentFrontUrl = this.normalizeOptionalString(
      profile.documentFrontUrl,
    );
    entity.documentBackUrl = this.normalizeOptionalString(
      profile.documentBackUrl,
    );
    entity.verifiedAt = profile.verifiedAt ?? entity.verifiedAt;
    entity.createdAt = entity.createdAt ?? profile.createdAt ?? timestamp;
    entity.updatedAt = timestamp;

    const savedProfile = await this.kycProfileRepository.save(entity);

    return {
      profile: this.toGrpcKycProfile(savedProfile),
    };
  }

  private async getRequiredUserEntity(userId: string): Promise<UserEntity> {
    const parsedUserId = this.parseObjectId(userId, 'User ID');
    const user = await this.userRepository.findOne({
      where: { _id: parsedUserId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async getExistingAddress(
    addressId: string | undefined,
    userId: string,
  ): Promise<UserAddressEntity | null> {
    const normalizedAddressId = this.normalizeOptionalString(addressId);

    if (!normalizedAddressId) {
      return null;
    }

    if (!ObjectId.isValid(normalizedAddressId)) {
      throw new BadRequestException('Invalid address ID');
    }

    return this.userAddressRepository.findOne({
      where: { _id: new ObjectId(normalizedAddressId), userId },
    });
  }

  private async getExistingEmergencyContact(
    contactId: string | undefined,
    userId: string,
  ): Promise<EmergencyContactEntity | null> {
    const normalizedContactId = this.normalizeOptionalString(contactId);

    if (!normalizedContactId) {
      return null;
    }

    if (!ObjectId.isValid(normalizedContactId)) {
      throw new BadRequestException('Invalid contact ID');
    }

    return this.emergencyContactRepository.findOne({
      where: { _id: new ObjectId(normalizedContactId), userId },
    });
  }

  private async getExistingKycProfile(
    profileId: string | undefined,
    userId: string,
  ): Promise<KycProfileEntity | null> {
    const normalizedProfileId = this.normalizeOptionalString(profileId);

    if (!normalizedProfileId) {
      return this.kycProfileRepository.findOne({
        where: { userId },
      });
    }

    if (!ObjectId.isValid(normalizedProfileId)) {
      throw new BadRequestException('Invalid KYC profile ID');
    }

    return this.kycProfileRepository.findOne({
      where: { _id: new ObjectId(normalizedProfileId), userId },
    });
  }

  private parseObjectId(
    value: string | undefined,
    fieldName: string,
  ): ObjectId {
    const normalizedValue = requireNonEmptyString(value, fieldName);

    if (!ObjectId.isValid(normalizedValue)) {
      throw new BadRequestException(`Invalid ${fieldName.toLowerCase()}`);
    }

    return new ObjectId(normalizedValue);
  }

  private normalizeOptionalString(
    value: string | undefined,
  ): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue && normalizedValue.length > 0
      ? normalizedValue
      : undefined;
  }

  private normalizeOptionalNumber(
    value: number | undefined,
  ): number | undefined {
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : undefined;
  }

  private normalizeStringArray(values: string[] | undefined): string[] {
    return (values ?? [])
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  private createTimestamp(date = new Date()): Timestamp {
    return {
      seconds: Math.floor(date.getTime() / 1000),
      nanos: date.getMilliseconds() * 1_000_000,
    };
  }

  private toGrpcUser(user: UserEntity): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? '',
      role: user.role ?? 'customer',
    };
  }

  private toGrpcUserAddress(address: UserAddressEntity): UserAddressDto {
    return {
      id: address.id,
      userId: address.userId,
      label: address.label,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      latitude: address.latitude,
      longitude: address.longitude,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }

  private toGrpcUserPreference(
    preference: UserPreferenceEntity,
  ): UserPreferenceDto {
    return {
      id: preference.id,
      userId: preference.userId,
      language: preference.language,
      currency: preference.currency,
      notificationChannels: preference.notificationChannels,
      preferredVehicleTypes: preference.preferredVehicleTypes,
      marketingOptIn: preference.marketingOptIn,
      darkMode: preference.darkMode,
      createdAt: preference.createdAt,
      updatedAt: preference.updatedAt,
    };
  }

  private toGrpcEmergencyContact(
    contact: EmergencyContactEntity,
  ): EmergencyContactDto {
    return {
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isPrimary: contact.isPrimary,
      createdAt: contact.createdAt,
    };
  }

  private toGrpcKycProfile(profile: KycProfileEntity): KycProfileDto {
    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      dateOfBirth: profile.dateOfBirth,
      idType: profile.idType,
      idNumber: profile.idNumber,
      verificationStatus: profile.verificationStatus,
      selfieUrl: profile.selfieUrl,
      documentFrontUrl: profile.documentFrontUrl,
      documentBackUrl: profile.documentBackUrl,
      verifiedAt: profile.verifiedAt,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
