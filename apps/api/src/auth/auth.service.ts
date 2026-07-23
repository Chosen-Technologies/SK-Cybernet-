import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { OnboardingStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }],
      },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          fullName: dto.fullName,
          authProvider: 'local',
          onboardingStatus: OnboardingStatus.incomplete,
        },
      });

      await tx.auth.create({
        data: {
          userId: user.id,
          passwordHash: hashedPassword,
          passwordSetAt: new Date(),
        },
      });

      await tx.wallet.create({
        data: {
          userId: user.id,
          availableCredits: 0.0,
          escrowedCredits: 0.0,
        },
      });

      const token = this.generateToken(user);
      return { user, token };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { auth: true },
    });

    if (!user || !user.auth || !user.auth.loginPinHash) {
      throw new UnauthorizedException('Invalid email or PIN');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    const isMatch = await bcrypt.compare(dto.pin, user.auth.loginPinHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or PIN');
    }

    const token = this.generateToken(user);
    const { auth, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async googleLogin(profile: { email: string; fullName: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
      include: { auth: true },
    });

    if (user && user.isSuspended) {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    if (!user) {
      user = await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: profile.email,
            fullName: profile.fullName,
            authProvider: 'google',
            onboardingStatus: OnboardingStatus.complete,
          },
        });

        await tx.auth.create({
          data: {
            userId: newUser.id,
          },
        });

        await tx.wallet.create({
          data: {
            userId: newUser.id,
            availableCredits: 0.0,
            escrowedCredits: 0.0,
          },
        });

        return tx.user.findUnique({
          where: { id: newUser.id },
          include: { auth: true },
        }) as any;
      });
    } else if (user.authProvider === 'google' && user.onboardingStatus !== OnboardingStatus.complete) {
      // Update existing Google users to have complete onboardingStatus
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { onboardingStatus: OnboardingStatus.complete },
        include: { auth: true },
      });
    }

    const token = this.generateToken(user!);
    const { auth, ...safeUser } = user!;
    return { user: { ...safeUser, onboardingStatus: OnboardingStatus.complete }, token };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        auth: {
          select: {
            passwordSetAt: true,
            phoneVerifiedAt: true,
            loginPinSetAt: true,
            paymentPinSetAt: true,
          },
        },
        wallet: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async requestOtp(userId: string, phone: string) {
    // Check if phone number is already taken by another user
    const existingPhone = await this.prisma.user.findFirst({
      where: {
        phone,
        id: { not: userId },
      },
    });
    if (existingPhone) {
      throw new ConflictException('This phone number is already registered with another account');
    }

    // Rate limiting: 1 request per minute per phone number
    const limitKey = `otp_limit:${phone}`;
    const isLimit = await this.redis.get(limitKey);
    if (isLimit) {
      throw new BadRequestException('Too many requests. Please wait 1 minute before requesting another OTP.');
    }

    // Generate 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis (TTL 5 minutes)
    const otpKey = `otp:${phone}`;
    await this.redis.set(otpKey, code, 300);

    // Set rate limit tracker (TTL 60s)
    await this.redis.set(limitKey, '1', 60);

    // Mock SMS sending by logging to console
    console.log(`\n======================================================`);
    console.log(`[SMS MOCK] To: ${phone} | Code: ${code} (Expires in 5 mins)`);
    console.log(`======================================================\n`);

    return { message: 'Verification code sent successfully' };
  }

  async verifyOtp(userId: string, phone: string, code: string) {
    const otpKey = `otp:${phone}`;
    const storedCode = await this.redis.get(otpKey);

    // Testing shortcut: outside production, any 6-digit code is accepted since no real SMS provider is wired up yet.
    const isTestEnvironment = process.env.NODE_ENV !== 'production';
    if (!isTestEnvironment && (!storedCode || storedCode !== code)) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.redis.del(otpKey);

    // Update phone number on User profile and phoneVerifiedAt in Auth
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { phone },
      }),
      this.prisma.auth.update({
        where: { userId },
        data: { phoneVerifiedAt: new Date() },
      }),
    ]);

    await this.checkAndUpdateOnboardingStatus(userId);
    return { message: 'Phone number verified successfully' };
  }

  async setLoginPin(userId: string, pin: string) {
    const auth = await this.prisma.auth.findUnique({
      where: { userId },
      select: { phoneVerifiedAt: true },
    });

    if (!auth || !auth.phoneVerifiedAt) {
      throw new BadRequestException('Phone number must be verified before setting a login PIN');
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await this.prisma.auth.update({
      where: { userId },
      data: {
        loginPinHash: hashedPin,
        loginPinSetAt: new Date(),
        lastPinChangedAt: new Date(),
      },
    });

    await this.checkAndUpdateOnboardingStatus(userId);
    return { message: 'Login PIN configured successfully' };
  }

  async setPaymentPin(userId: string, pin: string) {
    const auth = await this.prisma.auth.findUnique({
      where: { userId },
      select: { phoneVerifiedAt: true },
    });

    if (!auth || !auth.phoneVerifiedAt) {
      throw new BadRequestException('Phone number must be verified before setting a payment PIN');
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await this.prisma.auth.update({
      where: { userId },
      data: {
        paymentPinHash: hashedPin,
        paymentPinSetAt: new Date(),
        lastPinChangedAt: new Date(),
      },
    });

    await this.checkAndUpdateOnboardingStatus(userId);
    return { message: 'Payment PIN configured successfully' };
  }

  private generateToken(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  private async checkAndUpdateOnboardingStatus(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { auth: true },
    });

    if (!user || !user.auth) {
      return false;
    }

    const hasPhone = !!user.phone && !!user.auth.phoneVerifiedAt;
    const hasLoginPin = !!user.auth.loginPinHash;
    const hasPaymentPin = !!user.auth.paymentPinHash;

    if (hasPhone && hasLoginPin && hasPaymentPin) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { onboardingStatus: OnboardingStatus.complete },
      });
      return true;
    }

    return false;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }
}
