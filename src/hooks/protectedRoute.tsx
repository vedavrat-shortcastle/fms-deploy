'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, ReactNode } from 'react';
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
  const pathname = usePathname();
  const [profileOnboarded, setProfileOnboarded] = useState<boolean | null>(
    null
  );

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
        return;
      }
    }

    setProfileOnboarded(session.user.profileId !== session.user.id);
  }, [session, status, requiredPermission, router]);

  useEffect(() => {
    if (profileOnboarded === false) {
      if (
        session?.user.role === 'PARENT' &&
        pathname !== '/players/onboard-parent'
      ) {
        router.push('/players/onboard-parent');
      } else if (
        session?.user.role !== 'PARENT' &&
        pathname !== '/players/onboard-player'
      ) {
        router.push('/players/onboard-player');
      }
    }
  }, [profileOnboarded, router, pathname, session?.user.role]);

  useEffect(() => {
    if (session?.user.role !== 'FED_ADMIN' && pathname == '/admin-dashboard') {
      router.push('/'); //TODO : add a common page
    }
  });

  if (status === 'loading' || profileOnboarded === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (
    profileOnboarded ||
    pathname === '/players/onboard-player' ||
    pathname === '/players/onboard-parent'
  ) {
    return <>{children}</>;
  }

  return <Loader />;
};
