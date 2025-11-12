import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getBalanceSheet } from '../lib/financialData';
import { generateLegacyBalanceSheet } from '../lib/legacyReportData';
import { BalanceSheetData, AccountBalance } from '../types/reports';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Download, ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { exportToExcel, exportToPDF, prepareBalanceSheetForExport } from '../lib/exportUtils';
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
import { Badge } from './ui/badge';
import { MultiNonprofitExportDialog } from './MultiNonprofitExportDialog';

// Account mapping to GL categories - Based on real account codes
type AccountLineItem = 
  | 'ifmCheckingPeoplesBank' // 1000
  | 'ifmSavingsPeoplesBank' // 1010
  | 'investmentAdelfiCreditUnion' // 1020
  | 'ministryPartnersCD' // 1021
  | 'peoplesBankMoneyMarket' // 1022
  | 'rbcCapitalMarkets' // 1023
  | 'stripePayments' // 1131.999999
  | 'suspense' // 2100
  | 'taxesPayable' // 2210
  | 'infocusMinisteriesFundBalance' // 3116
  | 'theUprisingFundBalance'; // 3127

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  source: string;
  entityId: string;
  category: string;
  internalCode?: string;
  debit: number;
  credit: number;
  balance?: number;
  referenceNumber?: string;
  reconciled: boolean;
}

