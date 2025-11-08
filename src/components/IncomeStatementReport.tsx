import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MultiNonprofitExportDialog } from './MultiNonprofitExportDialog';
import { exportToExcel, exportToPDF, prepareIncomeStatementForExport } from '../lib/exportUtils';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  internalCode: string;
  referenceNumber: string;
  donorName?: string;
  donorId?: string;
}

interface LineItemDetails {
  label: string;
  amount: number;
  accountCode: string;
  category: string;
}

interface IncomeStatementData {
  revenue: {
    donations: number;
    earnedIncome: number;
    bookSales: number;
    initialFees: number;
    interestIncome: number;
    miscRevenue: number;
    adminFees: number;
    total: number;
  };
  expenses: {
    programServices: {
      tithe: number;
      donation: number;
      familySupport: number;
      foreignSupplies: number;
      foreignEquipment: number;
      foreignConstruction: number;
      total: number;
    };
    personnel: {
      salariesOfficers: number;
      salariesOthers: number;
      pensionRetirement: number;
      benefits: number;
      payrollTaxes: number;
      total: number;
    };
    administrative: {
      legal: number;
      accounting: number;
      advertising: number;
      officeSupplies: number;
      postage: number;
      printing: number;
      it: number;
      software: number;
      total: number;
    };
    facilities: {
      rent: number;
      utilities: number;
      telephone: number;
      repairs: number;
      mortgageInterest: number;
      total: number;
    };
    other: {
      travel: number;
      meals: number;
      training: number;
      insurance: number;
      bankFees: number;
      contractFees: number;
      donorAppreciation: number;
      ifmAdminFee: number;
      miscExpense: number;
      total: number;
    };
    totalExpenses: number;
  };
  netIncome: number;
}

