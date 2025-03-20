// import { clubRouter } from '@/app/server/routers/club';
import { dashboardRouter } from '@/app/server/routers/dashboard';
import { federationRouter } from '@/app/server/routers/federation';
import { playerRouter } from '@/app/server/routers/player';
import { superUserRouter } from '@/app/server/routers/super-user';
import { router } from '@/app/server/trpc';

export const appRouter = router({
  superUser: superUserRouter,
  player: playerRouter,
  // club: clubRouter,
  federation: federationRouter,
  dashboard: dashboardRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
