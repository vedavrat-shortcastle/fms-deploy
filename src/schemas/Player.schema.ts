import { Gender, Role, UserStatus } from '@prisma/client';
import { z } from 'zod';

export const playerOnboardingSchema = z.object({
  birthDate: z.string(),
  gender: z.nativeEnum(Gender),
  avatarUrl: z.string().nullable().optional(),
  ageProof: z.string(),
  streetAddress: z.string(),
  streetAddress2: z.string().nullable().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
  phoneNumber: z.string(),
  countryCode: z.string(),
  fideId: z.string().nullable().optional(),
  schoolName: z.string().nullable().optional(),
  graduationYear: z.number().nullable().optional(),
  gradeInSchool: z.string().nullable().optional(),
  gradeDate: z.string().nullable().optional(),
  clubName: z.string().nullable().optional(),
  clubId: z.string().nullable().optional(),
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
  role: z.enum([Role.PLAYER, Role.CLUB_MANAGER]),
});

export type SignupMemberFormValues = z.infer<typeof signupMemberSchema>;

//Permissions are omitted from the editPlayerSchema
export const editPlayerSchema = z.object({
  baseUser: z.object({
    id: z.string(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
  }),
  playerDetails: z.object({
    birthDate: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    ageProof: z.string().optional(),
    streetAddress: z.string().optional(),
    streetAddress2: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    adminFederationId: z.string().optional(),
    clubId: z.string().optional(),
    avatarUrl: z.string().optional(),
    fideId: z.string().optional(),
    schoolName: z.string().optional(),
    graduationYear: z.number().optional(),
    gradeInSchool: z.string().optional(),
    gradeDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    clubName: z.string().optional(),
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
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    middleName: z.string().nullable().optional(),
    nameSuffix: z.string().nullable().optional(),
  }),
  playerDetails: z.object({
    birthDate: z.date({ required_error: 'Birth date is required' }),
    gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
    avatarUrl: z.string().nullable().optional(),
    ageProof: z.string({ required_error: 'Age proof is required' }),
    streetAddress: z.string({ required_error: 'Street address is required' }),
    streetAddress2: z.string().nullable().optional(),
    country: z.string({ required_error: 'Country is required' }),
    state: z.string({ required_error: 'State is required' }),
    city: z.string({ required_error: 'City is required' }),
    postalCode: z.string({ required_error: 'Postal code is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    countryCode: z.string({ required_error: 'Country code is required' }),
    fideId: z.string().nullable().optional(),
    schoolName: z.string().nullable().optional(),
    graduationYear: z.number().nullable().optional(),
    gradeInSchool: z.string().nullable().optional(),
    gradeDate: z.date().nullable().optional(),
    clubName: z.string().nullable().optional(),
    clubId: z.string().nullable().optional(),
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
