'use client';

import DonutChart from '@/components/dashboard-components/DonutChart';
import MembersGrowthChart from '@/components/dashboard-components/MemberGrowthChart';
import MetricCard from '@/components/dashboard-components/MetricCard';
import useDashboardMetrics from '@/hooks/useDashboardMetrics';

export default function AdminDashboard() {
  const metricsCardData = useDashboardMetrics();
  return (
    <>
      <div className="flex min-h-svh">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6 ml-3">Overview</h1>
          <div className="flex flex-wrap gap-4">
            {metricsCardData.map((metric) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6">
            <div className="lg:col-span-1 bg-white rounded mt-10 ">
              <DonutChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
