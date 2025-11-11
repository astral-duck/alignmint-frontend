import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageHeader } from './PageHeader';
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
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Download,
  Filter,
  Search,
  CheckCircle,
  Edit,
  X,
  Save,
  Trash2,
  Calendar,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

// Account interface - matches Chart of Accounts
interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;
  is_active: boolean;
}

// Journal Entry interface - proper structure
interface JournalEntry {
  id: string;
  organization_id: string;
  entity_id: string;
  entry_number: string;           // e.g., "JE-2025-001"
  entry_date: string;
  description: string;
  memo?: string;
  status: 'draft' | 'posted' | 'voided';
  source_type: 'manual';          // Manual entries only
  source_id: null;                // No source for manual entries
  posted_at?: string;
  posted_by?: string;
  voided_at?: string;
  voided_by?: string;
  void_reason?: string;
  reversing_entry_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  lines: JournalEntryLine[];
}

// Journal Entry Line interface
interface JournalEntryLine {
  id: string;
  journal_entry_id: string;
  account: Account;               // Full account object from Chart of Accounts
  line_number: number;            // Order within entry (1, 2, 3...)
  description: string;
  memo?: string;
  debit_amount: number;
  credit_amount: number;
}

// Mock Chart of Accounts - in production this will come from backend API
const MOCK_ACCOUNTS: Account[] = [
  { id: '1000', code: '1000', name: 'IFM Checking/Peoples Bank', type: 'asset', full_name: '1000 - IFM Checking/Peoples Bank', is_active: true },
  { id: '1010', code: '1010', name: 'Savings Account', type: 'asset', full_name: '1010 - Savings Account', is_active: true },
  { id: '1200', code: '1200', name: 'Accounts Receivable', type: 'asset', full_name: '1200 - Accounts Receivable', is_active: true },
  { id: '1700', code: '1700', name: 'Accumulated Depreciation', type: 'asset', full_name: '1700 - Accumulated Depreciation', is_active: true },
  { id: '4000', code: '4000', name: 'Donations', type: 'revenue', full_name: '4000 - Donations', is_active: true },
  { id: '4100', code: '4100', name: 'Earned Income', type: 'revenue', full_name: '4100 - Earned Income', is_active: true },
  { id: '4300', code: '4300', name: 'Grants', type: 'revenue', full_name: '4300 - Grants', is_active: true },
  { id: '5100', code: '5100', name: 'Compensation - Officers', type: 'expense', full_name: '5100 - Compensation - Officers', is_active: true },
  { id: '5110', code: '5110', name: 'Compensation - Staff', type: 'expense', full_name: '5110 - Compensation - Staff', is_active: true },
  { id: '5130', code: '5130', name: 'Employee Benefits', type: 'expense', full_name: '5130 - Employee Benefits', is_active: true },
  { id: '5140', code: '5140', name: 'Payroll Taxes', type: 'expense', full_name: '5140 - Payroll Taxes', is_active: true },
  { id: '5200', code: '5200', name: 'Legal Fees', type: 'expense', full_name: '5200 - Legal Fees', is_active: true },
  { id: '5210', code: '5210', name: 'Accounting', type: 'expense', full_name: '5210 - Accounting', is_active: true },
  { id: '5240', code: '5240', name: 'Advertising', type: 'expense', full_name: '5240 - Advertising', is_active: true },
  { id: '5300', code: '5300', name: 'Office Supplies', type: 'expense', full_name: '5300 - Office Supplies', is_active: true },
  { id: '5310', code: '5310', name: 'Furniture & Equipment', type: 'expense', full_name: '5310 - Furniture & Equipment', is_active: true },
  { id: '5400', code: '5400', name: 'Information Technology', type: 'expense', full_name: '5400 - Information Technology', is_active: true },
  { id: '5500', code: '5500', name: 'Rent', type: 'expense', full_name: '5500 - Rent', is_active: true },
  { id: '5600', code: '5600', name: 'Travel', type: 'expense', full_name: '5600 - Travel', is_active: true },
  { id: '5700', code: '5700', name: 'Insurance', type: 'expense', full_name: '5700 - Insurance', is_active: true },
  { id: '5800', code: '5800', name: 'Bank Fees', type: 'expense', full_name: '5800 - Bank Fees', is_active: true },
];

