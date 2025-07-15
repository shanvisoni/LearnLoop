import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.services';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
