// import { IsEmail, IsNotEmpty } from 'class-validator';

// export class LoginDto {
//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   password: string;
// }

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(3, { message: 'Password cannot be empty' })
  password: string;
}
