import {z} from 'zod';

export const loginSchema = z.object({
    email:z.string().email('Invalid email address'),
    password:z.string().min(1, 'Password is required'),
});

export const registerSchema=z.object({
    username:z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email:z.string().email('Invalid email address'),
    password:z.string()
     .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
     firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .optional(),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .optional(),
});

export const taskSchema=z.object({
    title:z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
    description:z.string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate:z.date().optional(),
});
export const communitySchema = z.object({
  name: z.string()
    .min(3, 'Community name must be at least 3 characters')
    .max(100, 'Community name must not exceed 100 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  tags: z.array(z.string().min(1).max(20))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  isPrivate: z.boolean().optional(),
});