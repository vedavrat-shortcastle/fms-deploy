import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { Role } from '@prisma/client';
import { roleMap } from '@/config/permissions';
import { federationOnboardingSchema } from '@/schemas/Federation.schema';

export const federationRouter = router({
  federationOnboarding: publicProcedure
    .input(federationOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const { admin, ...federation } = input;

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

        const hashedPassword = await hashPassword(admin.password);

        const createdFederation = await ctx.db.federation.create({
          data: federation,
        });

        const createdAdmin = await ctx.db.user.create({
          data: {
            ...admin,
            password: hashedPassword,
            role: Role.FED_ADMIN,
            adminFederationId: createdFederation.id,
            permissions: {
              create: roleMap[Role.FED_ADMIN].map((permission) => ({
                permission: { connect: { code: permission } },
              })),
            },
          },
        });

        return { federation: createdFederation, admin: createdAdmin };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create federation with admin',
          cause: error.message,
        });
      }
    }),
});
