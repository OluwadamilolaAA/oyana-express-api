import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { MongoRepository } from 'typeorm';
import { OTPType, OtpVerification } from '../Entities/verification-otp.entity';

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(OtpVerification)
    private otpRepo: MongoRepository<OtpVerification>,
  ) {}

  async generateOTP(userId: string, type: OTPType) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const otp = this.otpRepo.create({
      userId,
      code,
      type,
      expiresAt: dayjs().add(5, 'minutes').toDate(),
    });

    await this.otpRepo.save(otp);

    return code;
  }

  async verifyOTP(userId: string, code: string, type: OTPType) {
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