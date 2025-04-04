import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  router,
  protectedProcedure,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { ProfileType, Role, Prisma, SubscriptionStatus } from '@prisma/client';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { z } from 'zod';
import { createParentSchema, editParentSchema } from '@/schemas/Parent.schema';
import { createPlayerSchema, editPlayerSchema } from '@/schemas/Player.schema';
import { generateCustomPlayerId } from '@/utils/generateCustomCode';
import i18next from 'i18next';

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

        const parentUserProfile = await ctx.db.userProfile.findUnique({
          where: {
            baseUserId: parent.id,
          },
        });

        const parentDetails = await ctx.db.parent.findUnique({
          where: { id: parent.profile?.profileId },
          include: {
            players: true,
          },
        });

        return {
          ...parent,
          ...parentUserProfile,
          ...parentDetails,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch parent',
          cause: error.message,
        });
      }
    }),
  //Edit parent by Id

  editParentById: permissionProtectedProcedure(PERMISSIONS.PARENT_UPDATE)
    .input(editParentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { baseUser, parentDetails } = input;
        // Find the existing user
        const existingUser = await ctx.db.baseUser.findUnique({
          where: {
            id: baseUser.id,
            federationId: ctx.session.user.federationId,
            role: Role.PARENT,
          },
          include: {
            profile: {
              select: {
                profileId: true,
                userStatus: true,
                profileType: true,
              },
            },
          },
        });

        if (!existingUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Parent not found',
          });
        }

        if (existingUser.profile?.userStatus !== 'ACTIVE') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Parent profile is ${existingUser.profile?.userStatus}`,
          });
        }

        if (existingUser.profile.profileType !== ProfileType.PARENT) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Profile is not a parent',
          });
        }

        // Check email uniqueness if email is being updated
        if (baseUser.email && baseUser.email !== existingUser.email) {
          const emailExists = await ctx.db.baseUser.findUnique({
            where: {
              email_federationId: {
                email: baseUser.email,
                federationId: ctx.session.user.federationId,
              },
            },
          });

          if (emailExists) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email already exists',
            });
          }
        }

        // Perform the update in a transaction
        const [updatedBaseUser, updatedParent] = await ctx.db.$transaction([
          // Update BaseUser
          ctx.db.baseUser.update({
            where: { id: baseUser.id },
            data: {
              ...baseUser,
            },
          }),
          ctx.db.userProfile.update({
            where: {
              baseUserId: existingUser.id,
            },
            data: {
              language: input.parentUserProfile.language,
              isRtl:
                i18next.dir(input.parentUserProfile.language) === 'rtl'
                  ? true
                  : false,
            },
          }),
          // Update Parent (using parentDetails)
          ctx.db.parent.update({
            where: { id: existingUser.profile.profileId },
            data: {
              ...parentDetails,
            },
          }),
        ]);

        return {
          ...updatedBaseUser,
          parentDetails: updatedParent,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to edit parent',
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
          const newBaseUser = await tx.baseUser.create({
            data: {
              ...baseUser,
              password: hashedPassword,
              role: Role.PLAYER,
              federationId: ctx.session.user.federationId,
            },
          });

          const customId = await generateCustomPlayerId(
            ctx.db,
            ctx.session.user.federationId
          );

          const newPlayer = await tx.player.create({
            data: {
              ...playerDetails,
              customId,
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

  //get players for parent
  getPlayers: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, searchQuery } = input;
        const offset = (page - 1) * limit;

        // First, get the parent profile for the current user
        const parentProfile = await ctx.db.userProfile.findFirst({
          where: {
            baseUserId: ctx.session.user.id,
            profileType: ProfileType.PARENT,
          },
          select: {
            profileId: true,
          },
        });

        if (!parentProfile) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized as parent',
          });
        }

        // Query to get player IDs associated with this parent
        const parentWithPlayers = await ctx.db.parent.findUnique({
          where: { id: parentProfile.profileId },
          select: {
            players: {
              select: {
                id: true,

                subscriptions: {
                  where: {
                    status: 'ACTIVE',
                  },
                  select: {
                    id: true,
                    planId: true,
                  },
                },
              },
            },
          },
        });

        if (!parentWithPlayers) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Parent not found',
          });
        }

        const playerIds = parentWithPlayers.players.map((player) => player.id);

        // Find base users who are players connected to this parent
        const where: Prisma.BaseUserWhereInput = {
          role: Role.PLAYER,
          federationId: ctx.session.user.federationId,
          profile: {
            profileType: ProfileType.PLAYER,
            profileId: { in: playerIds },
            userStatus: {
              not: 'DELETED',
            },
          },
          OR: searchQuery
            ? [
                { email: { contains: searchQuery, mode: 'insensitive' } },
                { firstName: { contains: searchQuery, mode: 'insensitive' } },
                { lastName: { contains: searchQuery, mode: 'insensitive' } },
              ]
            : undefined,
        };

        // Get players
        const baseUsers = await ctx.db.baseUser.findMany({
          where,
          skip: offset,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                userStatus: true,
                profileId: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        // Get total count for pagination
        const totalPlayers = await ctx.db.baseUser.count({
          where,
        });
        return {
          players: baseUsers,
          total: totalPlayers,
          playerSubscriptions: parentWithPlayers,
          limit,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch players',
          cause: error.message,
        });
      }
    }),

  // Get specific player details by ID (for parent)
  getPlayerById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const parentId = ctx.session.user.profileId;
        const playerBaseUser = await ctx.db.baseUser.findFirst({
          where: {
            id: input.id,
            role: Role.PLAYER,
            federationId: ctx.session.user.federationId,
            profile: {
              profileType: ProfileType.PLAYER,
              userStatus: {
                not: 'DELETED',
              },
            },
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

        if (!playerBaseUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player not found',
          });
        }
        const playerId = playerBaseUser.profile?.profileId;
        // Check if the player belongs to this parent
        const playerBelongsToParent = await ctx.db.player.findFirst({
          where: {
            id: playerId,
            parentId,
          },
        });

        if (!playerBelongsToParent) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player not found or not authorized to view this player',
          });
        }

        // Get detailed player information
        const playerDetails = await ctx.db.player.findUnique({
          where: { id: playerId },
        });

        if (!playerDetails) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player details not found',
          });
        }

        // Combine the player details with the base user info
        return { ...playerDetails, ...playerBaseUser };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch player',
          cause: error.message,
        });
      }
    }),

  // Edit player by ID (for parent)
  editPlayerById: protectedProcedure
    .input(editPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the parent profile for the current user
        const parentId = ctx.session.user.profileId;
        const { baseUser } = input;
        const playerBaseUser = await ctx.db.baseUser.findFirst({
          where: {
            id: baseUser.id,
            role: Role.PLAYER,
            federationId: ctx.session.user.federationId,
            profile: {
              profileType: ProfileType.PLAYER,
              userStatus: {
                not: 'DELETED',
              },
            },
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

        if (!playerBaseUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player not found',
          });
        }
        const playerId = playerBaseUser.profile?.profileId;
        // Check if the player belongs to this parent
        const playerBelongsToParent = await ctx.db.player.findFirst({
          where: {
            id: playerId,
            parentId,
          },
        });

        if (!playerBelongsToParent) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player not found or not authorized to view this player',
          });
        }

        // Check email uniqueness if email is being updated
        if (
          input.baseUser.email &&
          input.baseUser.email !== playerBaseUser.email
        ) {
          const emailExists = await ctx.db.baseUser.findUnique({
            where: {
              email_federationId: {
                email: input.baseUser.email,
                federationId: ctx.session.user.federationId,
              },
            },
          });

          if (emailExists) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email already exists',
            });
          }
        }

        const [updatedBaseUser, updatedPlayer] = await ctx.db.$transaction([
          // Update BaseUser
          ctx.db.baseUser.update({
            where: { id: playerBaseUser.id },
            data: {
              ...input.baseUser,
            },
          }),

          // Update Player
          ctx.db.player.update({
            where: { id: playerId },
            data: {
              ...input.playerDetails,
            },
          }),
        ]);

        return {
          ...updatedBaseUser,
          playerDetails: updatedPlayer,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to edit player',
          cause: error.message,
        });
      }
    }),

  // Delete player by ID (for parent)
  deletePlayerById: permissionProtectedProcedure(
    PERMISSIONS.PLAYER_DELETE,
    Role.PARENT
  )
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const parentId = ctx.session.user.profileId;

        const playerBaseUser = await ctx.db.baseUser.findFirst({
          where: {
            id: input.id,
            role: Role.PLAYER,
            federationId: ctx.session.user.federationId,
            profile: {
              profileType: ProfileType.PLAYER,
              userStatus: {
                not: 'DELETED',
              },
            },
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

        if (!playerBaseUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player not found',
          });
        }

        const playerId = playerBaseUser.profile?.profileId;
        // Check if the player belongs to this parent
        const playerBelongsToParent = await ctx.db.player.findFirst({
          where: {
            id: playerId,
            parentId,
          },
        });

        if (!playerBelongsToParent) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to delete this player',
          });
        }

        const activeSubscriptions = await ctx.db.subscription.findFirst({
          where: {
            subscriberId: playerId,
            status: SubscriptionStatus.ACTIVE,
          },
        });

        if (activeSubscriptions) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Players with active memberships cannot be deleted',
          });
        }

        // Find the userProfile record for this player
        const playerUserProfile = await ctx.db.userProfile.findFirst({
          where: {
            profileType: ProfileType.PLAYER,
            profileId: playerId,
          },
        });

        if (!playerUserProfile) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player profile not found',
          });
        }

        // Mark the player as deleted (soft delete)
        await ctx.db.userProfile.update({
          where: { id: playerUserProfile.id },
          data: {
            userStatus: 'DELETED',
            deletedAt: new Date(),
          },
        });

        return { success: true };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to delete player',
          cause: error.message,
        });
      }
    }),
});
