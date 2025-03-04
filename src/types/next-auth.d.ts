import { Permission, Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
      firstName: string;
      lastName: string;
      permissions: Permission[];
    };
  }

  interface User {
    id: string;
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
    role: Role;
    firstName: string;
    lastName: string;
    permissions: Permission[];
  }
}
