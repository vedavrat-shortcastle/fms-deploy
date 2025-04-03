import { protectedProcedure, router } from '@/app/server/trpc';
import { SupportedLanguages } from '@prisma/client';
import i18next from 'i18next';
import { z } from 'zod';

export const userRouter = router({
  updateLanguage: protectedProcedure
    .input(
      z.object({
        language: z.string(), // Expecting a string language code like 'en', 'fr', etc.
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userProfile = await ctx.db.userProfile.findUnique({
        where: {
          baseUserId: ctx.session.user.id,
        },
      });

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      const dir = i18next.dir(input.language) === 'rtl' ? true : false;

      const updatedUser = await ctx.db.userProfile.update({
        where: {
          baseUserId: ctx.session.user.id,
        },
        data: {
          language: input.language as SupportedLanguages,
          isRtl: dir,
        },
      });

      return updatedUser;
    }),
});
