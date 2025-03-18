'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { checkPermission } from '@/utils/auth';
import Loader from '@/components/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({
  children,
  requiredPermission,
}: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requiredPermission) {
      const hasPermission = checkPermission(
        session.user.permissions.map((p) => p.code),
        requiredPermission
      );

      if (!hasPermission) {
        router.push('/403');
      }
    }
  }, [session, status, requiredPermission, router]);

  if (status === 'loading') {
    return  <Loader/>;
  }

  return <>{children}</>;
};
