import { Gender, Role, UserStatus } from '@prisma/client';
import { z } from 'zod';

export const playerOnboardingSchema = z.object({
  birthDate: z.date({ message: 'Birth date is required' }),
  gender: z.nativeEnum(Gender, { message: 'Gender is required' }),

  streetAddress: z.string().min(1, { message: 'Street address is required' }),
  streetAddress2: z.string().nullable().optional(),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  avatarUrl: z.string().nullable().optional(),
  fideId: z.string().nullable().optional(),
  schoolName: z.string().nullable().optional(),
  graduationYear: z.number().nullable().optional(),
  gradeInSchool: z.string().nullable().optional(),
  gradeDate: z.date().nullable().optional(),
  clubName: z.string().nullable().optional(),
  ageProof: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  countryCode: z.string().nullable().optional(),
});

export type playerOnboardingInput = z.input<typeof playerOnboardingSchema>;

// You might want to add these types for better type safety
export type CreatePlayerInput = z.input<typeof createPlayerSchema>;
export type CreatePlayerOutput = z.output<typeof createPlayerSchema>;

export const signupMemberSchema = z.object({
  domain: z.string(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum([Role.PLAYER, Role.PARENT]),
});

export type SignupMemberFormValues = z.infer<typeof signupMemberSchema>;

//Permissions are omitted from the editPlayerSchema
export const editPlayerSchema = z.object({
  baseUser: z.object({
    id: z.string(),
    email: z.string().email({ message: 'Invalid email' }),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    middleName: z.string().nullable().optional(),
    nameSuffix: z.string().nullable().optional(),
  }),
  playerDetails: z.object({
    birthDate: z
      .date()
      .min(new Date('1900-01-01'), { message: 'Invalid birth date' }),
    gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
    avatarUrl: z.string().nullable().optional(),
    ageProof: z.string().nullable().optional(),
    streetAddress: z.string().min(1, 'Street address is required'),
    streetAddress2: z.string().nullable().optional(),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    phoneNumber: z.string().nullable().optional(),
    countryCode: z.string().nullable().optional(),
    fideId: z.string().nullable().optional(),
    schoolName: z.string().nullable().optional(),
    graduationYear: z.number().nullable().optional(),
    gradeInSchool: z.string().nullable().optional(),
    gradeDate: z.date().nullable().optional(),
    clubName: z.string().nullable().optional(),
  }),
});

export const deletePlayerSchema = z.object({
  id: z.string(),
});

export type EditPlayerFormValues = z.infer<typeof editPlayerSchema>;
//export type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>;

export const createPlayerSchema = z.object({
  baseUser: z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    middleName: z.string().nullable().optional(),
    nameSuffix: z.string().nullable().optional(),
  }),
  playerDetails: z.object({
    birthDate: z
      .date()
      .min(new Date('1900-01-01'), { message: 'Invalid birth date' }),
    gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
    avatarUrl: z.string().nullable().optional(),
    ageProof: z.string().nullable().optional(),
    streetAddress: z.string().min(1, 'Street address is required'),
    streetAddress2: z.string().nullable().optional(),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    phoneNumber: z.string().nullable().optional(),
    countryCode: z.string().nullable().optional(),
    fideId: z.string().nullable().optional(),
    schoolName: z.string().nullable().optional(),
    graduationYear: z.number().nullable().optional(),
    gradeInSchool: z.string().nullable().optional(),
    gradeDate: z.date().nullable().optional(),
    clubName: z.string().nullable().optional(),
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
