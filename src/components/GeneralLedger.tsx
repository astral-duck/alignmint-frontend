import React, { useState, useMemo, useEffect } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PageHeader } from './PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './ui/sheet';
import { Textarea } from './ui/textarea';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Search,
  CheckCircle,
  Edit,
  X,
  Save,
  Trash2,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { exportToExcel } from '../lib/exportUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

// Transaction types
type TransactionSource = 'donation' | 'check-deposit' | 'reimbursement' | 'expense' | 'reconciliation';

// Category codes
const CATEGORY_CODES = [
  { value: '4000', label: '4000 - Donations' },
  { value: '4100', label: '4100 - Earned Income' },
  { value: '4300', label: '4300 - Grants' },
  { value: '5100', label: '5100 - Compensation - Officers' },
  { value: '5110', label: '5110 - Compensation - Staff' },
  { value: '5130', label: '5130 - Employee Benefits' },
  { value: '5200', label: '5200 - Legal Fees' },
  { value: '5210', label: '5210 - Accounting' },
  { value: '5300', label: '5300 - Office Supplies' },
  { value: '5400', label: '5400 - Information Technology' },
  { value: '5500', label: '5500 - Rent' },
  { value: '5600', label: '5600 - Travel' },
  { value: '5700', label: '5700 - Insurance' },
  { value: '5800', label: '5800 - Bank Fees' },
];

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  source: TransactionSource;
  entityId: string;
  category: string;
  internalCode?: string; // internal category code (4000, 5000, etc.)
  debit: number; // expenses
  credit: number; // income
  balance?: number; // running balance
  referenceNumber?: string;
  reconciled: boolean; // reconciliation status
}

