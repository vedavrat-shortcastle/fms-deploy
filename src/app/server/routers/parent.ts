import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  router,
  protectedProcedure,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { ProfileType, Role } from '@prisma/client';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { z } from 'zod';
import { createParentSchema } from '@/schemas/Parent.schema';
import { createPlayerSchema } from '@/schemas/Player.schema';

export const parentRouter = router({
  // Create a new parent
  createParent: protectedProcedure
    .input(createParentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.federationId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        const result = await ctx.db.$transaction(async (tx) => {
          const newParent = await tx.parent.create({
            data: {
              ...input,
            },
          });
          const baseUserId = ctx.session.user.id;

          const newUserProfile = await tx.userProfile.create({
            data: {
              profileType: ProfileType.PARENT,
              profileId: newParent.id,
              baseUser: {
                connect: { id: baseUserId },
              },
            },
          });

          const parentPermissions = await tx.permission.findMany({
            where: {
              code: {
                in: roleMap[Role.PARENT],
              },
            },
            select: {
              id: true,
            },
          });

          await tx.userPermission.createMany({
            data: parentPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          return { ...newUserProfile, password: undefined };
        });

        return result;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create parent',
          cause: error.message,
        });
      }
    }),

  // Get parent by ID with players
  getParentById: permissionProtectedProcedure(PERMISSIONS.PARENT_VIEW)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const parent = await ctx.db.baseUser.findFirst({
          where: {
            id: input.id,
            role: Role.PARENT,
            federationId: ctx.session.user.federationId,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                profileId: true,
                profileType: true,
                userStatus: true,
              },
            },
          },
        });

        if (!parent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Parent not found',
          });
        }

        const parentDetails = await ctx.db.parent.findUnique({
          where: { id: parent.profile?.profileId },
          include: {
            players: true,
          },
        });

        return {
          ...parent,
          ...parentDetails,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch parent',
          cause: error.message,
        });
      }
    }),

  // Add player to parent
  addPlayer: permissionProtectedProcedure(PERMISSIONS.PLAYER_CREATE)
    .input(createPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.federationId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        const { baseUser, playerDetails } = input;

        const existingUser = await ctx.db.baseUser.findUnique({
          where: {
            email_federationId: {
              email: baseUser.email,
              federationId: ctx.session.user.federationId,
            },
          },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        const parentProfile = await ctx.db.userProfile.findFirst({
          where: {
            baseUserId: ctx.session.user.id,
            profileType: ProfileType.PARENT,
          },
        });

        if (!parentProfile) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized as parent',
          });
        }

        const hashedPassword = await hashPassword(baseUser.password);

        const result = await ctx.db.$transaction(async (tx) => {
          console.log('flag1', baseUser);
          const newBaseUser = await tx.baseUser.create({
            data: {
              ...baseUser,
              password: hashedPassword,
              role: Role.PLAYER,
              federationId: ctx.session.user.federationId,
            },
          });

          const newPlayer = await tx.player.create({
            data: {
              ...playerDetails,
              parent: {
                connect: { id: parentProfile.profileId },
              },
            },
          });

          const newUserProfile = await tx.userProfile.create({
            data: {
              profileType: ProfileType.PLAYER,
              profileId: newPlayer.id,
              baseUser: {
                connect: { id: newBaseUser.id },
              },
            },
          });

          const playerPermissions = await tx.permission.findMany({
            where: {
              code: {
                in: roleMap[Role.PLAYER],
              },
            },
            select: {
              id: true,
            },
          });

          await tx.userPermission.createMany({
            data: playerPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          return { ...newUserProfile, password: undefined };
        });

        return result;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to add player',
          cause: error.message,
        });
      }
    }),

  // Onboard a new parent
  onboardParent: protectedProcedure
    .input(createParentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.profileId !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Parent already onboarded',
          });
        }

        const result = await ctx.db.$transaction(async (tx) => {
          const newParent = await tx.parent.create({
            data: {
              ...input,
            },
          });

          const baseUserId = ctx.session.user.id;

          await tx.userProfile.update({
            where: {
              baseUserId,
            },
            data: {
              profileId: newParent.id,
              userStatus: 'ACTIVE',
            },
          });

          return newParent;
        });

        return result;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to onboard parent',
          cause: error.message,
        });
      }
    }),
});
