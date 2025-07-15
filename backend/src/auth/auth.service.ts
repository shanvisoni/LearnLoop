// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.services';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { Types } from 'mongoose';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async register(registerDto: RegisterDto) {
//     const user = await this.usersService.create(registerDto);

//     const userId = (user as any)._id.toString();

//     const payload = { email: user.email, sub: userId };
//     const accessToken = this.jwtService.sign(payload);

//     return {
//       success: true,
//       message: 'User registered successfully',
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

//     // Fix: Proper type casting for MongoDB document
//     const userId = (user as any)._id.toString();
//     // OR if you have UserDocument type:
//     // const userId = (user as UserDocument)._id.toString();

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

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.services';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  AuthResponse,
  UserResponse,
} from '../common/interfaces/api-response.intergace';
import { JwtPayload } from '../common/interfaces/jwt-payload.interfaces';
import { AUTH_MESSAGES } from '../common/constants/auth.constants';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(registerDto);
    const accessToken = this.generateAccessToken(user);

    return {
      success: true,
      message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
      user: this.mapUserToResponse(user),
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto);
    const accessToken = this.generateAccessToken(user);

    return {
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      user: this.mapUserToResponse(user),
      accessToken,
    };
  }

  private async validateUser(loginDto: LoginDto): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (
      !user ||
      !(await this.usersService.validatePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    return user;
  }

  private generateAccessToken(user: UserDocument): string {
    const payload: JwtPayload = {
      email: user.email,
      sub: (user as any)._id.toString(),
    };

    return this.jwtService.sign(payload);
  }

  private mapUserToResponse(user: UserDocument): UserResponse {
    return {
      id: (user as any)._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
