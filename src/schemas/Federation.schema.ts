import { FedType } from '@prisma/client';
import { z } from 'zod';

export const createFederationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, { message: 'Name cannot exceed 255 characters' }),
  type: z.nativeEnum(FedType),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(25, { message: 'Country cannot exceed 100 characters' }),
  domain: z
    .string()
    .min(3, { message: 'Domain must be at least 3 characters' })
    .max(50, { message: 'Domain cannot exceed 50 characters' }),
  logo: z
    .string()
    .max(255, { message: 'Logo URL cannot exceed 255 characters' })
    .optional(),
});

export const federationOnboardingSchema = createFederationSchema.extend({
  email: z
    .string()
    .email({
      message: 'Invalid email format. Please enter a valid email address.',
    })
    .max(255, { message: 'Email cannot exceed 255 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(25, { message: 'First name cannot exceed 100 characters' }),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(25, { message: 'Last name cannot exceed 100 characters' }),
  middleName: z
    .string()
    .max(25, { message: 'Middle name cannot exceed 100 characters' })
    .optional(),
  nameSuffix: z
    .string()
    .max(25, { message: 'Name suffix cannot exceed 50 characters' })
    .optional(),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .max(15, { message: 'Phone number cannot exceed 20 characters' }),
  countryCode: z
    .string()
    .min(1, 'Country code is required')
    .max(10, { message: 'Country code cannot exceed 10 characters' }),
});

export type FederationOnboardingFormValues = z.infer<
  typeof federationOnboardingSchema
>;