// Helper function to get account by code
const getAccountByCode = (code: string): Account => {
  const account = MOCK_ACCOUNTS.find(a => a.code === code);
  return account || MOCK_ACCOUNTS[0]; // Default to first account if not found
};

// Mock Journal Entries - proper structure with header + lines
const mockJournalEntries: JournalEntry[] = [
  {
    id: 'je-001',
    organization_id: 'org-1',
    entity_id: 'infocus',
    entry_number: 'JE-2025-001',
    entry_date: '2025-11-05',
    description: 'Monthly depreciation expense',
    memo: 'Depreciation for office equipment',
    status: 'posted',
    source_type: 'manual',
    source_id: null,
    posted_at: '2025-11-05T10:00:00Z',
    posted_by: 'John Doe',
    created_by: 'John Doe',
    created_at: '2025-11-05T09:00:00Z',
    updated_at: '2025-11-05T10:00:00Z',
    lines: [
      {
        id: 'line-1',
        journal_entry_id: 'je-001',
        account: getAccountByCode('5310'),
        line_number: 1,
        description: 'Depreciation expense',
        debit_amount: 450.00,
        credit_amount: 0.00,
      },
      {
        id: 'line-2',
        journal_entry_id: 'je-001',
        account: getAccountByCode('1700'),
        line_number: 2,
        description: 'Accumulated depreciation',
        debit_amount: 0.00,
        credit_amount: 450.00,
      },
    ],
  },
  {
    id: 'je-002',
    organization_id: 'org-1',
    entity_id: 'the-uprising',
    entry_number: 'JE-2025-002',
    entry_date: '2025-11-01',
    description: 'Accrued payroll expense',
    status: 'draft',
    source_type: 'manual',
    source_id: null,
    created_by: 'Jane Smith',
    created_at: '2025-11-01T14:00:00Z',
    updated_at: '2025-11-01T14:00:00Z',
    lines: [
      {
        id: 'line-3',
        journal_entry_id: 'je-002',
        account: getAccountByCode('5110'),
        line_number: 1,
        description: 'Payroll expense',
        debit_amount: 2850.00,
        credit_amount: 0.00,
      },
      {
        id: 'line-4',
        journal_entry_id: 'je-002',
        account: getAccountByCode('1200'),
        line_number: 2,
        description: 'Accounts payable',
        debit_amount: 0.00,
        credit_amount: 2850.00,
      },
    ],
  },
  {
    id: 'je-003',
    organization_id: 'org-1',
    entity_id: 'bloom-strong',
    entry_number: 'JE-2025-003',
    entry_date: '2025-10-28',
    description: 'Prepaid insurance adjustment',
    status: 'posted',
    source_type: 'manual',
    source_id: null,
    posted_at: '2025-10-28T11:00:00Z',
    posted_by: 'John Doe',
    created_by: 'John Doe',
    created_at: '2025-10-28T10:00:00Z',
    updated_at: '2025-10-28T11:00:00Z',
    lines: [
      {
        id: 'line-5',
        journal_entry_id: 'je-003',
        account: getAccountByCode('5700'),
        line_number: 1,
        description: 'Insurance expense',
        debit_amount: 675.00,
        credit_amount: 0.00,
      },
      {
        id: 'line-6',
        journal_entry_id: 'je-003',
        account: getAccountByCode('1000'),
        line_number: 2,
        description: 'Cash payment',
        debit_amount: 0.00,
        credit_amount: 675.00,
      },
    ],
  },
  {
    id: 'je-004',
    organization_id: 'org-1',
    entity_id: 'awakenings',
    entry_number: 'JE-2025-004',
    entry_date: '2025-10-15',
    description: 'Revenue recognition adjustment',
    status: 'voided',
    source_type: 'manual',
    source_id: null,
    posted_at: '2025-10-15T12:00:00Z',
    posted_by: 'Jane Smith',
    voided_at: '2025-10-16T09:00:00Z',
    voided_by: 'John Doe',
    void_reason: 'Incorrect revenue amount',
    reversing_entry_id: 'je-005',
    created_by: 'Jane Smith',
    created_at: '2025-10-15T11:00:00Z',
    updated_at: '2025-10-16T09:00:00Z',
    lines: [
      {
        id: 'line-7',
        journal_entry_id: 'je-004',
        account: getAccountByCode('1200'),
        line_number: 1,
        description: 'Accounts receivable',
        debit_amount: 1200.00,
        credit_amount: 0.00,
      },
      {
        id: 'line-8',
        journal_entry_id: 'je-004',
        account: getAccountByCode('4100'),
        line_number: 2,
        description: 'Earned income',
        debit_amount: 0.00,
        credit_amount: 1200.00,
      },
    ],
  },
];

