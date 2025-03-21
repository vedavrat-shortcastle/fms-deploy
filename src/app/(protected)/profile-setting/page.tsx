'use client';
import PlayerSettings from '@/components/player-components/playerSetting';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data } = useSession();
  return <div>{data?.user.role == 'PLAYER' && <PlayerSettings />}</div>;
}
