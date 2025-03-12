import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const createMemberSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum([
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.CLUB_MANAGER,
    Role.MEMBER,
  ]),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  nameSuffix: z.string().optional(),
  birthDate: z.string().transform((str) => new Date(str)),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
  streetAddress: z.string(),
  streetAddress2: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  phoneNumber: z.string(),
  permissions: z.array(z.string()), // Array of permission codes
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
