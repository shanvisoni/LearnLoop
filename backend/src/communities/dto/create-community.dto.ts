import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  @MinLength(3, {
    message: 'Community name must be at least 3 characters long',
  })
  @MaxLength(100, { message: 'Community name cannot exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
