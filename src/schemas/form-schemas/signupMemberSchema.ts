import { z } from 'zod';

// Form Validation Schema
export const signupMemberSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    role: z.enum(['User', 'Admin', 'Editor'], {
      message: 'Select a valid role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Type inference for form values
export type SignupMemberFormValues = z.infer<typeof signupMemberSchema>;
