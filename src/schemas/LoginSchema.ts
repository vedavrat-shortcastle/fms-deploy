import { z } from 'zod';

// Form Validation Schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  domain: z
    .string()
    .min(3, { message: 'Domain must be at least 3 characters' }),
});

// Type inference for form values
export type LoginFormValues = z.infer<typeof loginSchema>;
