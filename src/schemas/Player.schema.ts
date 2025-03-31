import { Gender, Role, UserStatus } from '@prisma/client';
import { z } from 'zod';

export const playerOnboardingSchema = z.object({
  birthDate: z.date({ message: 'Birth date is required' }),
  gender: z.nativeEnum(Gender, { message: 'Gender is required' }),

  streetAddress: z
    .string()
    .min(1, { message: 'Street address is required' })
    .max(100, { message: 'Street address is too long' }),
  streetAddress2: z
    .string()
    .max(100, { message: 'Street address 2 is too long' })
    .nullable()
    .optional(),
  country: z
    .string()
    .min(1, { message: 'Country is required' })
    .max(50, { message: 'Country is too long' }),
  state: z
    .string()
    .min(1, { message: 'State is required' })
    .max(50, { message: 'State is too long' }),
  city: z
    .string()
    .min(1, { message: 'City is required' })
    .max(50, { message: 'City is too long' }),
  postalCode: z
    .string()
    .min(1, { message: 'Postal code is required' })
    .max(20, { message: 'Postal code is too long' }),
  avatarUrl: z
    .string()
    .max(200, { message: 'Avatar URL is too long' })
    .nullable()
    .optional(),
  fideId: z
    .string()
    .max(20, { message: 'FIDE ID is too long' })
    .nullable()
    .optional(),
  schoolName: z
    .string()
    .max(100, { message: 'School name is too long' })
    .nullable()
    .optional(),
  graduationYear: z.number().nullable().optional(),
  gradeInSchool: z
    .string()
    .max(10, { message: 'Grade in school is too long' })
    .nullable()
    .optional(),
  gradeDate: z.date().nullable().optional(),
  clubName: z
    .string()
    .max(100, { message: 'Club name is too long' })
    .nullable()
    .optional(),
  ageProof: z
    .string()
    .max(200, { message: 'Age proof is too long' })
    .nullable()
    .optional(),
  phoneNumber: z
    .string()
    .max(20, { message: 'Phone number is too long' })
    .nullable()
    .optional(),
});

export type playerOnboardingInput = z.input<typeof playerOnboardingSchema>;

export type CreatePlayerInput = z.input<typeof createPlayerSchema>;
export type CreatePlayerOutput = z.output<typeof createPlayerSchema>;

export const signupMemberSchema = z.object({
  domain: z.string().max(100, { message: 'Domain is too long' }),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, { message: 'Email is too long' }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, { message: 'Password is too long' }),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, { message: 'First name is too long' }),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, { message: 'Last name is too long' }),
  role: z.enum([Role.PLAYER, Role.PARENT]),
});

export type SignupMemberFormValues = z.infer<typeof signupMemberSchema>;

