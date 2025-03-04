import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const createUserSchema = z.object({
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
  phoneNumber: z.string(),
  permissions: z.array(z.string()), // Array of permission codes
});
