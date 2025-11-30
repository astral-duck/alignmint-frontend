import React from 'react';
import { FileText, TrendingUp, BarChart3, Clock, Users, GitCompare, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PageHeader } from './PageHeader';

interface ReportsHubProps {
  onSelectReport: (report: 'balance-sheet' | 'cash-flow' | 'income-statement' | 'volunteer-hours' | 'donor-reporting' | 'comparative' | 'mileage') => void;
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
      id: 'cash-flow' as const,
      title: 'Cash Flow Statement',
      description: 'Track cash inflows and outflows by activity',
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
    {
      id: 'donor-reporting' as const,
      title: 'Donor Reporting',
      description: 'Send end-of-year tax reports to donors',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      id: 'comparative' as const,
      title: 'Comparative Report',
      description: 'Compare reports side by side across periods',
      icon: GitCompare,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    },
    {
      id: 'mileage' as const,
      title: 'Mileage Report',
      description: 'Annual mileage summary for tax deductions',
      icon: Car,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports"
        subtitle="View and export comprehensive reports"
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
