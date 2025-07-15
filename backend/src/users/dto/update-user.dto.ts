// import { IsOptional, IsString, IsUrl } from "class-validator";

// export class UpdateUserDto{
//     @IsOptional()
//     @IsString()
//     name?:string;

//     @IsOptional()
//     @IsUrl()
//     avatartUrl?: string;
// }

// backend/src/users/dto/update-user.dto.ts
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