// Mock transaction data - in production this would come from a database
const generateMockTransactions = (): LedgerEntry[] => {
  const transactions: LedgerEntry[] = [];
  const today = new Date();

  // Individual Donations (Online & Checks)
  const donors = [
    'Robert & Susan Thompson',
    'Michael Chen',
    'Sarah Williams',
    'David & Jennifer Martinez',
    'James Anderson',
    'Patricia Brown',
    'Christopher Lee',
    'Linda Garcia',
    'Daniel Rodriguez',
    'Elizabeth Wilson',
    'Matthew Taylor',
    'Maria Hernandez',
    'Joseph Moore',
    'Barbara Martin',
    'Thomas Jackson',
    'Jennifer White',
    'William Harris',
    'Nancy Clark',
    'Richard Lewis',
    'Margaret Walker',
    'Charles Hall',
    'Susan Allen',
    'Kevin Young',
    'Carol King',
    'Steven Wright',
    'Betty Lopez',
    'Brian Hill',
    'Helen Scott',
    'Edward Green',
    'Dorothy Adams',
  ];

  for (let i = 0; i < 85; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const amount = [25, 50, 75, 100, 150, 200, 250, 500, 750, 1000, 1500, 2500, 5000, 10000][Math.floor(Math.random() * 14)];
    
    transactions.push({
      id: `don-${i}`,
      date: date.toISOString().split('T')[0],
      description: `Donation from ${donors[i % donors.length]}`,
      source: 'donation',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: '4000 - Donations',
      internalCode: '4000',
      debit: 0,
      credit: amount,
      referenceNumber: `DON-${1000 + i}`,
      reconciled: i < 30,
    });
  }

  // Check Deposits
  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 150);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const checkNum = 1234 + i * 17;
    const amount = [100, 200, 250, 350, 500, 750, 1000, 1250, 1500, 2000, 3000, 5000][Math.floor(Math.random() * 12)];
    
    transactions.push({
      id: `chk-${i}`,
      date: date.toISOString().split('T')[0],
      description: `Check #${checkNum} - ${donors[Math.floor(Math.random() * donors.length)]}`,
      source: 'check-deposit',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: '4000 - Donations',
      internalCode: '4000',
      debit: 0,
      credit: amount,
      referenceNumber: `CHK-${2000 + i}`,
      reconciled: i < 20,
    });
  }

  // Grant Income
  const grantors = [
    'Community Foundation of Greater Metro',
    'State Arts Council',
    'Federal Education Grant Program',
    'Private Family Foundation',
    'Corporate Matching Program - Microsoft',
    'National Science Foundation',
    'Department of Health & Human Services',
    'Local Community Development Block Grant',
    'Google.org Impact Challenge',
    'Ford Foundation',
    'Bill & Melinda Gates Foundation',
    'Knight Foundation',
    'Rockefeller Foundation',
    'MacArthur Foundation',
    'Open Society Foundations',
  ];

  for (let i = 0; i < 28; i++) {
    const daysAgo = Math.floor(Math.random() * 200);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const amount = [5000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000][Math.floor(Math.random() * 12)];
    
    transactions.push({
      id: `grant-${i}`,
      date: date.toISOString().split('T')[0],
      description: `Grant - ${grantors[i % grantors.length]}`,
      source: 'donation',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: '4300 - Grants',
      internalCode: '4300',
      debit: 0,
      credit: amount,
      referenceNumber: `GRANT-${3000 + i}`,
      reconciled: i < 12,
    });
  }

  // Earned Income (Program Fees, Events, etc.)
  const earnedIncomeTypes = [
    'Workshop Registration Fees',
    'Conference Ticket Sales',
    'Program Service Fees',
    'Training Session Revenue',
    'Consulting Services',
    'Publication Sales',
    'Membership Dues - Annual',
    'Membership Dues - Monthly',
    'Online Course Enrollment',
    'Webinar Series Access',
    'Certification Program Fee',
    'Event Sponsorship Revenue',
    'Vendor Booth Rental',
    'Merchandise Sales',
    'Annual Gala Ticket Sales',
    'Auction Item Sales',
  ];

  for (let i = 0; i < 42; i++) {
    const daysAgo = Math.floor(Math.random() * 150);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const amount = [150, 200, 350, 450, 650, 850, 1200, 1500, 1800, 2200, 2500, 3500, 5000][Math.floor(Math.random() * 13)];
    
    transactions.push({
      id: `earned-${i}`,
      date: date.toISOString().split('T')[0],
      description: earnedIncomeTypes[i % earnedIncomeTypes.length],
      source: 'donation',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: '4100 - Earned Income',
      internalCode: '4100',
      debit: 0,
      credit: amount,
      referenceNumber: `EARN-${4000 + i}`,
      reconciled: i < 18,
    });
  }

  // Personnel Expenses (Salaries, Benefits, Payroll Taxes)
  const personnelExpenses = [
    { desc: 'Payroll - Executive Director', cat: '5100 - Compensation - Officers and Directors', code: '5100', amounts: [8500, 9000, 9500] },
    { desc: 'Payroll - Program Manager', cat: '5110 - Compensation - all others', code: '5110', amounts: [5500, 6000, 6200] },
    { desc: 'Payroll - Development Director', cat: '5110 - Compensation - all others', code: '5110', amounts: [5000, 5500, 5800] },
    { desc: 'Payroll - Office Administrator', cat: '5110 - Compensation - all others', code: '5110', amounts: [3800, 4000, 4200] },
    { desc: 'Payroll - Program Staff', cat: '5110 - Compensation - all others', code: '5110', amounts: [4500, 4800, 5000] },
    { desc: 'Payroll - Part-time Coordinator', cat: '5110 - Compensation - all others', code: '5110', amounts: [2200, 2400, 2600] },
    { desc: 'Payroll - Contract Worker', cat: '5110 - Compensation - all others', code: '5110', amounts: [1800, 2000, 2200] },
    { desc: 'Health Insurance - Staff', cat: '5130 - Other Employee Benefits', code: '5130', amounts: [2800, 3200, 3600] },
    { desc: 'Dental Insurance Premium', cat: '5130 - Other Employee Benefits', code: '5130', amounts: [380, 420, 460] },
    { desc: 'Vision Insurance Premium', cat: '5130 - Other Employee Benefits', code: '5130', amounts: [120, 140, 160] },
    { desc: '401(k) Employer Match', cat: '5130 - Other Employee Benefits', code: '5130', amounts: [1200, 1400, 1600] },
    { desc: 'Payroll Taxes - FICA', cat: '5140 - Payroll Taxes', code: '5140', amounts: [1200, 1400, 1600, 1800] },
    { desc: 'Payroll Taxes - Federal Unemployment', cat: '5140 - Payroll Taxes', code: '5140', amounts: [180, 220, 260] },
    { desc: 'Payroll Taxes - State Unemployment', cat: '5140 - Payroll Taxes', code: '5140', amounts: [240, 280, 320] },
    { desc: 'Workers Compensation Insurance', cat: '5700 - Insurance Premium', code: '5700', amounts: [450, 520, 600] },
    { desc: 'Professional Development - Staff Training', cat: '5160 - Staff Development', code: '5160', amounts: [350, 500, 750] },
  ];

  for (let i = 0; i < 65; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const expenseType = personnelExpenses[i % personnelExpenses.length];
    const amount = expenseType.amounts[Math.floor(Math.random() * expenseType.amounts.length)];
    
    transactions.push({
      id: `personnel-${i}`,
      date: date.toISOString().split('T')[0],
      description: expenseType.desc,
      source: 'expense',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: expenseType.cat,
      internalCode: expenseType.code,
      debit: amount,
      credit: 0,
      referenceNumber: `PAY-${5000 + i}`,
      reconciled: i < 25,
    });
  }

  // Operating Expenses
  const operatingExpenses = [
    { desc: 'Office Rent - Monthly', cat: '5500 - Rent', code: '5500', amounts: [2400, 2500, 2600] },
    { desc: 'Co-Working Space Membership', cat: '5500 - Rent', code: '5500', amounts: [850, 900, 950] },
    { desc: 'Storage Unit Rental', cat: '5500 - Rent', code: '5500', amounts: [180, 200, 220] },
    { desc: 'Electricity Bill', cat: '5510 - Utilities', code: '5510', amounts: [320, 350, 380, 420] },
    { desc: 'Water & Sewer', cat: '5510 - Utilities', code: '5510', amounts: [110, 120, 135] },
    { desc: 'Gas/Heating', cat: '5510 - Utilities', code: '5510', amounts: [150, 180, 220, 280] },
    { desc: 'Trash & Recycling Service', cat: '5510 - Utilities', code: '5510', amounts: [85, 95, 105] },
    { desc: 'Internet Service - Fiber', cat: '5520 - Telephone, Telecommunications', code: '5520', amounts: [180, 200, 220] },
    { desc: 'Phone System - VoIP', cat: '5520 - Telephone, Telecommunications', code: '5520', amounts: [120, 140, 160] },
    { desc: 'Mobile Phone Plan - Staff', cat: '5520 - Telephone, Telecommunications', code: '5520', amounts: [250, 280, 320] },
    { desc: 'Office Supplies - Staples', cat: '5300 - Office Supplies', code: '5300', amounts: [165, 185, 210] },
    { desc: 'Printer Paper & Toner', cat: '5300 - Office Supplies', code: '5300', amounts: [220, 240, 280] },
    { desc: 'Office Furniture Purchase', cat: '5310 - Furniture & Equipment', code: '5310', amounts: [850, 1200, 1500] },
    { desc: 'Computer Equipment - Laptops', cat: '5310 - Furniture & Equipment', code: '5310', amounts: [1200, 1500, 1800] },
    { desc: 'Postage & Shipping', cat: '5320 - Postage, Mailing Service', code: '5320', amounts: [85, 95, 115] },
    { desc: 'FedEx/UPS Shipping', cat: '5320 - Postage, Mailing Service', code: '5320', amounts: [45, 60, 85] },
    { desc: 'Cleaning Service - Weekly', cat: '5530 - Repairs and Maintenance - Domestic', code: '5530', amounts: [280, 300, 320] },
    { desc: 'Building Repairs', cat: '5530 - Repairs and Maintenance - Domestic', code: '5530', amounts: [450, 650, 850, 1200] },
    { desc: 'HVAC Maintenance', cat: '5530 - Repairs and Maintenance - Domestic', code: '5530', amounts: [350, 420, 500] },
    { desc: 'Plumbing Repair', cat: '5530 - Repairs and Maintenance - Domestic', code: '5530', amounts: [180, 250, 350] },
    { desc: 'Electrical Repair', cat: '5530 - Repairs and Maintenance - Domestic', code: '5530', amounts: [220, 300, 420] },
    { desc: 'Liability Insurance Premium', cat: '5710 - Insurance - Liability, D and O', code: '5710', amounts: [1100, 1200, 1300] },
    { desc: 'Directors & Officers Insurance', cat: '5710 - Insurance - Liability, D and O', code: '5710', amounts: [850, 950, 1050] },
    { desc: 'Property Insurance', cat: '5700 - Insurance Premium', code: '5700', amounts: [920, 980, 1040] },
    { desc: 'Equipment Insurance', cat: '5700 - Insurance Premium', code: '5700', amounts: [380, 420, 460] },
  ];

  for (let i = 0; i < 72; i++) {
    const daysAgo = Math.floor(Math.random() * 165);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const expense = operatingExpenses[i % operatingExpenses.length];
    const amount = expense.amounts[Math.floor(Math.random() * expense.amounts.length)];
    
    transactions.push({
      id: `operating-${i}`,
      date: date.toISOString().split('T')[0],
      description: expense.desc,
      source: 'expense',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: expense.cat,
      internalCode: expense.code,
      debit: amount,
      credit: 0,
      referenceNumber: `OPR-${6000 + i}`,
      reconciled: i < 28,
    });
  }

  // Program Expenses
  const programExpenses = [
    { desc: 'Educational Materials - Textbooks', cat: '5830 - Materials', code: '5830', amounts: [450, 650, 850] },
    { desc: 'Program Supplies - Art Materials', cat: '5830 - Materials', code: '5830', amounts: [320, 420, 550] },
    { desc: 'Workshop Materials - Kits', cat: '5830 - Materials', code: '5830', amounts: [280, 380, 480] },
    { desc: 'Technology Equipment - iPads', cat: '5830 - Materials', code: '5830', amounts: [1200, 1500, 1800] },
    { desc: 'Event Venue Rental - Community Center', cat: '5840 - Outside Contract Services', code: '5840', amounts: [800, 1200, 1500] },
    { desc: 'Event Venue Rental - Hotel Ballroom', cat: '5840 - Outside Contract Services', code: '5840', amounts: [2500, 3500, 4500] },
    { desc: 'Audio/Visual Equipment Rental', cat: '5840 - Outside Contract Services', code: '5840', amounts: [450, 650, 850] },
    { desc: 'Guest Speaker Honorarium', cat: '5840 - Outside Contract Services', code: '5840', amounts: [500, 800, 1200] },
    { desc: 'Facilitator Fee - Workshop', cat: '5840 - Outside Contract Services', code: '5840', amounts: [650, 850, 1050] },
    { desc: 'Graphic Designer - Contract', cat: '5840 - Outside Contract Services', code: '5840', amounts: [850, 1200, 1500] },
    { desc: 'Videographer - Event Coverage', cat: '5840 - Outside Contract Services', code: '5840', amounts: [1200, 1500, 1800] },
    { desc: 'Marketing & Advertising - Google Ads', cat: '5240 - Advertising Expenses', code: '5240', amounts: [350, 450, 650] },
    { desc: 'Marketing - Facebook/Instagram Ads', cat: '5240 - Advertising Expenses', code: '5240', amounts: [220, 280, 380] },
    { desc: 'Print Marketing - Flyers & Posters', cat: '5240 - Advertising Expenses', code: '5240', amounts: [280, 320, 420] },
    { desc: 'Print Marketing - Brochures', cat: '5240 - Advertising Expenses', code: '5240', amounts: [450, 550, 650] },
    { desc: 'Billboard Advertising', cat: '5240 - Advertising Expenses', code: '5240', amounts: [1200, 1500, 1800] },
    { desc: 'Radio Advertising Spot', cat: '5240 - Advertising Expenses', code: '5240', amounts: [650, 850, 1050] },
    { desc: 'Flight - Staff Conference', cat: '5600 - Travel and Meetings', code: '5600', amounts: [350, 450, 650, 850] },
    { desc: 'Hotel - Professional Development', cat: '5600 - Travel and Meetings', code: '5600', amounts: [450, 680, 850] },
    { desc: 'Rental Car - Site Visit', cat: '5600 - Travel and Meetings', code: '5600', amounts: [180, 250, 320] },
    { desc: 'Conference Registration Fee', cat: '5600 - Travel and Meetings', code: '5600', amounts: [450, 650, 850] },
    { desc: 'Meals - Staff Conference', cat: '5660 - Meals', code: '5660', amounts: [85, 120, 180] },
    { desc: 'Catering - Program Event', cat: '5660 - Meals', code: '5660', amounts: [450, 650, 850, 1200] },
    { desc: 'Coffee & Snacks - Meeting', cat: '5660 - Meals', code: '5660', amounts: [65, 85, 120] },
    { desc: 'Participant Meals - Training', cat: '5660 - Meals', code: '5660', amounts: [280, 340, 420] },
  ];

  for (let i = 0; i < 95; i++) {
    const daysAgo = Math.floor(Math.random() * 170);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const expense = programExpenses[i % programExpenses.length];
    const amount = expense.amounts[Math.floor(Math.random() * expense.amounts.length)];
    
    transactions.push({
      id: `program-${i}`,
      date: date.toISOString().split('T')[0],
      description: expense.desc,
      source: 'expense',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: expense.cat,
      internalCode: expense.code,
      debit: amount,
      credit: 0,
      referenceNumber: `PRG-${7000 + i}`,
      reconciled: i < 35,
    });
  }

  // Administrative Expenses
  const adminExpenses = [
    { desc: 'QuickBooks Online Subscription', cat: '5410 - Software Programs', code: '5410', amounts: [140, 150, 165] },
    { desc: 'Salesforce Nonprofit License', cat: '5410 - Software Programs', code: '5410', amounts: [280, 320, 360] },
    { desc: 'Microsoft 365 Subscription', cat: '5410 - Software Programs', code: '5410', amounts: [75, 85, 95] },
    { desc: 'Zoom Pro Subscription', cat: '5410 - Software Programs', code: '5410', amounts: [45, 55, 65] },
    { desc: 'Adobe Creative Cloud', cat: '5410 - Software Programs', code: '5410', amounts: [120, 140, 160] },
    { desc: 'Slack Premium Subscription', cat: '5410 - Software Programs', code: '5410', amounts: [65, 75, 85] },
    { desc: 'Dropbox Business', cat: '5410 - Software Programs', code: '5410', amounts: [95, 115, 135] },
    { desc: 'Website Hosting - AWS', cat: '5400 - Information Technology', code: '5400', amounts: [85, 120, 165] },
    { desc: 'Domain Registration - Annual', cat: '5400 - Information Technology', code: '5400', amounts: [35, 45, 55] },
    { desc: 'SSL Certificate', cat: '5400 - Information Technology', code: '5400', amounts: [95, 120, 145] },
    { desc: 'IT Support Services', cat: '5400 - Information Technology', code: '5400', amounts: [350, 450, 550] },
    { desc: 'Cybersecurity Software', cat: '5400 - Information Technology', code: '5400', amounts: [180, 220, 260] },
    { desc: 'Bank Service Fees - Monthly', cat: '5800 - Bank Fees', code: '5800', amounts: [25, 35, 45] },
    { desc: 'Wire Transfer Fees', cat: '5800 - Bank Fees', code: '5800', amounts: [15, 25, 35] },
    { desc: 'Credit Card Processing Fees', cat: '5800 - Bank Fees', code: '5800', amounts: [85, 125, 185, 245] },
    { desc: 'ACH Processing Fees', cat: '5800 - Bank Fees', code: '5800', amounts: [45, 65, 85] },
    { desc: 'Legal Consultation - General', cat: '5200 - Legal Fees', code: '5200', amounts: [650, 850, 1200] },
    { desc: 'Legal - Contract Review', cat: '5200 - Legal Fees', code: '5200', amounts: [450, 650, 850] },
    { desc: 'Legal - Trademark Filing', cat: '5200 - Legal Fees', code: '5200', amounts: [850, 1200, 1500] },
    { desc: 'Legal - Annual Compliance', cat: '5200 - Legal Fees', code: '5200', amounts: [1800, 2200, 2600] },
    { desc: 'Accounting Services - Monthly', cat: '5210 - Accounting', code: '5210', amounts: [950, 1200, 1450] },
    { desc: 'Bookkeeping Services', cat: '5210 - Accounting', code: '5210', amounts: [650, 850, 1050] },
    { desc: 'Tax Preparation - Form 990', cat: '5210 - Accounting', code: '5210', amounts: [1800, 2200, 2600] },
    { desc: 'Annual Audit - CPA Firm', cat: '5210 - Accounting', code: '5210', amounts: [4500, 5000, 5500] },
    { desc: 'Payroll Processing Service', cat: '5210 - Accounting', code: '5210', amounts: [180, 220, 260] },
    { desc: 'HR Consulting Services', cat: '5840 - Outside Contract Services', code: '5840', amounts: [650, 850, 1050] },
    { desc: 'Fundraising Consultant', cat: '5840 - Outside Contract Services', code: '5840', amounts: [1500, 2000, 2500] },
    { desc: 'Grant Writing Services', cat: '5840 - Outside Contract Services', code: '5840', amounts: [1200, 1800, 2400] },
    { desc: 'Board Retreat Facilitation', cat: '5840 - Outside Contract Services', code: '5840', amounts: [850, 1200, 1500] },
    { desc: 'IFM Admin Fee - 10%', cat: '5900 - IFM Admin fee', code: '5900', amounts: [650, 850, 1050, 1250, 1500, 1800] },
  ];

  for (let i = 0; i < 88; i++) {
    const daysAgo = Math.floor(Math.random() * 175);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const expense = adminExpenses[i % adminExpenses.length];
    const amount = expense.amounts[Math.floor(Math.random() * expense.amounts.length)];
    
    transactions.push({
      id: `admin-${i}`,
      date: date.toISOString().split('T')[0],
      description: expense.desc,
      source: 'expense',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: expense.cat,
      internalCode: expense.code,
      debit: amount,
      credit: 0,
      referenceNumber: `ADM-${8000 + i}`,
      reconciled: i < 32,
    });
  }

  // Reimbursements
  const staffMembers = ['John Davis', 'Sarah Mitchell', 'Lisa Chen', 'Tom Wilson', 'Maria Rodriguez', 'Robert Johnson', 'Emily Brown', 'Michael Chang', 'Amanda Foster', 'David Kim'];
  const reimbursementTypes = [
    { desc: 'Mileage Reimbursement', cat: '5610 - Transportation', code: '5610', amounts: [45, 65, 85, 115, 145] },
    { desc: 'Gas - Personal Vehicle', cat: '5610 - Transportation', code: '5610', amounts: [35, 45, 55, 65] },
    { desc: 'Uber/Lyft - Client Transport', cat: '5610 - Transportation', code: '5610', amounts: [25, 35, 45, 55] },
    { desc: 'Parking - Meeting', cat: '5620 - Parking', code: '5620', amounts: [15, 20, 25, 30] },
    { desc: 'Parking - Conference', cat: '5620 - Parking', code: '5620', amounts: [35, 45, 55, 65] },
    { desc: 'Tolls - Site Visit', cat: '5610 - Transportation', code: '5610', amounts: [12, 18, 24, 30] },
    { desc: 'Office Supplies - Amazon', cat: '5300 - Office Supplies', code: '5300', amounts: [85, 125, 165, 215] },
    { desc: 'Office Supplies - Staples', cat: '5300 - Office Supplies', code: '5300', amounts: [45, 65, 85, 115] },
    { desc: 'Program Materials - Target', cat: '5830 - Materials', code: '5830', amounts: [55, 75, 95, 125] },
    { desc: 'Program Materials - Michaels', cat: '5830 - Materials', code: '5830', amounts: [45, 67, 85, 105] },
    { desc: 'Event Food - Costco', cat: '5660 - Meals', code: '5660', amounts: [125, 180, 215, 275] },
    { desc: 'Meeting Snacks - Grocery Store', cat: '5660 - Meals', code: '5660', amounts: [35, 45, 55, 65] },
    { desc: 'Client Lunch - Restaurant', cat: '5660 - Meals', code: '5660', amounts: [45, 65, 85, 115] },
    { desc: 'Team Meal - Working Lunch', cat: '5660 - Meals', code: '5660', amounts: [65, 85, 115, 145] },
    { desc: 'Postage - USPS', cat: '5320 - Postage, Mailing Service', code: '5320', amounts: [28, 38, 48, 58] },
    { desc: 'Shipping - FedEx', cat: '5320 - Postage, Mailing Service', code: '5320', amounts: [35, 45, 55, 75] },
    { desc: 'Book Purchase - Training', cat: '5160 - Staff Development', code: '5160', amounts: [25, 35, 45, 55] },
    { desc: 'Online Course - Professional Dev', cat: '5160 - Staff Development', code: '5160', amounts: [85, 125, 165, 215] },
  ];

  for (let i = 0; i < 58; i++) {
    const daysAgo = Math.floor(Math.random() * 120);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const reimb = reimbursementTypes[i % reimbursementTypes.length];
    const staff = staffMembers[Math.floor(Math.random() * staffMembers.length)];
    const amount = reimb.amounts[Math.floor(Math.random() * reimb.amounts.length)];
    
    transactions.push({
      id: `reimb-${i}`,
      date: date.toISOString().split('T')[0],
      description: `${reimb.desc} - ${staff}`,
      source: 'reimbursement',
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      category: reimb.cat,
      internalCode: reimb.code,
      debit: amount,
      credit: 0,
      referenceNumber: `REIMB-${9000 + i}`,
      reconciled: i < 22,
    });
  }

  return transactions;
};

