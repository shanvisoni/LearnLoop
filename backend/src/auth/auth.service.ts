import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.services';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      // Check if user already exists by email
      const existingUserByEmail = await this.usersService.findByEmail(
        registerDto.email,
      );
      if (existingUserByEmail) {
        throw new ConflictException({
          success: false,
          message: 'User with this email already exists',
          field: 'email',
        });
      }

      // Check if username already exists
      const existingUserByUsername = await this.usersService.findByUsername(
        registerDto.username,
      );
      if (existingUserByUsername) {
        throw new ConflictException({
          success: false,
          message: 'Username is already taken',
          field: 'username',
        });
      }

      const user = await this.usersService.create(registerDto);
      const userId = (user as any)._id.toString();
      const payload = { email: user.email, sub: userId };
      const accessToken = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Account created successfully! Welcome to our platform.',
        user: {
          id: userId,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          // country: user.country,
          // countryCode: user.countryCode,
        },
        accessToken,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Registration failed. Please try again.',
      });
    }
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
}