// Generate mock transactions for income statement - substantiates the numbers
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];

  // ===== AWAKENINGS DONATION TRANSACTIONS (Total: ~$125,000) =====
  const donationTxns = [
    { date: '2025-01-15', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1001' },
    { date: '2025-01-20', desc: 'One-Time Donation - Annual Appeal', amount: 5000, donor: 'Robert Martinez', donorId: 'DONOR-002', ref: 'DON-1002' },
    { date: '2025-02-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1003' },
    { date: '2025-02-14', desc: 'Valentine Campaign Donation', amount: 2500, donor: 'Michael Chen', donorId: 'DONOR-003', ref: 'DON-1004' },
    { date: '2025-02-28', desc: 'Major Gift - Building Fund', amount: 10000, donor: 'Jennifer Lee', donorId: 'DONOR-004', ref: 'DON-1005' },
    { date: '2025-03-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1006' },
    { date: '2025-03-15', desc: 'Spring Fundraiser Event', amount: 8500, donor: 'Amanda White', donorId: 'DONOR-005', ref: 'DON-1007' },
    { date: '2025-03-22', desc: 'Corporate Matching Gift', amount: 7500, donor: 'David Thompson', donorId: 'DONOR-006', ref: 'DON-1008' },
    { date: '2025-04-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1009' },
    { date: '2025-04-18', desc: 'Easter Campaign', amount: 4200, donor: 'Maria Garcia', donorId: 'DONOR-007', ref: 'DON-1010' },
    { date: '2025-05-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1011' },
    { date: '2025-05-25', desc: 'Memorial Day Special', amount: 6800, donor: 'Lisa Anderson', donorId: 'DONOR-008', ref: 'DON-1012' },
    { date: '2025-06-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1013' },
    { date: '2025-06-15', desc: 'Mid-Year Appeal', amount: 12000, donor: 'Thomas Brown', donorId: 'DONOR-009', ref: 'DON-1014' },
    { date: '2025-07-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1015' },
    { date: '2025-07-20', desc: 'Summer Camp Sponsorship', amount: 9500, donor: 'Emily Rodriguez', donorId: 'DONOR-010', ref: 'DON-1016' },
    { date: '2025-08-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1017' },
    { date: '2025-08-28', desc: 'Back to School Drive', amount: 5500, donor: 'Kevin Davis', donorId: 'DONOR-011', ref: 'DON-1018' },
    { date: '2025-09-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1019' },
    { date: '2025-09-22', desc: 'Annual Gala Donation', amount: 15000, donor: 'Patricia Moore', donorId: 'DONOR-012', ref: 'DON-1020' },
    { date: '2025-10-10', desc: 'Monthly Recurring Donation', amount: 500, donor: 'Sarah Johnson', donorId: 'DONOR-001', ref: 'DON-1021' },
    { date: '2025-10-15', desc: 'Fall Campaign', amount: 8000, donor: 'Christopher Wilson', donorId: 'DONOR-013', ref: 'DON-1022' },
    { date: '2025-10-20', desc: 'One-Time Gift', amount: 3500, donor: 'Nancy Taylor', donorId: 'DONOR-014', ref: 'DON-1023' },
    { date: '2025-10-22', desc: 'Online Donation', amount: 2500, donor: 'Daniel Anderson', donorId: 'DONOR-015', ref: 'DON-1024' },
  ];

  donationTxns.forEach((t, i) => {
    transactions.push({
      id: `don-awk-${i}`,
      date: t.date,
      description: t.desc,
      amount: t.amount,
      category: '4000 - Donations',
      internalCode: '4000',
      referenceNumber: t.ref,
      donorName: t.donor,
      donorId: t.donorId,
    });
  });

  // ===== EARNED INCOME TRANSACTIONS (Total: ~$45,000) =====
  const earnedIncomeTxns = [
    { date: '2025-02-15', desc: 'Training Workshop - Leadership Series', amount: 3500, ref: 'EARN-2001' },
    { date: '2025-03-20', desc: 'Consulting Services - Community Center', amount: 5000, ref: 'EARN-2002' },
    { date: '2025-04-10', desc: 'Speaking Engagement - Conference', amount: 2500, ref: 'EARN-2003' },
    { date: '2025-05-05', desc: 'Program Fees - Youth Development', amount: 4800, ref: 'EARN-2004' },
    { date: '2025-06-12', desc: 'Training Workshop - Team Building', amount: 3200, ref: 'EARN-2005' },
    { date: '2025-07-08', desc: 'Summer Camp Registration Fees', amount: 8500, ref: 'EARN-2006' },
    { date: '2025-08-15', desc: 'Consulting Services - School District', amount: 6500, ref: 'EARN-2007' },
    { date: '2025-09-10', desc: 'Workshop Series - Fall Programs', amount: 5200, ref: 'EARN-2008' },
    { date: '2025-10-05', desc: 'Speaking Fees - Leadership Summit', amount: 3800, ref: 'EARN-2009' },
    { date: '2025-10-18', desc: 'Program Service Fees', amount: 2000, ref: 'EARN-2010' },
  ];

  earnedIncomeTxns.forEach((t, i) => {
    transactions.push({
      id: `earn-awk-${i}`,
      date: t.date,
      description: t.desc,
      amount: t.amount,
      category: '4100 - Earned Income',
      internalCode: '4100',
      referenceNumber: t.ref,
    });
  });

  // Add expense transactions (simplified for brevity)
  // Program Services - Tithe (~$15,000)
  transactions.push({
    id: 'exp-tithe-1',
    date: '2025-03-01',
    description: 'Quarterly Tithe Payment - Church Partnership',
    amount: 5000,
    category: '5000 - Tithe',
    internalCode: '5000',
    referenceNumber: 'TITHE-3001',
  }, {
    id: 'exp-tithe-2',
    date: '2025-06-01',
    description: 'Quarterly Tithe Payment - Church Partnership',
    amount: 5000,
    category: '5000 - Tithe',
    internalCode: '5000',
    referenceNumber: 'TITHE-3002',
  }, {
    id: 'exp-tithe-3',
    date: '2025-09-01',
    description: 'Quarterly Tithe Payment - Church Partnership',
    amount: 5000,
    category: '5000 - Tithe',
    internalCode: '5000',
    referenceNumber: 'TITHE-3003',
  });

  // Personnel - Salaries Officers (~$45,000)
  for (let i = 1; i <= 10; i++) {
    transactions.push({
      id: `sal-off-${i}`,
      date: `2025-${String(i).padStart(2, '0')}-01`,
      description: 'Officer Salaries - Executive Director & CFO',
      amount: 4500,
      category: '5100 - Compensation - Officers/Directors',
      internalCode: '5100',
      referenceNumber: `SAL-OFF-${4000 + i}`,
    });
  }

  // Administrative - Legal Fees (~$5,000)
  transactions.push({
    id: 'leg-1',
    date: '2025-03-15',
    description: 'Legal Consultation - Nonprofit Compliance',
    amount: 2500,
    category: '5200 - Legal Fees',
    internalCode: '5200',
    referenceNumber: 'LEGAL-5001',
  }, {
    id: 'leg-2',
    date: '2025-08-22',
    description: 'Legal Services - Contract Review',
    amount: 2500,
    category: '5200 - Legal Fees',
    internalCode: '5200',
    referenceNumber: 'LEGAL-5002',
  });

  // Facilities - Rent (~$18,000)
  for (let i = 1; i <= 10; i++) {
    transactions.push({
      id: `rent-${i}`,
      date: `2025-${String(i).padStart(2, '0')}-01`,
      description: 'Monthly Office Rent',
      amount: 1800,
      category: '5500 - Rent',
      internalCode: '5500',
      referenceNumber: `RENT-${6000 + i}`,
    });
  }

  return transactions;
};

