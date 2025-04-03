import { z } from 'zod';

// Base schema for club onboarding - combines all necessary fields
export const clubOnboardingSchema = z.object({
  domain: z
    .string()
    .min(3, { message: 'Domain must be at least 3 characters' })
    .max(50, { message: 'Domain cannot exceed 50 characters' }), // Club manager details
  email: z
    .string()
    .min(1, { message: 'Please enter an email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  firstName: z.string().min(1, { message: 'Please enter your first name' }),
  lastName: z.string().min(1, { message: 'Please enter your last name' }),
  middleName: z.string().optional(),
  nameSuffix: z.string().optional(),
  phoneNumber: z.string().min(1, { message: 'Please enter your phone number' }),

  // Club details
  name: z.string().min(1, { message: 'Please enter a club name' }),
  streetAddress: z.string().min(1, { message: 'Please enter street address' }),
  streetAddress2: z.string().optional(),
  country: z.string().min(1, { message: 'Please select a country' }),
  state: z.string().min(1, { message: 'Please select a state/province' }),
  city: z.string().min(1, { message: 'Please enter a city' }),
  postalCode: z.string().min(1, { message: 'Please enter a postal code' }),
});

// Type for form values derived from the schema
export type ClubOnboardingFormValues = z.infer<typeof clubOnboardingSchema>;
