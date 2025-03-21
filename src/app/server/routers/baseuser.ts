import { permissionProtectedProcedure, router } from '@/app/server/trpc';
import { z } from 'zod';
import { PERMISSIONS } from '@/config/permissions';

export const baseUserRouter = router({
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
});
