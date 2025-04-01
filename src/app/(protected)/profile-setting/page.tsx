'use client';
import PlayerProfile from '@/components/player-components/Profile';
import ParentSettings from '@/components/player-components/ParentSettings';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (data?.user.role === 'PLAYER') {
    return <PlayerProfile />;
  }

  if (data?.user.role === 'PARENT') {
    return <ParentSettings />;
  }

  return <div>No valid role found</div>;
}
