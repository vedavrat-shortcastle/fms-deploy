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
