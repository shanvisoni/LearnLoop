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
