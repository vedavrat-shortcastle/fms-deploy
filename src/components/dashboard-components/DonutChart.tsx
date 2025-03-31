import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { useMemo } from 'react';

interface RegionData {
  name: string;
  value: number;
  color: string;
}

const DonutChart = () => {
  const {
    data: memberCountByRegion,
    isLoading,
    isError,
  } = trpc.dashboard.getMemberCountByRegion.useQuery();

  // Define a color palette for the regions
  const regionColors = useMemo(() => {
    if (!memberCountByRegion) {
      return {};
    }
    const colors: Record<string, string> = {};
    const baseColors = [
      '#FF7A7A',
      '#FF0000',
      '#B22222',
      '#3B0000',
      '#0088FE',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#800080', // Add a 9th color
      '#A9A9A9', // Color for 'Others'
    ]; // Add more colors as needed
    const sortedRegions = [...memberCountByRegion].sort(
      (a, b) => b.value - a.value
    );
    const topNine = sortedRegions.slice(0, 9);

    topNine.forEach((region, index) => {
      colors[region.name] = baseColors[index % (baseColors.length - 1)]; // Cycle through first 9 colors
    });
    colors['Others'] = baseColors[9 % baseColors.length]; // Assign the 10th color to 'Others'
    return colors;
  }, [memberCountByRegion]);

  const processedData: RegionData[] = useMemo(() => {
    if (!memberCountByRegion) {
      return [];
    }

    const sortedRegions = [...memberCountByRegion].sort(
      (a, b) => b.value - a.value
    );
    const topNine = sortedRegions.slice(0, 9);
    const remainingRegions = sortedRegions.slice(9);

    let othersValue = 0;
    remainingRegions.forEach((region) => {
      othersValue += region.value;
    });

    const finalData: RegionData[] = topNine.map((region) => ({
      name: region.name,
      value: region.value,
      color: regionColors[region.name] || '#8884d8',
    }));

    if (remainingRegions.length > 0) {
      finalData.push({
        name: 'Others',
        value: othersValue,
        color: regionColors['Others'] || '#8884d8',
      });
    }

    return finalData;
  }, [memberCountByRegion, regionColors]);

  // Render custom dot for legend
  const renderColorDot = (color: string) => (
    <div
      className="w-2 h-2 rounded-full mr-2"
      style={{ backgroundColor: color }}
    ></div>
  );

  if (isLoading) {
    return (
      <Card className="w-full h-full shadow-none border rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-2xl font-bold">
            Total Members
            <br />
            By Regions
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-center h-full">
            Loading region data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full h-full shadow-none border rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-2xl font-bold">
            Total Members
            <br />
            By Regions
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-center h-full">
            Error loading region data.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full shadow-none border rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-2xl font-bold">
          Total Members
          <br />
          By Regions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-center">
          <div className="w-60 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={0}
                >
                  {processedData.map((entry, index) => (
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
            {processedData.map((region, index) => (
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

export default DonutChart;
