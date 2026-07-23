import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'Login PIN must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Login PIN must be numeric' })
  pin!: string;
}

export class PhoneRequestDto {
  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid E.164 formatted number' })
  phone!: string;
}

export class PhoneVerifyDto {
  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Verification code must be numeric' })
  code!: string;
}

export class PinLoginDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'Login PIN must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Login PIN must be numeric' })
  pin!: string;
}

export class PinPaymentDto {
  @ApiProperty({ example: '1234' })
  @IsString()
  @Length(4, 4, { message: 'Payment PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'Payment PIN must be numeric' })
  pin!: string;
}
