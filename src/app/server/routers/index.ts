// import { clubRouter } from '@/app/server/routers/club';
import { dashboardRouter } from '@/app/server/routers/dashboard';
import { federationRouter } from '@/app/server/routers/federation';
import { playerRouter } from '@/app/server/routers/player';
import { superUserRouter } from '@/app/server/routers/super-user';

import { uploadRouter } from '@/app/server/routers/upload';
import { router } from '@/app/server/trpc';
import { membershipRouter } from './membership';
import { parentRouter } from '@/app/server/routers/parent';
import { paymentRouter } from '@/app/server/routers/payment';
import { authRouter } from '@/app/server/routers/auth';
import { configRouter } from '@/app/server/routers/configFields';
import { userRouter } from '@/app/server/routers/user';
import { clubRouter } from '@/app/server/routers/club';

export const appRouter = router({
  superUser: superUserRouter,
  player: playerRouter,
  federation: federationRouter,
  parent: parentRouter,
  dashboard: dashboardRouter,
  membership: membershipRouter,
  upload: uploadRouter,
  payment: paymentRouter,
  auth: authRouter,
  config: configRouter,
  user: userRouter,
  club: clubRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
