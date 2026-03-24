import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Credential } from '../Entities/credentials.entity';

@Injectable()
export class CredentialService {
  constructor(
    @InjectRepository(Credential)
    private readonly repo: MongoRepository<Credential>,
  ) {}

  async createPasswordCredential(
    userId: string,
    authIdentityId: string,
    password: string,
  ) {
    const hash = await bcrypt.hash(password, 10);

    // check if first credential
    const existing = await this.repo.findOne({
      where: { userId },
    });

    const credential = this.repo.create({
      userId,
      authIdentityId,
      type: 'PASSWORD',
      passwordHash: hash,
      isPrimary: !existing,
    });

    return this.repo.save(credential);
  }

  // VERIFY PASSWORD
  async validatePassword(userId: string, password: string) {
    const credential = await this.repo.findOne({
      where: { userId, type: 'PASSWORD' },
    });

    if (!credential || !credential.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, credential.passwordHash);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return credential;
  }

  // SOCIAL LOGIN (GOOGLE, etc)
  async createSocialCredential(
    userId: string,
    authIdentityId: string,
    provider: 'GOOGLE' | 'GITHUB',
    providerId: string,
  ) {
    const existing = await this.repo.findOne({
      where: { userId },
    });

    const credential = this.repo.create({
      userId,
      authIdentityId,
      type: provider,
      providerId,
      isPrimary: !existing, 
    });

    return this.repo.save(credential);
  }

  // FIND CREDENTIAL
  async findByUserId(userId: string) {
    return this.repo.find({
      where: { userId },
    });
  }
}