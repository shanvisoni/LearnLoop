import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.services';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Get current user's profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.usersService.getUserProfile(req.user.id);
  }

  // Update current user's profile
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  // Change password
  @Put('password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user.id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  // Search users (for community features)
  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.usersService.searchUsers(query, limit);
  }

  // Get user by ID (public profile)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  // Get user by email (for internal use)
  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // Get user by username (for internal use)
  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  // Community management endpoints
  @Post('communities/:communityId/join')
  @UseGuards(JwtAuthGuard)
  async joinCommunity(
    @Request() req,
    @Param('communityId') communityId: string,
  ) {
    await this.usersService.joinCommunity(req.user.id, communityId);
    return { message: 'Successfully joined community' };
  }

  @Delete('communities/:communityId/leave')
  @UseGuards(JwtAuthGuard)
  async leaveCommunity(
    @Request() req,
    @Param('communityId') communityId: string,
  ) {
    await this.usersService.leaveCommunity(req.user.id, communityId);
    return { message: 'Successfully left community' };
  }
}
