'use client';
import PlayerProfile from '@/components/player-components/Profile';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data } = useSession();
  return <div>{data?.user.role == 'PLAYER' && <PlayerProfile />}</div>;
}
