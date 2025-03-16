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
        const existingOrg = await ctx.db.federation.findUnique({
          where: { domain: federation.domain },
        });

        if (existingOrg) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Federation with this domain already exists',
          });
        }

        const hashedPassword = await hashPassword(baseUser.password);

        const createdFederation = await ctx.db.federation.create({
          data: federation,
        });

        const newBaseUser = await ctx.db.baseUser.create({
          data: {
            ...baseUser,
            password: hashedPassword,
            role: Role.FED_ADMIN,
            federation: {
              connect: { id: createdFederation.id },
            },
          },
        });

        const newFederationAdmin = await ctx.db.federationAdmin.create({
          data: {
            federationId: createdFederation.id,
          },
        });

        const newUserProfile = await ctx.db.userProfile.create({
          data: {
            baseUser: {
              connect: { id: newBaseUser.id },
            },
            profileType: ProfileType.FED_ADMIN,
            profileId: newFederationAdmin.id,
            permissions: {
              create: roleMap[Role.FED_ADMIN].map((permission) => ({
                permission: { connect: { code: permission } },
              })),
            },
          },
        });

        return { federation: createdFederation, userProfile: newUserProfile };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create federation with admin',
          cause: error.message,
        });
      }
    }),
});
