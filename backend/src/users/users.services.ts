// import {
//   Injectable,
//   ConflictException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from './schemas/user.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

//   async create(createUserDto: CreateUserDto): Promise<UserDocument> {
//     // Check if user already exists
//     const existingUser = await this.userModel.findOne({
//       $or: [
//         { email: createUserDto.email },
//         { username: createUserDto.username },
//       ],
//     });

//     if (existingUser) {
//       throw new ConflictException(
//         'User with this email or username already exists',
//       );
//     }

//     // Hash password
//     const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
//     const hashedPassword = await bcrypt.hash(
//       createUserDto.password,
//       saltRounds,
//     );

//     // Create user
//     const createdUser = new this.userModel({
//       ...createUserDto,
//       password: hashedPassword,
//     });

//     return createdUser.save();
//   }

//   async findByEmail(email: string): Promise<UserDocument | null> {
//     return this.userModel.findOne({ email }).exec();
//   }

//   async findByUsername(username: string): Promise<UserDocument | null> {
//     return this.userModel.findOne({ username }).exec();
//   }

//   async findById(id: string): Promise<UserDocument> {
//     const user = await this.userModel.findById(id).exec();
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     return user;
//   }

//   async validatePassword(
//     plainPassword: string,
//     hashedPassword: string,
//   ): Promise<boolean> {
//     return bcrypt.compare(plainPassword, hashedPassword);
//   }
// }

// users.service.ts (fixed version)
// import {
//   Injectable,
//   ConflictException,
//   NotFoundException,
//   BadRequestException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { User, UserDocument } from './schemas/user.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UserProfileDto } from './dto/user-profile.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

//   async create(createUserDto: CreateUserDto): Promise<UserDocument> {
//     // Check if user already exists
//     const existingUser = await this.userModel.findOne({
//       $or: [
//         { email: createUserDto.email },
//         { username: createUserDto.username },
//       ],
//     });

//     if (existingUser) {
//       throw new ConflictException(
//         'User with this email or username already exists',
//       );
//     }

//     // Hash password
//     const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
//     const hashedPassword = await bcrypt.hash(
//       createUserDto.password,
//       saltRounds,
//     );

//     // Create user
//     const createdUser = new this.userModel({
//       ...createUserDto,
//       password: hashedPassword,
//     });

//     return createdUser.save();
//   }

//   async findByEmail(email: string): Promise<UserDocument | null> {
//     return this.userModel.findOne({ email }).exec();
//   }

//   async findByUsername(username: string): Promise<UserDocument | null> {
//     return this.userModel.findOne({ username }).exec();
//   }

//   async findById(id: string): Promise<UserDocument> {
//     const user = await this.userModel.findById(id).exec();
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     return user;
//   }

//   // Get user profile (without password)
//   async getUserProfile(id: string): Promise<UserProfileDto> {
//     const user = await this.userModel
//       .findById(id)
//       .select('-password')
//       .populate('joinedCommunities', 'name description')
//       .populate('createdCommunities', 'name description')
//       .exec();

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return {
//       id: user._id.toString(),
//       username: user.username,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       bio: user.bio,
//       avatar: user.avatar,
//       contactInfo: user.contactInfo,
//       joinedCommunities: user.joinedCommunities.map((community) =>
//         typeof community === 'string' ? community : community.toString(),
//       ),
//       createdCommunities: user.createdCommunities.map((community) =>
//         typeof community === 'string' ? community : community.toString(),
//       ),
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     };
//   }

//   // Update user profile
//   async updateProfile(
//     id: string,
//     updateUserDto: UpdateUserDto,
//   ): Promise<UserDocument> {
//     const user = await this.userModel.findById(id);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Update user fields
//     Object.assign(user, updateUserDto);
//     return user.save();
//   }

//   // Change password
//   async changePassword(
//     id: string,
//     changePasswordDto: ChangePasswordDto,
//   ): Promise<void> {
//     const user = await this.userModel.findById(id);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Verify current password
//     const isCurrentPasswordValid = await bcrypt.compare(
//       changePasswordDto.currentPassword,
//       user.password,
//     );

//     if (!isCurrentPasswordValid) {
//       throw new UnauthorizedException('Current password is incorrect');
//     }

//     // Hash new password
//     const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
//     const hashedNewPassword = await bcrypt.hash(
//       changePasswordDto.newPassword,
//       saltRounds,
//     );

