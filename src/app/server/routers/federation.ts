import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  publicProcedure,
  router,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { ProfileType, Role } from '@prisma/client';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { federationOnboardingSchema } from '@/schemas/Federation.schema';
import { createPlayerSchema } from '@/schemas/Player.schema';

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
      };

      try {
        // Check for existing federation outside transaction
        const existingFederation = await ctx.db.federation.findUnique({
          where: { domain: federation.domain },
        });

        if (existingFederation) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Federation with this domain already exists',
          });
        }

        const hashedPassword = await hashPassword(baseUser.password);

        // Wrap all database operations in a transaction
        const result = await ctx.db.$transaction(async (tx) => {
          const createdFederation = await tx.federation.create({
            data: federation,
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
              countryCode: input.countryCode,
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
            },
          });

          await tx.userPermission.createMany({
            data: fedAdminPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });
          return {
            federation: createdFederation,
            userProfile: newUserProfile,
          };
        });

        return result;
      } catch (error: any) {
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

          const newPlayer = await tx.player.create({
            data: {
              ...playerDetails,
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
});
