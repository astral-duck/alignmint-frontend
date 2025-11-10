import React, { useState } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getBalanceSheet, getProfitLoss, getCashFlow } from '../lib/financialData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { PageHeader } from './PageHeader';

export const FinancialReports: React.FC = () => {
  const { selectedEntity } = useApp();
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-10-10',
  });

  const balanceSheet = getBalanceSheet(selectedEntity);
  const profitLoss = getProfitLoss(selectedEntity);
  const cashFlow = getCashFlow(selectedEntity);

  const entityName = entities.find(e => e.id === selectedEntity)?.name || 'All Non-Profits';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleExport = (reportType: string) => {
    toast.success(`Exporting ${reportType} as PDF...`);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog...');
  };

  if (selectedEntity === 'all') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl mb-2">Select a Nonprofit</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Please select a specific nonprofit from the dropdown above to view financial reports.
            Reports are organization-specific and cannot be displayed for all nonprofits at once.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader 
          title="Financial Reports"
          subtitle={`${entityName} - Financial Statements`}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Assets</p>
                <p className="text-xl sm:text-2xl">
                  {balanceSheet ? formatCurrency(balanceSheet.assets.totalAssets) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Net Income (YTD)</p>
                <p className="text-xl sm:text-2xl">
                  {profitLoss ? formatCurrency(profitLoss.netIncome) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cash on Hand</p>
                <p className="text-xl sm:text-2xl">
                  {cashFlow ? formatCurrency(cashFlow.cashEndOfPeriod) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="balance-sheet" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="balance-sheet" className="text-xs sm:text-sm">
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="text-xs sm:text-sm">
            P&L Statement
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="text-xs sm:text-sm">
            Cash Flow
          </TabsTrigger>
        </TabsList>

        {/* Balance Sheet Tab */}
        <TabsContent value="balance-sheet" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Balance Sheet</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    As of {balanceSheet?.asOfDate || dateRange.endDate}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleExport('Balance Sheet')}
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {balanceSheet ? (
                <>
                  {/* Assets Section */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">ASSETS</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div>
                        <p className="font-medium mb-2">Current Assets</p>
                        <div className="space-y-1 ml-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Cash</span>
                            <span>{formatCurrency(balanceSheet.assets.currentAssets.cash)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Accounts Receivable</span>
                            <span>{formatCurrency(balanceSheet.assets.currentAssets.accountsReceivable)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Pledges Receivable</span>
                            <span>{formatCurrency(balanceSheet.assets.currentAssets.pledgesReceivable)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Prepaid Expenses</span>
                            <span>{formatCurrency(balanceSheet.assets.currentAssets.prepaidExpenses)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total Current Assets</span>
                            <span>{formatCurrency(balanceSheet.assets.currentAssets.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3">
                        <p className="font-medium mb-2">Fixed Assets</p>
                        <div className="space-y-1 ml-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Property & Equipment</span>
                            <span>{formatCurrency(balanceSheet.assets.fixedAssets.propertyAndEquipment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Accumulated Depreciation</span>
                            <span>{formatCurrency(balanceSheet.assets.fixedAssets.accumulatedDepreciation)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total Fixed Assets</span>
                            <span>{formatCurrency(balanceSheet.assets.fixedAssets.total)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />
                      <div className="flex justify-between font-bold text-base">
                        <span>TOTAL ASSETS</span>
                        <span>{formatCurrency(balanceSheet.assets.totalAssets)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Liabilities Section */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">LIABILITIES</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div>
                        <p className="font-medium mb-2">Current Liabilities</p>
                        <div className="space-y-1 ml-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Accounts Payable</span>
                            <span>{formatCurrency(balanceSheet.liabilities.currentLiabilities.accountsPayable)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Accrued Expenses</span>
                            <span>{formatCurrency(balanceSheet.liabilities.currentLiabilities.accruedExpenses)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Deferred Revenue</span>
                            <span>{formatCurrency(balanceSheet.liabilities.currentLiabilities.deferredRevenue)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total Current Liabilities</span>
                            <span>{formatCurrency(balanceSheet.liabilities.currentLiabilities.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3">
                        <p className="font-medium mb-2">Long-Term Liabilities</p>
                        <div className="space-y-1 ml-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Loans Payable</span>
                            <span>{formatCurrency(balanceSheet.liabilities.longTermLiabilities.loansPayable)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total Long-Term Liabilities</span>
                            <span>{formatCurrency(balanceSheet.liabilities.longTermLiabilities.total)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />
                      <div className="flex justify-between font-bold text-base">
                        <span>TOTAL LIABILITIES</span>
                        <span>{formatCurrency(balanceSheet.liabilities.totalLiabilities)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Net Assets Section */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">NET ASSETS</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Without Donor Restrictions</span>
                          <span>{formatCurrency(balanceSheet.netAssets.withoutDonorRestrictions)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">With Donor Restrictions</span>
                          <span>{formatCurrency(balanceSheet.netAssets.withDonorRestrictions)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>TOTAL NET ASSETS</span>
                          <span>{formatCurrency(balanceSheet.netAssets.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Total */}
                  <div className="flex justify-between font-bold text-lg bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <span>TOTAL LIABILITIES & NET ASSETS</span>
                    <span>{formatCurrency(balanceSheet.totalLiabilitiesAndNetAssets)}</span>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No balance sheet data available for this organization.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profit & Loss Tab */}
        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Statement of Activities (P&L)</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    For the period {dateRange.startDate} to {dateRange.endDate}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleExport('P&L Statement')}
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profitLoss ? (
                <>
                  {/* Revenue Section */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">REVENUE</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Donation Revenue</span>
                          <span>{formatCurrency(profitLoss.revenue.donationRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Grant Revenue</span>
                          <span>{formatCurrency(profitLoss.revenue.grantRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Program Service Revenue</span>
                          <span>{formatCurrency(profitLoss.revenue.programServiceRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Other Revenue</span>
                          <span>{formatCurrency(profitLoss.revenue.otherRevenue)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>TOTAL REVENUE</span>
                          <span>{formatCurrency(profitLoss.revenue.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Expenses Section */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">EXPENSES</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Program Expenses</span>
                          <span>{formatCurrency(profitLoss.expenses.programExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Fundraising Expenses</span>
                          <span>{formatCurrency(profitLoss.expenses.fundraisingExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Administrative Expenses</span>
                          <span>{formatCurrency(profitLoss.expenses.administrativeExpenses)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>TOTAL EXPENSES</span>
                          <span>{formatCurrency(profitLoss.expenses.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Net Income */}
                  <div className={`flex justify-between font-bold text-lg p-4 rounded-lg ${
                    profitLoss.netIncome >= 0 
                      ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                  }`}>
                    <span>NET INCOME (LOSS)</span>
                    <span>{formatCurrency(profitLoss.netIncome)}</span>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No profit & loss data available for this organization.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Statement of Cash Flows</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    For the period {dateRange.startDate} to {dateRange.endDate}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleExport('Cash Flow Statement')}
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cashFlow ? (
                <>
                  {/* Operating Activities */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">CASH FLOWS FROM OPERATING ACTIVITIES</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Net Income</span>
                          <span>{formatCurrency(cashFlow.operatingActivities.netIncome)}</span>
                        </div>
                        <div className="ml-4 mt-2">
                          <p className="text-xs text-gray-500 mb-1">Adjustments to reconcile net income:</p>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Depreciation</span>
                              <span>{formatCurrency(cashFlow.operatingActivities.adjustments.depreciation)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Changes in Receivables</span>
                              <span>{formatCurrency(cashFlow.operatingActivities.adjustments.changesInReceivables)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Changes in Payables</span>
                              <span>{formatCurrency(cashFlow.operatingActivities.adjustments.changesInPayables)}</span>
                            </div>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>Net Cash from Operating Activities</span>
                          <span>{formatCurrency(cashFlow.operatingActivities.netCashFromOperations)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Investing Activities */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">CASH FLOWS FROM INVESTING ACTIVITIES</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Purchase of Equipment</span>
                          <span>{formatCurrency(cashFlow.investingActivities.purchaseOfEquipment)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>Net Cash from Investing Activities</span>
                          <span>{formatCurrency(cashFlow.investingActivities.netCashFromInvesting)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Financing Activities */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">CASH FLOWS FROM FINANCING ACTIVITIES</h3>
                    
                    <div className="space-y-3 ml-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Proceeds from Loans</span>
                          <span>{formatCurrency(cashFlow.financingActivities.proceedsFromLoans)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Repayment of Loans</span>
                          <span>{formatCurrency(cashFlow.financingActivities.repaymentOfLoans)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>Net Cash from Financing Activities</span>
                          <span>{formatCurrency(cashFlow.financingActivities.netCashFromFinancing)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-base bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <span>Net Change in Cash</span>
                      <span className={cashFlow.netChangeInCash >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {formatCurrency(cashFlow.netChangeInCash)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm ml-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cash - Beginning of Period</span>
                        <span>{formatCurrency(cashFlow.cashBeginningOfPeriod)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base">
                        <span>Cash - End of Period</span>
                        <span>{formatCurrency(cashFlow.cashEndOfPeriod)}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No cash flow data available for this organization.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
