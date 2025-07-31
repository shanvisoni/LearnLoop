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

  // async register(registerDto: RegisterDto) {
  //   const user = await this.usersService.create(registerDto);

  //   // Fix: Proper type casting for MongoDB document
  //   const userId = (user as any)._id.toString();
  //   // OR if you have UserDocument type:
  //   // const userId = (user as UserDocument)._id.toString();

  //   const payload = { email: user.email, sub: userId };
  //   const accessToken = this.jwtService.sign(payload);

  //   return {
  //     success: true,
  //     message: 'User registered successfully',
  //     user: {
  //       id: userId,
  //       username: user.username,
  //       email: user.email,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //     },
  //     accessToken,
  //   };
  // }

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

  //----------------county purpose changes-----------------------
  // async login(loginDto: LoginDto) {
  //   try {
  //     const user = await this.usersService.findByEmail(loginDto.email);

  //     if (!user) {
  //       throw new UnauthorizedException('Invalid credentials');
  //     }

  //     const isPasswordValid = await this.usersService.validatePassword(
  //       loginDto.password,
  //       user.password,
  //     );

  //     if (!isPasswordValid) {
  //       throw new UnauthorizedException('Invalid credentials');
  //     }

  //     const userId = (user as any)._id.toString();
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
  //         country: user.country,
  //         countryCode: user.countryCode,
  //       },
  //       accessToken,
  //     };
  //   } catch (error) {
  //     if (error instanceof UnauthorizedException) {
  //       throw error;
  //     }
  //     throw new BadRequestException('Login failed');
  //   }
  // }
  // }

  //-------forgot password thing------------------
  // async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
  //   const { email } = forgotPasswordDto;

  //   // Generate reset token
  //   const resetToken = randomBytes(32).toString('hex');

  //   // Save token to database
  //   await this.usersService.setResetPasswordToken(email, resetToken);

  //   // Here you would send email with reset link
  //   // For now, just log it (implement email service later)
  //   console.log(`Reset token for ${email}: ${resetToken}`);

  //   // Note: Always return success to prevent email enumeration attacks
  // }

  // // async forgotPassword(
  // //   forgotPasswordDto: ForgotPasswordDto,
  // // ): Promise<{ resetUrl?: string }> {
  // //   const { email } = forgotPasswordDto;

  // //   // Check if user exists (optional - for better UX in demo)
  // //   const user = await this.usersService.findByEmail(email);
  // //   if (!user) {
  // //     // In production, you'd still return success to prevent enumeration
  // //     // For demo, we can show the actual error
  // //     throw new NotFoundException('User with this email does not exist');
  // //   }

  // //   // Generate reset token
  // //   const resetToken = randomBytes(32).toString('hex');

  // //   // Save token to database
  // //   await this.usersService.setResetPasswordToken(email, resetToken);

  // //   // Create reset URL (in demo mode)
  // //   const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/forgot-password?token=${resetToken}`;

  // //   // Log it for demo purposes
  // //   console.log(`Reset URL for ${email}: ${resetUrl}`);

  // //   // Return the URL in demo mode (remove this in production)
  // //   return { resetUrl };
  // // }

  // async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
  //   const { token, newPassword } = resetPasswordDto;
  //   await this.usersService.resetPassword(token, newPassword);
  // }
}
