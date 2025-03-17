import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { ProfileType, Role } from '@prisma/client';
import { roleMap } from '@/config/permissions';
import { federationOnboardingSchema } from '@/schemas/Federation.schema';

export const federationRouter = router({
  federationOnboarding: publicProcedure
    .input(federationOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const { baseUser, ...federation } = input;

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
});
