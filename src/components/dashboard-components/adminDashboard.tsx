// src/app/(protected)/admin-dashboard/AdminDashboard.tsx
'use client';

import { useTranslation } from 'react-i18next';
import MetricCard from '@/components/dashboard-components/MetricCard';
import DonutChart from '@/components/dashboard-components/DonutChart';
import MembersGrowthChart from '@/components/dashboard-components/MemberGrowthChart';
import {
  GraduationCap,
  PersonStanding,
  Store,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react';

const dummyMetricData = [
  { value: '80', cardColor: '#E9FBEF', icon: <UserCheck size={32} /> },
  { value: '100', cardColor: '#FFE6E9', icon: <Users size={32} /> },
  { value: '30', cardColor: '#FEF9E6', icon: <PersonStanding size={32} /> },
  { value: '50', cardColor: '#F3EBFA', icon: <UserRound size={32} /> },
  { value: '20', cardColor: '#FEFFD7', icon: <GraduationCap size={32} /> },
  { value: '8', cardColor: '#E9FFE3', icon: <Store size={32} /> },
];

export default function AdminDashboard() {
  const { t, i18n } = useTranslation('common');
  const direction = i18n.dir();

  const metricTitles = [
    t('activeMembers'),
    t('allTimeMembers'),
    t('activeArbiters'),
    t('allTimeArbiters'),
    t('totalSchools'),
    t('totalClubs'),
  ];

  const metricsWithTitles = dummyMetricData.map((metric, index) => ({
    ...metric,
    title: metricTitles[index],
  }));

  return (
    <div
      className={`flex min-h-svh ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
    >
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 ms-3">{t('overview')}</h1>
        <div
          className={`flex flex-wrap gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          {metricsWithTitles.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-6">
          <div className="lg:col-span-2 bg-white rounded">
            <h1 className="p-2 text-xl font-bold text-start">
              {t('memberGrowth')}
            </h1>
            <MembersGrowthChart />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6">
          <div className="lg:col-span-1 bg-white rounded mt-10">
            <DonutChart />
          </div>
          <div className="lg:col-span-1 bg-white rounded">
            <h1 className="p-2 text-xl font-bold text-start">
              {t('memberGrowth')}
            </h1>
            <MembersGrowthChart />
          </div>
        </div>
      </div>
    </div>
  );
}
