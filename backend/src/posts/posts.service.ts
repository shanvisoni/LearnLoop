import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommunitiesService } from '../communities/communities.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private communitiesService: CommunitiesService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    // Check if user is a member of the community
    const isMember = await this.communitiesService.isMember(
      createPostDto.communityId,
      userId,
    );
    if (!isMember) {
      throw new ForbiddenException(
        'You must be a member of this community to post',
      );
    }

    const post = new this.postModel({
      ...createPostDto,
      authorId: userId,
    });

    return post.save();
  }
  async findByCommunity(
    communityId: string,
    page = 1,
    limit = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const posts = await this.postModel
      .find({ communityId })
      .populate('authorId', 'username firstName lastName avatar')
      .populate('comments.authorId', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.postModel.countDocuments({ communityId });

    return { posts, total };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('authorId', 'username firstName lastName avatar bio')
      .populate('comments.authorId', 'username firstName lastName avatar')
      .populate('communityId', 'name description')
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.authorId.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();

    if (!updatedPost) {
      throw new NotFoundException('Post not found after update');
    }

    return updatedPost;
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);

    if (post.authorId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.findByIdAndDelete(id);
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userLikedIndex = post.likes.findIndex(
      (like) => like.toString() === userId,
    );

    if (userLikedIndex > -1) {
      // User has already liked, so unlike
      post.likes.splice(userLikedIndex, 1);
    } else {
      // User hasn't liked, so like
      post.likes.push(userId as any);
    }

    return post.save();
  }

  async addComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user is a member of the community
    const isMember = await this.communitiesService.isMember(
      post.communityId.toString(),
      userId,
    );
    if (!isMember) {
      throw new ForbiddenException(
        'You must be a member of this community to comment',
      );
    }

    const comment = {
      _id: new Types.ObjectId(),
      authorId: userId as any,
      content: createCommentDto.content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    return post.save();
  }

  async removeComment(
    postId: string,
    commentId: string,
    userId: string,
  ): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId,
    );

    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found');
    }

    const comment = post.comments[commentIndex];

    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    post.comments.splice(commentIndex, 1);
    return post.save();
  }

  async getUserPosts(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const posts = await this.postModel
      .find({ authorId: userId })
      .populate('communityId', 'name description')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.postModel.countDocuments({ authorId: userId });

    return { posts, total };
  }
}
