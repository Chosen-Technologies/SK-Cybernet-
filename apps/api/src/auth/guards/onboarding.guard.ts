import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { SKIP_ONBOARDING_KEY } from '../decorators/skip-onboarding.decorator';

@Injectable()
export class OnboardingGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipOnboarding = this.reflector.getAllAndOverride<boolean>(SKIP_ONBOARDING_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipOnboarding) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userPayload = request.user;

    if (!userPayload || !userPayload.id) {
      throw new ForbiddenException('Authentication required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.id },
      select: { onboardingStatus: true },
    });

    if (!user) {
      throw new ForbiddenException('User record not found');
    }

    if (user.onboardingStatus !== 'complete') {
      throw new ForbiddenException({
        statusCode: 403,
        message: ['Onboarding incomplete'],
        error: 'Forbidden',
        code: 'ONBOARDING_INCOMPLETE',
      });
    }

    return true;
  }
}
