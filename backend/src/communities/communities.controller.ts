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

  @Get(':id/stats')
  getCommunityStats(@Param('id') id: string) {
    return this.communitiesService.getCommunityState(id); // or rename the service method
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
    return this.communitiesService.update(id, updateCommunityDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    // Fix: Use req.user.id instead of req.user.userId
    return this.communitiesService.remove(id, req.user.id);
  }

  @Post(':id/members')
  getCommunityMembers(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.communitiesService.getCommunityMembers(id, page, limit);
  }

  @Post(':id/members/:userId')
  getMemberPriofile(
    @Param('id') communityId: string,
    @Param('userId') userId: string,
  ) {
    return this.communitiesService.getMemberProfile(communityId, userId);
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
// } from '@nestjs/common';
// import { CommunitiesService } from './communities.service';
// import { CreateCommunityDto } from './dto/create-community.dto';
// import { UpdateCommunityDto } from './dto/update-community.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { ResponseUtil } from '../common/utils/response.util';

// @Controller('communities')
// export class CommunitiesController {
//   constructor(private readonly communitiesService: CommunitiesService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   async create(@Body() createCommunityDto: CreateCommunityDto, @Request() req) {
//     const userId = req.user.id;
//     const community = await this.communitiesService.create(
//       createCommunityDto,
//       userId,
//     );
//     return ResponseUtil.created(community, 'Community created successfully');
//   }

//   @Get()
//   async findAll(
//     @Query('search') search?: string,
//     @Query('page') page?: number,
//     @Query('limit') limit?: number,
//   ) {
//     const result = await this.communitiesService.findAll(search, page, limit);
//     return ResponseUtil.paginated(
//       result.communities,
//       page || 1,
//       limit || 10,
//       result.total,
//       'Communities retrieved successfully',
//     );
//   }

//   @Get('my-communities')
//   @UseGuards(JwtAuthGuard)
//   async getMyCreatedCommunities(@Request() req) {
//     const communities = await this.communitiesService.getMyCreatedCommunities(
//       req.user.id,
//     );
//     return ResponseUtil.success(
//       communities,
//       'Created communities retrieved successfully',
//     );
//   }

//   @Get('joined-communities')
//   @UseGuards(JwtAuthGuard)
//   async getJoinedCommunities(@Request() req) {
//     const communities = await this.communitiesService.getJoinedCommunities(
//       req.user.id,
//     );
//     return ResponseUtil.success(
//       communities,
//       'Joined communities retrieved successfully',
//     );
//   }

//   @Get(':id/stats')
//   async getCommunityStats(@Param('id') id: string) {
//     const stats = await this.communitiesService.getCommunityState(id);
//     return ResponseUtil.success(
//       stats,
//       'Community statistics retrieved successfully',
//     );
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     const community = await this.communitiesService.findOne(id);
//     return ResponseUtil.success(community, 'Community retrieved successfully');
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard)
//   async update(
//     @Param('id') id: string,
//     @Body() updateCommunityDto: UpdateCommunityDto,
//     @Request() req,
//   ) {
//     const community = await this.communitiesService.update(
//       id,
//       updateCommunityDto,
//       req.user.id,
//     );
//     return ResponseUtil.updated(community, 'Community updated successfully');
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard)
//   async remove(@Param('id') id: string, @Request() req) {
//     await this.communitiesService.remove(id, req.user.id);
//     return ResponseUtil.deleted('Community deleted successfully');
//   }

//   @Get(':id/members')
//   async getCommunityMembers(
//     @Param('id') id: string,
//     @Query('page') page?: number,
//     @Query('limit') limit?: number,
//   ) {
//     const result = await this.communitiesService.getCommunityMembers(
//       id,
//       page,
//       limit,
//     );
//     return ResponseUtil.paginated(
//       result.members,
//       page || 1,
//       limit || 10,
//       result.total,
//       'Community members retrieved successfully',
//     );
//   }

//   @Get(':id/members/:userId')
//   async getMemberProfile(
//     @Param('id') communityId: string,
//     @Param('userId') userId: string,
//   ) {
//     const member = await this.communitiesService.getMemberProfile(
//       communityId,
//       userId,
//     );
//     return ResponseUtil.success(
//       member,
//       'Member profile retrieved successfully',
//     );
//   }

//   @Post(':id/join')
//   @UseGuards(JwtAuthGuard)
//   async joinCommunity(@Param('id') id: string, @Request() req) {
//     const community = await this.communitiesService.joinCommunity(
//       id,
//       req.user.id,
//     );
//     return ResponseUtil.success(community, 'Successfully joined community');
//   }

//   @Post(':id/leave')
//   @UseGuards(JwtAuthGuard)
//   async leaveCommunity(@Param('id') id: string, @Request() req) {
//     const community = await this.communitiesService.leaveCommunity(
//       id,
//       req.user.id,
//     );
//     return ResponseUtil.success(community, 'Successfully left community');
//   }
// }