// Mock GL transactions generator - generates realistic transactions that match balance sheet
const generateMockGLTransactions = (): LedgerEntry[] => {
  const transactions: LedgerEntry[] = [];

  // ===== AWAKENINGS TRANSACTIONS =====
  // 1000 - IFM Checking Peoples Bank: Should total $45,250
  const checkingTransactions = [
    { date: '2025-01-15', desc: 'Opening Balance Transfer', debit: 28450, credit: 0, ref: 'CHK-1001' },
    { date: '2025-02-10', desc: 'Donation - Monthly Supporters', debit: 3500, credit: 0, ref: 'CHK-1002' },
    { date: '2025-02-28', desc: 'Program Revenue - Workshop Fees', debit: 2800, credit: 0, ref: 'CHK-1003' },
    { date: '2025-03-05', desc: 'Grant Disbursement - Community Foundation', debit: 15000, credit: 0, ref: 'CHK-1004' },
    { date: '2025-03-20', desc: 'Donation - Annual Gala Event', debit: 8500, credit: 0, ref: 'CHK-1005' },
    { date: '2025-04-12', desc: 'Check #1234 - Office Rent', debit: 0, credit: 2500, ref: 'CHK-1006' },
    { date: '2025-05-08', desc: 'Donation - Individual Donors', debit: 4200, credit: 0, ref: 'CHK-1007' },
    { date: '2025-05-22', desc: 'Check #1235 - Payroll', debit: 0, credit: 5800, ref: 'CHK-1008' },
    { date: '2025-06-14', desc: 'Program Revenue - Training Services', debit: 3100, credit: 0, ref: 'CHK-1009' },
    { date: '2025-07-01', desc: 'Check #1236 - Utilities & Insurance', debit: 0, credit: 1850, ref: 'CHK-1010' },
    { date: '2025-07-18', desc: 'Donation - Corporate Sponsor', debit: 5000, credit: 0, ref: 'CHK-1011' },
    { date: '2025-08-09', desc: 'Check #1237 - Program Supplies', debit: 0, credit: 1200, ref: 'CHK-1012' },
    { date: '2025-08-25', desc: 'Donation - Online Campaign', debit: 2750, credit: 0, ref: 'CHK-1013' },
    { date: '2025-09-12', desc: 'Check #1238 - Marketing & Outreach', debit: 0, credit: 980, ref: 'CHK-1014' },
    { date: '2025-09-28', desc: 'Donation - Fall Fundraiser', debit: 3300, credit: 0, ref: 'CHK-1015' },
    { date: '2025-10-05', desc: 'Check #1239 - Administrative Costs', debit: 0, credit: 720, ref: 'CHK-1016' },
  ];

  checkingTransactions.forEach((t, i) => {
    transactions.push({
      id: `chk-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: t.debit > 0 ? 'donation' : 'expense',
      entityId: 'awakenings',
      category: '1000 - IFM Checking Peoples Bank',
      internalCode: '1000',
      debit: t.debit,
      credit: t.credit,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 1010 - IFM Savings - Peoples Bank: Should total $8,500
  const savingsTransactions = [
    { date: '2025-01-15', desc: 'Opening Balance', amount: 5000, ref: 'SAV-1001' },
    { date: '2025-03-01', desc: 'Transfer from Checking - Reserve Fund', amount: 2000, ref: 'SAV-1002' },
    { date: '2025-06-15', desc: 'Interest Income', amount: 500, ref: 'SAV-1003' },
    { date: '2025-09-01', desc: 'Transfer from Checking - Building Fund', amount: 1000, ref: 'SAV-1004' },
  ];

  savingsTransactions.forEach((t, i) => {
    transactions.push({
      id: `sav-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '1010 - IFM - Savings - Peoples Bank',
      internalCode: '1010',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 1020 - Investment - Adelfi Credit Union: Should total $12,000
  const investmentAdelfiTransactions = [
    { date: '2025-01-10', desc: 'Opening Investment Balance', amount: 10000, ref: 'INV-1001' },
    { date: '2025-04-15', desc: 'Additional Investment Contribution', amount: 1500, ref: 'INV-1002' },
    { date: '2025-08-20', desc: 'Quarterly Interest', amount: 500, ref: 'INV-1003' },
  ];

  investmentAdelfiTransactions.forEach((t, i) => {
    transactions.push({
      id: `inv-adelfi-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '1020 - Investment - Adelfi Credit Union',
      internalCode: '1020',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 1021 - Ministry Partners CD: Should total $15,000
  const ministryPartnersCDTransactions = [
    { date: '2025-02-01', desc: 'Certificate of Deposit - 12 Month Term', amount: 15000, ref: 'CD-1001' },
  ];

  ministryPartnersCDTransactions.forEach((t, i) => {
    transactions.push({
      id: `cd-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '1021 - Ministry Partners CD',
      internalCode: '1021',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 1022 - Peoples Bank Money Market: Should total $8,200
  const moneyMarketTransactions = [
    { date: '2025-01-20', desc: 'Opening Money Market Balance', amount: 7000, ref: 'MM-1001' },
    { date: '2025-05-10', desc: 'Additional Deposit', amount: 1000, ref: 'MM-1002' },
    { date: '2025-09-15', desc: 'Interest Income', amount: 200, ref: 'MM-1003' },
  ];

  moneyMarketTransactions.forEach((t, i) => {
    transactions.push({
      id: `mm-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '1022 - Peoples Bank Money Market',
      internalCode: '1022',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 1023 - RBC Capital Markets: Should total $5,800
  const rbcCapitalTransactions = [
    { date: '2025-03-01', desc: 'Investment Account Opening', amount: 5000, ref: 'RBC-1001' },
    { date: '2025-07-20', desc: 'Investment Returns', amount: 800, ref: 'RBC-1002' },
  ];

  rbcCapitalTransactions.forEach((t, i) => {
    transactions.push({
      id: `rbc-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '1023 - RBC Capital Markets',
      internalCode: '1023',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 1131.999999 - Stripe Payments: Should total $3,500
  const stripeTransactions = [
    { date: '2025-08-10', desc: 'Online Donations - August', amount: 1200, ref: 'STRIPE-1001' },
    { date: '2025-09-10', desc: 'Online Donations - September', amount: 1500, ref: 'STRIPE-1002' },
    { date: '2025-10-10', desc: 'Online Donations - October', amount: 800, ref: 'STRIPE-1003' },
  ];

  stripeTransactions.forEach((t, i) => {
    transactions.push({
      id: `stripe-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '1131.999999 - Stripe Payments',
      internalCode: '1131',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 2100 - Suspense: Should total $4,200
  const suspenseTransactions = [
    { date: '2025-09-18', desc: 'Unclassified Payment - To Be Allocated', amount: 1500, ref: 'SUSP-2001' },
    { date: '2025-09-25', desc: 'Pending Reconciliation - Donor Payment', amount: 1200, ref: 'SUSP-2002' },
    { date: '2025-10-02', desc: 'Unidentified Deposit - Investigation', amount: 850, ref: 'SUSP-2003' },
    { date: '2025-10-08', desc: 'Temporary Hold - Processing', amount: 650, ref: 'SUSP-2004' },
  ];

  suspenseTransactions.forEach((t, i) => {
    transactions.push({
      id: `susp-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '2100 - Suspense',
      internalCode: '2100',
      debit: 0,
      credit: t.amount,
      referenceNumber: t.ref,
      reconciled: false,
    });
  });

  // 2210 - Taxes Payable: Should total $2,150
  const taxesPayableTransactions = [
    { date: '2025-09-30', desc: 'Payroll Taxes - Q3 2025', amount: 1200, ref: 'TAX-2201' },
    { date: '2025-10-01', desc: 'Sales Tax - September', amount: 450, ref: 'TAX-2202' },
    { date: '2025-10-15', desc: 'Property Tax Accrual', amount: 500, ref: 'TAX-2203' },
  ];

  taxesPayableTransactions.forEach((t, i) => {
    transactions.push({
      id: `tax-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '2210 - Taxes Payable',
      internalCode: '2210',
      debit: 0,
      credit: t.amount,
      referenceNumber: t.ref,
      reconciled: false,
    });
  });

  // Deferred Revenue: Should total $5,000
  const deferredTransactions = [
    { date: '2025-08-10', desc: 'Advance Payment - November Conference Registration', amount: 2500, ref: 'DEF-6001' },
    { date: '2025-09-15', desc: 'Advance Payment - Q4 Workshop Series (Prepaid)', amount: 1500, ref: 'DEF-6002' },
    { date: '2025-10-05', desc: 'Advance Payment - December Event Sponsorship', amount: 1000, ref: 'DEF-6003' },
  ];

  deferredTransactions.forEach((t, i) => {
    transactions.push({
      id: `deferred-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '2200 - Deferred Revenue',
      internalCode: '2200',
      debit: 0,
      credit: t.amount,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // Loans Payable: Should total $25,000
  const loanTransactions = [
    { date: '2025-01-15', desc: 'Business Loan - Community Bank (5 year term)', amount: 30000, ref: 'LOAN-7001' },
    { date: '2025-04-01', desc: 'Loan Payment - Principal', amount: 1250, ref: 'LOAN-7002' },
    { date: '2025-07-01', desc: 'Loan Payment - Principal', amount: 1250, ref: 'LOAN-7003' },
    { date: '2025-10-01', desc: 'Loan Payment - Principal', amount: 2500, ref: 'LOAN-7004' },
  ];

  loanTransactions.forEach((t, i) => {
    transactions.push({
      id: `loan-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '2300 - Loans Payable',
      internalCode: '2300',
      debit: i > 0 ? t.amount : 0, // Payments are debits, original loan is credit
      credit: i === 0 ? t.amount : 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  return transactions;
};

export const BalanceSheetReport: React.FC = () => {
  const { selectedEntity, setReportTool } = useApp();
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-10-20',
  });
  
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<{
    name: string;
    amount: number;
    accountType: AccountLineItem;
  } | null>(null);

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Generate GL transactions
  const [glTransactions] = useState<LedgerEntry[]>(generateMockGLTransactions());

  // Use legacy balance sheet data
  const legacyBalanceSheet = useMemo(() => generateLegacyBalanceSheet(dateRange.endDate), [dateRange.endDate]);
  
  const balanceSheet = getBalanceSheet(selectedEntity);
  const entityName = entities.find(e => e.id === selectedEntity)?.name || 'InFocus Ministries';
  const isInFocus = selectedEntity === 'infocus';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Map account types to GL categories
  const getGLCategoryForAccount = (accountType: AccountLineItem): string[] => {
    const mapping: Record<AccountLineItem, string[]> = {
      ifmCheckingPeoplesBank: ['1000'],
      ifmSavingsPeoplesBank: ['1010'],
      investmentAdelfiCreditUnion: ['1020'],
      ministryPartnersCD: ['1021'],
      peoplesBankMoneyMarket: ['1022'],
      rbcCapitalMarkets: ['1023'],
      stripePayments: ['1131'],
      suspense: ['2100'],
      taxesPayable: ['2210'],
      infocusMinisteriesFundBalance: ['3116'],
      theUprisingFundBalance: ['3127'],
    };
    return mapping[accountType] || [];
  };

  // Filter GL transactions for selected line item
  const filteredGLTransactions = useMemo(() => {
    if (!selectedLineItem) return [];

    const glCodes = getGLCategoryForAccount(selectedLineItem.accountType);
    
    let filtered = glTransactions.filter(t => {
      // Filter by GL code
      const matchesCode = glCodes.some(code => t.internalCode?.startsWith(code));
      
      // Filter by entity
      const matchesEntity = selectedEntity === 'all' || selectedEntity === 'infocus' || t.entityId === selectedEntity;
      
      // Filter by date range
      const matchesDate = t.date >= dateRange.startDate && t.date <= dateRange.endDate;
      
      return matchesCode && matchesEntity && matchesDate;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [selectedLineItem, glTransactions, selectedEntity, dateRange]);

  // Calculate summary for drawer
  const drawerSummary = useMemo(() => {
    const totalDebits = filteredGLTransactions.reduce((sum, t) => sum + t.debit, 0);
    const totalCredits = filteredGLTransactions.reduce((sum, t) => sum + t.credit, 0);
    const netBalance = totalDebits - totalCredits; // For assets, debits increase balance

    return {
      totalDebits,
      totalCredits,
      netBalance,
      transactionCount: filteredGLTransactions.length,
    };
  }, [filteredGLTransactions]);

  // Handle legacy account click - maps account number to drawer
  const handleLegacyAccountClick = (account: AccountBalance) => {
    setSelectedLineItem({ 
      name: `${account.account_number} - ${account.account_name}`, 
      amount: account.amount, 
      accountType: 'ifmCheckingPeoplesBank' as AccountLineItem // Placeholder for now
    });
    setDrawerOpen(true);
  };

  // Handle line item click
  const handleLineItemClick = (name: string, amount: number, accountType: AccountLineItem) => {
    setSelectedLineItem({ name, amount, accountType });
    setDrawerOpen(true);
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleMultiNonprofitExport = (selectedNonprofitIds: string[], format: 'pdf' | 'xlsx') => {
    // Prepare data for each selected nonprofit
    selectedNonprofitIds.forEach(nonprofitId => {
      const nonprofit = entities.find(e => e.id === nonprofitId);
      if (!nonprofit) return;

      // Get the balance sheet data for this nonprofit
      const balanceSheetData = getBalanceSheet(nonprofitId);
      if (!balanceSheetData) return;
      
      if (format === 'xlsx') {
        const data = prepareBalanceSheetForExport(balanceSheetData, dateRange.endDate);
        const headers = ['Account', 'Amount'];
        const filename = `Balance_Sheet_${nonprofit.name.replace(/\s+/g, '_')}_${dateRange.endDate}`;
        exportToExcel(data, headers, filename, 'Balance Sheet');
      } else {
        const data = prepareBalanceSheetForExport(balanceSheetData, dateRange.endDate);
        const headers = ['Account', 'Amount'];
        const title = 'Balance Sheet';
        const subtitle = `${nonprofit.name} - As of ${new Date(dateRange.endDate).toLocaleDateString()}`;
        const filename = `Balance_Sheet_${nonprofit.name.replace(/\s+/g, '_')}_${dateRange.endDate}`;
        exportToPDF(title, subtitle, [{ data, headers }], filename);
      }
    });
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
          title="Balance Sheet"
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

      {/* Balance Sheet Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Balance Sheet</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                As of {legacyBalanceSheet.report_date}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {legacyBalanceSheet ? (
            <>
              {/* Assets Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-300 dark:border-gray-600 pb-2">ASSETS</h3>
                
                <div className="ml-4 space-y-1">
                  {legacyBalanceSheet.assets.map((account) => (
                    <div 
                      key={account.account_number}
                      className="flex justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLegacyAccountClick(account)}
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
                    <span className="font-mono tabular-nums">{formatCurrency(legacyBalanceSheet.total_assets)}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Liabilities Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-300 dark:border-gray-600 pb-2">LIABILITIES</h3>
                
                <div className="ml-4 space-y-1">
                  {legacyBalanceSheet.liabilities.map((account) => (
                    <div 
                      key={account.account_number}
                      className="flex justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLegacyAccountClick(account)}
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
                    <span className="font-mono tabular-nums">{formatCurrency(legacyBalanceSheet.total_liabilities)}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Equity Section - All 38 Fund Balances */}
              <div>
                <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-300 dark:border-gray-600 pb-2">EQUITY (FUND BALANCES)</h3>
                
                <div className="ml-4 space-y-1">
                  {legacyBalanceSheet.equity.map((account) => (
                    <div 
                      key={account.account_number}
                      className="flex justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLegacyAccountClick(account)}
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
                    <span className="font-mono tabular-nums">{formatCurrency(legacyBalanceSheet.total_equity)}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Total Liabilities & Equity */}
              <div className="flex justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-bold text-lg">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span className="font-mono tabular-nums">{formatCurrency(legacyBalanceSheet.total_liabilities + legacyBalanceSheet.total_equity)}</span>
              </div>
              
              {/* Balance Check */}
              {!legacyBalanceSheet.balanced && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Balance sheet does not balance. Assets: {formatCurrency(legacyBalanceSheet.total_assets)}, 
                    Liabilities + Equity: {formatCurrency(legacyBalanceSheet.total_liabilities + legacyBalanceSheet.total_equity)}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No balance sheet data available for this organization.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-8">
          <SheetHeader className="pb-8 border-b border-gray-200 dark:border-gray-700">
            <SheetTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              {selectedLineItem?.name}
            </SheetTitle>
            <SheetDescription>
              General ledger transactions for {dateRange.startDate} to {dateRange.endDate}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-10 mt-10">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance Sheet Amount</p>
                  <p className="text-2xl">{formatCurrency(selectedLineItem?.amount || 0)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transactions</p>
                  <p className="text-2xl">{drawerSummary.transactionCount}</p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredGLTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Ref #</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGLTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{transaction.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                              {transaction.referenceNumber}
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.debit > 0 ? (
                                <span className="text-green-600 dark:text-green-400">
                                  {formatCurrency(transaction.debit)}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.credit > 0 ? (
                                <span className="text-red-600 dark:text-red-400">
                                  {formatCurrency(transaction.credit)}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {transaction.reconciled ? (
                                <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                                  Reconciled
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

      {/* Multi-Nonprofit Export Dialog */}
      <MultiNonprofitExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        reportType="balance-sheet"
        onExport={handleMultiNonprofitExport}
      />
    </div>
  );
};
