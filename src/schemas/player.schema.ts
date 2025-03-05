import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

export const playerDetailsSchema = z.object({
  fideId: z.string().min(1, 'FIDE ID is required'),
});

export const studentDetailsSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  grade: z.string().min(1, 'Grade is required'),
  graduationYear: z.string().min(1, 'Graduation year is required'),
  gradeAsOf: z.string().min(1, 'Grade as of date is required'),
});

export const clubInfoSchema = z.object({
  clubName: z.string().optional(),
});

export const playerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  nameSuffix: z.string().optional(),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Invalid email address'),
  ageProof: z.string().optional(),
  profileImage: z.string().optional(),
  address: addressSchema,
  playerDetails: playerDetailsSchema,
  studentDetails: studentDetailsSchema,
  clubInfo: clubInfoSchema,
});

export type PlayerFormData = z.infer<typeof playerSchema>;
