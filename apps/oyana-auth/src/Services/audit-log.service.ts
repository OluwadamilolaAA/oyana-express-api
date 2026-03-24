import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AuthAuditLog } from '../Entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuthAuditLog)
    private readonly repo: MongoRepository<AuthAuditLog>,
  ) {}

  async log(data: Partial<AuthAuditLog>) {
    const log = this.repo.create(data);
    return this.repo.save(log);
  }
}