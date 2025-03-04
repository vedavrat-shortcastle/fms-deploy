import { PERMISSIONS } from '@/constants';
import { router, permissionProtectedProcedure } from '../trpc';
import { z } from 'zod';

export const organizationRouter = router({
  create: permissionProtectedProcedure(PERMISSIONS.ORG_CREATE)
    .input(
      z.object({
        name: z.string(),
        type: z.enum(['NATIONAL', 'REGIONAL']),
        country: z.string(),
        domain: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.organization.create({
        data: {
          ...input,
          admins: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  getAll: permissionProtectedProcedure(PERMISSIONS.ORG_VIEW).query(
    async ({ ctx }) => {
      return await ctx.db.organization.findMany();
    }
  ),
});
