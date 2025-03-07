import { z } from 'zod';

export const addPlayerSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    nameSuffix: z.string().optional(),
    birthDate: z.string().min(1, 'Birth date is required'),
    gender: z.enum(['Male', 'Female', 'Other'], {
      errorMap: () => ({ message: 'Gender is required' }),
    }),
    email: z.string().email('Invalid email address'),
    photo: z.any().optional(),
    ageProof: z.any().optional(),
  }),
  mailing: z.object({
    streetAddress: z.string().min(1, 'Street Address is required'),
    streetAddressLine2: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State/Province is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal Code is required'),
    phoneNumber: z.string().min(1, 'Phone Number is required'),
  }),
  other: z.object({
    fideId: z.string().optional(),
    schoolName: z.string().min(1, 'School Name is required'),
    graduationYear: z.string().min(1, 'Graduation Year is required'),
    grade: z.string().min(1, 'Grade is required'),
    gradeAsOf: z.string().min(1, 'Grade date is required'),
    clubName: z.string().min(1, 'Club Name is required'),
  }),
});

export type AddPlayerFormData = z.infer<typeof addPlayerSchema>;
