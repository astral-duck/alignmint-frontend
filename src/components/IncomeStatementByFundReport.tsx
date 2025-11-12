import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateLegacyIncomeStatementByFund } from '../lib/legacyReportData';
import { IncomeStatementByFundData, FundColumn, IncomeExpenseAccount } from '../types/reports';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Download, ArrowLeft, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PageHeader } from './PageHeader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export const IncomeStatementByFundReport: React.FC = () => {
  const { selectedEntity, setReportTool } = useApp();
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-10-29',
  });

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{
    account: IncomeExpenseAccount;
    fundId: string;
    fundName: string;
  } | null>(null);

  // Generate legacy income statement data
  const incomeStatement = useMemo(
    () => generateLegacyIncomeStatementByFund(dateRange.startDate, dateRange.endDate),
    [dateRange]
  );

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleAccountClick = (account: IncomeExpenseAccount, fundId: string, fundName: string) => {
    setSelectedAccount({ account, fundId, fundName });
    setDrawerOpen(true);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export Income Statement by Fund');
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
          title="Income Statement by Fund"
          subtitle={`${incomeStatement.organization_name} - Multi-Fund View`}
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

      {/* Income Statement Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Income Statement by Fund</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For the period {incomeStatement.start_date} to {incomeStatement.end_date}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px] sticky left-0 bg-white dark:bg-gray-950 z-10">
                    Account
                  </TableHead>
                  {incomeStatement.funds.map((fund) => (
                    <TableHead key={fund.fund_id} className="text-right min-w-[150px]">
                      <div className="font-semibold">{fund.fund_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {fund.fund_code}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Income Section */}
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableCell colSpan={incomeStatement.funds.length + 1} className="font-bold text-lg">
                    INCOME
                  </TableCell>
                </TableRow>
                
                {incomeStatement.income_accounts.map((account) => (
                  <TableRow key={account.account_number} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="sticky left-0 bg-white dark:bg-gray-950">
                      <span className="text-sm">
                        {account.account_number} - {account.account_name}
                      </span>
                    </TableCell>
                    {incomeStatement.funds.map((fund) => {
                      const amount = account.amounts_by_fund[fund.fund_id] || 0;
                      return (
                        <TableCell 
                          key={fund.fund_id} 
                          className="text-right font-mono text-sm tabular-nums cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => handleAccountClick(account, fund.fund_id, fund.fund_name)}
                        >
                          {amount !== 0 ? formatCurrency(amount) : '—'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

                {/* Total Income */}
                <TableRow className="font-semibold border-t-2">
                  <TableCell className="sticky left-0 bg-white dark:bg-gray-950">
                    TOTAL INCOME
                  </TableCell>
                  {incomeStatement.funds.map((fund) => (
                    <TableCell key={fund.fund_id} className="text-right font-mono tabular-nums">
                      {formatCurrency(fund.total_income)}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Spacer */}
                <TableRow>
                  <TableCell colSpan={incomeStatement.funds.length + 1} className="h-4" />
                </TableRow>

                {/* Expenses Section */}
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableCell colSpan={incomeStatement.funds.length + 1} className="font-bold text-lg">
                    EXPENSES
                  </TableCell>
                </TableRow>

                {incomeStatement.expense_accounts.map((account) => (
                  <TableRow key={account.account_number} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="sticky left-0 bg-white dark:bg-gray-950">
                      <span className="text-sm">
                        {account.account_number} - {account.account_name}
                      </span>
                    </TableCell>
                    {incomeStatement.funds.map((fund) => {
                      const amount = account.amounts_by_fund[fund.fund_id] || 0;
                      return (
                        <TableCell 
                          key={fund.fund_id} 
                          className="text-right font-mono text-sm tabular-nums cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => handleAccountClick(account, fund.fund_id, fund.fund_name)}
                        >
                          {amount !== 0 ? formatCurrency(amount) : '—'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

                {/* Total Expenses */}
                <TableRow className="font-semibold border-t-2">
                  <TableCell className="sticky left-0 bg-white dark:bg-gray-950">
                    TOTAL EXPENSES
                  </TableCell>
                  {incomeStatement.funds.map((fund) => (
                    <TableCell key={fund.fund_id} className="text-right font-mono tabular-nums">
                      {formatCurrency(fund.total_expense)}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Spacer */}
                <TableRow>
                  <TableCell colSpan={incomeStatement.funds.length + 1} className="h-4" />
                </TableRow>

                {/* Net Income */}
                <TableRow className="font-bold text-lg border-t-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                  <TableCell className="sticky left-0 bg-gray-100 dark:bg-gray-800">
                    NET INCOME (LOSS)
                  </TableCell>
                  {incomeStatement.funds.map((fund) => (
                    <TableCell 
                      key={fund.fund_id} 
                      className={`text-right font-mono tabular-nums ${
                        fund.net_income >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {formatCurrency(fund.net_income)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Fund Balance Reconciliation */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
              FUND BALANCE RECONCILIATION
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund</TableHead>
                  <TableHead className="text-right">Beginning Balance</TableHead>
                  <TableHead className="text-right">Other Movements</TableHead>
                  <TableHead className="text-right">Net Income</TableHead>
                  <TableHead className="text-right">Ending Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeStatement.summary.map((summary) => (
                  <TableRow key={summary.fund_id}>
                    <TableCell>
                      <div className="font-medium">{summary.fund_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{summary.fund_code}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatCurrency(summary.beginning_balance)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {summary.other_movements !== 0 ? formatCurrency(summary.other_movements) : '—'}
                    </TableCell>
                    <TableCell className={`text-right font-mono tabular-nums ${
                      summary.net_income >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(summary.net_income)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-semibold">
                      {formatCurrency(summary.ending_balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-8">
          <SheetHeader className="pb-8 border-b border-gray-200 dark:border-gray-700">
            <SheetTitle>
              {selectedAccount?.account.account_number} - {selectedAccount?.account.account_name}
            </SheetTitle>
            <SheetDescription>
              Transactions for {selectedAccount?.fundName} ({dateRange.startDate} to {dateRange.endDate})
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-10 mt-10">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                <p className="text-2xl font-mono tabular-nums">
                  {selectedAccount && formatCurrency(
                    selectedAccount.account.amounts_by_fund[selectedAccount.fundId] || 0
                  )}
                </p>
              </CardContent>
            </Card>

            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Transaction details will be loaded from the General Ledger</p>
              <p className="text-sm mt-2">Account: {selectedAccount?.account.account_number}</p>
              <p className="text-sm">Fund: {selectedAccount?.fundName}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
