// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   Query,
//   Request,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { CommunitiesService } from './communities.service';
// import { CreateCommunityDto } from './dto/create-community.dto';
// import { UpdateCommunityDto } from './dto/update-community.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @Controller('communities')
// export class CommunitiesController {
//   constructor(private readonly communitiesService: CommunitiesService) {}

//   // @Post()
//   // @UseGuards(JwtAuthGuard)
//   // create(@Body() createCommunityDto: CreateCommunityDto, @Request() req) {
//   //    console.log('JWT User ID:', req.user.id);
//   //    console.log('JWT User sub:', req.user.sub);
//   //    console.log('Full JWT user object:', req.user);
//   //   return this.communitiesService.create(createCommunityDto, req.user.id);
//   // }

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   create(@Body() createCommunityDto: CreateCommunityDto, @Request() req) {
//     console.log('req.user:', req.user);
//     console.log('req.user.id:', req.user.id);
//     console.log('req.user._id:', req.user._id);

//     const userId = req.user._id?.toString() || req.user.id;
//     return this.communitiesService.create(createCommunityDto, userId);
//   }

//   @Get()
//   findAll(
//     @Query('search') search?: string,
//     @Query('page') page?: number,
//     @Query('limit') limit?: number,
//   ) {
//     return this.communitiesService.findAll(search, page, limit);
//   }

//   @Get('my-communities')
//   @UseGuards(JwtAuthGuard)
//   getMyCreatedCommunities(@Request() req) {
//     return this.communitiesService.getMyCreatedCommunities(req.user.userId);
//   }

//   @Get('joined-communities')
//   @UseGuards(JwtAuthGuard)
//   getJoinedCommunities(@Request() req) {
//     return this.communitiesService.getJoinedCommunities(req.user.userId);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.communitiesService.findOne(id);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard)
//   update(
//     @Param('id') id: string,
//     @Body() updateCommunityDto: UpdateCommunityDto,
//     @Request() req,
//   ) {
//     return this.communitiesService.update(
//       id,
//       updateCommunityDto,
//       req.user.userId,
//     );
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard)
//   remove(@Param('id') id: string, @Request() req) {
//     return this.communitiesService.remove(id, req.user.userId);
//   }

//   @Post(':id/join')
//   @UseGuards(JwtAuthGuard)
//   joinCommunity(@Param('id') id: string, @Request() req) {
//     return this.communitiesService.joinCommunity(id, req.user.userId);
//   }

//   @Post(':id/leave')
//   @UseGuards(JwtAuthGuard)
//   leaveCommunity(@Param('id') id: string, @Request() req) {
//     return this.communitiesService.leaveCommunity(id, req.user.userId);
//   }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommunityDto: CreateCommunityDto, @Request() req) {
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user.id);

    // Fix: Use req.user.id instead of req.user._id
    const userId = req.user.id;
    return this.communitiesService.create(createCommunityDto, userId);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.communitiesService.findAll(search, page, limit);
  }

  @Get('my-communities')
  @UseGuards(JwtAuthGuard)
  getMyCreatedCommunities(@Request() req) {
    // Fix: Use req.user.id instead of req.user.userId
    return this.communitiesService.getMyCreatedCommunities(req.user.id);
  }

  @Get('joined-communities')
  @UseGuards(JwtAuthGuard)
  getJoinedCommunities(@Request() req) {
    // Fix: Use req.user.id instead of req.user.userId
    return this.communitiesService.getJoinedCommunities(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communitiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
    @Request() req,
  ) {
    console.log('Update request - req.user:', req.user);
    console.log('Update request - req.user.id:', req.user.id);
    console.log('Update request - community ID:', id);
    console.log('Update request - DTO:', updateCommunityDto);

    // Fix: Use req.user.id instead of req.user.userId
    return this.communitiesService.update(id, updateCommunityDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    // Fix: Use req.user.id instead of req.user.userId
    return this.communitiesService.remove(id, req.user.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  joinCommunity(@Param('id') id: string, @Request() req) {
    // Fix: Use req.user.id instead of req.user.userId
    return this.communitiesService.joinCommunity(id, req.user.id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  leaveCommunity(@Param('id') id: string, @Request() req) {
    // Fix: Use req.user.id instead of req.user.userId
    return this.communitiesService.leaveCommunity(id, req.user.id);
  }
}
