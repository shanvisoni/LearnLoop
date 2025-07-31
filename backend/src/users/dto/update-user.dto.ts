import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
}

// user-profile.dto.ts
export class UserProfileDto {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
  joinedCommunities: string[];
  createdCommunities: string[];
  createdAt: Date;
  updatedAt: Date;
}

// change-password.dto.ts
export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;
}
