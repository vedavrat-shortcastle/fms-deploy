import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  publicProcedure,
  router,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { FormType, ProfileType, Role } from '@prisma/client';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { federationOnboardingSchema } from '@/schemas/Federation.schema';
import { createPlayerSchema } from '@/schemas/Player.schema';
import { z } from 'zod';
import { generateCustomPlayerId } from '@/utils/generateCustomCode';
import { defaultFormConfigs } from '@/config/defaultFormConfigs';
import { getDirection } from '@/utils/getLanguageDirection';

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
        console.log('flag1: Checking for existing federation');
        const existingFederation = await ctx.db.federation.findUnique({
          where: { domain: federation.domain },
        });

        if (existingFederation) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Federation with this domain already exists',
          });
        }

        console.log('flag2: Getting language direction');
        const direction = getDirection(federation.language);

        console.log('flag3: Hashing password');
        const hashedPassword = await hashPassword(baseUser.password);

        console.log('flag4: Starting transaction');
        const result = await ctx.db.$transaction(async (tx) => {
          console.log('flag5: Creating federation', {
            ...federation,
            isRtl: direction === 'rtl',
          });
          const createdFederation = await tx.federation.create({
            data: { ...federation, isRtl: direction === 'rtl' },
            select: {
              id: true,
            },
          });

          console.log('flag6: Creating base user');
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

          console.log('flag7: Creating federation admin');
          const newFederationAdmin = await tx.federationAdmin.create({
            data: {
              federationId: createdFederation.id,
              phoneNumber: input.phoneNumber,
            },
          });

          console.log('flag8: Fetching federation admin permissions');
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

          console.log('flag9: Creating user profile');
          const newUserProfile = await tx.userProfile.create({
            data: {
              baseUser: {
                connect: { id: newBaseUser.id },
              },
              profileType: ProfileType.FEDERATION_ADMIN,
              profileId: newFederationAdmin.id,
            },
          });

          console.log('flag10: Assigning permissions to user');
          await tx.userPermission.createMany({
            data: fedAdminPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          console.log('flag11: Creating form templates');
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

        console.log('flag12: Transaction completed successfully');
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
      console.log('Received input in backend:', input);

      try {
        const federationId = ctx.session.user.federationId;
        if (!federationId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        // Use a Prisma transaction to ensure atomicity
        await ctx.db.$transaction(async (tx) => {
          for (const player of input) {
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

            const customId = await generateCustomPlayerId(
              ctx.db,
              ctx.session.user.federationId
            );

            const newPlayer = await tx.player.create({
              data: {
                birthDate: player.playerDetails.birthDate,
                gender: player.playerDetails.gender,
                avatarUrl: player.playerDetails.avatarUrl,
                ageProof: player.playerDetails.ageProof,
                streetAddress: player.playerDetails.streetAddress,
                streetAddress2: player.playerDetails.streetAddress2,
                country: player.playerDetails.country,
                state: player.playerDetails.state,
                city: player.playerDetails.city,
                postalCode: player.playerDetails.postalCode,
                phoneNumber: player.playerDetails.phoneNumber,
                fideId: player.playerDetails.fideId,
                schoolName: player.playerDetails.schoolName,
                graduationYear: player.playerDetails.graduationYear,
                gradeInSchool: player.playerDetails.gradeInSchool,
                gradeDate: player.playerDetails.gradeDate,
                clubName: player.playerDetails.clubName,
                customId,
              },
            });

            await tx.userProfile.create({
              data: {
                profileType: ProfileType.PLAYER,
                profileId: newPlayer.id,
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
});
