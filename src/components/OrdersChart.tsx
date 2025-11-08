import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { getOrdersData } from '../lib/mockData';

export const OrdersChart: React.FC = () => {
  const { selectedEntity, theme } = useApp();
  const data = getOrdersData(selectedEntity);

  const chartConfig = {
    pending: theme === 'dark' ? '#FBBF24' : '#F59E0B',
    processing: theme === 'dark' ? '#60A5FA' : '#3B82F6',
    delivered: theme === 'dark' ? '#34D399' : '#10B981',
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    text: theme === 'dark' ? '#9CA3AF' : '#6B7280',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Order distribution by status over the past 4 weeks
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.grid} />
              <XAxis
                dataKey="week"
                stroke={chartConfig.text}
                tick={{ fill: chartConfig.text }}
              />
              <YAxis
                stroke={chartConfig.text}
                tick={{ fill: chartConfig.text }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${chartConfig.grid}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: chartConfig.text }}
              />
              <Legend
                wrapperStyle={{ color: chartConfig.text }}
              />
              <Bar dataKey="pending" stackId="a" fill={chartConfig.pending} name="Pending" radius={[0, 0, 0, 0]} />
              <Bar dataKey="processing" stackId="a" fill={chartConfig.processing} name="Processing" radius={[0, 0, 0, 0]} />
              <Bar dataKey="delivered" stackId="a" fill={chartConfig.delivered} name="Delivered" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
