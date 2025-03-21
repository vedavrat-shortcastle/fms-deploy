'use client';

import { SimpleLineChart } from '@/components/dashboard-components/SimpleLineChart';
import MetricCard from '@/components/dashboard-components/MetricCard';
import VerticalBarChart from '@/components/dashboard-components/VerticalBarChart';
import HorizontalBarChart from '@/components/dashboard-components/HorizontalBarChart';
import { trpc } from '@/utils/trpc';

export default function AdminDashboard() {
  const { data: memberCount, error } = trpc.dashboard.getMemberCount.useQuery();

  if (error) {
    console.error('Error fetching member count:', error);
  }

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-bold mb-6 ml-3">Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Total Members"
              value={String(memberCount)}
              change="+11.01%"
              isPositive={true}
            />
            <MetricCard
              title="Total Arbiters"
              value="3,671"
              change="-0.03%"
              isPositive={false}
            />
            <MetricCard
              title="Total Academies"
              value="156"
              change="+15.03%"
              isPositive={true}
            />
          </div>
          {/* Main content row: Large chart on the left, smaller card on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <div className="lg:col-span-2 bg-white rounded ">
              <h1 className="p-2 text-xl"> Member Growth</h1>
              <SimpleLineChart />
            </div>
            <div className="rounded">
              <VerticalBarChart />
            </div>
          </div>
          {/* Additional row: “Traffic by Website”, “Traffic by Device”, “Traffic by Location” */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="rounded">
              <HorizontalBarChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
