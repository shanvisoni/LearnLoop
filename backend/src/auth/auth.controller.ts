import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @Get('debug/user')
  debugUser(@Request() req) {
    console.log('[DEBUG] Full request user object:', req.user);
    console.log('[DEBUG] User ID:', req.user?._id);
    console.log('[DEBUG] User type:', typeof req.user?._id);
    return {
      user: req.user,
      userId: req.user?._id,
      userIdType: typeof req.user?._id,
    };
  }
}
