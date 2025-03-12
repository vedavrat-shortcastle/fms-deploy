import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string(),
  managerId: z.string(),
});
