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
    if (status === 'loading' || !session || profileOnboarded === null) return;

    const isParent = session.user.role === 'PARENT';
    const isOnParentOnboarding = pathname === '/players/onboard-parent';
    const isOnPlayerOnboarding = pathname === '/players/onboard-player';

    if (profileOnboarded === false) {
      if (isParent && !isOnParentOnboarding) {
        router.push('/players/onboard-parent');
      } else if (!isParent && !isOnPlayerOnboarding) {
        router.push('/players/onboard-player');
      }
    } else if (
      session.user.role !== 'FED_ADMIN' &&
      pathname === '/admin-dashboard'
    ) {
      router.push('/'); //TODO : add a common page
    }
  }, [session, status, pathname, router, profileOnboarded]);

  if (status === 'loading' || profileOnboarded === null) {
    return (
      <div className="w-full min-h-svh flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Render children if onboarded or on onboarding pages
  if (
    profileOnboarded ||
    pathname === '/players/onboard-player' ||
    pathname === '/players/onboard-parent'
  ) {
    return <>{children}</>;
  }

  // Fallback to loader if not onboarded and not on onboarding pages (should ideally not happen due to redirects)
  return <Loader />;
};
