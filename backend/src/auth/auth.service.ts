import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.services';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async register(registerDto: RegisterDto) {
//     const user = await this.usersService.create(registerDto);

//     // Type assertion for _id
//     const userId = (user._id as Types.ObjectId).toString();

//     const payload = { email: user.email, sub: userId };
//     const accessToken = this.jwtService.sign(payload);

//     return {
//       success: true,
//       message: 'User registered successfully',
//       user: {
//         id: userId.toString(),
//         username: user.username,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//       },
//       accessToken,
//     };
//   }

//   async login(loginDto: LoginDto) {
//     const user = await this.usersService.findByEmail(loginDto.email);

//     if (
//       !user ||
//       !(await this.usersService.validatePassword(
//         loginDto.password,
//         user.password,
//       ))
//     ) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const userId = (user._id as Types.ObjectId).toString();
//     const payload = { email: user.email, sub: userId };
//     const accessToken = this.jwtService.sign(payload);

//     return {
//       success: true,
//       message: 'Login successful',
//       user: {
//         id: userId,
//         username: user.username,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//       },
//       accessToken,
//     };
//   }
// }

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    // Fix: Proper type casting for MongoDB document
    const userId = (user as any)._id.toString();
    // OR if you have UserDocument type:
    // const userId = (user as UserDocument)._id.toString();

    const payload = { email: user.email, sub: userId };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: userId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (
      !user ||
      !(await this.usersService.validatePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fix: Proper type casting for MongoDB document
    const userId = (user as any)._id.toString();
    // OR if you have UserDocument type:
    // const userId = (user as UserDocument)._id.toString();

    const payload = { email: user.email, sub: userId };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: userId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
    };
  }

  //-------forgot password thing------------------
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');

    // Save token to database
    await this.usersService.setResetPasswordToken(email, resetToken);

    // Here you would send email with reset link
    // For now, just log it (implement email service later)
    console.log(`Reset token for ${email}: ${resetToken}`);

    // Note: Always return success to prevent email enumeration attacks
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;
    await this.usersService.resetPassword(token, newPassword);
  }
}
