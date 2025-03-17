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
                isActive: true,
                permissions: {
                  include: { permission: true },
                },
                profileType: true,
                profileId: true,
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
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.permissions = user.permissions;
        token.federationId = user.federationId;
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
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
};
