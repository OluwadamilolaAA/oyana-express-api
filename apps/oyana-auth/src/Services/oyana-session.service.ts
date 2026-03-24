import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { User } from '@package/packages';
import { Session } from '../Entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly repo: MongoRepository<Session>,
  ) {}

  async createSession(user: User, refreshToken: string, meta: any) {
    const session = this.repo.create({
      userId: user.id,
      authIdentityId: user.id,
      refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      ipAddress: meta?.ip,
      userAgent: meta?.userAgent,
      expiresAt: dayjs().add(7, 'days').toDate(),
      isActive: true,
    });

    return this.repo.save(session);
  }

  async validateSession(sessionId: string) {
    const session = await this.repo.findOne({
      where: { _id: new ObjectId(sessionId) },
    });

    if (!session) return null;
    if (!session.isActive) return null;
    if (session.revokedAt) return null;
    if (dayjs().isAfter(session.expiresAt)) return null;

    return session;
  }

  async revokeSession(sessionId: string) {
    await this.repo.updateOne(
      { _id: new ObjectId(sessionId) },
      {
        $set: {
          isActive: false,
          revokedAt: new Date(),
          revocationReason: 'logout',
        },
      },
    );
  }

  async updateRefreshToken(sessionId: string, refreshToken: string) {
    await this.repo.updateOne(
      { _id: new ObjectId(sessionId) },
      {
        $set: {
          refreshTokenHash: await bcrypt.hash(refreshToken, 10),
        },
      },
    );
  }
}