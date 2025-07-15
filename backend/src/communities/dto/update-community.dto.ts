// import { PartialType } from '@nestjs/mapped-types';
// import { CreateCommunityDto } from './create-community.dto';

// export class UpdateCommunityDto extends PartialType(CreateCommunityDto) {}

import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateCommunityDto {
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'Community name must be at least 3 characters long',
  })
  @MaxLength(100, { message: 'Community name cannot exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
