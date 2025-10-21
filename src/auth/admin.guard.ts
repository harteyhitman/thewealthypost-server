// src/auth/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // First authenticate with JWT
    const isAuthenticated = await super.canActivate(context) as boolean;
    
    // Then check admin role
    return isAuthenticated && request.user?.role === 'admin';
  }
}
