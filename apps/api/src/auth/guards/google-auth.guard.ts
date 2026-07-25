import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Check if we should use Mock Google OAuth (e.g. offline environment or MOCK_GOOGLE=true)
    const useMock = process.env.MOCK_GOOGLE !== 'false';

    if (useMock) {
      const path = request.path || request.url;
      if (path.includes('/auth/google/callback')) {
        // Mock the user payload that Passport would return
        request.user = {
          email: 'mock.google.user@example.com',
          fullName: 'Mock Google User',
        };
        return true;
      } else {
        // We are at /auth/google, redirect directly to /auth/google/callback
        response.redirect('/auth/google/callback');
        return false;
      }
    }

    // Otherwise, use real Passport-Google-OAuth20 flow
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
