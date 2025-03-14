import { z } from 'zod';

export const signupMemberSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Confirm Password must be at least 6 characters long' }),
  role: z.enum(['User', 'Admin', 'Editor']),
});

export type SignupMemberFormValues = z.infer<typeof signupMemberSchema>;
