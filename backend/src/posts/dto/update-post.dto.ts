// src/posts/dto/update-post.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['communityId'] as const),
) {}
