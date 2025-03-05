import { z } from 'zod';

export const subdomainSchema = z.object({
  subdomain: z
    .string()
    .min(3, { message: 'Subdomain must be at least 3 characters' })
    .max(20, { message: 'Subdomain cannot exceed 20 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Subdomain can only contain lowercase letters and numbers',
    }),
});

export type SubdomainFormValues = z.infer<typeof subdomainSchema>;
