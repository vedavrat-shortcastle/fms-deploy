import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { trpc } from '@/utils/trpc';

const MembersGrowthChart = () => {
  const { t } = useTranslation('dashboard');

  const [data, setData] = React.useState<
    { month: string; members: number }[] | undefined
  >(undefined);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [activeRange, setActiveRange] = React.useState<
    'thisMonth' | 'last3Months' | 'last6Months' | 'last12Months'
  >('last12Months');

  const now = new Date();
  const initialEndDate = new Date(now);
  const initialStartDate = new Date(now);
  initialStartDate.setMonth(now.getMonth() - 12);

  React.useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, []);

  trpc.dashboard.getMemberGrowth.useQuery(
    startDate && endDate
      ? { startDate, endDate }
      : { startDate: initialStartDate, endDate: initialEndDate },
    {
      enabled: !!startDate && !!endDate,
      onSuccess: (data) => {
        setData(data);
      },
      onError: (err) => {
        console.error('Failed to fetch member growth:', err);
      },
    }
  );

  const handleThisMonth = () => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(1);
    setStartDate(start);
    setEndDate(end);
    setActiveRange('thisMonth');
  };

  const handleLast3Months = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 3);
    setStartDate(start);
    setEndDate(end);
    setActiveRange('last3Months');
  };

  const handleLast6Months = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 6);
    setStartDate(start);
    setEndDate(end);
    setActiveRange('last6Months');
  };

  const handleLast12Months = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 12);
    setStartDate(start);
    setEndDate(end);
    setActiveRange('last12Months');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{t('membersGrowth')}</CardTitle>
        </div>
        <div className="flex space-x-2 text-sm">
          <Button
            size="sm"
            variant={activeRange === 'thisMonth' ? 'destructive' : 'outline'}
            className={`rounded-full h-8 ${
              activeRange === 'thisMonth' ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
            onClick={handleThisMonth}
          >
            {t('thisMonth')}
          </Button>
          <Button
            size="sm"
            variant={activeRange === 'last3Months' ? 'destructive' : 'outline'}
            className={`rounded-full h-8 ${
              activeRange === 'last3Months' ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
            onClick={handleLast3Months}
          >
            {t('last3Months')}
          </Button>
          <Button
            size="sm"
            variant={activeRange === 'last6Months' ? 'destructive' : 'outline'}
            className={`rounded-full h-8 ${
              activeRange === 'last6Months' ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
            onClick={handleLast6Months}
          >
            {t('last6Months')}
          </Button>
          <Button
            size="sm"
            variant={activeRange === 'last12Months' ? 'destructive' : 'outline'}
            className={`rounded-full h-8 ${
              activeRange === 'last12Months'
                ? 'bg-red-500 hover:bg-red-600'
                : ''
            }`}
            onClick={handleLast12Months}
          >
            {t('last12Months')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={30}
              barGap={2}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                dataKey="members"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 200]}
                ticks={[0, 50, 100, 150, 200]}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              />
              <Bar
                dataKey="members"
                fill="#FF6B6B"
                radius={[10, 10, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersGrowthChart;