export const JournalEntryManager: React.FC = () => {
  const { setAccountingTool, selectedEntity } = useApp();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  // Create new journal entry state
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    memo: '',
    entityId: selectedEntity === 'all' ? 'infocus' : selectedEntity,
    referenceNumber: '',
    lines: [] as JournalEntryLine[],
  });

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const addLine = () => {
    const newLine: JournalEntryLine = {
      id: `line-${Date.now()}`,
      journal_entry_id: '',
      account: MOCK_ACCOUNTS[0], // Default to first account
      line_number: newEntry.lines.length + 1,
      description: '',
      memo: '',
      debit_amount: 0,
      credit_amount: 0,
    };
    setNewEntry({ ...newEntry, lines: [...newEntry.lines, newLine] });
  };

  const updateLine = (lineId: string, field: string, value: any) => {
    const updatedLines = newEntry.lines.map(line =>
      line.id === lineId ? { ...line, [field]: value } : line
    );
    setNewEntry({ ...newEntry, lines: updatedLines });
  };

  const removeLine = (lineId: string) => {
    setNewEntry({ ...newEntry, lines: newEntry.lines.filter(line => line.id !== lineId) });
  };

  const handleCreateEntry = () => {
    // Validate that debits equal credits
    const totalDebits = newEntry.lines.reduce((sum, line) => sum + line.debit_amount, 0);
    const totalCredits = newEntry.lines.reduce((sum, line) => sum + line.credit_amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      toast.error('Debits must equal credits');
      return;
    }

    if (newEntry.lines.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    if (!newEntry.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    // Create proper journal entry
    const newJournalEntry: JournalEntry = {
      id: `je-${Date.now()}`,
      organization_id: 'org-1',
      entity_id: newEntry.entityId,
      entry_number: newEntry.referenceNumber || `JE-${Date.now()}`,
      entry_date: newEntry.date,
      description: newEntry.description,
      memo: newEntry.memo,
      status: 'draft',
      source_type: 'manual',
      source_id: null,
      created_by: 'Current User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lines: newEntry.lines.map((line, index) => ({
        ...line,
        journal_entry_id: `je-${Date.now()}`,
        line_number: index + 1,
      })),
    };

    setJournalEntries([newJournalEntry, ...journalEntries]);
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      memo: '',
      entityId: selectedEntity === 'all' ? 'infocus' : selectedEntity,
      referenceNumber: '',
      lines: [],
    });

    toast.success(`Journal entry created with ${newJournalEntry.lines.length} line${newJournalEntry.lines.length > 1 ? 's' : ''}`);
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleConfirmExport = () => {
    import('xlsx').then((XLSX) => {
      const headers = ['Entry Number', 'Date', 'Description', 'Entity', 'Line #', 'Account', 'Line Description', 'Debit', 'Credit', 'Status'];
      const data = filteredEntries.flatMap(e => {
        const entityName = entities.find(ent => ent.id === e.entity_id)?.name || '';
        const rows = e.lines.map(line => [
          e.entry_number,
          e.entry_date,
          e.description,
          entityName,
          line.line_number,
          `${line.account.code} - ${line.account.name}`,
          line.description,
          line.debit_amount.toFixed(2),
          line.credit_amount.toFixed(2),
          e.status.charAt(0).toUpperCase() + e.status.slice(1)
        ]);
        // Add totals row
        const totalDebits = e.lines.reduce((sum, l) => sum + l.debit_amount, 0);
        const totalCredits = e.lines.reduce((sum, l) => sum + l.credit_amount, 0);
        rows.push([
          e.entry_number,
          '',
          '',
          '',
          '',
          'TOTAL',
          '',
          totalDebits.toFixed(2),
          totalCredits.toFixed(2),
          ''
        ]);
        return rows;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

      ws['!cols'] = [
        { wch: 12 },
        { wch: 12 },
        { wch: 40 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Journal Entries');
      const filename = `journal-entries-${new Date().toISOString().split('T')[0]}.${exportFormat === 'csv' ? 'csv' : 'xlsx'}`;
      
      if (exportFormat === 'csv') {
        // Convert to CSV
        const csv = [headers, ...data].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        XLSX.writeFile(wb, filename);
      }
      
      setExportDialogOpen(false);
      const formatName = exportFormat === 'csv' ? 'CSV' : 'Excel';
      toast.success(
        `Exporting Journal Entries as ${formatName}...`,
        { description: 'Your file will be downloaded shortly' }
      );
    }).catch(error => {
      console.error('Error exporting:', error);
      toast.error('Failed to export journal entries');
    });
  };

  // Filter entries
  const filteredEntries = useMemo(() => {
    let filtered = [...journalEntries];

    // Filter by global selected entity
    if (selectedEntity !== 'all') {
      filtered = filtered.filter(e => e.entity_id === selectedEntity);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(e => e.entry_date >= filterDateFrom);
    }
    if (filterDateTo) {
      filtered = filtered.filter(e => e.entry_date <= filterDateTo);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.description.toLowerCase().includes(search) ||
        e.entry_number.toLowerCase().includes(search) ||
        e.memo?.toLowerCase().includes(search) ||
        e.lines.some(line => 
          line.account.code.toLowerCase().includes(search) ||
          line.account.name.toLowerCase().includes(search) ||
          line.description.toLowerCase().includes(search)
        )
      );
    }

    filtered.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());

    return filtered;
  }, [journalEntries, selectedEntity, filterDateFrom, filterDateTo, searchTerm]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalDebits = filteredEntries.reduce((sum, e) => 
      sum + e.lines.reduce((lineSum, line) => lineSum + line.debit_amount, 0), 0
    );
    const totalCredits = filteredEntries.reduce((sum, e) => 
      sum + e.lines.reduce((lineSum, line) => lineSum + line.credit_amount, 0), 0
    );
    return {
      totalDebits,
      totalCredits,
      count: filteredEntries.length,
    };
  }, [filteredEntries]);

  const totalDebits = newEntry.lines.reduce((sum, line) => sum + line.debit_amount, 0);
  const totalCredits = newEntry.lines.reduce((sum, line) => sum + line.credit_amount, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

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
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-medium mb-2">Journal Entries</h1>
          <p className="text-muted-foreground">Create and manage manual journal entries for adjustments and corrections</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Journal Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create Journal Entry
                </DialogTitle>
                <DialogDescription>
                  Add multiple line items. Debits must equal credits.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Header Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="entry-date">Date</Label>
                    <Input
                      id="entry-date"
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entry-entity">Entity</Label>
                    <Select value={newEntry.entityId} onValueChange={(value: string) => setNewEntry({ ...newEntry, entityId: value })}>
                      <SelectTrigger id="entry-entity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.filter(e => e.id !== 'all').map(entity => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="entry-description">Description</Label>
                    <Textarea
                      id="entry-description"
                      placeholder="Enter journal entry description"
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="entry-memo">Memo (Optional)</Label>
                    <Textarea
                      id="entry-memo"
                      placeholder="Additional notes for this journal entry"
                      value={newEntry.memo || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, memo: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entry-reference">Reference Number (Optional)</Label>
                    <Input
                      id="entry-reference"
                      placeholder="JE-2025-001"
                      value={newEntry.referenceNumber}
                      onChange={(e) => setNewEntry({ ...newEntry, referenceNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Line Items</h3>
                    <Button type="button" onClick={addLine} variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Line
                    </Button>
                  </div>

                  {newEntry.lines.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
                      No line items added yet. Click "Add Line" to start.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {newEntry.lines.map((line, index) => (
                        <div key={line.id} className="p-4 border rounded-lg space-y-3 bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Line {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLine(line.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2 sm:col-span-2">
                              <Label>Account</Label>
                              <Select
                                value={line.account.id}
                                onValueChange={(value: string) => {
                                  const selectedAccount = MOCK_ACCOUNTS.find(a => a.id === value);
                                  if (selectedAccount) {
                                    updateLine(line.id, 'account', selectedAccount);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MOCK_ACCOUNTS.map(account => (
                                    <SelectItem key={account.id} value={account.id}>
                                      {account.full_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <Label>Line Description</Label>
                              <Input
                                placeholder="Description for this line"
                                value={line.description}
                                onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <Label>Line Memo (Optional)</Label>
                              <Input
                                placeholder="Additional notes for this line"
                                value={line.memo || ''}
                                onChange={(e) => updateLine(line.id, 'memo', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Debit</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={line.debit_amount || ''}
                                onChange={(e) => updateLine(line.id, 'debit_amount', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Credit</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={line.credit_amount || ''}
                                onChange={(e) => updateLine(line.id, 'credit_amount', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Add Line button at bottom */}
                      {newEntry.lines.length > 0 && (
                        <div className="flex justify-center pt-2">
                          <Button type="button" onClick={addLine} variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Line
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Totals */}
                  {newEntry.lines.length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Debits:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            ${totalDebits.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Credits:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            ${totalCredits.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Difference:</span>
                          <span className={`font-medium ${isBalanced ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            ${Math.abs(totalDebits - totalCredits).toFixed(2)}
                            {isBalanced && <CheckCircle className="inline h-4 w-4 ml-2" />}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEntry} disabled={!isBalanced || newEntry.lines.length === 0}>
                  Create Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-semibold">{summary.count}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Debits</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                ${summary.totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                ${summary.totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Description, category, code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[120px]">Entry Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden lg:table-cell w-[140px]">Entity</TableHead>
                  <TableHead className="text-center w-[90px]">Lines</TableHead>
                  <TableHead className="text-right w-[120px]">Total Debits</TableHead>
                  <TableHead className="text-right w-[120px]">Total Credits</TableHead>
                  <TableHead className="text-center w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No journal entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => {
                    const totalDebits = entry.lines.reduce((sum, line) => sum + line.debit_amount, 0);
                    const totalCredits = entry.lines.reduce((sum, line) => sum + line.credit_amount, 0);
                    
                    return (
                      <TableRow
                        key={entry.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => handleEntryClick(entry)}
                      >
                        <TableCell className="font-medium">
                          {new Date(entry.entry_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.entry_number}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={entry.description}>
                            {entry.description}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {entities.find(e => e.id === entry.entity_id)?.name || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {entry.lines.length} {entry.lines.length === 1 ? 'line' : 'lines'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            ${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.status === 'posted' ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Posted
                            </Badge>
                          ) : entry.status === 'voided' ? (
                            <Badge variant="destructive" className="text-xs">
                              Voided
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Draft
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Entry Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-8">
          <SheetHeader className="pb-8 border-b border-gray-200 dark:border-gray-700">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Journal Entry Details
            </SheetTitle>
            <SheetDescription>
              View all details and lines for this journal entry.
            </SheetDescription>
          </SheetHeader>

          {selectedEntry && (
            <div className="space-y-6 mt-6">
              {/* Entry Header */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Entry Number:</span>
                    <p className="font-mono font-medium mt-1">{selectedEntry.entry_number}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <p className="font-medium mt-1">
                      {new Date(selectedEntry.entry_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Description:</span>
                    <p className="font-medium mt-1">{selectedEntry.description}</p>
                  </div>
                  {selectedEntry.memo && (
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Memo:</span>
                      <p className="text-sm mt-1">{selectedEntry.memo}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <div className="mt-1">
                      {selectedEntry.status === 'posted' ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Posted
                        </Badge>
                      ) : selectedEntry.status === 'voided' ? (
                        <Badge variant="destructive">Voided</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Entity:</span>
                    <p className="font-medium mt-1">
                      {entities.find(e => e.id === selectedEntry.entity_id)?.name || 'Unknown'}
                    </p>
                  </div>
                  {selectedEntry.posted_at && (
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Posted:</span>
                      <p className="text-sm mt-1">
                        {new Date(selectedEntry.posted_at).toLocaleString()} by {selectedEntry.posted_by}
                      </p>
                    </div>
                  )}
                  {selectedEntry.voided_at && (
                    <>
                      <div className="col-span-2">
                        <span className="text-gray-600 dark:text-gray-400">Voided:</span>
                        <p className="text-sm mt-1">
                          {new Date(selectedEntry.voided_at).toLocaleString()} by {selectedEntry.voided_by}
                        </p>
                      </div>
                      {selectedEntry.void_reason && (
                        <div className="col-span-2">
                          <span className="text-gray-600 dark:text-gray-400">Void Reason:</span>
                          <p className="text-sm mt-1">{selectedEntry.void_reason}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Entry Lines */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Entry Lines</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Line</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right w-[120px]">Debit</TableHead>
                        <TableHead className="text-right w-[120px]">Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEntry.lines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell className="font-medium text-gray-600 dark:text-gray-400">
                            {line.line_number}
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm font-medium">{line.account.code}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{line.account.name}</div>
                          </TableCell>
                          <TableCell>
                            <div>{line.description}</div>
                            {line.memo && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{line.memo}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {line.debit_amount > 0 ? (
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                ${line.debit_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {line.credit_amount > 0 ? (
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                ${line.credit_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Totals Row */}
                      <TableRow className="bg-muted/50 font-medium">
                        <TableCell colSpan={3} className="text-right">
                          <span className="text-gray-900 dark:text-gray-100">Totals:</span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className="text-red-600 dark:text-red-400 font-bold">
                            ${selectedEntry.lines.reduce((sum, line) => sum + line.debit_amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            ${selectedEntry.lines.reduce((sum, line) => sum + line.credit_amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="mt-8">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Export Format Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Export Journal Entries</DialogTitle>
            <DialogDescription className="text-center">
              Select your preferred export format for the journal entries data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <RadioGroup value={exportFormat} onValueChange={(value: string) => setExportFormat(value as 'csv' | 'xlsx')}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="csv" id="format-csv" />
                <Label htmlFor="format-csv" className="cursor-pointer flex-1">
                  <div className="font-medium">CSV</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Comma-separated values, compatible with Excel and Google Sheets</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="xlsx" id="format-xlsx" />
                <Label htmlFor="format-xlsx" className="cursor-pointer flex-1">
                  <div className="font-medium">Excel (XLSX)</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Microsoft Excel format with formatting</div>
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
