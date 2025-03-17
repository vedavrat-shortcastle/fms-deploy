import { authConfig } from '@/app/server/authConfig';
import { db } from '@/lib/db';
import { checkPermission } from '@/utils/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';

export const createContext = async (opts: { req: Request }) => {
  const session = await getServerSession(authConfig);

  return {
    db,
    session,
    req: opts.req,
    // Add any other context items here
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

// Base middleware to check if user is authenticated
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

// Middleware to check specific permissions
const hasPermission = (permission: string) => {
  return t.middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    console.log('permissions', ctx.session.user.permissions);
    const hasRequired = checkPermission(
      ctx.session.user.permissions.map((p) => p.code),
      permission
    );

    if (!hasRequired) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({
      ctx: {
        session: ctx.session,
      },
    });
  });
};

export const validateApiKey = () => {
  return t.middleware(({ ctx, next }) => {
    const apiKey = ctx.req.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.SUPER_USER_API_KEY) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid API key',
      });
    }

    return next();
  });
};

export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const permissionProtectedProcedure = (permission: string) =>
  t.procedure.use(isAuthed).use(hasPermission(permission));
