import { z } from 'zod';

export const createParentSchema = z.object({
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
  streetAddress: z.string(),
  streetAddress2: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
});
