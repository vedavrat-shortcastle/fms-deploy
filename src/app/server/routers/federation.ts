import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  publicProcedure,
  router,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import {
  FormType,
  ProfileType,
  Role,
  SubscriptionStatus,
} from '@prisma/client';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { federationOnboardingSchema } from '@/schemas/Federation.schema';
import {
  createPlayerSchema,
  deletePlayerSchema,
  editAdminSchema,
  editPlayerSchema,
} from '@/schemas/Player.schema';
import { z } from 'zod';
import {
  generateCustomPlayerId,
  generateBulkCustomPlayerIds,
} from '@/utils/generateCustomCode';
import { defaultFormConfigs } from '@/config/defaultFormConfigs';
import { getDirection } from '@/utils/getLanguageDirection';
import i18next from 'i18next';

export const federationRouter = router({
  federationOnboarding: publicProcedure
    .input(federationOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const baseUser = {
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        middleName: input.middleName,
        nameSuffix: input.nameSuffix,
      };

      const federation = {
        name: input.name,
        type: input.type,
        country: input.country,
        domain: input.domain,
        logo: input.logo,
        shortCode: input.shortCode,
        language: input.language,
      };

      try {
        const existingFederation = await ctx.db.federation.findUnique({
          where: { domain: federation.domain },
        });

        if (existingFederation) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Federation with this domain already exists',
          });
        }

        const direction = getDirection(federation.language);

        const hashedPassword = await hashPassword(baseUser.password);

        const result = await ctx.db.$transaction(async (tx) => {
          const createdFederation = await tx.federation.create({
            data: { ...federation, isRtl: direction === 'rtl' },
            select: {
              id: true,
            },
          });

          const newBaseUser = await tx.baseUser.create({
            data: {
              ...baseUser,
              password: hashedPassword,
              role: Role.FED_ADMIN,
              federation: {
                connect: { id: createdFederation.id },
              },
            },
          });

          const newFederationAdmin = await tx.federationAdmin.create({
            data: {
              federationId: createdFederation.id,
              phoneNumber: input.phoneNumber,
            },
          });

          const fedAdminPermissions = await tx.permission.findMany({
            where: {
              code: {
                in: roleMap[Role.FED_ADMIN],
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
              profileType: ProfileType.FEDERATION_ADMIN,
              profileId: newFederationAdmin.id,
              language: input.language,
              isRtl: i18next.dir(input.language) === 'rtl' ? true : false,
            },
          });

          await tx.userPermission.createMany({
            data: fedAdminPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          for (const [formType, config] of Object.entries(defaultFormConfigs)) {
            await tx.formTemplate.create({
              data: {
                federationId: createdFederation.id,
                formType: formType as FormType,
                fields: {
                  create: config.fields.map((field) => ({
                    ...field,
                  })),
                },
              },
            });
          }

          return {
            federation: createdFederation,
            userProfile: newUserProfile,
          };
        });

        return result;
      } catch (error: any) {
        console.error('flag13: Error occurred', error);
        handleError(error, {
          message: 'Failed to create federation with admin',
          cause: error.message,
        });
      }
    }),
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

          const customId = await generateCustomPlayerId(
            ctx.db,
            ctx.session.user.federationId
          );

          const newPlayer = await tx.player.create({
            data: {
              ...playerDetails,
              customId,
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

  // Create multiple players from CSV file
  uploadPlayersCSV: permissionProtectedProcedure(PERMISSIONS.PLAYER_CREATE)
    .input(z.array(createPlayerSchema))
    .mutation(async ({ ctx, input }) => {
      try {
        const federationId = ctx.session.user.federationId;
        if (!federationId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        const customIds = await generateBulkCustomPlayerIds(
          ctx.db,
          federationId,
          input.length
        );

        await ctx.db.$transaction(async (tx) => {
          for (let i = 0; i < input.length; i++) {
            const player = input[i];
            const hashedCSVPassword = await hashPassword(
              player.baseUser.password
            );

            const newBaseUser = await tx.baseUser.create({
              data: {
                email: player.baseUser.email,
                password: hashedCSVPassword,
                firstName: player.baseUser.firstName,
                lastName: player.baseUser.lastName,
                middleName: player.baseUser.middleName,
                nameSuffix: player.baseUser.nameSuffix,
                role: Role.PLAYER,
                federation: {
                  connect: { id: federationId },
                },
              },
            });

            await tx.player.create({
              data: {
                ...player.playerDetails,
                customId: customIds[i],
              },
            });

            await tx.userProfile.create({
              data: {
                profileType: ProfileType.PLAYER,
                profileId: newBaseUser.id,
                baseUser: {
                  connect: { id: newBaseUser.id },
                },
              },
            });
          }
        });

        return { success: true, message: 'Players uploaded successfully' };
      } catch (error: any) {
        console.error('Error in CSV upload:', error);
        handleError(error, {
          message: 'Failed to create players from CSV',
          cause: error.message,
        });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process CSV upload',
        });
      }
    }),
  getExistingShortCodes: publicProcedure.query(async ({ ctx }) => {
    try {
      const shortCodes = await ctx.db.federation.findMany({
        select: {
          shortCode: true,
        },
      });
      return shortCodes.map((federation) => federation.shortCode);
    } catch (error: any) {
      handleError(error, {
        message: 'Failed to fetch existing short codes',
        cause: error.message,
      });
    }
  }),

  editPlayerById: permissionProtectedProcedure(
    PERMISSIONS.PLAYER_UPDATE,
    Role.FED_ADMIN
  )
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
  deletePlayerById: permissionProtectedProcedure(
    PERMISSIONS.PLAYER_DELETE,
    Role.FED_ADMIN
  )
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
  updateAdminProfile: permissionProtectedProcedure(
    PERMISSIONS.FED_ALL,
    Role.FED_ADMIN
  )
    .input(editAdminSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const adminId = ctx.session.user.id;

        const { language, ...baseUserData } = input; // Separate language from other fields

        const result = await ctx.db.$transaction(async (tx) => {
          const updatedBaseUser = await tx.baseUser.update({
            where: { id: adminId },
            data: {
              ...baseUserData,
              ...(baseUserData.password && {
                password: await hashPassword(baseUserData.password),
              }),
            },
          });

          if (language) {
            await tx.userProfile.update({
              where: { baseUserId: adminId },
              data: { language, isRtl: i18next.dir(language) === 'rtl' },
            });
          }

          return updatedBaseUser;
        });

        return { success: true, admin: result };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to update admin profile',
          cause: error.message,
        });
      }
    }),
});
