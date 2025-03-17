import { Gender } from '@prisma/client';
import { z } from 'zod';

export const createPlayerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
    birthDate: z.string(),
    avatarUrl: z.string().optional(),
    ageProof: z.string(),
    streetAddress: z.string(),
    streetAddress2: z.string().optional(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    postalCode: z.string(),
    phoneNumber: z.string(),
    countryCode: z.string(),
    fideId: z.string().optional(),
    schoolName: z.string().optional(),
    graduationYear: z.number().optional(),
    gradeInSchool: z.string().optional(),
    gradeDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    clubName: z.string().optional(),
    clubId: z.string().optional(),
  })
  .transform((data) => {
    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      nameSuffix,
      gender,
      ...rest
    } = data;

    return {
      baseUser: {
        email,
        password,
        firstName,
        lastName,
        middleName,
        nameSuffix,
        gender,
      },
      playerDetails: {
        ...rest,
      },
    };
  });

// You might want to add these types for better type safety
export type CreatePlayerInput = z.input<typeof createPlayerSchema>;
export type CreatePlayerOutput = z.output<typeof createPlayerSchema>;

export const signupPlayerSchema = z
  .object({
    domain: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.nativeEnum(Gender),
  })
  .transform((data) => {
    const { domain, ...rest } = data;
    return {
      federation: {
        domain,
      },
      ...rest,
    };
  });

//Permissions are omitted from the editPlayerSchema
export const editPlayerSchema = z
  .object({
    id: z.string(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    nameSuffix: z.string().optional(),
    birthDate: z.string().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
    ageProof: z.string().optional(),
    streetAddress: z.string().optional(),
    streetAddress2: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    adminFederationId: z.string().optional(),
    clubId: z.string().optional(),
    avatarUrl: z.string().optional(),
    fideId: z.string().optional(),
    schoolName: z.string().optional(),
    graduationYear: z.number().optional(),
    gradeInSchool: z.string().optional(),
    gradeDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    clubName: z.string().optional(),
  })
  .transform((data) => {
    const { id, email, firstName, lastName, middleName, nameSuffix, ...rest } =
      data;
    return {
      baseUser: {
        id,
        email,
        firstName,
        lastName,
        middleName,
        nameSuffix,
      },
      playerDetails: {
        ...rest,
      },
    };
  });

export const deletePlayerSchema = z.object({
  id: z.string(),
});

export type EditPlayerFormValues = z.infer<typeof editPlayerSchema>;
export type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>;
