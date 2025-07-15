// import {
//   BadRequestException,
//   ForbiddenException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Community, CommunityDocument } from './schemas/community.schema';
// import { Model, Types } from 'mongoose';
// import { CreateCommunityDto } from './dto/create-community.dto';
// import { UpdateCommunityDto } from './dto/update-community.dto';

// @Injectable()
// export class CommunitiesService {
//   userModel: any;
//   constructor(
//     @InjectModel(Community.name)
//     private communityModel: Model<CommunityDocument>,
//   ) {}

//   async create(
//     createCommunityDto: CreateCommunityDto,
//     userId: string,
//   ): Promise<Community> {
//     const existingCommunity = await this.communityModel.findOne({
//       name: { $regex: new RegExp(`^${createCommunityDto.name}$`, 'i') },
//     });

//     if (existingCommunity) {
//       throw new BadRequestException('Community with this name already exists');
//     }

//     const creatorObjectId = Types.ObjectId.createFromHexString(userId);

//     const community = new this.communityModel({
//       ...createCommunityDto,
//       creatorId: creatorObjectId, // Use the converted ObjectId
//       members: [creatorObjectId], // Add creator as first member
//       posts: [], // Initialize empty posts array
//       isPrivate: createCommunityDto.isPrivate || false, // Default to false
//     });
//     return community.save();
//   }
//   // async create(
//   //   createCommunityDto: CreateCommunityDto,
//   //   userId: string,
//   // ): Promise<Community> {
//   //   console.log('Received userId:', userId); // Debug log
//   //   console.log('UserId length:', userId.length); // Should be 24

//   //   const existingCommunity = await this.communityModel.findOne({
//   //     name: { $regex: new RegExp(`^${createCommunityDto.name}$`, 'i') },
//   //   });

//   //   if (existingCommunity) {
//   //     throw new BadRequestException('Community with this name already exists');
//   //   }

//   //   // Fix: Better ObjectId handling
//   //   let creatorObjectId: Types.ObjectId;
//   //   try {
//   //     creatorObjectId = new Types.ObjectId(userId);
//   //   } catch (error) {
//   //     throw new BadRequestException('Invalid user ID format');
//   //   }

//   //   const community = new this.communityModel({
//   //     ...createCommunityDto,
//   //     creatorId: creatorObjectId,
//   //     members: [creatorObjectId],
//   //     posts: [],
//   //     isPrivate: createCommunityDto.isPrivate || false,
//   //   });

//   //   const savedCommunity = await community.save();

//   //   // Update user's createdCommunities array
//   //   await this.userModel.findByIdAndUpdate(userId, {
//   //     $push: { createdCommunities: savedCommunity._id },
//   //   });

//   //   return savedCommunity;

//   //   // return community.save();
//   // }
//   async findAll(
//     search?: string,
//     page = 1,
//     limit = 10,
//   ): Promise<{ communities: Community[]; total: number }> {
//     const query = search
//       ? {
//           $or: [
//             { name: { $regex: search, $options: 'i' } },
//             { description: { $regex: search, $options: 'i' } },
//             { tags: { $in: [new RegExp(search, 'i')] } },
//           ],
//         }
//       : {};

//     const communities = await this.communityModel
//       .find(query)
//       .populate('creatorId', 'username firstName lastName avatar')
//       .populate('members', 'username firstName lastName avatar')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec();

//     const total = await this.communityModel.countDocuments(query);
//     return { communities, total };
//   }

//   async findOne(id: string): Promise<Community> {
//     const community = await this.communityModel
//       .findById(id)
//       .populate(
//         'creatorId',
//         'username firstName lastName avatar bio contactInfo',
//       )
//       .populate('members', 'username firstName lastName avatar bio')
//       .populate('posts')
//       .exec();

//     if (!community) {
//       throw new NotFoundException('Community not found');
//     }
//     return community;
//   }

//   async update(
//     id: string,
//     updateCommunityDto: UpdateCommunityDto,
//     userId: string,
//   ): Promise<Community> {
//     const community = await this.findOne(id);

//     if (community.creatorId.toString() !== userId) {
//       throw new ForbiddenException(
//         'Only the creator can update this community',
//       );
//     }

//     // If updating name, check for uniqueness
//     if (updateCommunityDto.name && updateCommunityDto.name !== community.name) {
//       const existingCommunity = await this.communityModel
//         .findOne({
//           name: { $regex: new RegExp(`^${updateCommunityDto.name}$`, 'i') },
//         })
//         .exec();

//       if (existingCommunity) {
//         throw new BadRequestException('Community name already exists');
//       }
//     }

//     return this.communityModel
//       .findByIdAndUpdate(id, updateCommunityDto, {
//         new: true,
//       })
//       .exec() as Promise<Community>;
//   }

//   async remove(id: string, userId: string): Promise<void> {
//     const community = await this.findOne(id);

//     if (community.creatorId.toString() !== userId) {
//       throw new ForbiddenException(
//         'Only the creator can delete this community',
//       );
//     }

//     await this.communityModel.findByIdAndDelete(id);
//   }

//   async joinCommunity(communityId: string, userId: string): Promise<Community> {
//     const community = await this.communityModel.findById(communityId);

//     if (!community) {
//       throw new NotFoundException('Community not found');
//     }

//     if (community.members.includes(userId as any)) {
//       throw new BadRequestException(
//         'You are already a member of this community',
//       );
//     }

//     community.members.push(userId as any);
//     return community.save();
//   }

//   async leaveCommunity(
//     communityId: string,
//     userId: string,
//   ): Promise<Community> {
//     const community = await this.communityModel.findById(communityId);

//     if (!community) {
//       throw new NotFoundException('Community not found');
//     }

//     if (community.creatorId.toString() === userId) {
//       throw new BadRequestException('Creator cannot leave their own community');
//     }

//     if (!community.members.includes(userId as any)) {
//       throw new BadRequestException('You are not a member of this community');
//     }

//     community.members = community.members.filter(
//       (memberId) => memberId.toString() !== userId,
//     );
//     return community.save();
//   }

//   async getMyCreatedCommunities(userId: string): Promise<Community[]> {
//     return this.communityModel
//       .find({ creatorId: userId })
//       .populate('members', 'username firstName lastName avatar')
//       .sort({ createdAt: -1 })
//       .exec();
//   }

//   async getJoinedCommunities(userId: string): Promise<Community[]> {
//     return this.communityModel
//       .find({ members: userId, creatorId: { $ne: userId } })
//       .populate('creatorId', 'username firstName lastName avatar')
//       .sort({ createdAt: -1 })
//       .exec();
//   }

//   async isMember(communityId: string, userId: string): Promise<boolean> {
//     const community = await this.communityModel.findById(communityId).exec();
//     if (!community) {
//       return false;
//     }
//     return community && community.members.includes(userId as any);
//   }
// }

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

    return this.communityModel
      .find({ creatorId: userId })
      .populate('members', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getJoinedCommunities(userId: string): Promise<Community[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    return this.communityModel
      .find({ members: userId, creatorId: { $ne: userId } })
      .populate('creatorId', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async isMember(communityId: string, userId: string): Promise<boolean> {
    if (
      !Types.ObjectId.isValid(communityId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      return false;
    }

    const community = await this.communityModel.findById(communityId).exec();
    if (!community) {
      return false;
    }

    return community.members.some((memberId) => memberId.toString() === userId);
  }
}
