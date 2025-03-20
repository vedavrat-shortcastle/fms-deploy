'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
// All the imports

export default function VerticalBarChart() {
  // Sample data for now, replace with an api call.
  // https://claude.ai/share/15cad61f-a27d-4ded-8690-5e72a6dc6d55
  const data = [
    { name: 'Google', value: 75 },
    { name: 'YouTube', value: 60 },
    { name: 'Instagram', value: 45 },
    { name: 'Pinterest', value: 30 },
    { name: 'Facebook', value: 50 },
    { name: 'Twitter', value: 35 },
  ];

  return (
    <Card className="w-full border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Traffic by Website
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barSize={2}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 14,
                  fontWeight: 500,
                  fill: '#000000',
                }}
                width={80}
              />
              <Bar
                dataKey="value"
                fill="#000000"
                radius={0}
                background={{ fill: 'transparent' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
