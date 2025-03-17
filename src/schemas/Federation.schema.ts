import { FedType, Gender } from '@prisma/client';
import { z } from 'zod';

export const createFederationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(FedType),
  country: z.string().min(1, 'Country is required'),
  domain: z
    .string()
    .min(3, { message: 'Subdomain must be at least 3 characters' })
    .max(20, { message: 'Subdomain cannot exceed 20 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Subdomain can only contain lowercase letters and numbers',
    }),
  logo: z.string().optional(),
});

export const federationOnboardingSchema = createFederationSchema.extend({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  nameSuffix: z.string().optional(),
  gender: z.nativeEnum(Gender),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
});

export type FederationOnboardingFormValues = z.infer<
  typeof federationOnboardingSchema
>;
