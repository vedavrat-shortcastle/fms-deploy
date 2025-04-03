import { protectedProcedure, router } from '@/app/server/trpc';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  getAdminDetails: protectedProcedure.query(async ({ ctx }) => {
    const userRole = ctx.session.user.role;
    if (userRole !== 'FED_ADMIN') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const adminDetails = await ctx.db.baseUser.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        middleName: true,
        nameSuffix: true,
        profile: {
          select: {
            language: true,
          },
        },
      },
    });
    if (!adminDetails) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return { ...adminDetails, language: adminDetails.profile?.language };
  }),
});
