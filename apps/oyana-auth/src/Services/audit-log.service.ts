import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { AUTH_AUDIT_LOG_REPOSITORY } from '../auth.providers';
import { AuthAuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject(AUTH_AUDIT_LOG_REPOSITORY)
    private readonly repo: MongoRepository<AuthAuditLog>,
  ) {}

  async log(data: Partial<AuthAuditLog>) {
    const log = this.repo.create(data);
    return this.repo.save(log);
  }
}