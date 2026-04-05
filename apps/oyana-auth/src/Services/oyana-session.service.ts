import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { User } from '@package/packages';
import { AUTH_SESSION_REPOSITORY } from '../auth.providers';
import { Session } from '../Entities/session.entity';

export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class SessionService {
  constructor(
    @Inject(AUTH_SESSION_REPOSITORY)
    private readonly repo: MongoRepository<Session>,
  ) {}

  async createSession(
    user: User,
    refreshToken: string,
    meta: SessionMetadata = {},
  ): Promise<Session> {
    const session = this.repo.create({
      userId: user.id,
      authIdentityId: user.id,
      refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: dayjs().add(7, 'days').toDate(),
      isActive: true,
    });

    return this.repo.save(session);
  }

  async validateSession(sessionId: string): Promise<Session | null> {
    if (!ObjectId.isValid(sessionId)) {
      return null;
    }

    const session = await this.repo.findOne({
      where: { _id: new ObjectId(sessionId) },
    });

    if (!session) return null;
    if (!session.isActive) return null;
    if (session.revokedAt) return null;
    if (dayjs().isAfter(session.expiresAt)) return null;

    return session;
  }

  async revokeSession(sessionId: string): Promise<void> {
    const objectId = this.toObjectId(sessionId);

    await this.repo.updateOne(
      { _id: objectId },
      {
        $set: {
          isActive: false,
          revokedAt: new Date(),
          revocationReason: 'logout',
        },
      },
    );
  }

  async updateRefreshToken(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    const objectId = this.toObjectId(sessionId);

    await this.repo.updateOne(
      { _id: objectId },
      {
        $set: {
          refreshTokenHash: await bcrypt.hash(refreshToken, 10),
        },
      },
    );
  }

  private toObjectId(sessionId: string): ObjectId {
    if (!ObjectId.isValid(sessionId)) {
      throw new BadRequestException('Invalid session id');
    }

    return new ObjectId(sessionId);
  }
}
