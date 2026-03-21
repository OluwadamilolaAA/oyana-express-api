import { Injectable, Inject, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ObjectId } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  ValidateUserRequest,
  ValidateUserResponse,
} from '@package/packages';

@Injectable()
export class OyanaUserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

     const hashedPassword = await bcrypt.hash(data.password, 10);

    const user= this.userRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      user: savedUser,
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
      throw new UnauthorizedException('User not found');
    }

    return {
      user,
    };
  }

  async validateUser(
    request: ValidateUserRequest,
  ): Promise<ValidateUserResponse> {
    const { email, password } = request;

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
      user,
    };
  }
}
