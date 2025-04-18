import { PlanStatus } from '@prisma/client';
import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name cannot exceed 255 characters' }),
  description: z
    .string()
    .max(1000, { message: 'Description cannot exceed 1000 characters' })
    .optional(),
  duration: z.number(),
  price: z.number(),
  currency: z
    .string()
    .min(1, { message: 'Currency is required' })
    .max(10, { message: 'Currency cannot exceed 10 characters' }),
  benefits: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return val
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return val;
    },
    z.array(
      z.string().max(255, { message: 'Benefit cannot exceed 255 characters' })
    )
  ),
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
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name cannot exceed 255 characters' })
    .optional(),
  description: z
    .string()
    .max(1000, { message: 'Description cannot exceed 1000 characters' })
    .optional(),
  price: z.number().optional(),
  currency: z
    .string()
    .min(1, { message: 'Currency is required' })
    .max(10, { message: 'Currency cannot exceed 10 characters' })
    .optional(),
  benefits: z
    .preprocess(
      (val) => {
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        }
        return val;
      },
      z.array(
        z.string().max(255, { message: 'Benefit cannot exceed 255 characters' })
      )
    )
    .optional(),
  autoRenewal: z.boolean().optional(),
  status: z.nativeEnum(PlanStatus).optional(),
  criteria: z.object({}).passthrough().optional(),
});

export const addMemberSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  subscriptionType: z.string().min(1, 'Subscription Type is required'),
  paymentMode: z.enum([
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'Wallet',
    'Cash',
  ]),
});

export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
