import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { MongoRepository } from 'typeorm';
import { AUTH_OTP_REPOSITORY } from '../auth.providers';
import { OTPType, OtpVerification } from '../Entities/verification-otp.entity';

@Injectable()
export class OTPService {
  constructor(
    @Inject(AUTH_OTP_REPOSITORY)
    private otpRepo: MongoRepository<OtpVerification>,
  ) {}

  async generateOTP(userId: string, type: OTPType): Promise<string> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');

    const otp = this.otpRepo.create({
      userId,
      code,
      type,
      expiresAt: dayjs().add(5, 'minutes').toDate(),
    });

    await this.otpRepo.save(otp);

    return code;
  }

  async verifyOTP(
    userId: string,
    code: string,
    type: OTPType,
  ): Promise<boolean> {
    const otp = await this.otpRepo.findOne({
      where: { userId, code, type },
    });

    if (!otp) throw new BadRequestException('Invalid OTP');

    if (otp.usedAt) throw new BadRequestException('OTP already used');

    if (dayjs().isAfter(otp.expiresAt)) {
      throw new BadRequestException('OTP expired');
    }

    otp.usedAt = new Date();
    await this.otpRepo.save(otp);

    return true;
  }
}
