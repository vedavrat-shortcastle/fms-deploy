import { db } from '@/lib/db';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const createContext = async () => {
  return {
    db,
    // Add any other context items here
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;

export const router = t.router;
export const procedure = t.procedure;
