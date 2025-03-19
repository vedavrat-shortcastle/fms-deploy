import Loader from '@/components/Loader';
import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
// All the imports

// Sample data for now, replace with an api call.
const sampleData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 28 },
  { name: 'Apr', value: 60 },
  { name: 'May', value: 40 },
  { name: 'Jun', value: 70 },
  { name: 'Jul', value: 50 },
  { name: 'Aug', value: 80 },
];

export function SimpleLineChart() {
  const [isLoading, setIsLoading] = useState(false); // Set it "true" while making an api call.

  // Just for testing purpose, remove later.
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulating API call delay
  }, []);

  // Set the state to true while making a api call
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] w-full">
        <Loader />;
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sampleData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
          />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '8px' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
