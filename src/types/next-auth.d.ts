import { Permission, Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      orgId: string;
      email: string;
      role: Role;
      firstName: string;
      lastName: string;
      permissions: Permission[];
    };
  }

  interface User {
    id: string;
    orgId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    permissions: Permission[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    orgId: string;
    role: Role;
    firstName: string;
    lastName: string;
    permissions: Permission[];
  }
}
