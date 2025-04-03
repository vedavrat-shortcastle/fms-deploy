import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  router,
  protectedProcedure,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { ProfileType, Role, SubscriptionStatus } from '@prisma/client';
import { PERMISSIONS } from '@/config/permissions';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  deletePlayerSchema,
  editPlayerSchema,
  playerOnboardingSchema,
} from '@/schemas/Player.schema';
import { generateCustomPlayerId } from '@/utils/generateCustomCode';

export const playerRouter = router({
  // Get all players
  getPlayers: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW)
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
        const where: Prisma.BaseUserWhereInput = {
          role: Role.PLAYER,
          federationId: ctx.session.user.federationId,
          profile: {
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
            federation: true,
            profile: {
              select: {
                userStatus: true,
                profileId: true,
              },
            },
          },
        });

        const totalPlayers = await ctx.db.baseUser.count({
          where,
        });

        return {
          players: baseUsers,
          total: totalPlayers,
          page,
          limit,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch players',
          cause: error.message,
        });
      }
    }),

  // Get a player by ID
  getPlayerById: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const role = ctx.session.user.role;
        if (role === Role.PLAYER) {
          if (ctx.session.user.id !== input.id) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Player not found',
            });
          }
        }

        const result = await ctx.db.$transaction(async (tx) => {
          // Find the base user by filtering on the related user profile's profileId field
          const baseUser = await tx.baseUser.findFirst({
            where: {
              role: Role.PLAYER,
              federationId: ctx.session.user.federationId,
              id: input.id,
            },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              federation: true,
              profile: {
                select: {
                  profileId: true,
                  profileType: true,
                  userStatus: true,
                },
              },
            },
          });

          if (!baseUser) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Player not found',
            });
          }

          if (baseUser.profile?.userStatus !== 'ACTIVE') {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: `Player profile is ${baseUser.profile?.userStatus}`,
            });
          }

          if (baseUser.profile.profileType !== ProfileType.PLAYER) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Player profile is not a player',
            });
          }

          // Fetch the player details using the profileId from the base user profile
          const player = await tx.player.findUnique({
            where: { id: baseUser.profile.profileId },
          });

          if (!player) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Player details not found',
            });
          }

          const subscriptions = await tx.subscription.findMany({
            where: {
              subscriberId: player.id,
            },
          });
          // Combine the player details with the base user info
          return { ...player, ...baseUser, subscriptions };
        });

        return result;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch player',
          cause: error.message,
        });
      }
    }),

  // Edit a player by ID
  editPlayerById: permissionProtectedProcedure(PERMISSIONS.PLAYER_UPDATE)
    .input(editPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { baseUser, playerDetails } = input;

        const existingUser = await ctx.db.baseUser.findUnique({
          where: {
            id: baseUser.id,
            federationId: ctx.session.user.federationId,
            role: Role.PLAYER,
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
            message: 'Player not found',
          });
        }

        if (existingUser.profile?.userStatus !== 'ACTIVE') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Player profile is ${existingUser.profile?.userStatus}`,
          });
        }

        if (existingUser.profile.profileType !== ProfileType.PLAYER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Profile is not a player',
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

        const [updatedBaseUser, updatedPlayer] = await ctx.db.$transaction([
          // Update BaseUser
          ctx.db.baseUser.update({
            where: { id: baseUser.id },
            data: {
              ...baseUser,
            },
          }),

          // Update Player
          ctx.db.player.update({
            where: { id: existingUser.profile.profileId },
            data: {
              ...playerDetails,
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
  // Delete a player by ID
  deletePlayerById: permissionProtectedProcedure(PERMISSIONS.PLAYER_DELETE)
    .input(deletePlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userProfileId = await ctx.db.baseUser.findUnique({
          where: {
            id: input.id,
            role: Role.PLAYER,
            federationId: ctx.session.user.federationId,
          },
          select: {
            profile: {
              select: {
                id: true,
                profileId: true,
                profileType: true,
                userStatus: true,
              },
            },
          },
        });

        if (!userProfileId || !userProfileId.profile) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player not found',
          });
        }

        // Check if player has active subscriptions
        const activeSubscriptions = await ctx.db.subscription.findFirst({
          where: {
            subscriberId: userProfileId.profile.profileId,
            status: SubscriptionStatus.ACTIVE,
          },
        });

        if (activeSubscriptions) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Players with active memberships cannot be deleted',
          });
        }
        await ctx.db.userProfile.update({
          where: {
            id: userProfileId.profile?.id,
            profileType: ProfileType.PLAYER,
          },
          data: {
            userStatus: 'DELETED',
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

  onboardPlayer: protectedProcedure
    .input(playerOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.profileId !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player already onboarded',
          });
        }

        const customId = await generateCustomPlayerId(
          ctx.db,
          ctx.session.user.federationId
        );
        const result = await ctx.db.$transaction(async (tx) => {
          const newPlayer = await tx.player.create({
            data: {
              ...input,
              customId,
            },
          });

          const baseUserId = ctx.session.user.id;

          await tx.userProfile.update({
            where: {
              baseUserId,
            },
            data: {
              profileId: newPlayer.id,
              userStatus: 'ACTIVE',
            },
          });

          return newPlayer;
        });

        return result;
      } catch (error: any) {
        console.log(error);
        handleError(error, {
          message: 'Failed to onboard player',
          cause: error.message,
        });
      }
    }),
  // to get players  csv:

  getPlayersCSV: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW)
    .input(
      z.object({
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { searchQuery } = input;
        const where: Prisma.BaseUserWhereInput = {
          role: Role.PLAYER,
          federationId: ctx.session.user.federationId,
          profile: {
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

        // Query all players without pagination.
        const players = await ctx.db.baseUser.findMany({
          where,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            profile: {
              select: {
                userStatus: true,
                profileId: true,
              },
            },
          },
        });

        // Create CSV header and rows
        const header = [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'createdAt',
          'userStatus',
          'profileId',
        ];
        const rows = players.map((player) => [
          player.id,
          player.email,
          player.firstName,
          player.lastName,
          player.role,
          player.createdAt.toISOString(),
          player.profile?.userStatus ?? '',
          player.profile?.profileId ?? '',
        ]);

        // Convert rows to CSV string (basic implementation)
        const csvContent = [header, ...rows]
          .map((row) =>
            row
              .map((cell) => {
                // Wrap cell content in quotes if it contains commas or newlines
                const cellStr = String(cell);
                return cellStr.includes(',') || cellStr.includes('\n')
                  ? `"${cellStr}"`
                  : cellStr;
              })
              .join(',')
          )
          .join('\n');

        return csvContent;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch players CSV',
          cause: error.message,
        });
      }
    }),
});
