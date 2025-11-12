import React, { useState } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PageHeader } from './PageHeader';
import { DesktopOnlyWarning } from './DesktopOnlyWarning';
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

// Import Account type and helpers
import { Account, createJournalEntryFromTransaction } from '../lib/journalEntryHelpers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

// Mock Chart of Accounts - Expense Accounts
const MOCK_ACCOUNTS: Account[] = [
  // Asset
  { id: 'acc-1000', code: '1000', name: 'Cash', type: 'asset', full_name: '1000 - Cash', is_active: true },
  // Expense Accounts
  { id: 'acc-5000', code: '5000', name: 'Tithe', type: 'expense', full_name: '5000 - Tithe', is_active: true },
  { id: 'acc-5010', code: '5010', name: 'Family Support', type: 'expense', full_name: '5010 - Family Support', is_active: true },
  { id: 'acc-5200', code: '5200', name: 'Legal Fees', type: 'expense', full_name: '5200 - Legal Fees', is_active: true },
  { id: 'acc-5210', code: '5210', name: 'Accounting', type: 'expense', full_name: '5210 - Accounting', is_active: true },
  { id: 'acc-5240', code: '5240', name: 'Advertising Expenses', type: 'expense', full_name: '5240 - Advertising Expenses', is_active: true },
  { id: 'acc-5300', code: '5300', name: 'Office Supplies', type: 'expense', full_name: '5300 - Office Supplies', is_active: true },
  { id: 'acc-5400', code: '5400', name: 'Information Technology', type: 'expense', full_name: '5400 - Information Technology', is_active: true },
  { id: 'acc-5500', code: '5500', name: 'Rent', type: 'expense', full_name: '5500 - Rent', is_active: true },
  { id: 'acc-5510', code: '5510', name: 'Utilities', type: 'expense', full_name: '5510 - Utilities', is_active: true },
  { id: 'acc-5600', code: '5600', name: 'Travel and Meetings', type: 'expense', full_name: '5600 - Travel and Meetings', is_active: true },
  { id: 'acc-5700', code: '5700', name: 'Insurance Premium', type: 'expense', full_name: '5700 - Insurance Premium', is_active: true },
  { id: 'acc-5800', code: '5800', name: 'Bank Fees', type: 'expense', full_name: '5800 - Bank Fees', is_active: true },
  { id: 'acc-5890', code: '5890', name: 'Miscellaneous Expense', type: 'expense', full_name: '5890 - Miscellaneous Expense', is_active: true },
  { id: 'acc-6000', code: '6000', name: 'Event Expenses', type: 'expense', full_name: '6000 - Event Expenses', is_active: true },
];

// Expense accounts only for the selector
const EXPENSE_ACCOUNTS = MOCK_ACCOUNTS.filter(acc => acc.type === 'expense');

interface ManualExpense {
  id: string;
  date: string;
  vendor: string;
  description: string;
  amount: number;
  account: Account;            // Changed from category string
  entityId: string;            // Now required
  notes?: string;
  status: 'pending' | 'approved' | 'posted';  // Added posted status
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  // New fields for GL integration
  journalEntryId?: string;
  postedBy?: string;
  postedAt?: string;
  attachments?: string[];
  paymentMethod?: string;
}

