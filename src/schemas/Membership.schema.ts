import { PlanStatus } from '@prisma/client';
import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  duration: z.number(),
  price: z.number(),
  currency: z.string(),
  benefits: z.array(z.string()),
  autoRenewal: z.boolean().default(false),
  criteria: z.object({}).passthrough().optional(),
});

export const getPlanSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  status: z.nativeEnum(PlanStatus).optional(),
  searchQuery: z.string().optional(),
});
