import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Community, CommunityDocument } from './schemas/community.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(
    createCommunityDto: CreateCommunityDto,
    userId: string,
  ): Promise<Community> {
    console.log('Creating community with userId:', userId);

    // Check if community name already exists
    const existingCommunity = await this.communityModel.findOne({
      name: { $regex: new RegExp(`^${createCommunityDto.name}$`, 'i') },
    });

    if (existingCommunity) {
      throw new BadRequestException('Community with this name already exists');
    }

    // Validate and convert userId to ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const creatorObjectId = new Types.ObjectId(userId);

    const community = new this.communityModel({
      ...createCommunityDto,
      creatorId: creatorObjectId,
      members: [creatorObjectId],
      posts: [],
      isPrivate: createCommunityDto.isPrivate || false,
    });

    const savedCommunity = await community.save();

    // Update user's createdCommunities array
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { createdCommunities: savedCommunity._id },
    });

    return savedCommunity;
  }

  async findAll(
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{ communities: Community[]; total: number }> {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
          ],
        }
      : {};

    const communities = await this.communityModel
      .find(query)
      .populate('creatorId', 'username firstName lastName avatar')
      .populate('members', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.communityModel.countDocuments(query);

    return { communities, total };
  }

  async findOne(id: string): Promise<Community> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid community ID format');
    }

    const community = await this.communityModel
      .findById(id)
      .populate(
        'creatorId',
        'username firstName lastName avatar bio contactInfo',
      )
      .populate('members', 'username firstName lastName avatar bio')
      .populate('posts')
      .exec();

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return community;
  }

  async update(
    id: string,
    updateCommunityDto: UpdateCommunityDto,
    userId: string,
  ): Promise<Community> {
    console.log('Update method called with:');
    console.log('- Community ID:', id);
    console.log('- User ID:', userId);
    console.log('- Update data:', updateCommunityDto);

    // Validate IDs
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid community ID format');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Find the community
    const community = await this.communityModel.findById(id).exec();
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    console.log('Found community:', {
      id: community._id,
      name: community.name,
      creatorId: community.creatorId,
      creatorIdString: community.creatorId.toString(),
    });

    // Check if user is the creator
    if (community.creatorId.toString() !== userId) {
      console.log('Authorization failed:');
      console.log('- Community creator ID:', community.creatorId.toString());
      console.log('- Requesting user ID:', userId);
      throw new ForbiddenException(
        'Only the creator can update this community',
      );
    }

    // Check for name uniqueness if name is being updated
    if (updateCommunityDto.name && updateCommunityDto.name !== community.name) {
      const existingCommunity = await this.communityModel
        .findOne({
          name: { $regex: new RegExp(`^${updateCommunityDto.name}$`, 'i') },
          _id: { $ne: id }, // Exclude current community
        })
        .exec();

      if (existingCommunity) {
        throw new BadRequestException('Community name already exists');
      }
    }

    const updatedCommunity = await this.communityModel
      .findByIdAndUpdate(id, updateCommunityDto, {
        new: true,
        runValidators: true,
      })
      .populate('creatorId', 'username firstName lastName avatar')
      .populate('members', 'username firstName lastName avatar')
      .exec();

    if (!updatedCommunity) {
      throw new NotFoundException('Failed to update community');
    }

    return updatedCommunity;
  }

  async remove(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const community = await this.communityModel.findById(id).exec();
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (community.creatorId.toString() !== userId) {
      throw new ForbiddenException(
        'Only the creator can delete this community',
      );
    }

    // Remove community from all users' arrays
    await this.userModel.updateMany(
      {
        $or: [{ createdCommunities: id }, { joinedCommunities: id }],
      },
      {
        $pull: {
          createdCommunities: id,
          joinedCommunities: id,
        },
      },
    );

    await this.communityModel.findByIdAndDelete(id);
  }

  async joinCommunity(communityId: string, userId: string): Promise<Community> {
    if (
      !Types.ObjectId.isValid(communityId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new BadRequestException('Invalid ID format');
    }

    const community = await this.communityModel.findById(communityId);
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user is already a member
    const isAlreadyMember = community.members.some(
      (memberId) => memberId.toString() === userId,
    );

    if (isAlreadyMember) {
      throw new BadRequestException(
        'You are already a member of this community',
      );
    }

    // Add user to community members
    community.members.push(userObjectId);
    await community.save();

    // Add community to user's joinedCommunities (if not creator)
    if (community.creatorId.toString() !== userId) {
      await this.userModel.findByIdAndUpdate(userId, {
        $addToSet: { joinedCommunities: communityId },
      });
    }

    return community;
  }

  async leaveCommunity(
    communityId: string,
    userId: string,
  ): Promise<Community> {
    if (
      !Types.ObjectId.isValid(communityId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new BadRequestException('Invalid ID format');
    }

    const community = await this.communityModel.findById(communityId);
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (community.creatorId.toString() === userId) {
      throw new BadRequestException('Creator cannot leave their own community');
    }

    const isMember = community.members.some(
      (memberId) => memberId.toString() === userId,
    );

    if (!isMember) {
      throw new BadRequestException('You are not a member of this community');
    }

    // Remove user from community members
    community.members = community.members.filter(
      (memberId) => memberId.toString() !== userId,
    );
    await community.save();

    // Remove community from user's joinedCommunities
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { joinedCommunities: communityId },
    });

    return community;
  }

  async getMyCreatedCommunities(userId: string): Promise<Community[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const creatorObjectId = new Types.ObjectId(userId);

    return this.communityModel
      .find({ creatorId: creatorObjectId })
      .populate('members', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getJoinedCommunities(userId: string): Promise<Community[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Convert userId to ObjectId for proper comparison
    const userObjectId = new Types.ObjectId(userId);

    return this.communityModel
      .find({ members: userObjectId, creatorId: { $ne: userObjectId } })
      .populate('creatorId', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async isMember(communityId: string, userId: string): Promise<boolean> {
    console.log('🔍 Checking membership:', { communityId, userId });
    if (
      !Types.ObjectId.isValid(communityId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      console.log('❌ Invalid ObjectId format');
      return false;
    }

    const community = await this.communityModel.findById(communityId).exec();
    if (!community) {
      console.log('❌ Community not found');
      return false;
    }

    console.log(
      '📋 Community members:',
      community.members.map((m) => m.toString()),
    );
    console.log('👤 Looking for userId:', userId);

    // Convert userId to ObjectId for proper comparison
    const userObjectId = new Types.ObjectId(userId);
    // return community.members.some((memberId) => memberId.equals(userObjectId));
    const isMember = community.members.some((memberId) =>
      memberId.equals(userObjectId),
    );

    console.log('✅ Is member?', isMember);
    return isMember;
  }

  async getCommunityMembers(
    communityId: string,
    page = 1,
    limit = 10,
  ): Promise<{ members: any[]; total: number }> {
    if (!Types.ObjectId.isValid(communityId)) {
      throw new BadRequestException('Invalid community ID format');
    }
    const community = await this.communityModel
      .findById(communityId)
      .populate({
        path: 'members',
        select: 'username firstName lastName avatar bio contactInfo',
        options: {
          skip: (page - 1) * limit,
          limit: limit,
        },
      })
      .exec();

    if (!community) {
      throw new NotFoundException('Community not found');
    }
    const total = community.members.length;
    return { members: community.members, total };
  }
  async getCommunityState(communityId: string): Promise<{
    memberCount: number;
    postCount: number;
    isPrivate: boolean;
    createdAt: Date;
  }> {
    if (!Types.ObjectId.isValid(communityId)) {
      throw new BadRequestException('Invalid community ID format');
    }
    const community = await this.communityModel.findById(communityId).exec();
    if (!community) {
      throw new NotFoundException('Community not found');
    }
    return {
      memberCount: community.members.length,
      postCount: community.posts.length,
      isPrivate: community.isPrivate,
      createdAt: community.createdAt,
    };
  }

  async getMemberProfile(communityId: string, userId: string): Promise<any> {
    if (
      !Types.ObjectId.isValid(communityId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new BadRequestException('Invalid Id format');
    }

    const community = await this.communityModel.findById(communityId).exec();
    if (!community) {
      throw new NotFoundException('Community not fount');
    }

    const isMember = community.members.some(
      (memberId) => memberId.toString() === userId,
    );
    if (!isMember) {
      throw new NotFoundException('User is not a member of this community');
    }
    const user = await this.userModel
      .findById(userId)
      .select('username firstName lastName avatar bio contactInfo')
      .exec();

    if (!user) {
      throw new NotFoundException('User not fount');
    }
    return user;
  }
}

// import {
//   BadRequestException,
//   ForbiddenException,
//   Injectable,
//   NotFoundException,
//   InternalServerErrorException,
//   Logger,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Community, CommunityDocument } from './schemas/community.schema';
// import { User, UserDocument } from '../users/schemas/user.schema';
// import { Model, Types } from 'mongoose';
// import { CreateCommunityDto } from './dto/create-community.dto';
// import { UpdateCommunityDto } from './dto/update-community.dto';
// import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';

// @Injectable()
// export class CommunitiesService {
//   private readonly logger = new Logger(CommunitiesService.name);

//   constructor(
//     @InjectModel(Community.name)
//     private communityModel: Model<CommunityDocument>,
//     @InjectModel(User.name)
//     private userModel: Model<UserDocument>,
//   ) {}

//   async create(
//     createCommunityDto: CreateCommunityDto,
//     userId: string,
//   ): Promise<Community> {
//     try {
//       this.logger.log('Creating community with userId:', userId);

//       // Validate userId format
//       if (!Types.ObjectId.isValid(userId)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_USER_ID);
//       }

//       // Check if community name already exists
//       const existingCommunity = await this.communityModel.findOne({
//         name: { $regex: new RegExp(`^${createCommunityDto.name}$`, 'i') },
//       });

//       if (existingCommunity) {
//         throw new BadRequestException(ERROR_MESSAGES.COMMUNITY_NAME_EXISTS);
//       }

//       const creatorObjectId = new Types.ObjectId(userId);

//       const community = new this.communityModel({
//         ...createCommunityDto,
//         creatorId: creatorObjectId,
//         members: [creatorObjectId],
//         posts: [],
//         isPrivate: createCommunityDto.isPrivate || false,
//       });

//       const savedCommunity = await community.save();

//       // Update user's createdCommunities array
//       await this.userModel.findByIdAndUpdate(userId, {
//         $addToSet: { createdCommunities: savedCommunity._id },
//       });

//       return savedCommunity;
//     } catch (error) {
//       this.logger.error('Error creating community:', error);
//       if (error instanceof BadRequestException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async findAll(
//     search?: string,
//     page = 1,
//     limit = 10,
//   ): Promise<{ communities: Community[]; total: number }> {
//     try {
//       const query = search
//         ? {
//             $or: [
//               { name: { $regex: search, $options: 'i' } },
//               { description: { $regex: search, $options: 'i' } },
//               { tags: { $in: [new RegExp(search, 'i')] } },
//             ],
//           }
//         : {};

//       const communities = await this.communityModel
//         .find(query)
//         .populate('creatorId', 'username firstName lastName avatar')
//         .populate('members', 'username firstName lastName avatar')
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .exec();

//       const total = await this.communityModel.countDocuments(query);

//       return { communities, total };
//     } catch (error) {
//       this.logger.error('Error finding communities:', error);
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async findOne(id: string): Promise<Community> {
//     try {
//       if (!Types.ObjectId.isValid(id)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }

//       const community = await this.communityModel
//         .findById(id)
//         .populate(
//           'creatorId',
//           'username firstName lastName avatar bio contactInfo',
//         )
//         .populate('members', 'username firstName lastName avatar bio')
//         .populate('posts')
//         .exec();

//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       return community;
//     } catch (error) {
//       this.logger.error('Error finding community:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async update(
//     id: string,
//     updateCommunityDto: UpdateCommunityDto,
//     userId: string,
//   ): Promise<Community> {
//     try {
//       this.logger.log('Update method called with:', {
//         id,
//         userId,
//         updateData: updateCommunityDto,
//       });

//       // Validate IDs
//       if (!Types.ObjectId.isValid(id)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }
//       if (!Types.ObjectId.isValid(userId)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_USER_ID);
//       }

//       // Find the community
//       const community = await this.communityModel.findById(id).exec();
//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       // Check if user is the creator
//       if (community.creatorId.toString() !== userId) {
//         this.logger.warn('Authorization failed:', {
//           creatorId: community.creatorId.toString(),
//           userId,
//         });
//         throw new ForbiddenException(ERROR_MESSAGES.COMMUNITY_ACCESS_DENIED);
//       }

//       // Check for name uniqueness if name is being updated
//       if (
//         updateCommunityDto.name &&
//         updateCommunityDto.name !== community.name
//       ) {
//         const existingCommunity = await this.communityModel
//           .findOne({
//             name: { $regex: new RegExp(`^${updateCommunityDto.name}$`, 'i') },
//             _id: { $ne: id },
//           })
//           .exec();

//         if (existingCommunity) {
//           throw new BadRequestException(ERROR_MESSAGES.COMMUNITY_NAME_EXISTS);
//         }
//       }

//       const updatedCommunity = await this.communityModel
//         .findByIdAndUpdate(id, updateCommunityDto, {
//           new: true,
//           runValidators: true,
//         })
//         .populate('creatorId', 'username firstName lastName avatar')
//         .populate('members', 'username firstName lastName avatar')
//         .exec();

//       if (!updatedCommunity) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       return updatedCommunity;
//     } catch (error) {
//       this.logger.error('Error updating community:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException ||
//         error instanceof ForbiddenException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async remove(id: string, userId: string): Promise<void> {
//     try {
//       if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }

//       const community = await this.communityModel.findById(id).exec();
//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       if (community.creatorId.toString() !== userId) {
//         throw new ForbiddenException(ERROR_MESSAGES.COMMUNITY_ACCESS_DENIED);
//       }

//       // Remove community from all users' arrays
//       await this.userModel.updateMany(
//         {
//           $or: [{ createdCommunities: id }, { joinedCommunities: id }],
//         },
//         {
//           $pull: {
//             createdCommunities: id,
//             joinedCommunities: id,
//           },
//         },
//       );

//       await this.communityModel.findByIdAndDelete(id);
//     } catch (error) {
//       this.logger.error('Error removing community:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException ||
//         error instanceof ForbiddenException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async joinCommunity(communityId: string, userId: string): Promise<Community> {
//     try {
//       if (
//         !Types.ObjectId.isValid(communityId) ||
//         !Types.ObjectId.isValid(userId)
//       ) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }

//       const community = await this.communityModel.findById(communityId);
//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       const userObjectId = new Types.ObjectId(userId);

//       // Check if user is already a member
//       const isAlreadyMember = community.members.some(
//         (memberId) => memberId.toString() === userId,
//       );

//       if (isAlreadyMember) {
//         throw new BadRequestException(ERROR_MESSAGES.ALREADY_MEMBER);
//       }

//       // Add user to community members
//       community.members.push(userObjectId);
//       await community.save();

//       // Add community to user's joinedCommunities (if not creator)
//       if (community.creatorId.toString() !== userId) {
//         await this.userModel.findByIdAndUpdate(userId, {
//           $addToSet: { joinedCommunities: communityId },
//         });
//       }

//       return community;
//     } catch (error) {
//       this.logger.error('Error joining community:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async leaveCommunity(
//     communityId: string,
//     userId: string,
//   ): Promise<Community> {
//     try {
//       if (
//         !Types.ObjectId.isValid(communityId) ||
//         !Types.ObjectId.isValid(userId)
//       ) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }

//       const community = await this.communityModel.findById(communityId);
//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       if (community.creatorId.toString() === userId) {
//         throw new BadRequestException(ERROR_MESSAGES.CREATOR_CANNOT_LEAVE);
//       }

//       const isMember = community.members.some(
//         (memberId) => memberId.toString() === userId,
//       );

//       if (!isMember) {
//         throw new BadRequestException(ERROR_MESSAGES.NOT_MEMBER);
//       }

//       // Remove user from community members
//       community.members = community.members.filter(
//         (memberId) => memberId.toString() !== userId,
//       );
//       await community.save();

//       // Remove community from user's joinedCommunities
//       await this.userModel.findByIdAndUpdate(userId, {
//         $pull: { joinedCommunities: communityId },
//       });

//       return community;
//     } catch (error) {
//       this.logger.error('Error leaving community:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async getMyCreatedCommunities(userId: string): Promise<Community[]> {
//     try {
//       if (!Types.ObjectId.isValid(userId)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_USER_ID);
//       }

//       const creatorObjectId = new Types.ObjectId(userId);

//       return this.communityModel
//         .find({ creatorId: creatorObjectId })
//         .populate('members', 'username firstName lastName avatar')
//         .sort({ createdAt: -1 })
//         .exec();
//     } catch (error) {
//       this.logger.error('Error getting created communities:', error);
//       if (error instanceof BadRequestException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async getJoinedCommunities(userId: string): Promise<Community[]> {
//     try {
//       if (!Types.ObjectId.isValid(userId)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_USER_ID);
//       }

//       const userObjectId = new Types.ObjectId(userId);

//       return this.communityModel
//         .find({ members: userObjectId, creatorId: { $ne: userObjectId } })
//         .populate('creatorId', 'username firstName lastName avatar')
//         .sort({ createdAt: -1 })
//         .exec();
//     } catch (error) {
//       this.logger.error('Error getting joined communities:', error);
//       if (error instanceof BadRequestException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async isMember(communityId: string, userId: string): Promise<boolean> {
//     try {
//       if (
//         !Types.ObjectId.isValid(communityId) ||
//         !Types.ObjectId.isValid(userId)
//       ) {
//         return false;
//       }

//       const community = await this.communityModel.findById(communityId).exec();
//       if (!community) {
//         return false;
//       }

//       const userObjectId = new Types.ObjectId(userId);
//       return community.members.some((memberId) =>
//         memberId.equals(userObjectId),
//       );
//     } catch (error) {
//       this.logger.error('Error checking membership:', error);
//       return false;
//     }
//   }

//   async getCommunityMembers(
//     communityId: string,
//     page = 1,
//     limit = 10,
//   ): Promise<{ members: any[]; total: number }> {
//     try {
//       if (!Types.ObjectId.isValid(communityId)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }

//       const community = await this.communityModel
//         .findById(communityId)
//         .populate({
//           path: 'members',
//           select: 'username firstName lastName avatar bio contactInfo',
//           options: {
//             skip: (page - 1) * limit,
//             limit: limit,
//           },
//         })
//         .exec();

//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       const total = community.members.length;
//       return { members: community.members, total };
//     } catch (error) {
//       this.logger.error('Error getting community members:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async getCommunityState(communityId: string): Promise<{
//     memberCount: number;
//     postCount: number;
//     isPrivate: boolean;
//     createdAt: Date;
//   }> {
//     try {
//       if (!Types.ObjectId.isValid(communityId)) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }

//       const community = await this.communityModel.findById(communityId).exec();
//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       return {
//         memberCount: community.members.length,
//         postCount: community.posts.length,
//         isPrivate: community.isPrivate,
//         createdAt: community.createdAt,
//       };
//     } catch (error) {
//       this.logger.error('Error getting community state:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async getMemberProfile(communityId: string, userId: string): Promise<any> {
//     try {
//       if (
//         !Types.ObjectId.isValid(communityId) ||
//         !Types.ObjectId.isValid(userId)
//       ) {
//         throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
//       }

//       const community = await this.communityModel.findById(communityId).exec();
//       if (!community) {
//         throw new NotFoundException(ERROR_MESSAGES.COMMUNITY_NOT_FOUND);
//       }

//       const isMember = community.members.some(
//         (memberId) => memberId.toString() === userId,
//       );
//       if (!isMember) {
//         throw new NotFoundException(ERROR_MESSAGES.NOT_MEMBER);
//       }

//       const user = await this.userModel
//         .findById(userId)
//         .select('username firstName lastName avatar bio contactInfo')
//         .exec();

//       if (!user) {
//         throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
//       }

//       return user;
//     } catch (error) {
//       this.logger.error('Error getting member profile:', error);
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
