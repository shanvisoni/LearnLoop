// src/posts/dto/create-comment.dto.ts
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsMongoId,
} from 'class-validator';

export class CreateCommentDto {
  communityId(communityId: any, userId: string) {
    throw new Error('Method not implemented.');
  }
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Comment cannot be empty' })
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  content: string;
}
