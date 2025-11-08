import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { getDonationsData } from '../lib/mockData';

export const RevenueChart: React.FC = () => {
  const { selectedEntity, timePeriod, theme } = useApp();
  const data = getDonationsData(selectedEntity, timePeriod);

  const chartConfig = {
    stroke: theme === 'dark' ? '#60A5FA' : '#3B82F6',
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    text: theme === 'dark' ? '#9CA3AF' : '#6B7280',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Trends</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monthly donations over the past 10 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[16/9] md:aspect-[21/9] min-h-[280px] md:min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.grid} />
              <XAxis
                dataKey="month"
                stroke={chartConfig.text}
                tick={{ fill: chartConfig.text, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke={chartConfig.text}
                tick={{ fill: chartConfig.text, fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${chartConfig.grid}`,
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: chartConfig.text, fontWeight: 500 }}
                itemStyle={{ color: chartConfig.stroke }}
                formatter={(value: number) => [`${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Donations']}
                cursor={{ strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="donations"
                stroke={chartConfig.stroke}
                strokeWidth={2}
                dot={{ fill: chartConfig.stroke, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
