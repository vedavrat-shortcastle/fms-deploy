import { clubRouter } from '@/app/server/routers/club';
import { memberRouter } from '@/app/server/routers/member';
import { superUserRouter } from '@/app/server/routers/superUser';
import { router } from '@/app/server/trpc';

export const appRouter = router({
  superUser: superUserRouter,
  member: memberRouter,
  club: clubRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
