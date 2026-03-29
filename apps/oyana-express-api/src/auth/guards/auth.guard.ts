import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const result = await this.authService.validateToken(token);

    if (!result.isValid) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    (request as Request & { user: unknown }).user = {
      userId: result.userId,
      email: result.email,
      role: result.role,
      sessionId: result.sessionId,
    };

    return true;
  }

  private extractBearerToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return undefined;
    return authHeader.slice(7);
  }
}
