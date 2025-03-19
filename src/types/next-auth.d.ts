import { Permission, Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      federationId: string;
      email: string;
      role: Role;
      firstName: string;
      lastName: string;
      permissions: Permission[];
      profileId?: string;
    };
  }

  interface User {
    id: string;
    federationId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    permissions: Permission[];
    profileId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    federationId: string;
    role: Role;
    firstName: string;
    lastName: string;
    permissions: Permission[];
    profileId?: string;
  }
}
