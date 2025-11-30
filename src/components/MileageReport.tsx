import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getAllMileageEntries, MileageEntry } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PageHeader } from './PageHeader';
import { Download, ArrowLeft, Car, Calendar, Building2, X, DollarSign } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { MultiNonprofitExportDialog } from './MultiNonprofitExportDialog';
import { exportToExcel, exportToPDF } from '../lib/exportUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

// IRS standard mileage rate for 2025 (70 cents per mile)
const IRS_MILEAGE_RATE = 0.70;

interface MileageSummary {
  nonprofit: string;
  nonprofitId: string;
  totalMiles: number;
  totalValue: number;
  entryCount: number;
  topPurpose: string;
  lastEntry: string;
}

export const MileageReport: React.FC = () => {
  const { setReportTool } = useApp();
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString());
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNonprofit, setSelectedNonprofit] = useState<MileageSummary | null>(null);

  // Get all mileage entries from shared data source
  const allEntries = useMemo(() => getAllMileageEntries(), []);
  
  // Build summaries from entries
  const summaries = useMemo(() => {
    const nonprofitTotals: Record<string, { name: string; miles: number; count: number; purposes: Record<string, number>; lastDate: string }> = {};
    
    allEntries.forEach(entry => {
      if (!nonprofitTotals[entry.entityId]) {
        nonprofitTotals[entry.entityId] = { name: entry.entityName, miles: 0, count: 0, purposes: {}, lastDate: '' };
      }
      nonprofitTotals[entry.entityId].miles += entry.miles;
      nonprofitTotals[entry.entityId].count += 1;
      nonprofitTotals[entry.entityId].purposes[entry.purpose] = 
        (nonprofitTotals[entry.entityId].purposes[entry.purpose] || 0) + 1;
      if (!nonprofitTotals[entry.entityId].lastDate || entry.date > nonprofitTotals[entry.entityId].lastDate) {
        nonprofitTotals[entry.entityId].lastDate = entry.date;
      }
    });

    return Object.entries(nonprofitTotals).map(([nonprofitId, totals]) => {
      const topPurpose = Object.entries(totals.purposes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Various';
      return {
        nonprofit: totals.name,
        nonprofitId,
        totalMiles: totals.miles,
        totalValue: totals.miles * IRS_MILEAGE_RATE,
        entryCount: totals.count,
        topPurpose,
        lastEntry: totals.lastDate,
      };
    }).sort((a, b) => b.totalMiles - a.totalMiles);
  }, [allEntries]);

  // Filter by year
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      const entryYear = new Date(entry.date).getFullYear().toString();
      return entryYear === reportYear;
    });
  }, [allEntries, reportYear]);

  const filteredSummaries = useMemo(() => {
    // Recalculate summaries based on filtered entries
    const nonprofitTotals: Record<string, { miles: number; count: number; purposes: Record<string, number>; lastDate: string }> = {};
    
    filteredEntries.forEach(entry => {
      if (!nonprofitTotals[entry.entityId]) {
        nonprofitTotals[entry.entityId] = { miles: 0, count: 0, purposes: {}, lastDate: '' };
      }
      nonprofitTotals[entry.entityId].miles += entry.miles;
      nonprofitTotals[entry.entityId].count += 1;
      nonprofitTotals[entry.entityId].purposes[entry.purpose] = 
        (nonprofitTotals[entry.entityId].purposes[entry.purpose] || 0) + 1;
      if (!nonprofitTotals[entry.entityId].lastDate || entry.date > nonprofitTotals[entry.entityId].lastDate) {
        nonprofitTotals[entry.entityId].lastDate = entry.date;
      }
    });

    return summaries
      .map(s => {
        const totals = nonprofitTotals[s.nonprofitId];
        if (!totals) return null;
        const topPurpose = Object.entries(totals.purposes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Various';
        return {
          ...s,
          totalMiles: totals.miles,
          totalValue: totals.miles * IRS_MILEAGE_RATE,
          entryCount: totals.count,
          topPurpose,
          lastEntry: totals.lastDate,
        };
      })
      .filter((s): s is MileageSummary => s !== null && s.totalMiles > 0)
      .filter(s => !searchQuery || s.nonprofit.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.totalMiles - a.totalMiles);
  }, [summaries, filteredEntries, searchQuery]);

  // Calculate totals
  const totalMiles = filteredSummaries.reduce((sum, s) => sum + s.totalMiles, 0);
  const totalValue = totalMiles * IRS_MILEAGE_RATE;
  const totalEntries = filteredSummaries.reduce((sum, s) => sum + s.entryCount, 0);
  const nonprofitCount = filteredSummaries.length;

  // Get entries for selected nonprofit
  const selectedNonprofitEntries = useMemo(() => {
    if (!selectedNonprofit) return [];
    return filteredEntries
      .filter(e => e.entityId === selectedNonprofit.nonprofitId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedNonprofit, filteredEntries]);

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleMultiNonprofitExport = (selectedNonprofitIds: string[], format: 'pdf' | 'xlsx') => {
    selectedNonprofitIds.forEach(nonprofitId => {
      const nonprofit = entities.find(e => e.id === nonprofitId);
      if (!nonprofit) return;

      const nonprofitEntries = filteredEntries.filter(e => e.entityId === nonprofitId);
      const summary = filteredSummaries.find(s => s.nonprofitId === nonprofitId);
      
      if (nonprofitEntries.length === 0) {
        toast.error(`No mileage data for ${nonprofit.name}`);
        return;
      }

      const data = nonprofitEntries.map(entry => [
        entry.date,
        entry.purpose,
        entry.miles.toString(),
        `$${(entry.miles * IRS_MILEAGE_RATE).toFixed(2)}`,
      ]);

      // Add totals row
      const totalMiles = nonprofitEntries.reduce((sum, e) => sum + e.miles, 0);
      data.push(['', 'TOTAL', totalMiles.toString(), `$${(totalMiles * IRS_MILEAGE_RATE).toFixed(2)}`]);

      const headers = ['Date', 'Purpose', 'Miles', 'Value'];
      const filename = `Mileage_Report_${nonprofit.name.replace(/\s+/g, '_')}_${reportYear}`;

      if (format === 'xlsx') {
        exportToExcel(data, headers, filename, 'Mileage Report');
      } else {
        const title = 'Mileage Report';
        const subtitle = `${nonprofit.name} - ${reportYear} | IRS Rate: $${IRS_MILEAGE_RATE.toFixed(2)}/mile`;
        exportToPDF(title, subtitle, [{ data, headers }], filename);
      }
    });

    toast.success('Mileage report exported');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

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
      <div className="flex flex-col items-center text-center gap-4">
        <PageHeader 
          title="Mileage Report"
          subtitle="Annual mileage summary for tax deduction purposes"
        />
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Miles</p>
            <p className="text-3xl font-bold">
              {totalMiles.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Deduction Value</p>
            <p className="text-3xl font-bold">
              {formatCurrency(totalValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Entries</p>
            <p className="text-3xl font-bold">
              {totalEntries}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Nonprofits</p>
            <p className="text-3xl font-bold">
              {nonprofitCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search nonprofits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={reportYear} onValueChange={(value: string) => setReportYear(value)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mileage Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mileage by Nonprofit</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nonprofit</TableHead>
                <TableHead className="text-right">Entries</TableHead>
                <TableHead className="text-right">Total Miles</TableHead>
                <TableHead className="text-center">Deduction Value</TableHead>
                <TableHead>Last Entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSummaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No mileage data for {reportYear}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredSummaries.map((summary) => (
                    <TableRow 
                      key={summary.nonprofitId}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setSelectedNonprofit(summary)}
                    >
                      <TableCell className="font-medium">
                        {summary.nonprofit}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {summary.entryCount}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {summary.totalMiles.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatCurrency(summary.totalValue)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(summary.lastEntry)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{totalEntries}</TableCell>
                    <TableCell className="text-right font-mono">{totalMiles.toLocaleString()}</TableCell>
                    <TableCell className="text-center font-mono text-green-600 dark:text-green-400">
                      {formatCurrency(totalValue)}
                    </TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                </>
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
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Tax Deduction Summary</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Based on IRS standard mileage rate of ${IRS_MILEAGE_RATE.toFixed(2)}/mile for {reportYear}
                </p>
              </div>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              This report is for informational purposes only. Consult with a tax professional for specific tax advice.
              The IRS standard mileage rate is used to calculate the deductible cost of operating a vehicle for business purposes.
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

      {/* Detail Drawer */}
      <Sheet open={!!selectedNonprofit} onOpenChange={(open: boolean) => !open && setSelectedNonprofit(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{selectedNonprofit?.nonprofit}</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {reportYear} Mileage Details
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {selectedNonprofit && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2">Total Miles</p>
                      <p className="text-2xl font-semibold">
                        {selectedNonprofit.totalMiles.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2">Deduction Value</p>
                      <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(selectedNonprofit.totalValue)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Entries Table */}
                <div className="space-y-3">
                  <h4 className="text-base font-semibold">
                    All Entries ({selectedNonprofitEntries.length})
                  </h4>
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Purpose</TableHead>
                              <TableHead className="text-right">Miles</TableHead>
                              <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedNonprofitEntries.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell>
                                  {formatDate(entry.date)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {entry.purpose}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {entry.miles}
                                </TableCell>
                                <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                                  {formatCurrency(entry.miles * IRS_MILEAGE_RATE)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* IRS Rate Note */}
                <Card>
                  <CardContent className="py-3">
                    <p className="text-xs text-muted-foreground">
                      Calculated using IRS standard mileage rate of ${IRS_MILEAGE_RATE.toFixed(2)}/mile for {reportYear}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
