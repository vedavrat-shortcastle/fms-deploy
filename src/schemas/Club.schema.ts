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
  state: z
    .string()
    .min(1, { message: 'Please select a state/province' })
    .optional(),
  city: z.string().min(1, { message: 'Please enter a city' }).optional(),
  postalCode: z.string().min(1, { message: 'Please enter a postal code' }),
});

// Type for form values derived from the schema
export type ClubOnboardingFormValues = z.infer<typeof clubOnboardingSchema>;

export const editclubManagerSchema = z.object({
  clubManagerDetails: z.object({
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
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
    phoneNumber: z
      .string()
      .max(15, { message: 'Phone Number cannot exceed 15 digits' })
      .optional(),
  }),
  clubDetails: z.object({
    name: z.string().min(1, { message: 'Club Name is required' }),
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
      .max(50, { message: 'State cannot exceed 50 characters' })
      .optional(),
    city: z
      .string()
      .min(1, { message: 'City is required' })
      .max(50, { message: 'City cannot exceed 50 characters' })
      .optional(),
    postalCode: z
      .string()
      .min(1, { message: 'Postal Code is required' })
      .max(20, { message: 'Postal Code cannot exceed 20 characters' }),
    phoneNumber: z
      .string()
      .max(15, { message: 'Phone Number cannot exceed 15 digits' })
      .optional(),
  }),
});

export type EditClubManagerFormValues = z.infer<typeof editclubManagerSchema>;
