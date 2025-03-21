// import { clubRouter } from '@/app/server/routers/club';
import { dashboardRouter } from '@/app/server/routers/dashboard';
import { federationRouter } from '@/app/server/routers/federation';
import { playerRouter } from '@/app/server/routers/player';
import { superUserRouter } from '@/app/server/routers/super-user';

import { uploadRouter } from '@/app/server/routers/upload';
import { router } from '@/app/server/trpc';
import { membershipRouter } from './membership';
import { parentRouter } from '@/app/server/routers/parent';
import { authRouter } from '@/app/server/routers/auth';

export const appRouter = router({
  superUser: superUserRouter,
  player: playerRouter,
  // club: clubRouter,
  federation: federationRouter,
  parent: parentRouter,
  dashboard: dashboardRouter,
  membership: membershipRouter,
  upload: uploadRouter,
  authRouter: authRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
