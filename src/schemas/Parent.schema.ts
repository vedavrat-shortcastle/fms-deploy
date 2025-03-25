import { z } from 'zod';

export const createParentSchema = z.object({
  phoneNumber: z.string().max(15).optional(),
  countryCode: z.string().max(5).optional(),
  streetAddress: z
    .string()
    .min(1, { message: 'Street Address is required' })
    .max(100),
  streetAddress2: z.string().max(100).optional(),
  country: z.string().min(1, { message: 'Country is required' }).max(50),
  state: z.string().min(1, { message: 'State is required' }).max(50),
  city: z.string().min(1, { message: 'City is required' }).max(50),
  postalCode: z.string().min(1, { message: 'Postal Code is required' }).max(20),
});
