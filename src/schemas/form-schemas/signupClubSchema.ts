import { z } from 'zod';

export const signupClubSchema = z.object({
  clubName: z.string().min(1, 'Club Name is required'),
  clubLocation: z.string().min(1, 'Club Location is required'),
  clubAddress: z.string().min(1, 'Club Address is required'),
  contactPerson: z.string().min(1, 'Contact Person is required'),
  phoneNumber: z.string().optional(),
});

export type SignupClubFormValues = z.infer<typeof signupClubSchema>;
