import { z } from 'zod';

const requiredString = z.string().trim().min(1, 'Required');

export const signUpSchema = z.object({
  email: requiredString.email('Invalid email address'),
  username: requiredString.regex(
    /[a-zA-Z0-9_-]+$/,
    'Username must be alphanumeric with dashes and underscores'
  ),
  password: requiredString.min(8, 'Password must be at least 8 characters'),
})

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
})

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, 'Cannot upload more than 5 files'),
})

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters'),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