export const GeneralLedger: React.FC = () => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [transactions, setTransactions] = useState<LedgerEntry[]>(generateMockTransactions());
  
  // Filters
  const [filterEntity, setFilterEntity] = useState<string>(selectedEntity === 'all' ? 'all' : selectedEntity);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterReconciled, setFilterReconciled] = useState<string>('unreconciled');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Drawer/Sheet state for editing transactions
  const [selectedTransaction, setSelectedTransaction] = useState<LedgerEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LedgerEntry>>({});
  
  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');

  // Sync with global entity selector
  useEffect(() => {
    setFilterEntity(selectedEntity === 'all' ? 'all' : selectedEntity);
  }, [selectedEntity]);

  // Open drawer with transaction details
  const handleTransactionClick = (transaction: LedgerEntry) => {
    setSelectedTransaction(transaction);
    setEditForm({
      date: transaction.date,
      description: transaction.description,
      source: transaction.source,
      entityId: transaction.entityId,
      category: transaction.category,
      internalCode: transaction.internalCode,
      debit: transaction.debit,
      credit: transaction.credit,
      referenceNumber: transaction.referenceNumber,
      reconciled: transaction.reconciled,
    });
    setIsDrawerOpen(true);
  };

  // Save edited transaction
  const handleSaveTransaction = () => {
    if (!selectedTransaction) return;

    const updatedTransactions = transactions.map(t => {
      if (t.id === selectedTransaction.id) {
        return {
          ...t,
          ...editForm,
        };
      }
      return t;
    });

    setTransactions(updatedTransactions);
    setIsDrawerOpen(false);
    toast.success('Transaction updated successfully');
  };

  // Delete transaction
  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;

    const updatedTransactions = transactions.filter(t => t.id !== selectedTransaction.id);
    setTransactions(updatedTransactions);
    setIsDrawerOpen(false);
    toast.success('Transaction deleted successfully');
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Entity filter
    if (filterEntity !== 'all') {
      filtered = filtered.filter(t => t.entityId === filterEntity);
    }

    // Category Code filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(t => t.internalCode === filterSource);
    }

    // Reconciliation filter
    if (filterReconciled === 'reconciled') {
      filtered = filtered.filter(t => t.reconciled);
    } else if (filterReconciled === 'unreconciled') {
      filtered = filtered.filter(t => !t.reconciled);
    }

    // Date range filter
    if (filterDateFrom) {
      filtered = filtered.filter(t => t.date >= filterDateFrom);
    }
    if (filterDateTo) {
      filtered = filtered.filter(t => t.date <= filterDateTo);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search) ||
        t.internalCode?.toLowerCase().includes(search) ||
        t.referenceNumber?.toLowerCase().includes(search)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate running balance
    let balance = 0;
    // Reverse to calculate from oldest to newest
    const reversed = [...filtered].reverse();
    reversed.forEach(t => {
      balance += t.credit - t.debit;
      t.balance = balance;
    });

    return filtered;
  }, [transactions, filterEntity, filterSource, filterReconciled, filterDateFrom, filterDateTo, searchTerm]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const totalDebits = filteredTransactions.reduce((sum, t) => sum + t.debit, 0);
    const totalCredits = filteredTransactions.reduce((sum, t) => sum + t.credit, 0);
    const netBalance = totalCredits - totalDebits;

    return {
      totalDebits,
      totalCredits,
      netBalance,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleConfirmExport = () => {
    // Prepare data for export
    const data = filteredTransactions.map(t => [
      t.date,
      t.referenceNumber || '',
      t.description,
      entities.find(e => e.id === t.entityId)?.name || '',
      t.category,
      t.internalCode || '',
      t.debit.toFixed(2),
      t.credit.toFixed(2),
      (t.balance || 0).toFixed(2),
      t.reconciled ? 'Reconciled' : 'Pending'
    ]);

    const headers = ['Date', 'Reference', 'Description', 'Entity', 'Category', 'Category Code', 'Debit', 'Credit', 'Balance', 'Status'];
    const filename = `General_Ledger_${new Date().toISOString().split('T')[0]}`;
    const sheetName = 'General Ledger';

    exportToExcel(data, headers, filename, sheetName);
    
    setExportDialogOpen(false);
    const formatName = exportFormat === 'csv' ? 'CSV' : 'Excel';
    toast.success(
      `Exporting General Ledger as ${formatName}...`,
      { description: `Your file will be downloaded shortly` }
    );
  };

  const clearFilters = () => {
    setFilterSource('all');
    setFilterReconciled('unreconciled');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSearchTerm('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setAccountingTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Accounting Hub
      </Button>

      {/* Header */}
      <div className="text-center">
        <PageHeader 
          title="General Ledger"
          subtitle="Complete transaction history with reconciliation status - showing unreconciled items by default"
        />
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Credits</p>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              ${summary.totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Debits</p>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
              ${summary.totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Net Balance</p>
            <p className={`text-2xl font-semibold ${
              summary.netBalance >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              ${Math.abs(summary.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Transactions</p>
            <p className="text-2xl font-semibold text-foreground">
              {summary.transactionCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2 xl:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Description, category, code, reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Code Filter */}
            <div className="space-y-2">
              <Label htmlFor="filterSource">Category Code</Label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger id="filterSource">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="4000">4000 - Donations</SelectItem>
                  <SelectItem value="4100">4100 - Earned Income</SelectItem>
                  <SelectItem value="4300">4300 - Grants</SelectItem>
                  <SelectItem value="5100">5100 - Compensation - Officers</SelectItem>
                  <SelectItem value="5110">5110 - Compensation - Staff</SelectItem>
                  <SelectItem value="5130">5130 - Employee Benefits</SelectItem>
                  <SelectItem value="5200">5200 - Legal Fees</SelectItem>
                  <SelectItem value="5210">5210 - Accounting</SelectItem>
                  <SelectItem value="5300">5300 - Office Supplies</SelectItem>
                  <SelectItem value="5400">5400 - Information Technology</SelectItem>
                  <SelectItem value="5500">5500 - Rent</SelectItem>
                  <SelectItem value="5600">5600 - Travel</SelectItem>
                  <SelectItem value="5700">5700 - Insurance</SelectItem>
                  <SelectItem value="5800">5800 - Bank Fees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reconciliation Status Filter */}


            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[110px]">Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[90px]">Code</TableHead>
                  <TableHead className="hidden lg:table-cell w-[140px]">Entity</TableHead>
                  <TableHead className="hidden xl:table-cell min-w-[180px]">Category</TableHead>
                  <TableHead className="text-right w-[100px]">Debit</TableHead>
                  <TableHead className="text-right w-[100px]">Credit</TableHead>
                  <TableHead className="text-right w-[110px]">Balance</TableHead>
                  <TableHead className="text-center w-[90px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <TableCell className="text-center">
                        {transaction.source === 'check-deposit' && !transaction.reconciled && (
                          <Flag className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        {transaction.referenceNumber}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                          {transaction.internalCode || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {entities.find(e => e.id === transaction.entityId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-gray-600 dark:text-gray-400">
                        {transaction.category}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {transaction.debit > 0 ? (
                          <span className="text-red-600 dark:text-red-400">
                            ${transaction.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {transaction.credit > 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            ${transaction.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        <span className={
                          (transaction.balance || 0) >= 0
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-red-600 dark:text-red-400'
                        }>
                          ${Math.abs(transaction.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction.reconciled ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reconciled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Summary */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Total Credits:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    ${summary.totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Total Debits:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    ${summary.totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Net:</span>
                  <span className={`font-medium ${
                    summary.netBalance >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    ${Math.abs(summary.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Transaction Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-8">
          <SheetHeader className="pb-8 border-b border-gray-200 dark:border-gray-700">
            <SheetTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Journal Entry
            </SheetTitle>
            <SheetDescription>
              Make changes to this transaction. All fields are editable.
            </SheetDescription>
          </SheetHeader>

          {selectedTransaction && (
            <div className="space-y-10 mt-10">
              {/* Transaction Info Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Transaction Information</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm">Transaction ID</Label>
                    <Input 
                      value={selectedTransaction.id} 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-900 text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-reference" className="text-sm">Reference Number</Label>
                    <Input
                      id="edit-reference"
                      value={editForm.referenceNumber || ''}
                      onChange={(e) => setEditForm({ ...editForm, referenceNumber: e.target.value })}
                      placeholder="DON-1059"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-date" className="text-sm">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editForm.date || ''}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-sm">Description</Label>
                  <Textarea
                    id="edit-description"
                    rows={3}
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Enter transaction description"
                  />
                </div>
              </div>

              {/* Classification Section */}
              <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Classification</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-entity" className="text-sm">Nonprofit</Label>
                    <Select 
                      value={editForm.entityId || ''} 
                      onValueChange={(value: string) => setEditForm({ ...editForm, entityId: value })}
                    >
                      <SelectTrigger id="edit-entity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {entities
                          .filter(e => e.id !== 'all')
                          .map(entity => (
                            <SelectItem key={entity.id} value={entity.id}>
                              {entity.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-category" className="text-sm">Account Category</Label>
                    <Select 
                      value={editForm.category || ''} 
                      onValueChange={(value: string) => setEditForm({ ...editForm, category: value })}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_CODES.map(cat => (
                          <SelectItem key={cat.value} value={cat.label}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Amount Section */}
              <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Amounts</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-debit" className="text-sm">Debit Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="edit-debit"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.debit || 0}
                        onChange={(e) => setEditForm({ ...editForm, debit: parseFloat(e.target.value) || 0 })}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-credit" className="text-sm">Credit Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="edit-credit"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.credit || 0}
                        onChange={(e) => setEditForm({ ...editForm, credit: parseFloat(e.target.value) || 0 })}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-12 mt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleSaveTransaction}
                    className="gap-2 h-12"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsDrawerOpen(false)}
                    className="gap-2 h-12"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
                
                {/* Delete Button */}
                <Button 
                  variant="destructive"
                  onClick={handleDeleteTransaction}
                  className="w-full gap-2 h-12"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Transaction
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Export Format Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Export General Ledger</DialogTitle>
            <DialogDescription className="text-center">
              Select your preferred export format for the general ledger data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <RadioGroup value={exportFormat} onValueChange={(value: string) => setExportFormat(value as 'csv' | 'xlsx')}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="csv" id="format-csv" />
                <Label htmlFor="format-csv" className="cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">CSV File</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Comma-separated values</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="xlsx" id="format-xlsx" />
                <Label htmlFor="format-xlsx" className="cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">Excel Spreadsheet</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Microsoft Excel (.xlsx)</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
