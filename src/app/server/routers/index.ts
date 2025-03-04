import { superUserRouter } from '@/app/server/routers/superUser';
import { router } from '@/app/server/trpc';

export const appRouter = router({
  superUser: superUserRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
