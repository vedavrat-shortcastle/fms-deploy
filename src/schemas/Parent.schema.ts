import { z } from 'zod';

export const createParentSchema = z.object({
  phoneNumber: z
    .string()
    .max(15, 'Phone Number cannot exceed 15 digits')
    .optional(),
  countryCode: z
    .string()
    .max(10, { message: 'Country code cannot exceed 10 characters' })
    .optional(),
  streetAddress: z
    .string()
    .min(1, { message: 'Street Address is required' })
    .max(100, { message: 'Street Address cannot exeed 100 characters' }),
  streetAddress2: z
    .string()
    .max(100, { message: 'Street Address 2 cannot exeed 100 characters' })
    .optional(),
  country: z
    .string()
    .min(1, { message: 'Country is required' })
    .max(50, { message: 'Country cannot exeed 50 characters' }),
  state: z
    .string()
    .min(1, { message: 'State is required' })
    .max(50, { message: 'State cannot exeed 50 characters' }),
  city: z
    .string()
    .min(1, { message: 'City is required' })
    .max(50, { message: 'City cannot exeed 50 characters' }),
  postalCode: z
    .string()
    .min(1, { message: 'Postal Code is required' })
    .max(20, { message: 'Postal Code cannot exeed 20 characters' }),
});

export const editParentSchema = z.object({
  baseUser: z.object({
    id: z.string().min(1, { message: 'User ID is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    firstName: z
      .string()
      .min(1, { message: 'First Name is required' })
      .max(100, { message: 'First Name cannot exceed 100 characters' }),
    lastName: z
      .string()
      .min(1, { message: 'Last Name is required' })
      .max(100, { message: 'Last Name cannot exceed 100 characters' }),
  }),
  parentDetails: z.object({
    streetAddress: z
      .string()
      .min(1, { message: 'Street Address is required' })
      .max(100, { message: 'Street Address cannot exceed 100 characters' }),
    streetAddress2: z
      .string()
      .max(100, { message: 'Street Address 2 cannot exceed 100 characters' })
      .optional(),
    country: z
      .string()
      .min(1, { message: 'Country is required' })
      .max(50, { message: 'Country cannot exceed 50 characters' }),
    state: z
      .string()
      .min(1, { message: 'State is required' })
      .max(50, { message: 'State cannot exceed 50 characters' }),
    city: z
      .string()
      .min(1, { message: 'City is required' })
      .max(50, { message: 'City cannot exceed 50 characters' }),
    postalCode: z
      .string()
      .min(1, { message: 'Postal Code is required' })
      .max(20, { message: 'Postal Code cannot exceed 20 characters' }),
    phoneNumber: z
      .string()
      .max(15, { message: 'Phone Number cannot exceed 15 digits' })
      .optional(),
    countryCode: z
      .string()
      .max(10, { message: 'Country code cannot exceed 10 characters' })
      .optional(),
  }),
});

export type EditParentFormValues = z.infer<typeof editParentSchema>;
