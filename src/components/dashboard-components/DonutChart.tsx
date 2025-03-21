import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MembersByRegionChart = () => {
  // Data for the donut chart (regions)
  const regionData = [
    { name: 'Auckland', value: 30, color: '#FF7A7A' },
    { name: 'Wellington', value: 25, color: '#FF0000' },
    { name: 'Christchurch', value: 15, color: '#B22222' },
    { name: 'Hamilton', value: 10, color: '#3B0000' },
  ];

  // Render custom dot for legend
  const renderColorDot = (color: string) => (
    <div
      className="w-2 h-2 rounded-full mr-2"
      style={{ backgroundColor: color }}
    ></div>
  );

  return (
    <Card className="w-full h-full shadow-none border rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-2xl font-bold">
          Total Members
          <br />
          By Regions
        </CardTitle>
        <div className="text-xs text-gray-500 border rounded-md px-3 py-1 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Jan 20, 2024 to Feb 20, 2025
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-center">
          <div className="w-50 h-50">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={0}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}`, 'Members']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 ml-6">
            <div className="flex justify-between mb-2 text-md font-bold">
              <div>Regions</div>
              <div>Members</div>
            </div>
            {regionData.map((region, index) => (
              <div key={index} className="flex justify-between mb-3 text-md">
                <div className="flex items-center">
                  {renderColorDot(region.color)}
                  {region.name}
                </div>
                <div>{region.value}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersByRegionChart;