export const ExpensesManager: React.FC = () => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  
  // Mock expense data
  const [expenses, setExpenses] = useState<ManualExpense[]>([
    {
      id: 'exp-001',
      date: '2024-01-15',
      vendor: 'Office Depot',
      description: 'Printer paper and ink cartridges',
      amount: 127.45,
      account: EXPENSE_ACCOUNTS.find(acc => acc.code === '5300')!,
      entityId: 'awakenings',
      status: 'pending',
      submittedBy: 'John Doe',
      submittedAt: '2024-01-15T10:30:00',
    },
    {
      id: 'exp-002',
      date: '2024-01-14',
      vendor: 'Staples',
      description: 'Filing folders and labels',
      amount: 89.44,
      account: EXPENSE_ACCOUNTS.find(acc => acc.code === '5300')!,
      entityId: 'bloom-strong',
      status: 'pending',
      submittedBy: 'Jane Smith',
      submittedAt: '2024-01-14T14:20:00',
    },
    {
      id: 'exp-003',
      date: '2024-01-14',
      vendor: 'FedEx',
      description: 'Shipping marketing materials',
      amount: 31.00,
      account: EXPENSE_ACCOUNTS.find(acc => acc.code === '5240')!,
      entityId: 'bonfire',
      status: 'pending',
      submittedBy: 'Mike Johnson',
      submittedAt: '2024-01-14T09:15:00',
    },
    {
      id: 'exp-004',
      date: '2024-01-13',
      vendor: 'Amazon',
      description: 'External hard drive for backups',
      amount: 156.78,
      account: EXPENSE_ACCOUNTS.find(acc => acc.code === '5890')!,
      entityId: 'awakenings',
      status: 'approved',
      submittedBy: 'Sarah Williams',
      submittedAt: '2024-01-13T11:00:00',
      approvedBy: 'Admin',
      approvedAt: '2024-01-13T15:30:00',
    },
    {
      id: 'exp-005',
      date: '2024-01-12',
      vendor: 'Comcast',
      description: 'Monthly internet service',
      amount: 89.99,
      account: EXPENSE_ACCOUNTS.find(acc => acc.code === '5510')!,
      entityId: 'bloom-strong',
      status: 'approved',
      submittedBy: 'Tom Brown',
      submittedAt: '2024-01-12T08:00:00',
      approvedBy: 'Admin',
      approvedAt: '2024-01-12T16:00:00',
    },
  ]);

  // Filter expenses based on selected entity and status
  const filteredExpenses = expenses.filter(exp => {
    const entityMatch = selectedEntity === 'all' || exp.entityId === selectedEntity;
    return entityMatch;
  });

  const pendingExpenses = filteredExpenses.filter(exp => exp.status === 'pending');
  const approvedExpenses = filteredExpenses.filter(exp => exp.status === 'approved');

  // Calculate totals
  const pendingTotal = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedTotal = approvedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const updateExpense = (id: string, field: keyof ManualExpense, value: any) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleApprove = (expense: ManualExpense) => {
    const updated = expenses.map(exp =>
      exp.id === expense.id
        ? {
            ...exp,
            status: 'approved' as const,
            approvedBy: 'Admin User',
            approvedAt: new Date().toISOString(),
          }
        : exp
    );
    setExpenses(updated);
    toast.success(`Expense approved - $${expense.amount.toFixed(2)}`);
  };

  const handleUnapprove = (expense: ManualExpense) => {
    const updated = expenses.map(exp =>
      exp.id === expense.id
        ? {
            ...exp,
            status: 'pending' as const,
            approvedBy: undefined,
            approvedAt: undefined,
          }
        : exp
    );
    setExpenses(updated);
    toast.success('Expense moved back to pending');
  };

  const handlePostToGL = (expense: ManualExpense) => {
    if (expense.status !== 'approved') {
      toast.error('Only approved expenses can be posted to GL');
      return;
    }

    // Create journal entry
    const journalEntry = createJournalEntryFromTransaction('expense', {
      ...expense,
      notes: expense.notes,
    }, MOCK_ACCOUNTS);
    
    // Dispatch event to update General Ledger
    const event = new CustomEvent('journal-entries-created', {
      detail: { entries: [journalEntry] }
    });
    window.dispatchEvent(event);
    
    // Update expense status
    setExpenses(prev => prev.map(e => 
      e.id === expense.id 
        ? { 
            ...e, 
            status: 'posted',
            journalEntryId: journalEntry.id,
            postedBy: 'Current User',
            postedAt: new Date().toISOString(),
          }
        : e
    ));
    
    toast.success(`Expense posted to General Ledger - $${expense.amount.toFixed(2)}`);
  };

  const handleAddExpense = () => {
    const defaultAccount = EXPENSE_ACCOUNTS.find(acc => acc.code === '5300') || EXPENSE_ACCOUNTS[0];
    const newExpense: ManualExpense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      description: '',
      amount: 0,
      account: defaultAccount,
      status: 'pending',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
      submittedBy: 'Current User',
      submittedAt: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
    toast.success('New expense added - please fill in details');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Desktop-Only Warning for Mobile */}
      <DesktopOnlyWarning 
        toolName="Expense Management"
        description="The Expense Manager requires a desktop computer for detailed expense categorization, approval workflows, and general ledger integration. Please access this feature from a larger screen."
        onBack={() => setAccountingTool(null)}
      />

      {/* Desktop Content */}
      <div className="hidden md:block space-y-4 sm:space-y-6">
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
            title="Expense Management"
            subtitle="Track and approve manual expense entries"
          />
        </div>

      {/* Add Expense Button */}
      <div className="flex justify-center">
        <Button onClick={handleAddExpense} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pending Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-2xl text-yellow-600 dark:text-yellow-400">
                ${pendingTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {pendingExpenses.length} expense{pendingExpenses.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Approved Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-2xl text-green-600 dark:text-green-400">
                ${approvedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {approvedExpenses.length} expense{approvedExpenses.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-2xl text-blue-600 dark:text-blue-400">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All tracked expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pending' | 'approved')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pending" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Pending ({pendingExpenses.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved ({approvedExpenses.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending Tab */}
            <TabsContent value="pending" className="space-y-4">
              {pendingExpenses.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No pending expenses</p>
                  <p className="text-sm mt-2">All expenses have been approved</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[150px]">Vendor</TableHead>
                        <TableHead className="min-w-[200px]">Description</TableHead>
                        <TableHead className="min-w-[100px]">Amount</TableHead>
                        <TableHead className="min-w-[180px]">Category</TableHead>
                        <TableHead className="min-w-[150px]">Nonprofit</TableHead>
                        <TableHead className="min-w-[200px]">Notes</TableHead>
                        <TableHead className="min-w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="py-1 px-2">
                            <Input
                              type="date"
                              value={expense.date}
                              onChange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                              className="h-7 text-xs"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <Input
                              value={expense.vendor}
                              onChange={(e) => updateExpense(expense.id, 'vendor', e.target.value)}
                              placeholder="Vendor..."
                              className="h-7 text-xs"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <Input
                              value={expense.description}
                              onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                              placeholder="Description..."
                              className="h-7 text-xs"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <Input
                              type="number"
                              step="0.01"
                              value={expense.amount}
                              onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="h-7 text-xs"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <Select
                              value={expense.account?.id || ''}
                              onValueChange={(value: string) => {
                                const account = EXPENSE_ACCOUNTS.find(acc => acc.id === value);
                                if (account) {
                                  updateExpense(expense.id, 'account', account);
                                }
                              }}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {EXPENSE_ACCOUNTS.map((acc) => (
                                  <SelectItem key={acc.id} value={acc.id} className="text-xs">
                                    {acc.code} - {acc.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <Select
                              value={expense.entityId || ''}
                              onValueChange={(value) => updateExpense(expense.id, 'entityId', value)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {entities
                                  .filter((entity) => entity.id !== 'all')
                                  .map((entity) => (
                                    <SelectItem key={entity.id} value={entity.id} className="text-xs">
                                      {entity.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <Input
                              value={expense.notes || ''}
                              onChange={(e) => updateExpense(expense.id, 'notes', e.target.value)}
                              placeholder="Notes..."
                              className="h-7 text-xs"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <Button
                              onClick={() => handleApprove(expense)}
                              size="sm"
                              className="gap-1 h-7 text-xs px-2"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Approved Tab */}
            <TabsContent value="approved" className="space-y-4">
              {approvedExpenses.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No approved expenses yet</p>
                  <p className="text-sm mt-2">Approve pending expenses to see them here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[150px]">Vendor</TableHead>
                        <TableHead className="min-w-[200px]">Description</TableHead>
                        <TableHead className="min-w-[100px]">Amount</TableHead>
                        <TableHead className="min-w-[180px]">Category</TableHead>
                        <TableHead className="min-w-[150px]">Nonprofit</TableHead>
                        <TableHead className="min-w-[200px]">Notes</TableHead>
                        <TableHead className="min-w-[120px]">Approved By</TableHead>
                        <TableHead className="min-w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedExpenses.map((expense) => (
                        <TableRow key={expense.id} className="bg-green-50/50 dark:bg-green-950/10">
                          <TableCell className="text-xs">{expense.date}</TableCell>
                          <TableCell className="text-xs">{expense.vendor}</TableCell>
                          <TableCell className="text-xs">{expense.description}</TableCell>
                          <TableCell className="text-xs">
                            <span className="text-green-600 dark:text-green-400">
                              ${expense.amount.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">{expense.account.code} - {expense.account.name}</TableCell>
                          <TableCell className="text-xs">
                            {entities.find(e => e.id === expense.entityId)?.name}
                          </TableCell>
                          <TableCell className="text-xs">{expense.notes || '-'}</TableCell>
                          <TableCell className="text-xs">
                            {expense.approvedBy}
                            <br />
                            <span className="text-gray-500 dark:text-gray-400">
                              {expense.approvedAt ? new Date(expense.approvedAt).toLocaleDateString() : ''}
                            </span>
                          </TableCell>
                          <TableCell className="py-1 px-2">
                            <div className="flex gap-2">
                              {expense.status === 'approved' && (
                                <Button
                                  onClick={() => handlePostToGL(expense)}
                                  size="sm"
                                  className="gap-1 h-7 text-xs px-2"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  Post to GL
                                </Button>
                              )}
                              {expense.status === 'posted' && (
                                <Badge variant="outline" className="text-xs">
                                  Posted to GL
                                </Badge>
                              )}
                              <Button
                                onClick={() => handleUnapprove(expense)}
                                size="sm"
                                variant="outline"
                                className="gap-1 h-7 text-xs px-2"
                              >
                                Undo
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
