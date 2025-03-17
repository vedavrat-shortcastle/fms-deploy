'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const [profileOnboarded, setProfileOnboarded] = useState<boolean | null>(
    null
  ); // Use `null` initially to handle loading state

  useEffect(() => {
    if (session.status === 'authenticated') {
      // Check if the user profile is onboarded
      setProfileOnboarded(session.data?.user.profileId !== 'PENDING');
    }
  }, [session.data?.user.profileId, session.status]);

  // Handle the different states
  if (session.status === 'loading') {
    // Optionally, show a loading spinner or fallback UI while the session is being fetched
    return <div>Loading...</div>;
  }

  if (session.status === 'authenticated') {
    if (profileOnboarded === null) {
      // Wait for the profileOnboarded state to be set before proceeding
      return null; // You can show a loading spinner here if desired
    }

    if (profileOnboarded) {
      // Render the page content when the user is authenticated and onboarded
      return <section>{children}</section>;
    } else {
      // Redirect to the onboarding page if the user is authenticated but not onboarded
      router.push('/players/onboard-player');
      return null; // Prevent rendering the page until the redirect occurs
    }
  }

  // If not authenticated, redirect to the login page
  router.push('/login');
  return null;
}
