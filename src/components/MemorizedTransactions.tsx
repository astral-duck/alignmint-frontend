import React, { useState } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageHeader } from './PageHeader';
import { DesktopOnlyWarning } from './DesktopOnlyWarning';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import {
  ArrowLeft,
  Plus,
  Clock,
  Edit,
  Trash2,
  Play,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

// Account interface
interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;
  is_active: boolean;
}

// Journal Entry Line for memorized transaction
interface MemorizedLine {
  id: string;
  account: Account;
  description: string;
  debit_amount: number;
  credit_amount: number;
}

// Memorized Transaction interface
interface MemorizedTransaction {
  id: string;
  name: string;
  description: string;
  entity_id: string;
  schedule_type: 'monthly' | 'quarterly' | 'manual';
  next_run_date?: string;
  last_run_date?: string;
  is_active: boolean;
  lines: MemorizedLine[];
  created_at: string;
  created_by: string;
}

// Mock Chart of Accounts
const MOCK_ACCOUNTS: Account[] = [
  { id: '1000', code: '1000', name: 'IFM Checking/Peoples Bank', type: 'asset', full_name: '1000 - IFM Checking/Peoples Bank', is_active: true },
  { id: '1010', code: '1010', name: 'Savings Account', type: 'asset', full_name: '1010 - Savings Account', is_active: true },
  { id: '4000', code: '4000', name: 'Donations', type: 'revenue', full_name: '4000 - Donations', is_active: true },
  { id: '4100', code: '4100', name: 'Earned Income', type: 'revenue', full_name: '4100 - Earned Income', is_active: true },
  { id: '5100', code: '5100', name: 'Compensation - Officers', type: 'expense', full_name: '5100 - Compensation - Officers', is_active: true },
  { id: '5110', code: '5110', name: 'Compensation - Staff', type: 'expense', full_name: '5110 - Compensation - Staff', is_active: true },
  { id: '5500', code: '5500', name: 'Rent', type: 'expense', full_name: '5500 - Rent', is_active: true },
  { id: '5700', code: '5700', name: 'Insurance', type: 'expense', full_name: '5700 - Insurance', is_active: true },
  { id: '5800', code: '5800', name: 'Bank Fees', type: 'expense', full_name: '5800 - Bank Fees', is_active: true },
];

// Mock memorized transactions
const mockMemorizedTransactions: MemorizedTransaction[] = [
  {
    id: 'mt-001',
    name: 'Monthly Rent Payment',
    description: 'Office rent for main location',
    entity_id: 'infocus',
    schedule_type: 'monthly',
    next_run_date: '2025-12-01',
    last_run_date: '2025-11-01',
    is_active: true,
    lines: [
      { id: 'l1', account: MOCK_ACCOUNTS.find(a => a.code === '5500')!, description: 'Monthly rent', debit_amount: 2500, credit_amount: 0 },
      { id: 'l2', account: MOCK_ACCOUNTS.find(a => a.code === '1000')!, description: 'Monthly rent', debit_amount: 0, credit_amount: 2500 },
    ],
    created_at: '2025-01-15',
    created_by: 'Admin',
  },
  {
    id: 'mt-002',
    name: 'Quarterly Insurance Premium',
    description: 'Liability insurance payment',
    entity_id: 'infocus',
    schedule_type: 'quarterly',
    next_run_date: '2026-01-01',
    last_run_date: '2025-10-01',
    is_active: true,
    lines: [
      { id: 'l3', account: MOCK_ACCOUNTS.find(a => a.code === '5700')!, description: 'Insurance premium', debit_amount: 1200, credit_amount: 0 },
      { id: 'l4', account: MOCK_ACCOUNTS.find(a => a.code === '1000')!, description: 'Insurance premium', debit_amount: 0, credit_amount: 1200 },
    ],
    created_at: '2025-01-15',
    created_by: 'Admin',
  },
  {
    id: 'mt-003',
    name: 'Bank Service Fee',
    description: 'Monthly bank maintenance fee',
    entity_id: 'awakenings',
    schedule_type: 'manual',
    is_active: true,
    lines: [
      { id: 'l5', account: MOCK_ACCOUNTS.find(a => a.code === '5800')!, description: 'Bank fee', debit_amount: 25, credit_amount: 0 },
      { id: 'l6', account: MOCK_ACCOUNTS.find(a => a.code === '1000')!, description: 'Bank fee', debit_amount: 0, credit_amount: 25 },
    ],
    created_at: '2025-02-01',
    created_by: 'Admin',
  },
];

