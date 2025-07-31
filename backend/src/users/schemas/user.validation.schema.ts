import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsString,
  Length,
  IsAlphanumeric,
  IsAlpha,
} from 'class-validator';

export class UserValidationSchema {
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
  @IsAlphanumeric('en-US', {
    message: 'Username can only contain letters and numbers',
  })
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string;

  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @IsAlpha('en-US', { message: 'First name can only contain letters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @IsAlpha('en-US', { message: 'Last name can only contain letters' })
  lastName: string;

  // @IsNotEmpty({ message: 'Country is required' })
  // @IsString({ message: 'Country must be a valid string' })
  // @MinLength(2, { message: 'Country name must be at least 2 characters long' })
  // @MaxLength(100, { message: 'Country name cannot exceed 100 characters' })
  // country: string;

  // @IsNotEmpty({ message: 'Country code is required' })
  // @IsString({ message: 'Country code must be a valid string' })
  // @Length(2, 3, {
  //   message: 'Country code must be 2-3 characters (e.g., US, IN, UK)',
  // })
  // @Matches(/^[A-Z]{2,3}$/, {
  //   message: 'Country code must be uppercase letters only (e.g., US, IN, UK)',
  // })
  // countryCode: string;
}
