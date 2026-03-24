import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  requireEmail,
  requireNonEmptyString,
  requirePassword,
  ValidateUserRequest,
  ValidateUserResponse,
  User as UserDto,
} from '@package/packages';
import { USER_REPOSITORY } from './user.providers';

@Injectable()
export class OyanaUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: MongoRepository<User>,
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

  async getUserById(request: GetUserRequest): Promise<GetUserResponse> {
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

  private toGrpcUser(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? '',
      role: user.role ?? 'customer',
    };
  }
}
