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

export type planFormValues = z.infer<typeof createPlanSchema>;

export const planFormDefaults: planFormValues = {
  name: '',
  description: '',
  duration: 0,
  price: 0,
  currency: '',
  benefits: [],
  autoRenewal: false,
  criteria: undefined,
};

export const getPlanSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  status: z.nativeEnum(PlanStatus).optional(),
  searchQuery: z.string().optional(),
});

export const updatePlanSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  autoRenewal: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  criteria: z.object({}).passthrough().optional(),
});
