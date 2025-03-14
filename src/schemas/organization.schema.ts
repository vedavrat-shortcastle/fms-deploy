import { OrgType, Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(OrgType),
  country: z.string().min(1, 'Country is required'),
  domain: z.string().min(1, 'Domain is required'),
  logo: z.string().optional(),
});

export const organizationOnboardingSchema = createOrganizationSchema.extend({
  admin: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
    birthDate: z.string().transform((str) => new Date(str)),
    gender: z.nativeEnum(Gender),
    ageProof: z.string(),
    streetAddress: z.string(),
    streetAddress2: z.string().optional(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    phoneNumber: z.string(),
    role: z.literal(Role.ORG_ADMIN),
  }),
});
