'use client';

import Loader from '@/components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function HorizontalBarChart() {
  const [isLoading, setIsLoading] = useState(false); // Set the state to true while making a api call

  // Just for testing purpose, remove later.
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulating API call delay
  }, []);

  // Sample data for now, replace with api call later.
  const data = [
    { name: 'Linux', value: 17000, color: '#8884d8' },
    { name: 'Mac', value: 28000, color: '#4ecdc4' },
    { name: 'iOS', value: 21000, color: '#000000' },
    { name: 'Windows', value: 30000, color: '#82b1ff' },
    { name: 'Android', value: 13000, color: '#b3e5fc' },
    { name: 'Other', value: 24000, color: '#a5d6a7' },
  ];

  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    if (value === 10000) return '10K';
    if (value === 20000) return '20K';
    if (value === 30000) return '30K';
    return '';
  };
  // Set the state to true while making a api call
  if (isLoading) {
    return (
      <div className="flex justify-center h-full w-full">
        <Loader />;
      </div>
    );
  }

  return (
    <Card className="w-full bg-gray-50 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Traffic by Device
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
              barSize={30}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.1}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={formatYAxis}
                domain={[0, 30000]}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                formatter={(value) => [`${value.toLocaleString()}`, 'Traffic']}
              />
              {data.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="value"
                  fill={entry.color}
                  radius={[4, 4, 4, 4]}
                  name={entry.name}
                  data={[entry]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
