import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface MetricsCardProps {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  label,
  value,
  change,
  trend,
  icon,
}) => {
  // Get the icon component dynamically
  const IconComponent = (Icons as any)[icon] as LucideIcon;

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950';
    if (trend === 'down') return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</p>
            <p className="text-2xl mb-3">{value}</p>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            {IconComponent && <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
