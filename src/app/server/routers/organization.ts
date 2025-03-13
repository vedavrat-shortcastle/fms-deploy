import { OrgType } from '@prisma/client';
import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(OrgType),
  country: z.string().min(1, 'Country is required'),
  domain: z.string().min(1, 'Domain is required'),
  logo: z.string().optional(),
});