export const editPlayerSchema = z.object({
  baseUser: z.object({
    id: z.string(),
    email: z
      .string()
      .email({ message: 'Invalid email' })
      .max(100, { message: 'Email is too long' }),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, { message: 'First name is too long' }),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, { message: 'Last name is too long' }),
    middleName: z
      .string()
      .max(50, { message: 'Middle name is too long' })
      .nullable()
      .optional(),
    nameSuffix: z
      .string()
      .max(10, { message: 'Name suffix is too long' })
      .nullable()
      .optional(),
  }),
  playerDetails: z.object({
    birthDate: z
      .date()
      .min(new Date('1900-01-01'), { message: 'Invalid birth date' })
      .max(new Date(), { message: 'Birth date cannot be in future' })
      .optional(),
    gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
    avatarUrl: z
      .string()
      .max(200, { message: 'Avatar URL is too long' })
      .nullable()
      .optional(),
    ageProof: z
      .string()
      .max(200, { message: 'Age proof is too long' })
      .nullable()
      .optional(),
    streetAddress: z
      .string()
      .min(1, 'Street address is required')
      .max(100, { message: 'Street address is too long' }),
    streetAddress2: z
      .string()
      .max(100, { message: 'Street address 2 is too long' })
      .nullable()
      .optional(),
    country: z
      .string()
      .min(1, 'Country is required')
      .max(50, { message: 'Country is too long' }),
    state: z
      .string()
      .min(1, 'State is required')
      .max(50, { message: 'State is too long' }),
    city: z
      .string()
      .min(1, 'City is required')
      .max(50, { message: 'City is too long' }),
    postalCode: z
      .string()
      .min(1, 'Postal code is required')
      .max(20, { message: 'Postal code is too long' }),
    phoneNumber: z
      .string()
      .max(20, { message: 'Phone number is too long' })
      .nullable()
      .optional(),
    fideId: z
      .string()
      .max(20, { message: 'FIDE ID is too long' })
      .nullable()
      .optional(),
    schoolName: z
      .string()
      .max(100, { message: 'School name is too long' })
      .nullable()
      .optional(),
    graduationYear: z.number().nullable().optional(),
    gradeInSchool: z
      .string()
      .max(50, { message: 'Grade in school is too long' })
      .nullable()
      .optional(),
    gradeDate: z.date().nullable().optional(),
    clubName: z
      .string()
      .max(100, { message: 'Club name is too long' })
      .nullable()
      .optional(),
  }),
});

export const deletePlayerSchema = z.object({
  id: z.string(),
});

export type EditPlayerFormValues = z.infer<typeof editPlayerSchema>;

export const createPlayerSchema = z.object({
  baseUser: z.object({
    email: z
      .string()
      .email({ message: 'Invalid email' })
      .max(100, { message: 'Email is too long' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password is too long' }),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, { message: 'First name is too long' }),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, { message: 'Last name is too long' }),
    middleName: z
      .string()
      .max(50, { message: 'Middle name is too long' })
      .nullable()
      .optional(),
    nameSuffix: z
      .string()
      .max(10, { message: 'Name suffix is too long' })
      .nullable()
      .optional(),
  }),
  playerDetails: z.object({
    birthDate: z
      .date()
      .min(new Date('1900-01-01'), { message: 'Invalid birth date' }),
    gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
    avatarUrl: z
      .string()
      .max(200, { message: 'Avatar URL is too long' })
      .nullable()
      .optional(),
    ageProof: z
      .string()
      .max(200, { message: 'Age proof is too long' })
      .nullable()
      .optional(),
    streetAddress: z
      .string()
      .min(1, 'Street address is required')
      .max(100, { message: 'Street address is too long' }),
    streetAddress2: z
      .string()
      .max(100, { message: 'Street address 2 is too long' })
      .nullable()
      .optional(),
    country: z
      .string()
      .min(1, 'Country is required')
      .max(50, { message: 'Country is too long' }),
    state: z
      .string()
      .min(1, 'State is required')
      .max(50, { message: 'State is too long' }),
    city: z
      .string()
      .min(1, 'City is required')
      .max(50, { message: 'City is too long' }),
    postalCode: z
      .string()
      .min(1, 'Postal code is required')
      .max(20, { message: 'Postal code is too long' }),
    phoneNumber: z
      .string()
      .max(20, { message: 'Phone number is too long' })
      .nullable()
      .optional(),

    fideId: z
      .string()
      .max(20, { message: 'FIDE ID is too long' })
      .nullable()
      .optional(),
    schoolName: z
      .string()
      .max(100, { message: 'School name is too long' })
      .nullable()
      .optional(),
    graduationYear: z.number().nullable().optional(),
    gradeInSchool: z
      .string()
      .max(50, { message: 'Grade in school is too long' })
      .nullable()
      .optional(),
    gradeDate: z.date().nullable().optional(),
    clubName: z
      .string()
      .max(100, { message: 'Club name is too long' })
      .nullable()
      .optional(),
  }),
});

export type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>;

export type PlayerCardTypes = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  profile: {
    userStatus: UserStatus | null;
  } | null;
};
