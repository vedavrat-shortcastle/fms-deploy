import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  nameSuffix: z.string().optional(),
  birthDate: z.string().transform((str) => new Date(str)),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
  ageProof: z.string(),
  streetAddress: z.string(),
  streetAddress2: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  phoneNumber: z.string(),
  permissions: z.array(z.string()), // Array of permission codes
  domain: z.string(),
});

export const createMemberSchema = createUserSchema
  .omit({ domain: true })
  .extend({
    role: z.literal(Role.MEMBER),
    adminOrganizationId: z.string().optional(),
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
  });

export const signupMemberSchema = z.object({
  domain: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.nativeEnum(Gender),
  phoneNumber: z.string(),
  countryCode: z.string(),
});

//Permissions are omitted from the editMemberSchema
export const editMemberSchema = z.object({
  id: z.string(),
  data: z.object({
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
    birthDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
    ageProof: z.string().optional(),
    streetAddress: z.string().optional(),
    streetAddress2: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    adminOrganizationId: z.string().optional(),
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

export const deleteMemberSchema = z.object({
  id: z.string(),
});
