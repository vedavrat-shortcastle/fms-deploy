import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  router,
  publicProcedure,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { ProfileType, Role } from '@prisma/client';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { getProfileByRole } from '@/config/roleTable';
import {
  createPlayerSchema,
  deletePlayerSchema,
  editPlayerSchema,
  signupMemberSchema,
} from '@/schemas/player.schema';

export const playerRouter = router({
  // Create a new player
  createPlayer: permissionProtectedProcedure(PERMISSIONS.PLAYER_CREATE)
    .input(createPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { baseUser, playerDetails } = input;
        if (!ctx.session.user.federationId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

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

          const newPlayer = await tx.player.create({
            data: {
              birthDate: playerDetails.birthDate,
              avatarUrl: playerDetails.avatarUrl,
              ageProof: playerDetails.ageProof,
              streetAddress: playerDetails.streetAddress,
              streetAddress2: playerDetails.streetAddress2,
              country: playerDetails.country,
              state: playerDetails.state,
              city: playerDetails.city,
              postalCode: playerDetails.postalCode,
              phoneNumber: playerDetails.phoneNumber,
              countryCode: playerDetails.countryCode,
              fideId: playerDetails.fideId,
              schoolName: playerDetails.schoolName,
              graduationYear: playerDetails.graduationYear,
              gradeInSchool: playerDetails.gradeInSchool,
              gradeDate: playerDetails.gradeDate,
              clubName: playerDetails.clubName,
              clubId: playerDetails.clubId ?? null,
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

          const fedPlayerPermissions = await tx.permission.findMany({
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
            data: fedPlayerPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          return { ...newUserProfile, password: undefined };
        });

        return result;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create player',
          cause: error.message,
        });
      }
    }),
  // Get all players
  getPlayers: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW)
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit } = input;
        const offset = (page - 1) * limit;
        const where: Prisma.BaseUserWhereInput = {
          role: Role.PLAYER,
          federationId: ctx.session.user.federationId,
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
            gender: true,
            role: true,
            federation: true,
            profile: {
              select: {
                isActive: true,
                profileId: true,
              },
            },
          },
        });

        const players = await ctx.db.player.findMany({
          where: {
            id: {
              in: baseUsers.map((user) => user.profile!.profileId),
            },
          },
        });

        const result = players.map((player) => {
          const user = baseUsers.find(
            (u) => u.profile!.profileId === player.id
          )!;
          return { ...user, ...player };
        });

        const totalPlayers = await ctx.db.baseUser.count({ where });

        return {
          players: result,
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
        // Find the base user by filtering on the related user profile's profileId field
        const baseUser = await ctx.db.baseUser.findFirst({
          where: {
            role: Role.PLAYER,
            federationId: ctx.session.user.federationId,
            profile: {
              profileId: input.id,
            },
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            gender: true,
            role: true,
            federation: true,
            profile: {
              select: {
                profileId: true,
                profileType: true,
                isActive: true,
              },
            },
          },
        });
        console.log('flag1,baseUser', baseUser);
        if (!baseUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player not found',
          });
        }

        if (!baseUser.profile?.isActive) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player profile is disabled',
          });
        }

        if (baseUser.profile.profileType !== ProfileType.PLAYER) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player profile is not a player',
          });
        }

        // Fetch the player details using the profileId from the base user profile
        const player = await ctx.db.player.findUnique({
          where: { id: baseUser.profile.profileId },
        });
        console.log('player', player);
        if (!player) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player details not found',
          });
        }

        // Combine the player details with the base user info
        return { ...baseUser, ...player };
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
                isActive: true,
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

        if (!existingUser.profile?.isActive) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Player profile is inactive',
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
          select: { profile: true },
        });

        if (!userProfileId) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player not found',
          });
        }

        await ctx.db.userProfile.update({
          where: {
            id: userProfileId.profile?.id,
            profileType: ProfileType.PLAYER,
          },
          data: {
            isActive: false,
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
  // Signup a new player
  signup: publicProcedure
    .input(signupMemberSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { domain, ...data } = input;
        const currentFederation = await ctx.db.federation.findFirst({
          where: { domain },
          select: { id: true },
        });

        if (!currentFederation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Federation not found',
          });
        }

        const existingUser = await ctx.db.baseUser.findUnique({
          where: {
            email_federationId: {
              email: input.email,
              federationId: currentFederation.id,
            },
          },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        const hashedPassword = await hashPassword(input.password);

        // Wrap creation operations in a transaction
        const result = await ctx.db.$transaction(async (tx) => {
          const newBaseUser = await tx.baseUser.create({
            data: {
              ...data,
              password: hashedPassword,
              federation: {
                connect: { id: currentFederation.id },
              },
            },
          });

          const profileType = getProfileByRole(data.role);

          const newUserProfile = await tx.userProfile.create({
            data: {
              profileType,
              profileId: 'PENDING',
              baseUser: {
                connect: { id: newBaseUser.id },
              },
            },
          });

          const playerPermissions = await tx.permission.findMany({
            where: {
              code: {
                in: roleMap[data.role],
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
          console.log('newUserProfile', newUserProfile);
          return { ...newBaseUser, newUserProfile };
        });

        return { ...result, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to sign up player',
          cause: error.message,
        });
      }
    }),
});
