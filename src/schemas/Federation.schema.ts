import { FedType, Gender } from '@prisma/client';
import { z } from 'zod';

export const createFederationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(FedType),
  country: z.string().min(1, 'Country is required'),
  domain: z
    .string()
    .min(3, { message: 'Subdomain must be at least 3 characters' })
    .max(50, { message: 'Subdomain cannot exceed 50 characters' }),
  logo: z.string().optional(),
});

export const federationOnboardingSchema = createFederationSchema.extend({
  email: z.string().email({
    message: 'Invalid email format. Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  nameSuffix: z.string().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
});

export type FederationOnboardingFormValues = z.infer<
  typeof federationOnboardingSchema
>;
