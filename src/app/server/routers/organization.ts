import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { Role } from '@prisma/client';
import { organizationOnboardingSchema } from '@/schemas/organization.schema';
import { roleMap } from '@/constants';

export const organizationRouter = router({
  organizationOnboarding: publicProcedure
    .input(organizationOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const { admin, ...organization } = input;

      try {
        const existingOrg = await ctx.db.organization.findUnique({
          where: { domain: organization.domain },
        });

        if (existingOrg) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Organization with this domain already exists',
          });
        }

        const hashedPassword = await hashPassword(admin.password);

        const createdOrganization = await ctx.db.organization.create({
          data: organization,
        });

        const createdAdmin = await ctx.db.user.create({
          data: {
            ...admin,
            password: hashedPassword,
            role: Role.ORG_ADMIN,
            adminOrganizationId: createdOrganization.id,
            permissions: {
              create: roleMap[Role.ORG_ADMIN].map((permission) => ({
                permission: { connect: { code: permission } },
              })),
            },
          },
        });

        return { organization: createdOrganization, admin: createdAdmin };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create organization with admin',
          cause: error.message,
        });
      }
    }),
});