// Generate mock income statement data
const generateIncomeStatement = (entityId: string): IncomeStatementData => {
  const isInFocus = entityId === 'infocus';
  const multiplier = isInFocus ? 34 : 1;

  const revenue = {
    donations: 125000 * multiplier * (0.8 + Math.random() * 0.4),
    earnedIncome: 45000 * multiplier * (0.8 + Math.random() * 0.4),
    bookSales: 8500 * multiplier * (0.8 + Math.random() * 0.4),
    initialFees: 12000 * multiplier * (0.8 + Math.random() * 0.4),
    interestIncome: 2500 * multiplier * (0.8 + Math.random() * 0.4),
    miscRevenue: 6000 * multiplier * (0.8 + Math.random() * 0.4),
    adminFees: isInFocus ? 85000 * multiplier : 0,
    total: 0,
  };
  revenue.total = Object.values(revenue).reduce((sum, val) => sum + val, 0) - revenue.total;

  const programServices = {
    tithe: 15000 * multiplier * (0.8 + Math.random() * 0.4),
    donation: 8000 * multiplier * (0.8 + Math.random() * 0.4),
    familySupport: 25000 * multiplier * (0.8 + Math.random() * 0.4),
    foreignSupplies: 12000 * multiplier * (0.8 + Math.random() * 0.4),
    foreignEquipment: 8500 * multiplier * (0.8 + Math.random() * 0.4),
    foreignConstruction: 18000 * multiplier * (0.8 + Math.random() * 0.4),
    total: 0,
  };
  programServices.total = Object.values(programServices).reduce((sum, val) => sum + val, 0) - programServices.total;

  const personnel = {
    salariesOfficers: 45000 * multiplier * (0.8 + Math.random() * 0.4),
    salariesOthers: 65000 * multiplier * (0.8 + Math.random() * 0.4),
    pensionRetirement: 12000 * multiplier * (0.8 + Math.random() * 0.4),
    benefits: 8500 * multiplier * (0.8 + Math.random() * 0.4),
    payrollTaxes: 9500 * multiplier * (0.8 + Math.random() * 0.4),
    total: 0,
  };
  personnel.total = Object.values(personnel).reduce((sum, val) => sum + val, 0) - personnel.total;

  const administrative = {
    legal: 5000 * multiplier * (0.8 + Math.random() * 0.4),
    accounting: 8500 * multiplier * (0.8 + Math.random() * 0.4),
    advertising: 12000 * multiplier * (0.8 + Math.random() * 0.4),
    officeSupplies: 4500 * multiplier * (0.8 + Math.random() * 0.4),
    postage: 2500 * multiplier * (0.8 + Math.random() * 0.4),
    printing: 3200 * multiplier * (0.8 + Math.random() * 0.4),
    it: 6500 * multiplier * (0.8 + Math.random() * 0.4),
    software: 4800 * multiplier * (0.8 + Math.random() * 0.4),
    total: 0,
  };
  administrative.total = Object.values(administrative).reduce((sum, val) => sum + val, 0) - administrative.total;

  const facilities = {
    rent: 18000 * multiplier * (0.8 + Math.random() * 0.4),
    utilities: 4500 * multiplier * (0.8 + Math.random() * 0.4),
    telephone: 3200 * multiplier * (0.8 + Math.random() * 0.4),
    repairs: 5500 * multiplier * (0.8 + Math.random() * 0.4),
    mortgageInterest: 8500 * multiplier * (0.8 + Math.random() * 0.4),
    total: 0,
  };
  facilities.total = Object.values(facilities).reduce((sum, val) => sum + val, 0) - facilities.total;

  const other = {
    travel: 8500 * multiplier * (0.8 + Math.random() * 0.4),
    meals: 3500 * multiplier * (0.8 + Math.random() * 0.4),
    training: 4200 * multiplier * (0.8 + Math.random() * 0.4),
    insurance: 7500 * multiplier * (0.8 + Math.random() * 0.4),
    bankFees: 1200 * multiplier * (0.8 + Math.random() * 0.4),
    contractFees: 9500 * multiplier * (0.8 + Math.random() * 0.4),
    donorAppreciation: 3800 * multiplier * (0.8 + Math.random() * 0.4),
    ifmAdminFee: isInFocus ? 0 : 8500 * (0.8 + Math.random() * 0.4),
    miscExpense: 2500 * multiplier * (0.8 + Math.random() * 0.4),
    total: 0,
  };
  other.total = Object.values(other).reduce((sum, val) => sum + val, 0) - other.total;

  const totalExpenses = 
    programServices.total +
    personnel.total +
    administrative.total +
    facilities.total +
    other.total;

  return {
    revenue,
    expenses: {
      programServices,
      personnel,
      administrative,
      facilities,
      other,
      totalExpenses,
    },
    netIncome: revenue.total - totalExpenses,
  };
};

