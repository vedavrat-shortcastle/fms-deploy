import { permissionProtectedProcedure, router } from '@/app/server/trpc';
import { PERMISSIONS } from '@/config/permissions';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const dashboardRouter = router({
  getMemberCount: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW).query(
    async ({ ctx }) => {
      const count = await ctx.db.baseUser.count({
        where: {
          role: 'PLAYER',
          federationId: ctx.session.user.federationId,
        },
      });
      return count;
    }
  ),

  getActiveMemberCount: permissionProtectedProcedure(
    PERMISSIONS.PLAYER_VIEW
  ).query(async ({ ctx }) => {
    const count = await ctx.db.baseUser.count({
      where: {
        role: 'PLAYER',
        profile: {
          userStatus: 'ACTIVE',
        },
        federationId: ctx.session.user.federationId,
      },
    });
    return count;
  }),

  getClubCount: permissionProtectedProcedure(PERMISSIONS.CLUB_VIEW).query(
    async ({ ctx }) => {
      const count = await ctx.db.club.count({
        where: {
          federationId: ctx.session.user.federationId,
        },
      });
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
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;

      try {
        const growthData = await ctx.db.baseUser.findMany({
          where: {
            role: 'PLAYER',
            federationId: ctx.session.user.federationId,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            createdAt: true,
          },
        });

        const monthlyGrowth: { [key: string]: number } = {};
        growthData.forEach((user) => {
          const monthYear = new Date(user.createdAt).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'short',
            }
          );
          monthlyGrowth[monthYear] = (monthlyGrowth[monthYear] || 0) + 1;
        });

        const formattedGrowthData = Object.entries(monthlyGrowth)
          .map(([month, members]) => ({
            month,
            members,
          }))
          .sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
          });

        return formattedGrowthData;
      } catch (error) {
        console.error('Error fetching member growth:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch member growth data.',
        });
      }
    }),

  getMemberCountByRegion: permissionProtectedProcedure(
    PERMISSIONS.PLAYER_VIEW
  ).query(async ({ ctx }) => {
    try {
      const playerIds = await ctx.db.baseUser.findMany({
        where: {
          federationId: ctx.session.user.federationId,
          role: 'PLAYER',
        },
        select: {
          profile: {
            select: {
              profileId: true,
            },
          },
        },
      });
      const regionCounts = await ctx.db.player.groupBy({
        by: ['state', 'country'], // Group by a field in the related UserProfile to ensure we have the relation
        where: {
          id: {
            in: playerIds
              .map((player) => player.profile?.profileId)
              .filter((id): id is string => !!id),
          },
        },
        _count: {
          id: true,
        },
      });

      // Now, process the results to group by country and state
      const formattedData = regionCounts.map((item) => ({
        name: `${item.country} - ${item.state}`,
        value: item._count.id,
      }));

      return formattedData;
    } catch (error) {
      console.error('Error fetching member count by region:', error);
      return []; // Or throw an error
    }
  }),
});
