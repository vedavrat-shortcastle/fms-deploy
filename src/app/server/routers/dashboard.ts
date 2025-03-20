import { permissionProtectedProcedure, router } from '@/app/server/trpc';
import { PERMISSIONS } from '@/config/permissions';
import { z } from 'zod';

export const dashboardRouter = router({
  getMemberCount: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW).query(
    async ({ ctx }) => {
      const count = await ctx.db.player.count();
      return { count };
    }
  ),
  getClubCount: permissionProtectedProcedure(PERMISSIONS.CLUB_VIEW).query(
    async ({ ctx }) => {
      const count = await ctx.db.club.count();
      return { count };
    }
  ),
  getMemberGrowth: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW)
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { startDate, endDate } = input;
      const growth = await ctx.db.player.count({
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });
      return { growth };
    }),
});
