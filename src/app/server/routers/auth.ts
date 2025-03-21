import {
  permissionProtectedProcedure,
  publicProcedure,
  router,
} from '@/app/server/trpc';
import { z } from 'zod';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { signupMemberSchema } from '@/schemas/Player.schema';
import { TRPCError } from '@trpc/server';
import { hashPassword } from '@/utils/encoder';
import { getProfileByRole } from '@/config/roleTable';
import { handleError } from '@/utils/errorHandler';

export const authRouter = router({
  updatePassword: permissionProtectedProcedure(PERMISSIONS.PLAYER_UPDATE)
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { oldPassword, newPassword } = input;

      // Verify the old password
      const user = await ctx.db.baseUser.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (user?.password !== oldPassword) {
        throw new Error('Old password is incorrect');
      }

      // Logic to update the user's password
      await ctx.db.baseUser.update({
        where: { id: user.id },
        data: { password: newPassword },
      });
    }),

  signup: publicProcedure
    .input(signupMemberSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { domain, ...data } = input;
        const currentFederation = await ctx.db.federation.findFirst({
          where: { domain },
          select: { id: true },
        });

        if (!currentFederation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Federation not found',
          });
        }

        const existingUser = await ctx.db.baseUser.findUnique({
          where: {
            email_federationId: {
              email: input.email,
              federationId: currentFederation.id,
            },
          },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        const hashedPassword = await hashPassword(input.password);

        // Wrap creation operations in a transaction
        const result = await ctx.db.$transaction(async (tx) => {
          const newBaseUser = await tx.baseUser.create({
            data: {
              ...data,
              password: hashedPassword,
              federation: {
                connect: { id: currentFederation.id },
              },
            },
          });

          const profileType = getProfileByRole(data.role);

          const newUserProfile = await tx.userProfile.create({
            data: {
              profileType,
              profileId: newBaseUser.id,
              baseUser: {
                connect: { id: newBaseUser.id },
              },
              userStatus: 'INACTIVE',
            },
          });

          const playerPermissions = await tx.permission.findMany({
            where: {
              code: {
                in: roleMap[data.role],
              },
            },
            select: {
              id: true,
            },
          });

          await tx.userPermission.createMany({
            data: playerPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          return { ...newBaseUser, newUserProfile };
        });

        return { ...result, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to sign up player',
          cause: error.message,
        });
      }
    }),
});
