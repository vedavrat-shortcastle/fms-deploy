import { hashPassword } from '@/utils/encoder';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router, validateApiKey } from '@/app/server/trpc';
import { createPermissionSchema } from '@/schemas/permission.schema';
import { handleError } from '@/utils/errorHandler';
import { createUserSchema } from '@/schemas/member.schema';
import { createOrganizationSchema } from '@/app/server/routers/organization';

export const superUserRouter = router({
  createPermission: publicProcedure
    .use(validateApiKey())
    .input(createPermissionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingPermissions = await ctx.db.permission.findMany({
          where: {
            OR: input.permissions.map((permission) => ({
              OR: [{ name: permission.name }, { code: permission.code }],
            })),
          },
        });

        if (existingPermissions.length > 0) {
          const duplicates = existingPermissions.map((p) => p.code).join(', ');
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Permissions already exist with codes: ${duplicates}`,
          });
        }

        const permissions = await ctx.db.$transaction(
          input.permissions.map((permission) =>
            ctx.db.permission.create({
              data: permission,
            })
          )
        );

        return permissions;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create permission',
        });
      }
    }),

  createUser: publicProcedure
    .use(validateApiKey())
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const hashedPassword = await hashPassword(input.password);
        const currentOrg = await ctx.db.organization.findFirst({
          where: { domain: input.domain },
          select: { id: true },
        });
        if (!currentOrg) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Organization not found',
          });
        }
        const existingUser = await ctx.db.user.findUnique({
          where: {
            email_organizationId: {
              email: input.email,
              organizationId: currentOrg.id,
            },
          },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        // Verify all permission IDs exist
        const permissions = await ctx.db.permission.findMany({
          where: {
            code: {
              in: input.permissions,
            },
          },
        });

        if (permissions.length !== input.permissions.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'One or more permission IDs are invalid',
          });
        }
        console.log('data', {
          ...input,
          password: hashedPassword,
          permissions: input.permissions,
        });
        // Create user with permissions
        const user = await ctx.db.user.create({
          data: {
            ...input,
            password: hashedPassword,
            organizationId: currentOrg.id,
            permissions: {
              create: input.permissions.map((permissionId) => ({
                permission: {
                  connect: { id: permissionId },
                },
              })),
            },
          },
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

        return { ...user, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create user',
          cause: error.message,
        });
      }
    }),

  createOrganization: publicProcedure
    .use(validateApiKey())
    .input(createOrganizationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('input', input);
        const existingOrg = await ctx.db.organization.findUnique({
          where: { domain: input.domain },
        });

        if (existingOrg) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Organization with this domain already exists',
          });
        }

        const organization = await ctx.db.organization.create({
          data: input,
        });

        return organization;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create organization',
        });
      }
    }),
});
