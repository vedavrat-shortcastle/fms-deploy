import { z } from 'zod';

export const createParentSchema = z.object({
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
  streetAddress: z.string().min(1, { message: 'Street Address is required' }),
  streetAddress2: z.string().optional(),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  postalCode: z.string().min(1, { message: 'Postal Code is required' }),
});
