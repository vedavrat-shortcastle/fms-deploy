import { TRPCError } from '@trpc/server';
import { permissionProtectedProcedure, router } from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { Role } from '@prisma/client';
import { PERMISSIONS } from '@/config/permissions';
import { createClubSchema } from '@/schemas/Club.schema';

export const clubRouter = router({
  createClub: permissionProtectedProcedure(PERMISSIONS.CLUB_CREATE)
    .input(createClubSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.orgId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        // Check if manager exists and belongs to the same federation
        const manager = await ctx.db.user.findFirst({
          where: {
            id: input.managerId,
            federationId: ctx.session.user.orgId,
          },
        });

        if (!manager) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Manager not found in federation',
          });
        }

        // Create club and update manager's role
        const club = await ctx.db.club.create({
          data: {
            name: input.name,
            federationId: ctx.session.user.orgId,
            managerId: input.managerId,
          },
          include: {
            manager: true,
            federation: true,
            players: true,
          },
        });

        // Update manager's role
        await ctx.db.user.update({
          where: { id: input.managerId },
          data: { role: Role.CLUB_MANAGER },
        });

        return club;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create club',
          cause: error.message,
        });
      }
    }),

  // Get all clubs
  getClubs: permissionProtectedProcedure(PERMISSIONS.CLUB_VIEW).query(
    async ({ ctx }) => {
      try {
        if (!ctx.session.user.orgId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        const clubs = await ctx.db.club.findMany({
          where: {
            federationId: ctx.session.user.orgId,
          },
          include: {
            manager: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
            players: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
            federation: true,
          },
        });

        return clubs;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch clubs',
          cause: error.message,
        });
      }
    }
  ),
});
