import React from 'react';
import { FileText, TrendingUp, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PageHeader } from './PageHeader';

interface ReportsHubProps {
  onSelectReport: (report: 'balance-sheet' | 'profit-loss' | 'income-statement' | 'volunteer-hours') => void;
}

export const ReportsHub: React.FC<ReportsHubProps> = ({ onSelectReport }) => {
  const reports = [
    {
      id: 'balance-sheet' as const,
      title: 'Balance Sheet',
      description: 'View assets, liabilities, and net assets',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: 'profit-loss' as const,
      title: 'P&L Statement',
      description: 'Revenue and expenses statement',
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      id: 'income-statement' as const,
      title: 'Income Statement',
      description: 'Revenue minus expenses for net income',
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      id: 'volunteer-hours' as const,
      title: 'Volunteer Hours',
      description: 'Track and report volunteer time',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financial Reports"
        subtitle="View and export comprehensive financial reports"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
            onClick={() => onSelectReport(report.id)}
          >
            <CardHeader>
              <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                View report →
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
