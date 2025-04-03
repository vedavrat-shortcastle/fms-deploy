import type { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { verifyPassword } from '@/utils/encoder';

export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        domain: { label: 'Domain', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const federation = await db.federation.findFirst({
          where: { domain: credentials.domain },
          select: { id: true },
        });

        if (!federation) return null;

        const baseUser = await db.baseUser.findUnique({
          where: {
            email_federationId: {
              email: credentials.email,
              federationId: federation.id,
            },
          },
          include: {
            profile: {
              select: {
                userStatus: true,
                permissions: {
                  include: { permission: true },
                },
                profileType: true,
                profileId: true,
                language: true,
                isRtl: true,
              },
            },
          },
        });

        if (!baseUser) return null;

        const isValid = await verifyPassword(
          credentials.password,
          baseUser.password
        );
        if (!isValid) return null;

        return {
          id: baseUser.id,
          federationId: baseUser.federationId || '',
          email: baseUser.email,
          role: baseUser.role,
          firstName: baseUser.firstName,
          lastName: baseUser.lastName,
          permissions:
            baseUser.profile?.permissions.map((p) => p.permission) || [],
          profileId: baseUser.profile?.profileId || baseUser.id,
          language: baseUser.profile?.language || 'en',
          isRtl: baseUser.profile?.isRtl ?? false,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.permissions = user.permissions;
        token.federationId = user.federationId;
        token.profileId = user.profileId;
        token.language = user.language;
        token.isRtl = user.isRtl;
      }
      if (trigger === 'update' && session?.user) {
        token.profileId = session.user.profileId;
        token.language = session.user.language;
        token.isRtl = session.user.isRtl;
      }
      return token;
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.federationId = token.federationId;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.permissions = token.permissions;
        session.user.profileId = token.profileId;
        session.user.language = token.language;
        session.user.isRtl = token.isRtl;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
};
