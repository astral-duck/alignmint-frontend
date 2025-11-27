import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getBalanceSheet, getProfitLoss } from '../lib/financialData';
import { generateLegacyBalanceSheet } from '../lib/legacyReportData';
import { AccountBalance } from '../types/reports';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, ChevronRight, GitCompare, ExternalLink } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PageHeader } from './PageHeader';
import { Badge } from './ui/badge';
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

type ReportType = 'balance-sheet' | 'cash-flow' | 'income-statement';

interface ReportConfig {
  type: ReportType;
  startDate: string;
  endDate: string;
}

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  source: string;
  debit: number;
  credit: number;
  referenceNumber: string;
  reconciled: boolean;
}

interface SelectedLineItem {
  name: string;
  amount: number;
  accountCode: string;
  category: string;
}

// Generate mock transactions for drawer
const generateMockTransactions = (accountCode: string, amount: number): LedgerEntry[] => {
  const transactions: LedgerEntry[] = [];
  const today = new Date();
  const descriptions = [
    'Monthly donation',
    'Online payment',
    'Check deposit',
    'Wire transfer',
    'ACH payment',
    'Recurring gift',
  ];
  
  // Generate 3-8 transactions that sum to approximately the amount
  const numTransactions = Math.floor(Math.random() * 6) + 3;
  let remaining = amount;
  
  for (let i = 0; i < numTransactions; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const isLast = i === numTransactions - 1;
    const txAmount = isLast ? remaining : Math.round((remaining / (numTransactions - i)) * (0.5 + Math.random()));
    remaining -= txAmount;
    
    transactions.push({
      id: `tx-${accountCode}-${i}`,
      date: date.toISOString().split('T')[0],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      source: 'journal-entry',
      debit: txAmount > 0 ? txAmount : 0,
      credit: txAmount < 0 ? Math.abs(txAmount) : 0,
      referenceNumber: `REF-${1000 + i}`,
      reconciled: Math.random() > 0.3,
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const ComparativeReport: React.FC = () => {
  const { selectedEntity, setReportTool } = useApp();
  
  // Left report configuration
  const [leftReport, setLeftReport] = useState<ReportConfig>({
    type: 'balance-sheet',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
  });
  
  // Right report configuration
  const [rightReport, setRightReport] = useState<ReportConfig>({
    type: 'balance-sheet',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
  });

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<SelectedLineItem | null>(null);
  const [drawerTransactions, setDrawerTransactions] = useState<LedgerEntry[]>([]);

  const entityName = entities.find(e => e.id === selectedEntity)?.name || 'InFocus Ministries';
  const isInFocus = selectedEntity === 'infocus';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const reportOptions = [
    { value: 'balance-sheet', label: 'Balance Sheet' },
    { value: 'cash-flow', label: 'Cash Flow Statement' },
    { value: 'income-statement', label: 'Income Statement' },
  ];

  // Handle line item click - opens drawer with transactions
  const handleLineItemClick = (name: string, amount: number, accountCode: string, category: string) => {
    setSelectedLineItem({ name, amount, accountCode, category });
    setDrawerTransactions(generateMockTransactions(accountCode, Math.abs(amount)));
    setDrawerOpen(true);
  };

  // Get balance sheet data
  const leftLegacyBalanceSheet = useMemo(() => generateLegacyBalanceSheet(leftReport.endDate), [leftReport.endDate]);
  const rightLegacyBalanceSheet = useMemo(() => generateLegacyBalanceSheet(rightReport.endDate), [rightReport.endDate]);

  // Get P&L data (used for cash flow)
  const profitLoss = getProfitLoss(selectedEntity);

  // Render Balance Sheet content
  const renderBalanceSheet = (legacyData: ReturnType<typeof generateLegacyBalanceSheet>, dateRange: { startDate: string; endDate: string }) => {
    if (!legacyData) {
      return <p className="text-center text-gray-500 py-8">No data available</p>;
    }

    return (
      <div className="space-y-4">
        {/* Assets */}
        <div>
          <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 dark:border-gray-600 pb-2">ASSETS</h4>
          <div className="space-y-1 text-sm ml-2">
            {legacyData.assets.map((account: AccountBalance, idx: number) => (
              <div 
                key={idx} 
                className="flex justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded cursor-pointer transition-colors group"
                onClick={() => handleLineItemClick(`${account.account_number} - ${account.account_name}`, account.amount, account.account_number, 'asset')}
              >
                <span className="text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                  {account.account_number} - {account.account_name}
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="font-mono text-sm tabular-nums">{formatCurrency(account.amount)}</span>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold pt-2">
              <span>TOTAL ASSETS</span>
              <span className="font-mono tabular-nums">{formatCurrency(legacyData.total_assets)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Liabilities */}
        <div>
          <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 dark:border-gray-600 pb-2">LIABILITIES</h4>
          <div className="space-y-1 text-sm ml-2">
            {legacyData.liabilities.map((account: AccountBalance, idx: number) => (
              <div 
                key={idx} 
                className="flex justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded cursor-pointer transition-colors group"
                onClick={() => handleLineItemClick(`${account.account_number} - ${account.account_name}`, account.amount, account.account_number, 'liability')}
              >
                <span className="text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                  {account.account_number} - {account.account_name}
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="font-mono text-sm tabular-nums">{formatCurrency(account.amount)}</span>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold pt-2">
              <span>TOTAL LIABILITIES</span>
              <span className="font-mono tabular-nums">{formatCurrency(legacyData.total_liabilities)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Net Assets / Fund Balance */}
        <div>
          <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 dark:border-gray-600 pb-2">EQUITY (FUND BALANCES)</h4>
          <div className="space-y-1 text-sm ml-2">
            {legacyData.equity.map((account: AccountBalance, idx: number) => (
              <div 
                key={idx} 
                className="flex justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded cursor-pointer transition-colors group"
                onClick={() => handleLineItemClick(`${account.account_number} - ${account.account_name}`, account.amount, account.account_number, 'equity')}
              >
                <span className="text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                  {account.account_number} - {account.account_name}
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="font-mono text-sm tabular-nums">{formatCurrency(account.amount)}</span>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold pt-2">
              <span>TOTAL EQUITY</span>
              <span className="font-mono tabular-nums">{formatCurrency(legacyData.total_equity)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Total Liabilities + Net Assets */}
        <div className="flex justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-bold text-lg">
          <span>TOTAL LIABILITIES & EQUITY</span>
          <span className="font-mono tabular-nums">{formatCurrency(legacyData.total_liabilities + legacyData.total_equity)}</span>
        </div>
      </div>
    );
  };

  // Render Cash Flow content
  const renderCashFlow = (dateRange: { startDate: string; endDate: string }) => {
    if (!profitLoss) {
      return <p className="text-center text-gray-500 py-8">No data available</p>;
    }

    return (
      <div className="space-y-4">
        {/* Operating Activities - Cash Received */}
        <div>
          <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 dark:border-gray-600 pb-2">CASH FLOWS FROM OPERATING ACTIVITIES</h4>
          <div className="space-y-1 text-sm ml-2">
            <div 
              className="flex justify-between py-1.5 hover:bg-green-50 dark:hover:bg-green-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('4500 - Direct Public Support', profitLoss.income.directPublicSupport, '4500', 'income')}
            >
              <span className="text-sm group-hover:text-green-600 dark:group-hover:text-green-400 flex items-center gap-1">
                4500 - Direct Public Support
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">{formatCurrency(profitLoss.income.directPublicSupport)}</span>
            </div>
            <div 
              className="flex justify-between py-1.5 hover:bg-green-50 dark:hover:bg-green-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('4510 - Initial Fee', profitLoss.income.initialFee, '4510', 'income')}
            >
              <span className="text-sm group-hover:text-green-600 dark:group-hover:text-green-400 flex items-center gap-1">
                4510 - Initial Fee
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">{formatCurrency(profitLoss.income.initialFee)}</span>
            </div>
            <div 
              className="flex justify-between py-1.5 hover:bg-green-50 dark:hover:bg-green-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('4520 - Interest Income', profitLoss.income.interestIncome, '4520', 'income')}
            >
              <span className="text-sm group-hover:text-green-600 dark:group-hover:text-green-400 flex items-center gap-1">
                4520 - Interest Income
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">{formatCurrency(profitLoss.income.interestIncome)}</span>
            </div>
            <div 
              className="flex justify-between py-1.5 hover:bg-green-50 dark:hover:bg-green-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('4530 - Miscellaneous Revenue', profitLoss.income.miscellaneousRevenue, '4530', 'income')}
            >
              <span className="text-sm group-hover:text-green-600 dark:group-hover:text-green-400 flex items-center gap-1">
                4530 - Miscellaneous Revenue
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">{formatCurrency(profitLoss.income.miscellaneousRevenue)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold bg-green-50 dark:bg-green-950/20 p-2 rounded">
              <span>Cash Received from Operations</span>
              <span className="font-mono tabular-nums text-green-600 dark:text-green-400">{formatCurrency(profitLoss.income.totalIncome)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Cash Disbursements */}
        <div>
          <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 dark:border-gray-600 pb-2">CASH DISBURSEMENTS</h4>
          <div className="space-y-1 text-sm ml-2">
            <div 
              className="flex justify-between py-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('5019 - Payroll Expenses', profitLoss.expense.payrollExpenses, '5019', 'expense')}
            >
              <span className="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center gap-1">
                5019 - Payroll Expenses
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">({formatCurrency(profitLoss.expense.payrollExpenses)})</span>
            </div>
            <div 
              className="flex justify-between py-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('5023 - Rent', profitLoss.expense.rent, '5023', 'expense')}
            >
              <span className="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center gap-1">
                5023 - Rent
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">({formatCurrency(profitLoss.expense.rent)})</span>
            </div>
            <div 
              className="flex justify-between py-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('5002 - Bank Fees', profitLoss.expense.bankFees, '5002', 'expense')}
            >
              <span className="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center gap-1">
                5002 - Bank Fees
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">({formatCurrency(profitLoss.expense.bankFees)})</span>
            </div>
            <div 
              className="flex justify-between py-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 -mx-2 rounded cursor-pointer transition-colors group"
              onClick={() => handleLineItemClick('Other Operating Expenses', profitLoss.expense.totalExpense - profitLoss.expense.payrollExpenses - profitLoss.expense.rent - profitLoss.expense.bankFees, '5999', 'expense')}
            >
              <span className="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center gap-1">
                Other Operating Expenses
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-sm tabular-nums">({formatCurrency(
                profitLoss.expense.totalExpense - profitLoss.expense.payrollExpenses - profitLoss.expense.rent - profitLoss.expense.bankFees
              )})</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold bg-red-50 dark:bg-red-950/20 p-2 rounded">
              <span>Total Cash Disbursements</span>
              <span className="font-mono tabular-nums text-red-600 dark:text-red-400">({formatCurrency(profitLoss.expense.totalExpense)})</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Net Cash Flow */}
        <div className={`p-4 rounded-lg font-bold ${
          profitLoss.netIncome >= 0 
            ? 'bg-green-50 dark:bg-green-950/30' 
            : 'bg-red-50 dark:bg-red-950/30'
        }`}>
          <div className="flex justify-between">
            <span>Net Cash Provided by (Used in) Operating Activities</span>
            <span className={`font-mono tabular-nums ${
              profitLoss.netIncome >= 0 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>{formatCurrency(profitLoss.netIncome)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render Income Statement content
  const renderIncomeStatement = (dateRange: { startDate: string; endDate: string }) => {
    if (!profitLoss) {
      return <p className="text-center text-gray-500 py-8">No data available</p>;
    }

    return (
      <div className="space-y-4">
        {/* Revenue */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Revenue</h4>
          <div className="space-y-1 text-sm ml-2">
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Donations</span>
              <span className="font-mono">{formatCurrency(profitLoss.income.directPublicSupport)}</span>
            </div>
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Program Fees</span>
              <span className="font-mono">{formatCurrency(profitLoss.income.initialFee)}</span>
            </div>
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Interest & Investment Income</span>
              <span className="font-mono">{formatCurrency(profitLoss.income.interestIncome)}</span>
            </div>
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Other Revenue</span>
              <span className="font-mono">{formatCurrency(profitLoss.income.miscellaneousRevenue + profitLoss.income.salesFromInvenorites)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium px-2">
              <span>Total Revenue</span>
              <span className="font-mono">{formatCurrency(profitLoss.income.totalIncome)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Expenses */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Expenses</h4>
          <div className="space-y-1 text-sm ml-2">
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Personnel</span>
              <span className="font-mono">{formatCurrency(profitLoss.expense.payrollExpenses)}</span>
            </div>
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Facilities</span>
              <span className="font-mono">{formatCurrency(profitLoss.expense.rent + profitLoss.expense.telephoneTelecommunications)}</span>
            </div>
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Administrative</span>
              <span className="font-mono">{formatCurrency(profitLoss.expense.bankFees + profitLoss.expense.advertisingExpenses)}</span>
            </div>
            <div className="flex justify-between py-1 px-2">
              <span className="text-gray-600 dark:text-gray-400">Program Services</span>
              <span className="font-mono">{formatCurrency(
                profitLoss.expense.totalExpense - profitLoss.expense.payrollExpenses - profitLoss.expense.rent - 
                profitLoss.expense.telephoneTelecommunications - profitLoss.expense.bankFees - profitLoss.expense.advertisingExpenses
              )}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium px-2">
              <span>Total Expenses</span>
              <span className="font-mono">{formatCurrency(profitLoss.expense.totalExpense)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Net Income */}
        <div className={`p-3 rounded-lg ${
          profitLoss.netIncome >= 0 
            ? 'bg-green-50 dark:bg-green-950/30' 
            : 'bg-red-50 dark:bg-red-950/30'
        }`}>
          <div className="flex justify-between font-semibold">
            <span>Net Income / (Loss)</span>
            <span className={`font-mono ${
              profitLoss.netIncome >= 0 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>{formatCurrency(profitLoss.netIncome)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render report based on type
  const renderReport = (config: ReportConfig, legacyBalanceSheet: ReturnType<typeof generateLegacyBalanceSheet>) => {
    switch (config.type) {
      case 'balance-sheet':
        return renderBalanceSheet(legacyBalanceSheet, { startDate: config.startDate, endDate: config.endDate });
      case 'cash-flow':
        return renderCashFlow({ startDate: config.startDate, endDate: config.endDate });
      case 'income-statement':
        return renderIncomeStatement({ startDate: config.startDate, endDate: config.endDate });
      default:
        return <p className="text-center text-gray-500 py-8">Select a report type</p>;
    }
  };

  const getReportTitle = (type: ReportType): string => {
    switch (type) {
      case 'balance-sheet':
        return 'Balance Sheet';
      case 'cash-flow':
        return 'Cash Flow Statement';
      case 'income-statement':
        return 'Income Statement';
      default:
        return 'Report';
    }
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
          title="Comparative Report"
          subtitle={isInFocus ? 'Compare reports across periods - Consolidated view' : `Compare reports across periods - ${entityName}`}
        />
      </div>

      {/* Two-column layout for report comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Report Panel */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GitCompare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg">Report A</CardTitle>
            </div>
            
            {/* Report Type Selector */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="left-report-type">Report Type</Label>
                <Select
                  value={leftReport.type}
                  onValueChange={(value: ReportType) => setLeftReport({ ...leftReport, type: value })}
                >
                  <SelectTrigger id="left-report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="left-start-date">Start Date</Label>
                  <Input
                    id="left-start-date"
                    type="date"
                    value={leftReport.startDate}
                    onChange={(e) => setLeftReport({ ...leftReport, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="left-end-date">End Date</Label>
                  <Input
                    id="left-end-date"
                    type="date"
                    value={leftReport.endDate}
                    onChange={(e) => setLeftReport({ ...leftReport, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
                {getReportTitle(leftReport.type)}
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
                {leftReport.type === 'balance-sheet' 
                  ? `As of ${new Date(leftReport.endDate).toLocaleDateString()}`
                  : `${new Date(leftReport.startDate).toLocaleDateString()} - ${new Date(leftReport.endDate).toLocaleDateString()}`
                }
              </p>
              <div className="max-h-[600px] overflow-y-auto">
                {renderReport(leftReport, leftLegacyBalanceSheet)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Report Panel */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GitCompare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-lg">Report B</CardTitle>
            </div>
            
            {/* Report Type Selector */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="right-report-type">Report Type</Label>
                <Select
                  value={rightReport.type}
                  onValueChange={(value: ReportType) => setRightReport({ ...rightReport, type: value })}
                >
                  <SelectTrigger id="right-report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="right-start-date">Start Date</Label>
                  <Input
                    id="right-start-date"
                    type="date"
                    value={rightReport.startDate}
                    onChange={(e) => setRightReport({ ...rightReport, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="right-end-date">End Date</Label>
                  <Input
                    id="right-end-date"
                    type="date"
                    value={rightReport.endDate}
                    onChange={(e) => setRightReport({ ...rightReport, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
                {getReportTitle(rightReport.type)}
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
                {rightReport.type === 'balance-sheet' 
                  ? `As of ${new Date(rightReport.endDate).toLocaleDateString()}`
                  : `${new Date(rightReport.startDate).toLocaleDateString()} - ${new Date(rightReport.endDate).toLocaleDateString()}`
                }
              </p>
              <div className="max-h-[600px] overflow-y-auto">
                {renderReport(rightReport, rightLegacyBalanceSheet)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Detail Drawer - Matches other report modules */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-4 sm:p-6 md:p-8">
          <SheetHeader className="pb-4 sm:pb-6 md:pb-8 border-b border-gray-200 dark:border-gray-700">
            <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
              {selectedLineItem?.name}
            </SheetTitle>
            <SheetDescription className="text-sm">
              General ledger transactions for the selected period
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 sm:space-y-8 md:space-y-10 mt-6 sm:mt-8 md:mt-10">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Card>
                <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Account Balance</p>
                  <p className="text-xl sm:text-2xl font-semibold">{formatCurrency(selectedLineItem?.amount || 0)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Transactions</p>
                  <p className="text-xl sm:text-2xl font-semibold">{drawerTransactions.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {drawerTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <Table className="min-w-[800px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap px-4 sm:px-6">Date</TableHead>
                            <TableHead className="whitespace-nowrap px-4 sm:px-6">Description</TableHead>
                            <TableHead className="whitespace-nowrap px-4 sm:px-6">Ref #</TableHead>
                            <TableHead className="text-right whitespace-nowrap px-4 sm:px-6">Debit</TableHead>
                            <TableHead className="text-right whitespace-nowrap px-4 sm:px-6">Credit</TableHead>
                            <TableHead className="whitespace-nowrap px-4 sm:px-6">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {drawerTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="whitespace-nowrap px-4 sm:px-6 text-sm">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </TableCell>
                              <TableCell className="px-4 sm:px-6">
                                <div className="min-w-[200px]">
                                  <p className="text-sm font-medium">{transaction.description}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {selectedLineItem?.accountCode} - {selectedLineItem?.category}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 dark:text-gray-400 px-4 sm:px-6 whitespace-nowrap">
                                {transaction.referenceNumber}
                              </TableCell>
                              <TableCell className="text-right px-4 sm:px-6 whitespace-nowrap">
                                {transaction.debit > 0 ? (
                                  <span className="text-green-600 dark:text-green-400 font-medium">
                                    {formatCurrency(transaction.debit)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right px-4 sm:px-6 whitespace-nowrap">
                                {transaction.credit > 0 ? (
                                  <span className="text-red-600 dark:text-red-400 font-medium">
                                    {formatCurrency(transaction.credit)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </TableCell>
                              <TableCell className="px-4 sm:px-6">
                                {transaction.reconciled ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 whitespace-nowrap">
                                    Reconciled
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 whitespace-nowrap">
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No transactions found for this account in the selected period.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
