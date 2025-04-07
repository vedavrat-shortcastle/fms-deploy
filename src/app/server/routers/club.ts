import {
  permissionProtectedProcedure,
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
import { ProfileType, Role } from '@prisma/client';
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
        const { baseUser, clubManagerDetails } = input;
        // Find the existing user
        const existingUser = await ctx.db.baseUser.findUnique({
          where: {
            id: baseUser.id,
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
        const [updatedBaseUser, updatedClubManage] = await ctx.db.$transaction([
          // Update BaseUser
          ctx.db.baseUser.update({
            where: { id: baseUser.id },
            data: {
              ...baseUser,
            },
          }),

          // Update Parent (using parentDetails)
          ctx.db.clubManager.update({
            where: { id: existingUser.profile.profileId },
            data: {
              ...clubManagerDetails,
            },
          }),
        ]);

        return {
          ...updatedBaseUser,
          parentDetails: updatedClubManage,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to edit club manager',
          cause: error.message,
        });
      }
    }),
});
