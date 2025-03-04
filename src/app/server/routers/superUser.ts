import { hashPassword } from '@/utils/encoder';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router, validateApiKey } from '@/app/server/trpc';
import { createUserSchema } from '@/schemas/user.schema';
import { createPermissionSchema } from '@/schemas/permission.schema';
import { handleError } from '@/utils/errorHandler';

export const superUserRouter = router({
  createPermission: publicProcedure
    .use(validateApiKey())
    .input(createPermissionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('input', input);
        const existingPermission = await ctx.db.permission.findFirst({
          where: {
            OR: [{ name: input.name }, { code: input.code }],
          },
        });

        if (existingPermission) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Permission with this name or code already exists',
          });
        }

        const permission = await ctx.db.permission.create({
          data: input,
        });

        return permission;
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

        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
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
            id: {
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
        console.log('input', input);
        // Create user with permissions
        const user = await ctx.db.user.create({
          data: {
            ...input,
            password: hashedPassword,
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
        console.log('error', error.message);
        handleError(error, {
          message: 'Failed to create user',
          cause: error.message,
        });
      }
    }),
});
