import { FedType, Gender, Role } from '@prisma/client';
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

export const createFederationFormSchema = createFederationSchema
  .omit({
    domain: true,
    logo: true,
  })
  .extend({
    phoneNumber: z.string().min(10, 'Phone number is required'),
    countryCode: z.string().min(1, 'Country code is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  });

export const federationOnboardingSchema = createFederationSchema.extend({
  baseUser: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.literal(Role.FED_ADMIN),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
    gender: z.nativeEnum(Gender),
  }),
});

export const subdomainSchema = z.object({
  subdomain: z
    .string()
    .min(3, { message: 'Subdomain must be at least 3 characters' })
    .max(20, { message: 'Subdomain cannot exceed 20 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Subdomain can only contain lowercase letters and numbers',
    }),
});

export type createFederationFormSchemaValues = z.infer<
  typeof createFederationFormSchema
>;
export type SubdomainFormValues = z.infer<typeof subdomainSchema>;