//     // Update password
//     user.password = hashedNewPassword;
//     await user.save();
//   }

//   // Search users by username (for community features)
//   async searchUsers(
//     query: string,
//     limit: number = 10,
//   ): Promise<UserProfileDto[]> {
//     const users = await this.userModel
//       .find({
//         username: { $regex: query, $options: 'i' },
//       })
//       .select('-password')
//       .limit(limit)
//       .exec();

//     return users.map((user) => ({
//       id: user._id.toString(),
//       username: user.username,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       bio: user.bio,
//       avatar: user.avatar,
//       contactInfo: user.contactInfo,
//       joinedCommunities: user.joinedCommunities.map((community) =>
//         typeof community === 'string' ? community : community.toString(),
//       ),
//       createdCommunities: user.createdCommunities.map((community) =>
//         typeof community === 'string' ? community : community.toString(),
//       ),
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     }));
//   }

//   // Add community to user's joined communities
//   async joinCommunity(userId: string, communityId: string): Promise<void> {
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const communityObjectId = new Types.ObjectId(communityId);
//     if (!user.joinedCommunities.includes(communityObjectId)) {
//       user.joinedCommunities.push(communityObjectId);
//       await user.save();
//     }
//   }

//   // Remove community from user's joined communities
//   async leaveCommunity(userId: string, communityId: string): Promise<void> {
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     user.joinedCommunities = user.joinedCommunities.filter(
//       (id) => id.toString() !== communityId,
//     );
//     await user.save();
//   }

//   // Add created community to user
//   async addCreatedCommunity(
//     userId: string,
//     communityId: string,
//   ): Promise<void> {
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const communityObjectId = new Types.ObjectId(communityId);
//     if (!user.createdCommunities.includes(communityObjectId)) {
//       user.createdCommunities.push(communityObjectId);
//       await user.save();
//     }
//   }

//   async validatePassword(
//     plainPassword: string,
//     hashedPassword: string,
//   ): Promise<boolean> {
//     return bcrypt.compare(plainPassword, hashedPassword);
//   }
// }

import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // Create user
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Get user profile (without password)
  async getUserProfile(id: string): Promise<UserProfileDto> {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('joinedCommunities', 'name description')
      .populate('createdCommunities', 'name description')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: (user._id as Types.ObjectId).toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      avatar: user.avatar,
      contactInfo: user.contactInfo,
      joinedCommunities: user.joinedCommunities.map((community) =>
        typeof community === 'string' ? community : community.toString(),
      ),
      createdCommunities: user.createdCommunities.map((community) =>
        typeof community === 'string' ? community : community.toString(),
      ),
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    };
  }

  // Update user profile
  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user fields
    Object.assign(user, updateUserDto);
    return user.save();
  }

  // Change password
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltRounds,
    );

    // Update password
    user.password = hashedNewPassword;
    await user.save();
  }

  // Search users by username (for community features)
  async searchUsers(
    query: string,
    limit: number = 10,
  ): Promise<UserProfileDto[]> {
    const users = await this.userModel
      .find({
        username: { $regex: query, $options: 'i' },
      })
      .select('-password')
      .limit(limit)
      .exec();

    return users.map((user) => ({
      id: (user._id as Types.ObjectId).toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      avatar: user.avatar,
      contactInfo: user.contactInfo,
      joinedCommunities: user.joinedCommunities.map((community) =>
        typeof community === 'string' ? community : community.toString(),
      ),
      createdCommunities: user.createdCommunities.map((community) =>
        typeof community === 'string' ? community : community.toString(),
      ),
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    }));
  }

  // Add community to user's joined communities
  async joinCommunity(userId: string, communityId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const communityObjectId = new Types.ObjectId(communityId);
    if (!user.joinedCommunities.includes(communityObjectId)) {
      user.joinedCommunities.push(communityObjectId);
      await user.save();
    }
  }

  // Remove community from user's joined communities
  async leaveCommunity(userId: string, communityId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.joinedCommunities = user.joinedCommunities.filter(
      (id) => id.toString() !== communityId,
    );
    await user.save();
  }

  // Add created community to user
  async addCreatedCommunity(
    userId: string,
    communityId: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const communityObjectId = new Types.ObjectId(communityId);
    if (!user.createdCommunities.includes(communityObjectId)) {
      user.createdCommunities.push(communityObjectId);
      await user.save();
    }
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