export const IncomeStatementReport: React.FC = () => {
  const { selectedEntity, setReportTool, setCurrentPage, setSelectedDonor, setDonorTool } = useApp();
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-10-24',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<LineItemDetails | null>(null);
  
  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const data = generateIncomeStatement(selectedEntity);
  const entityName = entities.find(e => e.id === selectedEntity)?.name || 'InFocus Ministries';
  const isInFocus = selectedEntity === 'infocus';

  // Get all transactions and filter
  const allTransactions = useMemo(() => generateMockTransactions(), []);
  
  const filteredTransactions = useMemo(() => {
    if (!selectedLineItem || selectedEntity === 'all') return [];
    
    return allTransactions.filter(txn => {
      // Filter by entity (only show awakenings for now since that's where we have detailed data)
      if (selectedEntity !== 'awakenings') return false;
      
      // Filter by account code
      if (txn.internalCode !== selectedLineItem.accountCode) return false;
      
      // Filter by date range
      if (txn.date < dateRange.startDate || txn.date > dateRange.endDate) return false;
      
      return true;
    });
  }, [selectedLineItem, selectedEntity, dateRange, allTransactions]);

  const handleLineItemClick = (label: string, amount: number, accountCode: string, category: string) => {
    if (selectedEntity === 'all') {
      toast.error('Please select a specific nonprofit to view transaction details');
      return;
    }
    if (selectedEntity !== 'awakenings') {
      toast.info('Detailed transactions are only available for Awakenings (demo data)');
      return;
    }
    
    setSelectedLineItem({ label, amount, accountCode, category });
    setDrawerOpen(true);
  };

  const handleDonorClick = (donorId: string, donorName: string) => {
    setSelectedDonor(donorName);
    setDonorTool('donors');
    setCurrentPage('donor-hub');
    setDrawerOpen(false);
    toast.success(`Navigating to ${donorName}'s profile`);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleMultiNonprofitExport = (selectedNonprofitIds: string[], format: 'pdf' | 'xlsx') => {
    // Prepare data for each selected nonprofit
    selectedNonprofitIds.forEach(nonprofitId => {
      const nonprofit = entities.find(e => e.id === nonprofitId);
      if (!nonprofit) return;

      // Get the income statement data for this nonprofit
      const incomeData = generateIncomeStatementData();
      
      if (format === 'xlsx') {
        const data = prepareIncomeStatementForExport(incomeData);
        const headers = ['Category', 'Amount'];
        const filename = `Income_Statement_${nonprofit.name.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}`;
        exportToExcel(data, headers, filename, 'Income Statement');
      } else {
        const data = prepareIncomeStatementForExport(incomeData);
        const headers = ['Category', 'Amount'];
        const title = 'Income Statement';
        const subtitle = `${nonprofit.name} - ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`;
        const filename = `Income_Statement_${nonprofit.name.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}`;
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100 mb-1">Income Statement</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isInFocus ? 'Consolidated view across all nonprofits' : entityName}
          </p>
        </div>
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
              <CardTitle>Income Statement</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For the period {dateRange.startDate} to {dateRange.endDate}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* REVENUE SECTION */}
          <div>
            <h3 className="mb-4 text-blue-600 dark:text-blue-400">REVENUE</h3>
            
            <div className="space-y-2 ml-4 text-sm">
              <div 
                className="flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950/20 p-2 rounded cursor-pointer transition-colors"
                onClick={() => handleLineItemClick('Donations', data.revenue.donations, '4000', 'revenue')}
              >
                <span className="text-gray-600 dark:text-gray-400">4000 - Donations</span>
                <span>{formatCurrency(data.revenue.donations)}</span>
              </div>
              <div 
                className="flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950/20 p-2 rounded cursor-pointer transition-colors"
                onClick={() => handleLineItemClick('Earned Income', data.revenue.earnedIncome, '4100', 'revenue')}
              >
                <span className="text-gray-600 dark:text-gray-400">4100 - Earned Income</span>
                <span>{formatCurrency(data.revenue.earnedIncome)}</span>
              </div>
              <div 
                className="flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950/20 p-2 rounded cursor-pointer transition-colors"
                onClick={() => handleLineItemClick('Book Sales', data.revenue.bookSales, '4200', 'revenue')}
              >
                <span className="text-gray-600 dark:text-gray-400">4200 - Book Sales</span>
                <span>{formatCurrency(data.revenue.bookSales)}</span>
              </div>
              <div 
                className="flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950/20 p-2 rounded cursor-pointer transition-colors"
                onClick={() => handleLineItemClick('Initial Fees', data.revenue.initialFees, '4300', 'revenue')}
              >
                <span className="text-gray-600 dark:text-gray-400">4300 - Initial Fees</span>
                <span>{formatCurrency(data.revenue.initialFees)}</span>
              </div>
              <div 
                className="flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950/20 p-2 rounded cursor-pointer transition-colors"
                onClick={() => handleLineItemClick('Interest Income', data.revenue.interestIncome, '4400', 'revenue')}
              >
                <span className="text-gray-600 dark:text-gray-400">4400 - Interest Income</span>
                <span>{formatCurrency(data.revenue.interestIncome)}</span>
              </div>
              <div 
                className="flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950/20 p-2 rounded cursor-pointer transition-colors"
                onClick={() => handleLineItemClick('Miscellaneous Revenue', data.revenue.miscRevenue, '4500', 'revenue')}
              >
                <span className="text-gray-600 dark:text-gray-400">4500 - Miscellaneous Revenue</span>
                <span>{formatCurrency(data.revenue.miscRevenue)}</span>
              </div>
              {isInFocus && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">4600 - Admin Fees from Ministries</span>
                  <span>{formatCurrency(data.revenue.adminFees)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                <span>Total Revenue</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(data.revenue.total)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* EXPENSES SECTION */}
          <div>
            <h3 className="mb-4 text-red-600 dark:text-red-400">EXPENSES</h3>

            {/* Program Services */}
            <div className="mb-6">
              <h4 className="ml-2 mb-3 text-sm">Program Services</h4>
              <div className="space-y-2 ml-6 text-sm">
                <div 
                  className="flex justify-between hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded cursor-pointer transition-colors"
                  onClick={() => handleLineItemClick('Tithe', data.expenses.programServices.tithe, '5000', 'expense')}
                >
                  <span className="text-gray-600 dark:text-gray-400">5000 - Tithe</span>
                  <span>{formatCurrency(data.expenses.programServices.tithe)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5000 - Donation</span>
                  <span>{formatCurrency(data.expenses.programServices.donation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5010 - Family Support</span>
                  <span>{formatCurrency(data.expenses.programServices.familySupport)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5070 - Supplies - Foreign</span>
                  <span>{formatCurrency(data.expenses.programServices.foreignSupplies)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5080 - Equipment - Foreign</span>
                  <span>{formatCurrency(data.expenses.programServices.foreignEquipment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5060 - Construction - Foreign</span>
                  <span>{formatCurrency(data.expenses.programServices.foreignConstruction)}</span>
                </div>
                <div className="flex justify-between ml-4 pt-1 border-t">
                  <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span>{formatCurrency(data.expenses.programServices.total)}</span>
                </div>
              </div>
            </div>

            {/* Personnel */}
            <div className="mb-6">
              <h4 className="ml-2 mb-3 text-sm">Personnel</h4>
              <div className="space-y-2 ml-6 text-sm">
                <div 
                  className="flex justify-between hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded cursor-pointer transition-colors"
                  onClick={() => handleLineItemClick('Compensation - Officers/Directors', data.expenses.personnel.salariesOfficers, '5100', 'expense')}
                >
                  <span className="text-gray-600 dark:text-gray-400">5100 - Compensation - Officers/Directors</span>
                  <span>{formatCurrency(data.expenses.personnel.salariesOfficers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5110 - Compensation - All Others</span>
                  <span>{formatCurrency(data.expenses.personnel.salariesOthers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5120 - Pension/Retirement</span>
                  <span>{formatCurrency(data.expenses.personnel.pensionRetirement)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5130 - Other Employee Benefits</span>
                  <span>{formatCurrency(data.expenses.personnel.benefits)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5140 - Payroll Taxes</span>
                  <span>{formatCurrency(data.expenses.personnel.payrollTaxes)}</span>
                </div>
                <div className="flex justify-between ml-4 pt-1 border-t">
                  <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span>{formatCurrency(data.expenses.personnel.total)}</span>
                </div>
              </div>
            </div>

            {/* Administrative */}
            <div className="mb-6">
              <h4 className="ml-2 mb-3 text-sm">Administrative</h4>
              <div className="space-y-2 ml-6 text-sm">
                <div 
                  className="flex justify-between hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded cursor-pointer transition-colors"
                  onClick={() => handleLineItemClick('Legal Fees', data.expenses.administrative.legal, '5200', 'expense')}
                >
                  <span className="text-gray-600 dark:text-gray-400">5200 - Legal Fees</span>
                  <span>{formatCurrency(data.expenses.administrative.legal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5210 - Accounting</span>
                  <span>{formatCurrency(data.expenses.administrative.accounting)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5240 - Advertising Expenses</span>
                  <span>{formatCurrency(data.expenses.administrative.advertising)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5300 - Office Supplies</span>
                  <span>{formatCurrency(data.expenses.administrative.officeSupplies)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5320 - Postage, Mailing Service</span>
                  <span>{formatCurrency(data.expenses.administrative.postage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5330 - Printing and Copying</span>
                  <span>{formatCurrency(data.expenses.administrative.printing)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5400 - Information Technology</span>
                  <span>{formatCurrency(data.expenses.administrative.it)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5410 - Software Programs</span>
                  <span>{formatCurrency(data.expenses.administrative.software)}</span>
                </div>
                <div className="flex justify-between ml-4 pt-1 border-t">
                  <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span>{formatCurrency(data.expenses.administrative.total)}</span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-6">
              <h4 className="ml-2 mb-3 text-sm">Facilities</h4>
              <div className="space-y-2 ml-6 text-sm">
                <div 
                  className="flex justify-between hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded cursor-pointer transition-colors"
                  onClick={() => handleLineItemClick('Rent', data.expenses.facilities.rent, '5500', 'expense')}
                >
                  <span className="text-gray-600 dark:text-gray-400">5500 - Rent</span>
                  <span>{formatCurrency(data.expenses.facilities.rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5510 - Utilities</span>
                  <span>{formatCurrency(data.expenses.facilities.utilities)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5520 - Telephone, Telecommunications</span>
                  <span>{formatCurrency(data.expenses.facilities.telephone)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5530 - Repairs and Maintenance</span>
                  <span>{formatCurrency(data.expenses.facilities.repairs)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5540 - Mortgage Interest</span>
                  <span>{formatCurrency(data.expenses.facilities.mortgageInterest)}</span>
                </div>
                <div className="flex justify-between ml-4 pt-1 border-t">
                  <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span>{formatCurrency(data.expenses.facilities.total)}</span>
                </div>
              </div>
            </div>

            {/* Other Expenses */}
            <div className="mb-6">
              <h4 className="ml-2 mb-3 text-sm">Other Expenses</h4>
              <div className="space-y-2 ml-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5600 - Travel and Meetings</span>
                  <span>{formatCurrency(data.expenses.other.travel)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5660 - Meals</span>
                  <span>{formatCurrency(data.expenses.other.meals)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5670 - Training</span>
                  <span>{formatCurrency(data.expenses.other.training)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5700 - Insurance Premium</span>
                  <span>{formatCurrency(data.expenses.other.insurance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5800 - Bank Fees</span>
                  <span>{formatCurrency(data.expenses.other.bankFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5810 - Contract Fees</span>
                  <span>{formatCurrency(data.expenses.other.contractFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5820 - Donor Appreciation</span>
                  <span>{formatCurrency(data.expenses.other.donorAppreciation)}</span>
                </div>
                {!isInFocus && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">5900 - IFM Admin Fee</span>
                    <span>{formatCurrency(data.expenses.other.ifmAdminFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">5890 - Miscellaneous Expense</span>
                  <span>{formatCurrency(data.expenses.other.miscExpense)}</span>
                </div>
                <div className="flex justify-between ml-4 pt-1 border-t">
                  <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span>{formatCurrency(data.expenses.other.total)}</span>
                </div>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded ml-4">
              <div className="flex justify-between">
                <span>Total Expenses</span>
                <span className="text-red-600 dark:text-red-400">{formatCurrency(data.expenses.totalExpenses)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* NET INCOME */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg">NET INCOME</span>
              <span className={`text-xl ${
                data.netIncome >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(data.netIncome)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              (Total Revenue minus Total Expenses)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedLineItem?.label} - Transaction Details</SheetTitle>
            <SheetDescription>
              {selectedLineItem?.accountCode} | {entityName}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {selectedLineItem?.category === 'revenue' ? 'Revenue' : 'Expense'} Amount
                  </p>
                  <p className="text-2xl">{formatCurrency(selectedLineItem?.amount || 0)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {selectedLineItem?.accountCode === '4000' ? 'Donors' : 'Transactions'}
                  </p>
                  <p className="text-2xl">{filteredTransactions.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table - Special view for Donations */}
            {selectedLineItem?.accountCode === '4000' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Donor Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Donor</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{txn.donorName}</span>
                                {txn.description.includes('Recurring') && (
                                  <Badge variant="secondary" className="text-xs">Recurring</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(txn.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(txn.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDonorClick(txn.donorId || '', txn.donorName || '')}
                                className="gap-1"
                              >
                                View Profile
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              /* Regular Transactions Table */
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                              No transactions found for this category
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTransactions.map((txn) => (
                            <TableRow key={txn.id}>
                              <TableCell className="text-sm">
                                {new Date(txn.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="text-sm">{txn.description}</div>
                                  <div className="text-xs text-gray-500">{txn.category}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                {txn.referenceNumber}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={selectedLineItem?.category === 'revenue' 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                                }>
                                  {formatCurrency(txn.amount)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Multi-Nonprofit Export Dialog */}
      <MultiNonprofitExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        reportType="income-statement"
        onExport={handleMultiNonprofitExport}
      />
    </div>
  );
};
