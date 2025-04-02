'use client';
import PlayerProfile from '@/components/player-components/Profile';
import ParentSettings from '@/components/player-components/ParentSettings';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { data, status } = useSession();
  const { t } = useTranslation();

  if (status === 'loading') {
    return <div>{t('profilePage_loading')}</div>;
  }

  if (data?.user.role === 'PLAYER') {
    return <PlayerProfile />;
  }

  if (data?.user.role === 'PARENT') {
    return <ParentSettings />;
  }

  return <div>{t('profilePage_noRoleFound')}</div>;
}
