import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { ReqUser } from './decorators/user.decorator';
import { SkipOnboarding } from './decorators/skip-onboarding.decorator';
import {
  LoginDto,
  PhoneRequestDto,
  PhoneVerifyDto,
  PinLoginDto,
  PinPaymentDto,
  RegisterDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication & Onboarding')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  private setOnboardingCookie(res: Response, status: string) {
    res.cookie('onboarding_status', status, {
      httpOnly: false, // Let client middleware read it
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  private clearAuthCookie(res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('onboarding_status', { path: '/' });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.authService.register(dto);
    this.setAuthCookie(res, token);
    this.setOnboardingCookie(res, user.onboardingStatus);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and 6-digit login PIN' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.authService.login(dto);
    this.setAuthCookie(res, token);
    this.setOnboardingCookie(res, user.onboardingStatus);
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear session cookies' })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookie(res);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @SkipOnboarding()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile and onboarding checklist' })
  async getMe(@ReqUser() userPayload: any, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.getMe(userPayload.id);
    this.setOnboardingCookie(res, user.onboardingStatus);
    return user;
  }

  @Post('onboarding/phone/request')
  @UseGuards(JwtAuthGuard)
  @SkipOnboarding()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request 6-digit phone verification OTP' })
  async requestOtp(@ReqUser() userPayload: any, @Body() dto: PhoneRequestDto) {
    return this.authService.requestOtp(userPayload.id, dto.phone);
  }

  @Post('onboarding/phone/verify')
  @UseGuards(JwtAuthGuard)
  @SkipOnboarding()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify phone number using 6-digit OTP' })
  async verifyOtp(
    @ReqUser() userPayload: any,
    @Body() dto: PhoneVerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyOtp(userPayload.id, dto.phone, dto.code);
    const user = await this.authService.getMe(userPayload.id);
    this.setOnboardingCookie(res, user.onboardingStatus);
    return result;
  }

  @Post('onboarding/pin/login')
  @UseGuards(JwtAuthGuard)
  @SkipOnboarding()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure 6-digit Login PIN' })
  async setLoginPin(
    @ReqUser() userPayload: any,
    @Body() dto: PinLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.setLoginPin(userPayload.id, dto.pin);
    const user = await this.authService.getMe(userPayload.id);
    this.setOnboardingCookie(res, user.onboardingStatus);
    return result;
  }

  @Post('onboarding/pin/payment')
  @UseGuards(JwtAuthGuard)
  @SkipOnboarding()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure 4-digit Payment PIN' })
  async setPaymentPin(
    @ReqUser() userPayload: any,
    @Body() dto: PinPaymentDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.setPaymentPin(userPayload.id, dto.pin);
    const user = await this.authService.getMe(userPayload.id);
    this.setOnboardingCookie(res, user.onboardingStatus);
    return result;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  async googleAuth() {
    // Redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback handler' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as { email: string; fullName: string };
    const { user, token } = await this.authService.googleLogin(googleUser);
    this.setAuthCookie(res, token);
    this.setOnboardingCookie(res, user?.onboardingStatus || 'incomplete');

    const clientUrl = process.env.APP_BASE_URL || 'http://localhost:3001';
    const destination = user?.onboardingStatus === 'complete' ? '/dashboard' : '/onboarding/start';
    res.redirect(`${clientUrl}${destination}`);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @SkipOnboarding()
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload user profile picture' })
  async uploadAvatar(
    @ReqUser() userPayload: any,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000';
    const avatarUrl = `${apiBaseUrl}/uploads/${file.filename}`;
    await this.authService.updateAvatar(userPayload.id, avatarUrl);
    return { avatarUrl };
  }
}
