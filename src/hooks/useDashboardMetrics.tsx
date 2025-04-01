// hooks/useDashboardMetrics.ts
import {
  GraduationCap,
  PersonStanding,
  Store,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { MetricCardProps } from '@/components/dashboard-components/MetricCard';
import { useMemo } from 'react';

const baseMetricsCardData: Omit<MetricCardProps, 'value' | 'icon'>[] = [
  {
    title: 'Active Members',
    cardColor: '#E9FBEF',
  },
  {
    title: 'All-time Members',
    cardColor: '#FFE6E9',
  },
  {
    title: 'Active Arbiters',
    cardColor: '#FEF9E6',
  },
  {
    title: 'All-time Arbiters',
    cardColor: '#F3EBFA',
  },
  {
    title: 'Total Schools',
    cardColor: '#FEFFD7',
  },
  {
    title: 'Total Clubs',
    cardColor: '#E9FFE3',
  },
];

const iconMap = {
  'Active Members': <UserCheck size={32} />,
  'All-time Members': <Users size={32} />,
  'Active Arbiters': <PersonStanding size={32} />,
  'All-time Arbiters': <UserRound size={32} />,
  'Total Schools': <GraduationCap size={32} />,
  'Total Clubs': <Store size={32} />,
};

function useDashboardMetrics(): MetricCardProps[] {
  const { data: totalMembers } = trpc.dashboard.getMemberCount.useQuery();
  const { data: activeMembers } =
    trpc.dashboard.getActiveMemberCount.useQuery();

  const metricsCardData: MetricCardProps[] = useMemo(() => {
    return baseMetricsCardData.map((item) => {
      let value: string = 'N/A';
      if (item.title === 'All-time Members' && totalMembers !== undefined) {
        value = totalMembers.toString();
      } else {
        // Add logic here to fetch other dynamic values if needed
        switch (item.title) {
          case 'Active Members':
            value = activeMembers?.toString() ?? 'N/A';
            break;
          case 'Active Arbiters':
            value = '30';
            break;
          case 'All-time Arbiters':
            value = '50';
            break;
          case 'Total Schools':
            value = '20';
            break;
          case 'Total Clubs':
            value = '8';
            break;
        }
      }
      return {
        ...item,
        value,
        icon: iconMap[item.title as keyof typeof iconMap],
      };
    });
  }, [totalMembers]);

  return metricsCardData;
}

export default useDashboardMetrics;
