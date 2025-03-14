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

        const org = await db.organization.findFirst({
          where: { domain: credentials.domain },
          select: { id: true },
        });

        if (!org) return null;

        const user = await db.user.findUnique({
          where: {
            email_organizationId: {
              email: credentials.email,
              organizationId: org.id,
            },
          },
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

        if (!user) return null;

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          orgId: user.organizationId || '',
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          permissions: user.permissions.map((p) => p.permission),
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
        token.orgId = user.orgId;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.orgId = token.orgId;
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
