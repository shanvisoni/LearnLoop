import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CustomValidationPipe } from '../common/pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new CustomValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new CustomValidationPipe())
  async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    // req.user comes from the JWT strategy validate method
    return {
      success: true,
      user: req.user,
    };
  }

  //----------forgot password related stuff------------

  //   @Post('forgot-password')
  //   @HttpCode(HttpStatus.OK)
  //   async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //     await this.authService.forgotPassword(forgotPasswordDto);
  //     return {
  //       success: true,
  //       message:
  //         'If your email exists in our system, you will receive a password reset link',
  //     };
  //   }

  //   @Post('reset-password')
  //   @HttpCode(HttpStatus.OK)
  //   async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //     await this.authService.resetPassword(resetPasswordDto);
  //     return {
  //       success: true,
  //       message: 'Password reset successfully',
  //     };
  //   }
}
