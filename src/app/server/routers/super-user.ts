import { TRPCError } from '@trpc/server';
import { publicProcedure, router, validateApiKey } from '@/app/server/trpc';
import { createFederationSchema } from '@/schemas/Federation.schema';
import { createPermissionSchema } from '@/schemas/permission.schema';

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

  // createFederationAdmin: publicProcedure
  //   .use(validateApiKey())
  //   .input(createUserSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const { domain, ...userData } = input;
  //       const hashedPassword = await hashPassword(input.password);
  //       const currentOrg = await ctx.db.federation.findFirst({
  //         where: { domain: domain },
  //         select: { id: true },
  //       });
  //       if (!currentOrg) {
  //         throw new TRPCError({
  //           code: 'NOT_FOUND',
  //           message: 'Federation not found',
  //         });
  //       }
  //       const existingUser = await ctx.db.user.findUnique({
  //         where: {
  //           email_federationId: {
  //             email: input.email,
  //             federationId: currentOrg.id,
  //           },
  //         },
  //       });

  //       if (existingUser) {
  //         throw new TRPCError({
  //           code: 'CONFLICT',
  //           message: 'User already exists',
  //         });
  //       }

  //       // Verify all permission IDs exist
  //       const permissions = await ctx.db.permission.findMany({
  //         where: {
  //           code: {
  //             in: input.permissions,
  //           },
  //         },
  //         select: {
  //           id: true,
  //         },
  //       });

  //       if (permissions.length !== input.permissions.length) {
  //         throw new TRPCError({
  //           code: 'BAD_REQUEST',
  //           message: 'One or more permission IDs are invalid',
  //         });
  //       }

  //       // Create user with permissions
  //       const user = await ctx.db.user.create({
  //         data: {
  //           ...userData,
  //           password: hashedPassword,
  //           federationId: currentOrg.id,
  //           permissions: {
  //             create: permissions.map((permission) => ({
  //               permissionId: permission.id,
  //             })),
  //           },
  //         },
  //         include: {
  //           permissions: {
  //             include: {
  //               permission: true,
  //             },
  //           },
  //         },
  //       });

  //       return { ...user, password: undefined };
  //     } catch (error: any) {
  //       handleError(error, {
  //         message: 'Failed to create user',
  //         cause: error.message,
  //       });
  //     }
  //   }),

  createFederation: publicProcedure
    .use(validateApiKey())
    .input(createFederationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingOrg = await ctx.db.federation.findUnique({
          where: { domain: input.domain },
        });

        if (existingOrg) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Federation with this domain already exists',
          });
        }

        const federation = await ctx.db.federation.create({
          data: input,
        });

        return federation;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create federation',
        });
      }
    }),
});
