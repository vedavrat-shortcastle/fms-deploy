'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOnboarded, setProfileOnboarded] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (session.status === 'authenticated') {
      setProfileOnboarded(
        session.data?.user.profileId !== session.data?.user.id
      );
    }
  }, [session.data?.user.profileId, session.status]);

  useEffect(() => {
    if (
      session.status === 'authenticated' &&
      profileOnboarded === false &&
      pathname !== '/players/onboard-player'
    ) {
      router.push('/players/onboard-player');
    } else if (session.status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session.status, profileOnboarded, router, pathname]);

  // Handle loading states
  if (session.status === 'loading' || profileOnboarded === null) {
    return <div>Loading...</div>;
  }

  // Allow rendering children for onboarding page or when user is authenticated and onboarded
  if (
    session.status === 'authenticated' &&
    (profileOnboarded || pathname === '/players/onboard-player')
  ) {
    return <section>{children}</section>;
  }

  // Return loading state while redirects are happening
  return <div>Loading...</div>;
}
