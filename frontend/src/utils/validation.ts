import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters long')
    .max(10, 'Password cannot exceed 10 characters'),
    // .regex(
    //   /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //   'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
    // ),
  
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z]+$/, 'First name can only contain letters'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z]+$/, 'Last name can only contain letters'),
  
  // country: z
  //   .string()
  //   .min(1, 'Country is required')
  //   .min(2, 'Country name must be at least 2 characters long')
  //   .max(100, 'Country name cannot exceed 100 characters'),
  
  // countryCode: z
  //   .string()
  //   .min(1, 'Country code is required')
  //   .length(2, 'Country code must be exactly 2 characters')
  //   .regex(/^[A-Z]{2}$/, 'Country code must be uppercase letters only'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
