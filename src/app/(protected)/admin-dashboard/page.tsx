'use client';

import MembersGrowthChart from '@/components/dashboard-components/MemberGrowthChart';
import MetricCard, {
  MetricCardProps,
} from '@/components/dashboard-components/MetricCard';
import {
  GraduationCap,
  PersonStanding,
  Store,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react';

const dummyMetricData: MetricCardProps[] = [
  {
    title: 'Active Members',
    value: '80',
    cardColor: '#E9FBEF',
    icon: <UserCheck size={32} />,
  },
  {
    title: 'All-time Members',
    value: '100',
    cardColor: '#FFE6E9',
    icon: <Users size={32} />,
  },
  {
    title: 'Active Arbiters',
    value: '30',
    cardColor: '#FEF9E6',
    icon: <PersonStanding size={32} />,
  },
  {
    title: 'All-time Arbiters',
    value: '50',
    cardColor: '#F3EBFA',
    icon: <UserRound size={32} />,
  },
  {
    title: 'Total Schools',
    value: '20',
    cardColor: '#FEFFD7',
    icon: <GraduationCap size={32} />,
  },
  {
    title: 'Total Clubs',
    value: '8',
    cardColor: '#E9FFE3',
    icon: <Store size={32} />,
  },
];
export default function AdminDashboard() {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-bold mb-6 ml-3">Overview</h1>
          <div className="flex flex-wrap gap-4">
            {dummyMetricData.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>
          {/* Main content row: Large chart on the left, smaller card on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-6">
            <div className="lg:col-span-2 bg-white rounded ">
              <h1 className="p-2 text-xl font-bold"> Member Growth</h1>
              <MembersGrowthChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
