import { TRPCError } from '@trpc/server';
import { permissionProtectedProcedure, router } from '@/app/server/trpc';
import { createClubSchema, createUserSchema } from '@/schemas/user.schema';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { Role } from '@prisma/client';
import { PERMISSIONS } from '@/constants';

export const userRouter = router({
  // Create a new member
  createMember: permissionProtectedProcedure(PERMISSIONS.MEMBER_CREATE)
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.orgId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No organization context found',
          });
        }

        const hashedPassword = await hashPassword(input.password);
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email, organizationId: ctx.session.user.orgId },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        const user = await ctx.db.user.create({
          data: {
            ...input,
            role: Role.MEMBER,
            password: hashedPassword,
            organizationId: ctx.session.user.orgId,
            permissions: {
              create: input.permissions.map((permission: string) => ({
                permission: { connect: { id: permission } },
              })),
            },
          },
        });

        return { ...user, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create member',
          cause: error.message,
        });
      }
    }),
  // Get all members
  getMembers: permissionProtectedProcedure(PERMISSIONS.MEMBER_VIEW).query(
    async ({ ctx }) => {
      try {
        const where = {
          role: Role.MEMBER,
          organizationId: ctx.session.user.orgId,
        };

        const members = await ctx.db.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            organization: true,
            club: true,
          },
        });

        return members;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch members',
          cause: error.message,
        });
      }
    }
  ),
  createClub: permissionProtectedProcedure(PERMISSIONS.CLUB_CREATE)
    .input(createClubSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.orgId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No organization context found',
          });
        }

        // Check if manager exists and belongs to the same organization
        const manager = await ctx.db.user.findFirst({
          where: {
            id: input.managerId,
            organizationId: ctx.session.user.orgId,
          },
        });

        if (!manager) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Manager not found in organization',
          });
        }

        // Create club and update manager's role
        const club = await ctx.db.club.create({
          data: {
            name: input.name,
            organizationId: ctx.session.user.orgId,
            managerId: input.managerId,
          },
          include: {
            manager: true,
            organization: true,
            members: true,
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
            message: 'No organization context found',
          });
        }

        const clubs = await ctx.db.club.findMany({
          where: {
            organizationId: ctx.session.user.orgId,
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
            members: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
            organization: true,
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
