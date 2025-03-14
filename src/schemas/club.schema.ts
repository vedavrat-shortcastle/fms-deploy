import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string(),
  managerId: z.string(),
});

export const signupClubSchema = z.object({
  clubName: z.string().min(1, 'Club Name is required'),
  clubLocation: z.string().min(1, 'Club Location is required'),
  clubAddress: z.string().min(1, 'Club Address is required'),
  contactPerson: z.string().min(1, 'Contact Person is required'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
});

export type SignupClubFormValues = z.infer<typeof signupClubSchema>;
