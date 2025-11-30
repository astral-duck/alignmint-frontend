import React from 'react';
import { RefreshCw, PieChart, Clock, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PageHeader } from './PageHeader';

interface ToolsHubProps {
  onSelectTool: (tool: 'reconciliation' | 'sponsor-fee-allocation' | 'memorized-transactions' | 'mileage-tracker') => void;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({ onSelectTool }) => {
  const tools = [
    {
      id: 'reconciliation' as const,
      title: 'Reconciliation',
      description: 'Match and categorize bank transactions',
      icon: RefreshCw,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      id: 'sponsor-fee-allocation' as const,
      title: 'Sponsor Fee Allocation',
      description: 'Review and confirm monthly admin fees',
      icon: PieChart,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      id: 'memorized-transactions' as const,
      title: 'Memorized Transactions',
      description: 'Manage recurring journal entry templates',
      icon: Clock,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    },
    {
      id: 'mileage-tracker' as const,
      title: 'Mileage Tracker',
      description: 'Track business miles for tax deductions',
      icon: Car,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tools"
        subtitle="Utility tools and integrations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
            onClick={() => onSelectTool(tool.id)}
          >
            <CardHeader>
              <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                Open tool →
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
