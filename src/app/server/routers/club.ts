import {
  permissionProtectedProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '@/app/server/trpc';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { clubOnboardingSchema } from '@/schemas/Club.schema';
import { createPlayerSchema } from '@/schemas/Player.schema';
import { hashPassword } from '@/utils/encoder';
import { handleError } from '@/utils/errorHandler';
import { generateCustomPlayerId } from '@/utils/generateCustomCode';
import { Prisma, ProfileType, Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const clubRouter = router({
  clubOnboarding: publicProcedure
    .input(clubOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const federation = await ctx.db.federation.findFirst({
        where: {
          domain: input.domain,
        },
        select: {
          id: true,
        },
      });
      if (!federation) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Federation ID is required',
        });
      }

      const baseUser = {
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
      };

      const club = {
        name: input.name,
        streetAddress: input.streetAddress,
        streetAddress2: input.streetAddress2,
        country: input.country,
        state: input.state,
        city: input.city,
        postalCode: input.postalCode,
        federationId: federation.id,
      };

      try {
        const existingClub = await ctx.db.club.findUnique({
          where: {
            name_federationId: {
              name: input.name,
              federationId: federation.id,
            },
          },
        });

        if (existingClub) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Federation with this domain already exists',
          });
        }
        const hashedPassword = await hashPassword(baseUser.password);
        // Wrap all database operations in a transaction
        const result = await ctx.db.$transaction(async (tx) => {
          const createdClub = await tx.club.create({
            data: club,
            select: {
              id: true,
            },
          });
          const newBaseUser = await tx.baseUser.create({
            data: {
              ...baseUser,
              password: hashedPassword,
              role: Role.CLUB_MANAGER,
              federation: {
                connect: { id: federation.id },
              },
            },
          });

          const newClubManager = await tx.clubManager.create({
            data: {
              clubId: createdClub.id,
              phoneNumber: input.phoneNumber,
            },
          });

          const clubManagerPermissions = await tx.permission.findMany({
            where: {
              code: {
                in: roleMap[Role.CLUB_MANAGER],
              },
            },
            select: {
              id: true,
            },
          });

          const newUserProfile = await tx.userProfile.create({
            data: {
              baseUser: {
                connect: { id: newBaseUser.id },
              },
              profileType: ProfileType.CLUB_MANAGER,
              profileId: newClubManager.id,
            },
          });

          await tx.userPermission.createMany({
            data: clubManagerPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          return {
            club: createdClub,
            userProfile: newUserProfile,
          };
        });

        return result;
      } catch (error: any) {
        console.log('error', error);
        handleError(error, {
          message: 'Failed to create club',
          cause: error.message ?? 'No error message',
        });
      }
    }),
  // Add player to club
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

        const clubManagerProfile = await ctx.db.userProfile.findFirst({
          where: {
            baseUserId: ctx.session.user.id,
            profileType: ProfileType.CLUB_MANAGER,
          },
        });

        if (!clubManagerProfile) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized as club manager',
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

          const clubDetails = await tx.clubManager.findFirst({
            where: {
              id: clubManagerProfile.profileId,
            },
            select: {
              club: {
                select: {
                  id: true,
                },
              },
            },
          });

          const newPlayer = await tx.player.create({
            data: {
              ...playerDetails,
              customId,
              club: {
                connect: {
                  id: clubDetails?.club.id,
                },
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

  // Get players for club
  getClubPlayers: protectedProcedure
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
        console.log('getClubPlayers: Starting mutation for club players');

        // Ensure the user is a club manager by retrieving their club manager profile.
        console.log(
          'Retrieving club manager profile for user:',
          ctx.session.user.id
        );
        const clubManagerProfile = await ctx.db.userProfile.findFirst({
          where: {
            baseUserId: ctx.session.user.id,
            profileType: ProfileType.CLUB_MANAGER,
          },
          select: { profileId: true },
        });
        console.log('Club manager profile:', clubManagerProfile);

        if (!clubManagerProfile) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized as club manager',
          });
        }

        // Retrieve the club manager record and the club they manage.
        console.log(
          'Retrieving club manager record for profile id:',
          clubManagerProfile.profileId
        );
        const clubManager = await ctx.db.clubManager.findFirst({
          where: {
            id: clubManagerProfile.profileId,
          },
          select: {
            clubId: true,
          },
        });
        console.log('Club manager record:', clubManager);

        if (!clubManager) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Club not found for this manager in the federation',
          });
        }

        // Build the where clause for players in the club.
        // Step 3: Build the where clause for players in the club
        const where: Prisma.BaseUserWhereInput = {
          role: Role.PLAYER,
          federationId: ctx.session.user.federationId,
          profile: {
            profileType: ProfileType.PLAYER,
            userStatus: {
              not: 'DELETED',
            },
            profileId: {
              in: await ctx.db.player
                .findMany({
                  where: {
                    clubId: clubManager.clubId,
                  },
                  select: {
                    id: true,
                  },
                })
                .then((players) => players.map((p) => p.id)),
            },
          },
          ...(searchQuery && {
            OR: [
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { firstName: { contains: searchQuery, mode: 'insensitive' } },
              { lastName: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }),
        };

        // Step 4: Query players from BaseUser
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
        // Step 5: Get total count for pagination
        const totalPlayers = await ctx.db.baseUser.count({
          where,
        });

        // Step 6: Return the response
        return {
          players: baseUsers,
          total: totalPlayers,
          page,
          limit,
        };
      } catch (error: any) {
        console.error('Error in getClubPlayers:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch club players',
          cause: error.message,
        });
      }
    }),
});
