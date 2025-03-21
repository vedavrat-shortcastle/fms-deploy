import React from 'react';
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

const MembersGrowthChart = () => {
  // Sample data matching the provided chart
  const data = [
    { month: 'Jan', members: 50 },
    { month: 'Feb', members: 75 },
    { month: 'Mar', members: 105 },
    { month: 'Apr', members: 80 },
    { month: 'May', members: 35 },
    { month: 'Jun', members: 65 },
    { month: 'Jul', members: 75 },
    { month: 'Aug', members: 50 },
    { month: 'Sep', members: 20 },
    { month: 'Oct', members: 70 },
    { month: 'Nov', members: 55 },
    { month: 'Dec', members: 75 },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Members Growth</CardTitle>
        </div>
        <div className="flex space-x-2 text-sm">
          <Button size="sm" variant="outline" className="rounded-full h-8">
            This Month
          </Button>
          <Button size="sm" variant="outline" className="rounded-full h-8">
            Last 6 Months
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-full h-8 bg-red-500 hover:bg-red-600"
          >
            Last 12 Months
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