export const MemorizedTransactions: React.FC = () => {
  const { selectedEntity, setToolsTool } = useApp();
  const [transactions, setTransactions] = useState<MemorizedTransaction[]>(mockMemorizedTransactions);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<MemorizedTransaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<MemorizedTransaction | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEntityId, setFormEntityId] = useState('');
  const [formScheduleType, setFormScheduleType] = useState<'monthly' | 'quarterly' | 'manual'>('manual');
  const [formNextRunDate, setFormNextRunDate] = useState('');
  const [formLines, setFormLines] = useState<MemorizedLine[]>([]);

  // Filter by entity
  const filteredTransactions = transactions.filter(t => 
    selectedEntity === 'all' || t.entity_id === selectedEntity
  );

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormEntityId(selectedEntity === 'all' ? '' : selectedEntity);
    setFormScheduleType('manual');
    setFormNextRunDate('');
    setFormLines([
      { id: `line-${Date.now()}-1`, account: MOCK_ACCOUNTS[0], description: '', debit_amount: 0, credit_amount: 0 },
      { id: `line-${Date.now()}-2`, account: MOCK_ACCOUNTS[0], description: '', debit_amount: 0, credit_amount: 0 },
    ]);
  };

  const handleCreate = () => {
    resetForm();
    setEditingTransaction(null);
    setSheetOpen(true);
  };

  const handleEdit = (transaction: MemorizedTransaction) => {
    setEditingTransaction(transaction);
    setFormName(transaction.name);
    setFormDescription(transaction.description);
    setFormEntityId(transaction.entity_id);
    setFormScheduleType(transaction.schedule_type);
    setFormNextRunDate(transaction.next_run_date || '');
    setFormLines([...transaction.lines]);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Please enter a transaction name');
      return;
    }
    if (!formEntityId) {
      toast.error('Please select a nonprofit');
      return;
    }

    const totalDebits = formLines.reduce((sum, l) => sum + l.debit_amount, 0);
    const totalCredits = formLines.reduce((sum, l) => sum + l.credit_amount, 0);
    if (totalDebits !== totalCredits) {
      toast.error('Debits must equal credits');
      return;
    }

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id
          ? { ...t, name: formName, description: formDescription, entity_id: formEntityId, schedule_type: formScheduleType, next_run_date: formNextRunDate || undefined, lines: formLines }
          : t
      ));
      toast.success('Memorized transaction updated');
    } else {
      const newTransaction: MemorizedTransaction = {
        id: `mt-${Date.now()}`,
        name: formName,
        description: formDescription,
        entity_id: formEntityId,
        schedule_type: formScheduleType,
        next_run_date: formNextRunDate || undefined,
        is_active: true,
        lines: formLines,
        created_at: new Date().toISOString().split('T')[0],
        created_by: 'Current User',
      };
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Memorized transaction created');
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (transactionToDelete) {
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
      toast.success('Memorized transaction deleted');
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleRunNow = (transaction: MemorizedTransaction) => {
    // In production, this would create a journal entry
    toast.success(`Journal entry created from "${transaction.name}"`);
    setTransactions(prev => prev.map(t => 
      t.id === transaction.id
        ? { ...t, last_run_date: new Date().toISOString().split('T')[0] }
        : t
    ));
  };

  const addLine = () => {
    setFormLines(prev => [...prev, {
      id: `line-${Date.now()}`,
      account: MOCK_ACCOUNTS[0],
      description: '',
      debit_amount: 0,
      credit_amount: 0,
    }]);
  };

  const updateLine = (lineId: string, field: keyof MemorizedLine, value: any) => {
    setFormLines(prev => prev.map(l => 
      l.id === lineId ? { ...l, [field]: value } : l
    ));
  };

  const removeLine = (lineId: string) => {
    if (formLines.length <= 2) {
      toast.error('Minimum 2 lines required');
      return;
    }
    setFormLines(prev => prev.filter(l => l.id !== lineId));
  };

  const getScheduleBadge = (type: string) => {
    switch (type) {
      case 'monthly': return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Monthly</Badge>;
      case 'quarterly': return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Quarterly</Badge>;
      default: return <Badge variant="outline">Manual</Badge>;
    }
  };

  const totalDebits = formLines.reduce((sum, l) => sum + l.debit_amount, 0);
  const totalCredits = formLines.reduce((sum, l) => sum + l.credit_amount, 0);
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DesktopOnlyWarning 
        toolName="Memorized Transactions"
        description="Memorized Transactions requires a desktop for managing recurring journal entries."
        onBack={() => setToolsTool(null)}
      />

      <div className="hidden md:block space-y-4 sm:space-y-6">
        <Button variant="ghost" onClick={() => setToolsTool(null)} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Button>

        <div className="text-center">
          <PageHeader 
            title="Memorized Transactions"
            subtitle="Create and manage recurring journal entries"
          />
        </div>

        <div className="flex justify-center">
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Memorized Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Memorized</p>
              <p className="text-3xl font-bold">{filteredTransactions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Scheduled</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {filteredTransactions.filter(t => t.schedule_type !== 'manual').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Manual</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {filteredTransactions.filter(t => t.schedule_type === 'manual').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader><CardTitle>Memorized Transactions</CardTitle></CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No memorized transactions</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Nonprofit</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {entities.find(e => e.id === t.entity_id)?.name || t.entity_id}
                      </TableCell>
                      <TableCell>{getScheduleBadge(t.schedule_type)}</TableCell>
                      <TableCell className="font-mono">
                        ${t.lines.reduce((sum, l) => sum + l.debit_amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {t.next_run_date || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {t.last_run_date || 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleRunNow(t)} title="Create Journal Entry">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setTransactionToDelete(t); setDeleteDialogOpen(true); }}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle>{editingTransaction ? 'Edit' : 'New'} Memorized Transaction</SheetTitle>
              <SheetDescription>Define a transaction template for recurring entries</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-name">Transaction Name</Label>
                    <Input 
                      id="transaction-name"
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      placeholder="e.g., Monthly Rent" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={formDescription} 
                      onChange={(e) => setFormDescription(e.target.value)} 
                      placeholder="Optional description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nonprofit">Nonprofit</Label>
                      <Select value={formEntityId} onValueChange={setFormEntityId}>
                        <SelectTrigger id="nonprofit">
                          <SelectValue placeholder="Select nonprofit..." />
                        </SelectTrigger>
                        <SelectContent>
                          {entities.filter(e => e.id !== 'all').map(e => (
                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule</Label>
                      <Select 
                        value={formScheduleType} 
                        onValueChange={(v: string) => setFormScheduleType(v as 'monthly' | 'quarterly' | 'manual')}
                      >
                        <SelectTrigger id="schedule">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formScheduleType !== 'manual' && (
                    <div className="space-y-2">
                      <Label htmlFor="next-run-date">Next Run Date</Label>
                      <Input 
                        id="next-run-date"
                        type="date" 
                        value={formNextRunDate} 
                        onChange={(e) => setFormNextRunDate(e.target.value)} 
                      />
                    </div>
                  )}
                </div>

                {/* Journal Entry Lines */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Journal Entry Lines</Label>
                    <Button variant="outline" size="sm" onClick={addLine} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Line
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formLines.map((line) => (
                      <Card key={line.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm">Account</Label>
                              <Select 
                                value={line.account.id} 
                                onValueChange={(v: string) => {
                                  const acc = MOCK_ACCOUNTS.find(a => a.id === v);
                                  if (acc) updateLine(line.id, 'account', acc);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {MOCK_ACCOUNTS.map(a => (
                                    <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">Description</Label>
                              <Input 
                                placeholder="Line description" 
                                value={line.description} 
                                onChange={(e) => updateLine(line.id, 'description', e.target.value)} 
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-sm">Debit</Label>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00" 
                                  value={line.debit_amount || ''} 
                                  onChange={(e) => updateLine(line.id, 'debit_amount', parseFloat(e.target.value) || 0)} 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">Credit</Label>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00" 
                                  value={line.credit_amount || ''} 
                                  onChange={(e) => updateLine(line.id, 'credit_amount', parseFloat(e.target.value) || 0)} 
                                />
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeLine(line.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Line
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Totals */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Totals:</span>
                        <div className="flex gap-8">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Debits</div>
                            <div className="font-mono">${totalDebits.toFixed(2)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Credits</div>
                            <div className="font-mono">${totalCredits.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                      {!isBalanced && totalDebits + totalCredits > 0 && (
                        <p className="text-red-500 text-sm mt-2">⚠️ Debits must equal credits</p>
                      )}
                      {isBalanced && (
                        <p className="text-green-600 dark:text-green-400 text-sm mt-2">✓ Entry is balanced</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t mt-auto">
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!isBalanced}>
                {editingTransaction ? 'Update' : 'Create'} Transaction
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Memorized Transaction</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{transactionToDelete?.name}"? This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
