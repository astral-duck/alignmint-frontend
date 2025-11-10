import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getProfitLoss } from '../lib/financialData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Download, ArrowLeft, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { exportToExcel, exportToPDF, prepareProfitLossForExport } from '../lib/exportUtils';
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

// Account mapping to GL categories - Based on real P&L account codes
type PLAccountLineItem = 
  | 'directPublicSupport' // 4500
  | 'initialFee' // 4510
  | 'interestIncome' // 4520
  | 'miscellaneousRevenue' // 4530
  | 'salesFromInvenorites' // 4600
  | 'advertisingExpenses' // 5001
  | 'bankFees' // 5002
  | 'boardEducation' // 5003
  | 'fundraisingExpenses' // 5011
  | 'officeSupplies' // 5014
  | 'payrollExpenses' // 5019
  | 'postageMailingService' // 5020
  | 'rent' // 5023
  | 'telephoneTelecommunications' // 5028
  | 'donorAppreciation' // 5033
  | 'businessExpenses' // 5034
  | 'insurancePremium' // 5013
  | 'meals' // 5014
  | 'parking' // 5018
  | 'supplies' // 5027
  | 'transportation' // 5031
  | 'travelMeetings' // 5032
  | 'uniformLinens' // 5000
  | 'adminFee' // 5000
  | 'professionalServices' // 5026
  | 'softwarePrograms' // 5026
  | 'miscellaneousExpense' // 5000
  | 'reconciliationDiscrepancies' // 6001
  | 'askMyAccountant'; // 6004

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

