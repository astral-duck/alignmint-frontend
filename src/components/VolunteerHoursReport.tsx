import React, { useState } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PageHeader } from './PageHeader';
import { Download, Clock, TrendingUp, Users, Award, ArrowLeft } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { MultiNonprofitExportDialog } from './MultiNonprofitExportDialog';
import { exportToExcel, exportToPDF, prepareVolunteerHoursForExport } from '../lib/exportUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface VolunteerData {
  nonprofit: string;
  totalHours: number;
  volunteers: number;
  topActivity: string;
  monthlyAverage: number;
}

export const VolunteerHoursReport: React.FC = () => {
  const { selectedEntity, setReportTool } = useApp();
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-10-20',
  });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const entityName = entities.find(e => e.id === selectedEntity)?.name || 'InFocus Ministries';
  const isInFocus = selectedEntity === 'infocus';

  // Mock data - in production this would come from your data source
  const generateVolunteerData = (): VolunteerData[] => {
    if (isInFocus) {
      // Show all nonprofits when InFocus is selected
      return entities
        .filter(e => e.id !== 'infocus' && e.type === 'nonprofit')
        .map(entity => ({
          nonprofit: entity.name,
          totalHours: Math.floor(Math.random() * 500) + 100,
          volunteers: Math.floor(Math.random() * 30) + 5,
          topActivity: ['Event Setup', 'Outreach Program', 'Administrative Support', 'Teaching/Training'][Math.floor(Math.random() * 4)],
          monthlyAverage: Math.floor(Math.random() * 50) + 10,
        }));
    } else {
      // Show only selected nonprofit
      return [{
        nonprofit: entityName,
        totalHours: Math.floor(Math.random() * 500) + 100,
        volunteers: Math.floor(Math.random() * 30) + 5,
        topActivity: 'Event Setup',
        monthlyAverage: Math.floor(Math.random() * 50) + 10,
      }];
    }
  };

  const volunteerData = generateVolunteerData();
  const totalHours = volunteerData.reduce((sum, data) => sum + data.totalHours, 0);
  const totalVolunteers = volunteerData.reduce((sum, data) => sum + data.volunteers, 0);
  const avgHoursPerVolunteer = totalVolunteers > 0 ? (totalHours / totalVolunteers).toFixed(1) : '0';
  const estimatedValue = totalHours * 31.80; // $31.80 per hour is typical volunteer value

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleMultiNonprofitExport = (selectedNonprofitIds: string[], format: 'pdf' | 'xlsx') => {
    // Prepare data for each selected nonprofit
    selectedNonprofitIds.forEach(nonprofitId => {
      const nonprofit = entities.find(e => e.id === nonprofitId);
      if (!nonprofit) return;

      // Generate volunteer data for this nonprofit - in production this would come from real data
      const mockVolunteerData = [
        {
          name: 'John Smith',
          role: 'Event Coordinator',
          totalHours: 45,
          thisMonth: 12,
          lastActivity: '2025-10-15',
          status: 'Active',
        },
        {
          name: 'Sarah Johnson',
          role: 'Outreach Assistant',
          totalHours: 38,
          thisMonth: 10,
          lastActivity: '2025-10-18',
          status: 'Active',
        },
        {
          name: 'Mike Davis',
          role: 'Administrative Support',
          totalHours: 52,
          thisMonth: 15,
          lastActivity: '2025-10-20',
          status: 'Active',
        },
      ];
      
      if (format === 'xlsx') {
        const data = prepareVolunteerHoursForExport(mockVolunteerData);
        const headers = ['Name', 'Role', 'Total Hours', 'This Month', 'Last Activity', 'Status'];
        const filename = `Volunteer_Hours_${nonprofit.name.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}`;
        exportToExcel(data, headers, filename, 'Volunteer Hours');
      } else {
        const data = prepareVolunteerHoursForExport(mockVolunteerData);
        const headers = ['Name', 'Role', 'Total Hours', 'This Month', 'Last Activity', 'Status'];
        const title = 'Volunteer Hours Report';
        const subtitle = `${nonprofit.name} - ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`;
        const filename = `Volunteer_Hours_${nonprofit.name.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}`;
        exportToPDF(title, subtitle, [{ data, headers }], filename);
      }
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setReportTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </Button>

      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <PageHeader 
          title="Volunteer Hours Report"
          subtitle={isInFocus ? 'Consolidated view across all nonprofits' : entityName}
        />
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{totalHours.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Volunteers</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{totalVolunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Hours/Volunteer</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{avgHoursPerVolunteer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Value</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{formatCurrency(estimatedValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isInFocus ? 'Volunteer Hours by Nonprofit' : 'Volunteer Activity Breakdown'}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            For the period {dateRange.startDate} to {dateRange.endDate}
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nonprofit</TableHead>
                <TableHead className="text-right">Total Hours</TableHead>
                <TableHead className="text-right">Volunteers</TableHead>
                <TableHead>Top Activity</TableHead>
                <TableHead className="text-right">Monthly Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteerData.map((data) => (
                <TableRow key={data.nonprofit}>
                  <TableCell className="text-gray-900 dark:text-gray-100">
                    {data.nonprofit}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 dark:text-gray-100">
                    {data.totalHours} hrs
                  </TableCell>
                  <TableCell className="text-right text-gray-600 dark:text-gray-400">
                    {data.volunteers}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {data.topActivity}
                  </TableCell>
                  <TableCell className="text-right text-gray-600 dark:text-gray-400">
                    {data.monthlyAverage} hrs
                  </TableCell>
                </TableRow>
              ))}
              {volunteerData.length > 1 && (
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableCell>
                    <strong>TOTAL</strong>
                  </TableCell>
                  <TableCell className="text-right">
                    <strong>{totalHours} hrs</strong>
                  </TableCell>
                  <TableCell className="text-right">
                    <strong>{totalVolunteers}</strong>
                  </TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Additional Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Volunteer Time Value</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Based on Independent Sector's volunteer value estimate of $31.80/hour
                </p>
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                {formatCurrency(estimatedValue)}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              This report includes all approved volunteer hours for the selected time period. 
              Pending hours are not included in these totals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Nonprofit Export Dialog */}
      <MultiNonprofitExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleMultiNonprofitExport}
        reportType="volunteer-hours"
      />
    </div>
  );
};
