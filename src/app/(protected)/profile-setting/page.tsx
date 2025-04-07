'use client';
import PlayerProfile from '@/components/player-components/Profile';
import ParentSettings from '@/components/player-components/ParentSettings';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import AdminSettings from '@/components/player-components/AdminSetting';
import ClubManagerSettings from '@/components/player-components/ClubManagerSetting';

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

  if (data?.user.role === 'FED_ADMIN') {
    return <AdminSettings />;
  }

  if (data?.user.role === 'CLUB_MANAGER') {
    return <ClubManagerSettings />;
  }

  return <div>{t('profilePage_noRoleFound')}</div>;
}