// Mock GL transactions generator for P&L accounts
const generateMockPLTransactions = (): LedgerEntry[] => {
  const transactions: LedgerEntry[] = [];

  // ===== INCOME TRANSACTIONS (AWAKENINGS) =====
  // 4500 - Direct Public Support
  const directSupportTransactions = [
    { date: '2025-01-15', desc: 'Individual Donation - John Doe', amount: 5000, ref: 'DON-4501' },
    { date: '2025-02-10', desc: 'Monthly Recurring Donations', amount: 3500, ref: 'DON-4502' },
    { date: '2025-03-05', desc: 'Annual Gala Event Donations', amount: 12500, ref: 'DON-4503' },
    { date: '2025-04-20', desc: 'Corporate Sponsorship - ABC Corp', amount: 8000, ref: 'DON-4504' },
    { date: '2025-05-15', desc: 'Online Fundraising Campaign', amount: 4200, ref: 'DON-4505' },
    { date: '2025-06-10', desc: 'Memorial Gift - Smith Family', amount: 2500, ref: 'DON-4506' },
    { date: '2025-07-18', desc: 'Monthly Recurring Donations', amount: 3504.68, ref: 'DON-4507' },
    { date: '2025-08-25', desc: 'Foundation Grant - Community Fund', amount: 5000, ref: 'DON-4508' },
    { date: '2025-09-12', desc: 'Fall Fundraiser Event', amount: 2500, ref: 'DON-4509' },
    { date: '2025-10-05', desc: 'Major Donor - Estate Gift', amount: 500, ref: 'DON-4510' },
  ];

  directSupportTransactions.forEach((t, i) => {
    transactions.push({
      id: `income-ds-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'donation',
      entityId: 'awakenings',
      category: '4500 - Direct Public Support',
      internalCode: '4500',
      debit: 0,
      credit: t.amount,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // ===== EXPENSE TRANSACTIONS (AWAKENINGS) =====
  // 5001 - Advertising Expenses
  const advertisingTransactions = [
    { date: '2025-02-08', desc: 'Facebook Ad Campaign - Spring Fundraiser', amount: 850.00, ref: 'ADV-5001' },
    { date: '2025-04-15', desc: 'Google Ads - Donor Recruitment', amount: 1200.35, ref: 'ADV-5002' },
    { date: '2025-07-22', desc: 'Print Advertisement - Local Magazine', amount: 450.00, ref: 'ADV-5003' },
    { date: '2025-09-10', desc: 'Social Media Marketing Campaign', amount: 355.00, ref: 'ADV-5004' },
  ];

  advertisingTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-adv-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5001 - Advertising Expenses',
      internalCode: '5001',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5002 - Bank Fees
  const bankFeesTransactions = [
    { date: '2025-01-31', desc: 'Monthly Account Maintenance Fee', amount: 125.00, ref: 'BANK-5001' },
    { date: '2025-02-28', desc: 'Wire Transfer Fee', amount: 45.00, ref: 'BANK-5002' },
    { date: '2025-03-31', desc: 'Monthly Account Maintenance Fee', amount: 125.00, ref: 'BANK-5003' },
    { date: '2025-04-30', desc: 'Check Processing Fees', amount: 85.50, ref: 'BANK-5004' },
    { date: '2025-05-31', desc: 'Monthly Account Maintenance Fee', amount: 125.00, ref: 'BANK-5005' },
    { date: '2025-06-30', desc: 'ACH Processing Fees', amount: 156.51, ref: 'BANK-5006' },
    { date: '2025-07-31', desc: 'Monthly Account Maintenance Fee', amount: 125.00, ref: 'BANK-5007' },
    { date: '2025-08-31', desc: 'Overdraft Protection Fee', amount: 35.00, ref: 'BANK-5008' },
    { date: '2025-09-30', desc: 'Monthly Account Maintenance Fee', amount: 125.00, ref: 'BANK-5009' },
    { date: '2025-10-25', desc: 'Credit Card Processing Fees', amount: 485.00, ref: 'BANK-5010' },
  ];

  bankFeesTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-bank-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5002 - Bank Fees',
      internalCode: '5002',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5019 - Payroll Expenses
  const payrollTransactions = [
    { date: '2025-01-15', desc: 'Payroll - Executive Director', amount: 1250.00, ref: 'PAY-5001' },
    { date: '2025-01-15', desc: 'Payroll Taxes - January', amount: 189.16, ref: 'PAY-5002' },
    { date: '2025-02-15', desc: 'Payroll - Executive Director', amount: 1250.00, ref: 'PAY-5003' },
    { date: '2025-02-15', desc: 'Payroll - Program Coordinator', amount: 950.00, ref: 'PAY-5004' },
    { date: '2025-03-15', desc: 'Payroll - Executive Director', amount: 1250.00, ref: 'PAY-5005' },
    { date: '2025-03-15', desc: 'Payroll - Program Coordinator', amount: 950.00, ref: 'PAY-5006' },
    { date: '2025-04-15', desc: 'Payroll - All Staff', amount: 2350.00, ref: 'PAY-5007' },
    { date: '2025-05-15', desc: 'Payroll - All Staff', amount: 1250.00, ref: 'PAY-5008' },
    { date: '2025-06-15', desc: 'Payroll - All Staff', amount: 950.00, ref: 'PAY-5009' },
    { date: '2025-07-15', desc: 'Payroll - All Staff', amount: 1250.00, ref: 'PAY-5010' },
    { date: '2025-08-15', desc: 'Payroll - All Staff', amount: 485.00, ref: 'PAY-5011' },
  ];

  payrollTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-payroll-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5019 - Payroll Expenses',
      internalCode: '5019',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5023 - Rent
  const rentTransactions = [
    { date: '2025-01-01', desc: 'Office Rent - January', amount: 1500.00, ref: 'RENT-5001' },
  ];

  rentTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-rent-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5023 - Rent',
      internalCode: '5023',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5028 - Telephone, Telecommunications
  const telephoneTransactions = [
    { date: '2025-03-10', desc: 'Cell Phone Plan - Executive Director', amount: 45.25, ref: 'PHONE-5001' },
    { date: '2025-08-15', desc: 'Internet Service - Office', amount: 41.28, ref: 'PHONE-5002' },
  ];

  telephoneTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-phone-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5028 - Telephone, Telecommunications',
      internalCode: '5028',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5034 - Business Expenses
  const businessExpTransactions = [
    { date: '2025-06-20', desc: 'Business License Renewal', amount: 70.38, ref: 'BUS-5001' },
  ];

  businessExpTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-bus-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5034 - Business Expenses',
      internalCode: '5034',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5013 - Insurance Premium
  const insuranceTransactions = [
    { date: '2025-05-01', desc: 'General Liability Insurance - Annual', amount: 50.00, ref: 'INS-5001' },
  ];

  insuranceTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-ins-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5013 - Insurance Premium',
      internalCode: '5013',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5014 - Meals
  const mealsTransactions = [
    { date: '2025-02-14', desc: 'Board Meeting Lunch', amount: 125.50, ref: 'MEALS-5001' },
    { date: '2025-03-18', desc: 'Staff Training Lunch', amount: 85.25, ref: 'MEALS-5002' },
    { date: '2025-04-22', desc: 'Donor Appreciation Dinner', amount: 850.00, ref: 'MEALS-5003' },
    { date: '2025-05-10', desc: 'Client Program Meals', amount: 425.75, ref: 'MEALS-5004' },
    { date: '2025-06-15', desc: 'Volunteer Appreciation Lunch', amount: 315.20, ref: 'MEALS-5005' },
    { date: '2025-07-08', desc: 'Conference Meals - Staff', amount: 550.00, ref: 'MEALS-5006' },
    { date: '2025-08-12', desc: 'Board Retreat Catering', amount: 675.44, ref: 'MEALS-5007' },
    { date: '2025-09-20', desc: 'Community Event Food', amount: 274.00, ref: 'MEALS-5008' },
    { date: '2025-10-05', desc: 'Staff Meeting Lunch', amount: 200.00, ref: 'MEALS-5009' },
  ];

  mealsTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-meals-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5014 - Meals',
      internalCode: '5014',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5018 - Parking
  const parkingTransactions = [
    { date: '2025-04-10', desc: 'Downtown Parking - Donor Meeting', amount: 15.00, ref: 'PARK-5001' },
    { date: '2025-07-22', desc: 'Conference Parking', amount: 26.00, ref: 'PARK-5002' },
  ];

  parkingTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-park-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5018 - Parking',
      internalCode: '5018',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5031 - Transportation
  const transportationTransactions = [
    { date: '2025-02-05', desc: 'Client Transportation - Program Services', amount: 425.00, ref: 'TRANS-5001' },
    { date: '2025-03-12', desc: 'Uber to Donor Event', amount: 45.50, ref: 'TRANS-5002' },
    { date: '2025-04-18', desc: 'Mileage Reimbursement - Program Director', amount: 285.75, ref: 'TRANS-5003' },
    { date: '2025-05-25', desc: 'Van Rental - Community Outreach', amount: 550.00, ref: 'TRANS-5004' },
    { date: '2025-06-08', desc: 'Gas for Program Vehicle', amount: 175.25, ref: 'TRANS-5005' },
    { date: '2025-07-15', desc: 'Lyft to Conference', amount: 38.90, ref: 'TRANS-5006' },
    { date: '2025-08-22', desc: 'Client Transportation Services', amount: 625.00, ref: 'TRANS-5007' },
    { date: '2025-09-10', desc: 'Staff Travel - Site Visit', amount: 485.50, ref: 'TRANS-5008' },
    { date: '2025-10-05', desc: 'Mileage Reimbursement - Executive Director', amount: 1817.25, ref: 'TRANS-5009' },
  ];

  transportationTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-trans-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5031 - Transportation',
      internalCode: '5031',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5032 - Travel and Meetings
  const travelMeetingsTransactions = [
    { date: '2025-03-15', desc: 'Nonprofit Conference Registration', amount: 125.00, ref: 'TRAVEL-5001' },
    { date: '2025-09-20', desc: 'Leadership Summit - Hotel', amount: 46.39, ref: 'TRAVEL-5002' },
  ];

  travelMeetingsTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-travel-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5032 - Travel and Meetings',
      internalCode: '5032',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5000 - Uniform, Linens
  const uniformTransactions = [
    { date: '2025-01-20', desc: 'Staff Uniforms - Branded Shirts', amount: 425.00, ref: 'UNI-5001' },
    { date: '2025-04-10', desc: 'Program Supplies - T-Shirts for Event', amount: 850.00, ref: 'UNI-5002' },
    { date: '2025-07-15', desc: 'Volunteer Shirts - Summer Program', amount: 625.80, ref: 'UNI-5003' },
    { date: '2025-09-25', desc: 'Event Linens - Fundraiser', amount: 1376.00, ref: 'UNI-5004' },
  ];

  uniformTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-uni-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5000 - Uniform, Linens',
      internalCode: '5000',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 5026 - Software Programs
  const softwareTransactions = [
    { date: '2025-02-01', desc: 'QuickBooks Online - Monthly Subscription', amount: 75.00, ref: 'SOFT-5001' },
    { date: '2025-04-15', desc: 'Donor Management Software - Annual', amount: 285.00, ref: 'SOFT-5002' },
    { date: '2025-07-20', desc: 'Microsoft 365 - Annual License', amount: 125.00, ref: 'SOFT-5003' },
    { date: '2025-10-01', desc: 'Zoom Pro Account - Monthly', amount: 61.92, ref: 'SOFT-5004' },
  ];

  softwareTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-soft-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '5026 - Software Programs',
      internalCode: '5026',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  // 6004 - Ask My Accountant
  const accountantTransactions = [
    { date: '2025-03-31', desc: 'Q1 Tax Preparation Services', amount: 425.00, ref: 'ACCT-6001' },
    { date: '2025-06-30', desc: 'Mid-Year Financial Review', amount: 550.00, ref: 'ACCT-6002' },
    { date: '2025-09-30', desc: 'Q3 Reconciliation & Consulting', amount: 375.00, ref: 'ACCT-6003' },
    { date: '2025-10-15', desc: 'Audit Support Services', amount: 351.03, ref: 'ACCT-6004' },
  ];

  accountantTransactions.forEach((t, i) => {
    transactions.push({
      id: `exp-acct-awk-${i}`,
      date: t.date,
      description: t.desc,
      source: 'expense',
      entityId: 'awakenings',
      category: '6004 - Ask My Accountant',
      internalCode: '6004',
      debit: t.amount,
      credit: 0,
      referenceNumber: t.ref,
      reconciled: true,
    });
  });

  return transactions;
};

export const ProfitLossReport: React.FC = () => {
  const { selectedEntity, setReportTool } = useApp();
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-10-29',
  });

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<{
    name: string;
    amount: number;
    accountType: PLAccountLineItem;
  } | null>(null);

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Generate GL transactions
  const [glTransactions] = useState<LedgerEntry[]>(generateMockPLTransactions());

  const profitLoss = getProfitLoss(selectedEntity);
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
  const getGLCategoryForAccount = (accountType: PLAccountLineItem): string[] => {
    const mapping: Record<PLAccountLineItem, string[]> = {
      directPublicSupport: ['4500'],
      initialFee: ['4510'],
      interestIncome: ['4520'],
      miscellaneousRevenue: ['4530'],
      salesFromInvenorites: ['4600'],
      advertisingExpenses: ['5001'],
      bankFees: ['5002'],
      boardEducation: ['5003'],
      fundraisingExpenses: ['5011'],
      officeSupplies: ['5014'],
      payrollExpenses: ['5019'],
      postageMailingService: ['5020'],
      rent: ['5023'],
      telephoneTelecommunications: ['5028'],
      donorAppreciation: ['5033'],
      businessExpenses: ['5034'],
      insurancePremium: ['5013'],
      meals: ['5014'],
      parking: ['5018'],
      supplies: ['5027'],
      transportation: ['5031'],
      travelMeetings: ['5032'],
      uniformLinens: ['5000'],
      adminFee: ['5000'],
      professionalServices: ['5026'],
      softwarePrograms: ['5026'],
      miscellaneousExpense: ['5000'],
      reconciliationDiscrepancies: ['6001'],
      askMyAccountant: ['6004'],
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
    // For income, credits increase balance. For expenses, debits increase balance
    const isIncome = selectedLineItem?.accountType && ['directPublicSupport', 'initialFee', 'interestIncome', 'miscellaneousRevenue', 'salesFromInvenorites'].includes(selectedLineItem.accountType);
    const netBalance = isIncome ? totalCredits - totalDebits : totalDebits - totalCredits;

    return {
      totalDebits,
      totalCredits,
      netBalance,
      transactionCount: filteredGLTransactions.length,
    };
  }, [filteredGLTransactions, selectedLineItem]);

  // Handle line item click
  const handleLineItemClick = (name: string, amount: number, accountType: PLAccountLineItem) => {
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

      // Get the P&L data for this nonprofit
      const profitLossData = getProfitLoss(nonprofitId);
      if (!profitLossData) return;
      
      if (format === 'xlsx') {
        const data = prepareProfitLossForExport(profitLossData);
        const headers = ['Category', 'Amount'];
        const filename = `Income_Statement_${nonprofit.name.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}`;
        exportToExcel(data, headers, filename, 'Income Statement');
      } else {
        const data = prepareProfitLossForExport(profitLossData);
        const headers = ['Category', 'Amount'];
        const title = 'Income Statement by Fund';
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
        <PageHeader 
          title="Income Statement by Fund"
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

      {/* P&L Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Income Statement by Fund</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For the period of {dateRange.startDate} to {dateRange.endDate}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {profitLoss ? (
            <>
              {/* Income Section */}
              <div>
                <h3 className="mb-4">Income</h3>
                
                <div className="space-y-3 ml-4">
                  <div className="space-y-1 text-sm">
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('4500 - Direct Public Support', profitLoss.income.directPublicSupport, 'directPublicSupport')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Direct Public Support
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.income.directPublicSupport)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('4510 - Initial Fee', profitLoss.income.initialFee, 'initialFee')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Initial Fee
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.income.initialFee)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('4520 - Interest Income', profitLoss.income.interestIncome, 'interestIncome')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Interest Income
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.income.interestIncome)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('4530 - Miscellaneous Revenue', profitLoss.income.miscellaneousRevenue, 'miscellaneousRevenue')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Miscellaneous Revenue
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.income.miscellaneousRevenue)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('4600 - Sales from Inventories', profitLoss.income.salesFromInvenorites, 'salesFromInvenorites')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Sales from Inventories
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.income.salesFromInvenorites)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span>Total Income</span>
                      <span>{formatCurrency(profitLoss.income.totalIncome)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Expense Section */}
              <div>
                <h3 className="mb-4">Expense</h3>
                
                <div className="space-y-3 ml-4">
                  <div className="space-y-1 text-sm">
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5001 - Advertising Expenses', profitLoss.expense.advertisingExpenses, 'advertisingExpenses')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Advertising Expenses
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.advertisingExpenses)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5002 - Bank Fees', profitLoss.expense.bankFees, 'bankFees')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Bank Fees
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.bankFees)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5003 - Board Education', profitLoss.expense.boardEducation, 'boardEducation')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Board Education
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.boardEducation)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5011 - Funds Waiting for Nonprofits', profitLoss.expense.fundraisingExpenses, 'fundraisingExpenses')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Funds Waiting for Nonprofits
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.fundraisingExpenses)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5014 - Office Supplies', profitLoss.expense.officeSupplies, 'officeSupplies')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Office Supplies
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.officeSupplies)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5019 - Payroll Expenses', profitLoss.expense.payrollExpenses, 'payrollExpenses')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Payroll Expenses
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.payrollExpenses)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5020 - Postage, Mailing Service', profitLoss.expense.postageMailingService, 'postageMailingService')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Postage, Mailing Service
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.postageMailingService)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5023 - Rent', profitLoss.expense.rent, 'rent')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Rent
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.rent)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5028 - Telephone, Telecommunications', profitLoss.expense.telephoneTelecommunications, 'telephoneTelecommunications')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Telephone, Telecommunications
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.telephoneTelecommunications)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5033 - Donor Appreciation', profitLoss.expense.donorAppreciation, 'donorAppreciation')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Donor Appreciation
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.donorAppreciation)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5034 - Business Expenses', profitLoss.expense.businessExpenses, 'businessExpenses')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Business Expenses
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.businessExpenses)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5013 - Insurance Premium', profitLoss.expense.insurancePremium, 'insurancePremium')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Insurance Premium
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.insurancePremium)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5014 - Meals', profitLoss.expense.meals, 'meals')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Meals
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.meals)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5018 - Parking', profitLoss.expense.parking, 'parking')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Parking
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.parking)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5027 - Supplies', profitLoss.expense.supplies, 'supplies')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Supplies
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.supplies)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5031 - Transportation', profitLoss.expense.transportation, 'transportation')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Transportation
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.transportation)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5032 - Travel and Meetings', profitLoss.expense.travelMeetings, 'travelMeetings')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Travel and Meetings
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.travelMeetings)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5000 - Uniform, Linens', profitLoss.expense.uniformLinens, 'uniformLinens')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Uniform, Linens
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.uniformLinens)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5000 - Admin Fee', profitLoss.expense.adminFee, 'adminFee')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Admin Fee
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.adminFee)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5026 - Professional Services', profitLoss.expense.professionalServices, 'professionalServices')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Professional Services
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.professionalServices)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5026 - Software Programs', profitLoss.expense.softwarePrograms, 'softwarePrograms')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Software Programs
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.softwarePrograms)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('5000 - Miscellaneous Expense', profitLoss.expense.miscellaneousExpense, 'miscellaneousExpense')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Miscellaneous Expense
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.miscellaneousExpense)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('6001 - Reconciliation Discrepancies', profitLoss.expense.reconciliationDiscrepancies, 'reconciliationDiscrepancies')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Reconciliation Discrepancies
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.reconciliationDiscrepancies)}</span>
                    </div>
                    <div 
                      className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors group"
                      onClick={() => handleLineItemClick('6004 - Ask My Accountant', profitLoss.expense.askMyAccountant, 'askMyAccountant')}
                    >
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                        Ask My Accountant
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span>{formatCurrency(profitLoss.expense.askMyAccountant)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span>Total Expense</span>
                      <span>{formatCurrency(profitLoss.expense.totalExpense)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Net Income */}
              <div className="space-y-3">
                <div className={`flex justify-between p-4 rounded-lg ${
                  profitLoss.netIncome >= 0 
                    ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                }`}>
                  <span>Net Income / (Loss)</span>
                  <span>{formatCurrency(profitLoss.netIncome)}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No profit & loss data available for this organization.
            </p>
          )}
        </CardContent>
      </Card>

      {/* GL Transaction Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>General Ledger Transactions</SheetTitle>
            <SheetDescription>
              {selectedLineItem?.name || 'Account Details'}
            </SheetDescription>
          </SheetHeader>
          
          {selectedLineItem && (
            <div className="mt-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Balance</div>
                    <div className="text-2xl">{formatCurrency(selectedLineItem.amount)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transactions</div>
                    <div className="text-2xl">{drawerSummary.transactionCount}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction Details */}
              <div>
                <h3 className="mb-4">Transaction Details</h3>
                {filteredGLTransactions.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
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
                                <div>{transaction.description}</div>
                                {transaction.referenceNumber && (
                                  <div className="text-xs text-gray-500">
                                    Ref: {transaction.referenceNumber}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={transaction.reconciled ? 'default' : 'secondary'}>
                                {transaction.reconciled ? 'Reconciled' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No transactions found for this account in the selected date range.
                  </p>
                )}
              </div>

              {/* Summary Totals */}
              {filteredGLTransactions.length > 0 && (
                <Card className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Debits:</span>
                        <span>{formatCurrency(drawerSummary.totalDebits)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Credits:</span>
                        <span>{formatCurrency(drawerSummary.totalCredits)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Net Balance:</span>
                        <span className={drawerSummary.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatCurrency(drawerSummary.netBalance)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Multi-Nonprofit Export Dialog */}
      <MultiNonprofitExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        reportType="profit-loss"
        onExport={handleMultiNonprofitExport}
      />
    </div>
  );
};
