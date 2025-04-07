import {
  permissionProtectedProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '@/app/server/trpc';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import {
  clubOnboardingSchema,
  editclubManagerSchema,
} from '@/schemas/Club.schema';
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

        // Step 2: Query to get the club and associated player IDs
        const clubWithPlayers = await ctx.db.clubManager.findUnique({
          where: { id: clubManagerProfile.profileId },
          select: {
            club: {
              select: {
                id: true,
                players: {
                  select: {
                    id: true,
                    subscriptions: {
                      where: { status: 'ACTIVE' },
                      select: { id: true, planId: true },
                    },
                  },
                },
              },
            },
          },
        });

        if (!clubWithPlayers || !clubWithPlayers.club) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Club not found for this manager',
          });
        }

        const playerIds = clubWithPlayers.club.players.map(
          (player) => player.id
        );

        // Step 3: Find base users who are players connected to this club
        const where: Prisma.BaseUserWhereInput = {
          role: Role.PLAYER,
          federationId: ctx.session.user.federationId,
          profile: {
            profileType: ProfileType.PLAYER,
            profileId: { in: playerIds },
            userStatus: { not: 'DELETED' },
          },
          OR: searchQuery
            ? [
                { email: { contains: searchQuery, mode: 'insensitive' } },
                { firstName: { contains: searchQuery, mode: 'insensitive' } },
                { lastName: { contains: searchQuery, mode: 'insensitive' } },
              ]
            : undefined,
        };

        // Step 4: Get players
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
          orderBy: { createdAt: 'desc' },
        });

        // Step 5: Get total count for pagination
        const totalPlayers = await ctx.db.baseUser.count({
          where,
        });

        // Step 6: Return the response
        return {
          players: baseUsers,
          total: totalPlayers,
          playerSubscriptions: clubWithPlayers.club,
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

  // Get club player by id
  getClubPlayerById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Step 1: Verify the user is a club manager
        const clubManagerProfile = await ctx.db.userProfile.findFirst({
          where: {
            baseUserId: ctx.session.user.id,
            profileType: ProfileType.CLUB_MANAGER,
          },
          select: { profileId: true },
        });

        if (!clubManagerProfile) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized as club manager',
          });
        }

        // Step 2: Retrieve the club ID from the ClubManager record
        const clubManager = await ctx.db.clubManager.findFirst({
          where: {
            id: clubManagerProfile.profileId,
          },
          select: { clubId: true },
        });

        if (!clubManager) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Club not found for this manager',
          });
        }

        const clubId = clubManager.clubId;

        // Step 3: Fetch the player's BaseUser record
        const playerBaseUser = await ctx.db.baseUser.findFirst({
          where: {
            id: input.id,
            role: Role.PLAYER,
            federationId: ctx.session.user.federationId,
            profile: {
              profileType: ProfileType.PLAYER,
              userStatus: { not: 'DELETED' },
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

        // Step 4: Verify the player belongs to the club
        const playerId = playerBaseUser.profile?.profileId;

        const playerDetails = await ctx.db.player.findFirst({
          where: {
            id: playerId,
            clubId: clubId,
          },
        });

        if (!playerDetails) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player not found or not authorized to view this player',
          });
        }

        // Step 6: Combine and return player details with base user info
        return { ...playerDetails, ...playerBaseUser };
      } catch (error: any) {
        console.error('Error in getClubPlayerById:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch player',
          cause: error.message,
        });
      }
    }),

  deletePlayerById: permissionProtectedProcedure(
    PERMISSIONS.PLAYER_DELETE,
    Role.CLUB_MANAGER
  )
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Step 1: Verify the user is a club manager
        const clubManagerProfile = await ctx.db.userProfile.findFirst({
          where: {
            baseUserId: ctx.session.user.id,
            profileType: ProfileType.CLUB_MANAGER,
          },
          select: { profileId: true },
        });

        if (!clubManagerProfile) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized as club manager',
          });
        }

        // Step 2: Retrieve the club ID from the ClubManager record
        const clubManager = await ctx.db.clubManager.findFirst({
          where: {
            id: clubManagerProfile.profileId,
          },
          select: { clubId: true },
        });

        if (!clubManager) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Club not found for this manager',
          });
        }

        const clubId = clubManager.clubId;

        // Step 3: Fetch the player's BaseUser record
        const playerBaseUser = await ctx.db.baseUser.findFirst({
          where: {
            id: input.id,
            role: Role.PLAYER,
            federationId: ctx.session.user.federationId,
            profile: {
              profileType: ProfileType.PLAYER,
              userStatus: { not: 'DELETED' },
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

        // Step 4: Verify the player belongs to the club
        const playerId = playerBaseUser.profile?.profileId;

        const playerBelongsToClub = await ctx.db.player.findFirst({
          where: {
            id: playerId,
            clubId: clubId,
          },
        });

        if (!playerBelongsToClub) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player does not belong to this club',
          });
        }

        // Step 5: Check for active subscriptions
        const activeSubscriptions = await ctx.db.subscription.findFirst({
          where: {
            subscriberId: playerId,
            status: 'ACTIVE', // Use the correct enum value for SubscriptionStatus.ACTIVE
          },
        });

        if (activeSubscriptions) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Players with active subscriptions cannot be deleted',
          });
        }

        // Step 6: Find the userProfile record for this player
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

        // Step 7: Mark the player as deleted (soft delete)
        await ctx.db.userProfile.update({
          where: { id: playerUserProfile.id },
          data: {
            userStatus: 'DELETED',
            deletedAt: new Date(),
          },
        });

        return { success: true, playerId, clubId };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to delete player',
          cause: error.message,
        });
      }
    }),
  // Get Club Manager by ID
  getClubMangerById: permissionProtectedProcedure(PERMISSIONS.CLUB_VIEW)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const clubManager = await ctx.db.baseUser.findFirst({
          where: {
            id: input.id,
            role: Role.CLUB_MANAGER,
            federationId: ctx.session.user.federationId,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            middleName: true,
            nameSuffix: true,
            role: true,
            profile: {
              select: {
                profileId: true,
                profileType: true,
              },
            },
          },
        });

        if (!clubManager) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'club Manager not found',
          });
        }

        const clubManagerDetails = await ctx.db.clubManager.findUnique({
          where: { id: clubManager.profile?.profileId },
          select: {
            id: true,
            phoneNumber: true,
            clubId: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!clubManagerDetails) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'club Manager details not found',
          });
        }
        const club = await ctx.db.club.findUnique({
          where: { id: clubManagerDetails.clubId },
          select: {
            id: true,
            name: true,
            streetAddress: true,
            streetAddress2: true,
            country: true,
            state: true,
            city: true,
            postalCode: true,
          },
        });

        return {
          ...clubManager,
          ...clubManagerDetails,
          ...club,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch parent',
          cause: error.message,
        });
      }
    }),
  //Edit club Manager by Id

  editClubManagerById: permissionProtectedProcedure(PERMISSIONS.CLUB_UPDATE)
    .input(editclubManagerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('input', input);
        const { clubManagerDetails, clubDetails } = input;
        // Find the existing user
        const existingUser = await ctx.db.baseUser.findUnique({
          where: {
            id: clubManagerDetails.id,
            federationId: ctx.session.user.federationId,
            role: Role.CLUB_MANAGER,
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
            message: 'club manager not found',
          });
        }

        if (existingUser.profile?.userStatus !== 'ACTIVE') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `club manager profile is ${existingUser.profile?.userStatus}`,
          });
        }

        if (existingUser.profile.profileType !== ProfileType.CLUB_MANAGER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Profile is not a club manager',
          });
        }

        const existingClubManager = await ctx.db.clubManager.findUnique({
          where: { id: existingUser.profile.profileId },
          select: {
            clubId: true,
          },
        });
        if (!existingClubManager) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'club manager details not found',
          });
        }

        // Check email uniqueness if email is being updated
        if (
          clubManagerDetails.email &&
          clubManagerDetails.email !== existingUser.email
        ) {
          const emailExists = await ctx.db.baseUser.findUnique({
            where: {
              email_federationId: {
                email: clubManagerDetails.email,
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
        const [updatedBaseUser, updatedclubManagerPhoneNumber] =
          await ctx.db.$transaction([
            // Update clubManagerDetails
            ctx.db.baseUser.update({
              where: { id: clubManagerDetails.id },
              data: {
                email: clubManagerDetails.email,
                firstName: clubManagerDetails.firstName,
                lastName: clubManagerDetails.lastName,
                middleName: clubManagerDetails.middleName,
                nameSuffix: clubManagerDetails.nameSuffix,
              },
            }),
            // Update clubManager phone number
            ctx.db.clubManager.update({
              where: { id: existingUser.profile.profileId },
              data: {
                phoneNumber: clubManagerDetails.phoneNumber,
              },
            }),

            // Update Parent (using parentDetails)
            ctx.db.club.update({
              where: { id: existingClubManager.clubId },
              data: {
                ...clubDetails,
              },
            }),
          ]);

        return {
          ...updatedBaseUser,
          ...updatedclubManagerPhoneNumber,
          // ... updatedClubDetails,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to edit club manager',
          cause: error.message,
        });
      }
    }),
});
