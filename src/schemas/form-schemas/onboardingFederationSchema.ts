import { z } from 'zod';

export const onboardingFederationSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  phoneNumber: z.string().min(10, { message: 'Invalid phone number' }),
  type: z.string().min(1, { message: 'Please select a type' }),
  federationName: z.string().min(1, { message: 'Federation name is required' }),
  federationCountry: z.string().min(1, { message: 'Select a country' }),
});

export type OnboardingFederationFormValues = z.infer<
  typeof onboardingFederationSchema
>;
