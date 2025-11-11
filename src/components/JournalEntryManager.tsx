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
import { toast } from 'sonner@2.0.3';

// Transaction types - aligned with General Ledger
type TransactionSource = 'donation' | 'check-deposit' | 'reimbursement' | 'expense' | 'reconciliation' | 'journal-entry';

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  source: TransactionSource;
  entityId: string;
  category: string;
  internalCode?: string;
  debit: number;
  credit: number;
  balance?: number;
  referenceNumber?: string;
  reconciled: boolean;
}

interface JournalEntryLine {
  id: string;
  category: string;
  internalCode: string;
  description: string;
  debit: number;
  credit: number;
}

const mockJournalEntries: LedgerEntry[] = [
  {
    id: 'JE-001',
    date: '2025-11-05',
    description: 'Monthly depreciation expense',
    source: 'journal-entry',
    entityId: 'infocus',
    category: '5310 - Furniture & Equipment',
    internalCode: '5310',
    debit: 450,
    credit: 0,
    referenceNumber: 'JE-2025-001',
    reconciled: true,
  },
  {
    id: 'JE-002',
    date: '2025-11-01',
    description: 'Accrued payroll expense',
    source: 'journal-entry',
    entityId: 'the-uprising',
    category: '5110 - Compensation - all others',
    internalCode: '5110',
    debit: 2850,
    credit: 0,
    referenceNumber: 'JE-2025-002',
    reconciled: false,
  },
  {
    id: 'JE-003',
    date: '2025-10-28',
    description: 'Prepaid insurance adjustment',
    source: 'journal-entry',
    entityId: 'bloom-strong',
    category: '5700 - Insurance Premium',
    internalCode: '5700',
    debit: 675,
    credit: 0,
    referenceNumber: 'JE-2025-003',
    reconciled: true,
  },
  {
    id: 'JE-004',
    date: '2025-10-15',
    description: 'Revenue recognition adjustment',
    source: 'journal-entry',
    entityId: 'awakenings',
    category: '4100 - Earned Income',
    internalCode: '4100',
    debit: 0,
    credit: 1200,
    referenceNumber: 'JE-2025-004',
    reconciled: true,
  },
];

export const JournalEntryManager: React.FC = () => {
  const { setAccountingTool, selectedEntity } = useApp();
  const [journalEntries, setJournalEntries] = useState<LedgerEntry[]>(mockJournalEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  
  // Create new journal entry state
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    entityId: selectedEntity === 'all' ? 'infocus' : selectedEntity,
    referenceNumber: '',
    lines: [] as JournalEntryLine[],
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    date: '',
    description: '',
    category: '',
    internalCode: '',
    debit: 0,
    credit: 0,
    referenceNumber: '',
  });

  const handleEntryClick = (entry: LedgerEntry) => {
    setSelectedEntry(entry);
    setEditForm({
      date: entry.date,
      description: entry.description,
      category: entry.category,
      internalCode: entry.internalCode || '',
      debit: entry.debit,
      credit: entry.credit,
      referenceNumber: entry.referenceNumber || '',
    });
    setIsDrawerOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEntry) return;

    const updatedEntries = journalEntries.map(e =>
      e.id === selectedEntry.id
        ? {
            ...e,
            date: editForm.date,
            description: editForm.description,
            category: editForm.category,
            internalCode: editForm.internalCode,
            debit: editForm.debit,
            credit: editForm.credit,
            referenceNumber: editForm.referenceNumber,
          }
        : e
    );

    setJournalEntries(updatedEntries);
    setIsDrawerOpen(false);
    toast.success('Journal entry updated successfully');
  };

  const handleDeleteEntry = () => {
    if (!selectedEntry) return;

    const updatedEntries = journalEntries.filter(e => e.id !== selectedEntry.id);
    setJournalEntries(updatedEntries);
    setIsDrawerOpen(false);
    toast.success('Journal entry deleted successfully');
  };

  const addLine = () => {
    const newLine: JournalEntryLine = {
      id: `line-${Date.now()}`,
      category: '',
      internalCode: '',
      description: '',
      debit: 0,
      credit: 0,
    };
    setNewEntry({ ...newEntry, lines: [...newEntry.lines, newLine] });
  };

  const updateLine = (lineId: string, field: keyof JournalEntryLine, value: any) => {
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
    const totalDebits = newEntry.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredits = newEntry.lines.reduce((sum, line) => sum + line.credit, 0);

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

    // Create journal entries (one for each line)
    const newEntries: LedgerEntry[] = newEntry.lines.map((line, index) => ({
      id: `JE-${Date.now()}-${index}`,
      date: newEntry.date,
      description: `${newEntry.description} - ${line.description}`,
      source: 'journal-entry' as TransactionSource,
      entityId: newEntry.entityId,
      category: line.category,
      internalCode: line.internalCode,
      debit: line.debit,
      credit: line.credit,
      referenceNumber: newEntry.referenceNumber || `JE-${Date.now()}`,
      reconciled: false,
    }));

    setJournalEntries([...newEntries, ...journalEntries]);
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      entityId: selectedEntity === 'all' ? 'infocus' : selectedEntity,
      referenceNumber: '',
      lines: [],
    });

    toast.success(`Journal entry created with ${newEntries.length} line${newEntries.length > 1 ? 's' : ''}`);
  };

  const handleExport = () => {
    import('xlsx').then((XLSX) => {
      const headers = ['Date', 'Reference', 'Description', 'Entity', 'Category', 'Category Code', 'Debit', 'Credit', 'Status'];
      const data = filteredEntries.map(e => [
        e.date,
        e.referenceNumber || '',
        e.description,
        entities.find(ent => ent.id === e.entityId)?.name || '',
        e.category,
        e.internalCode || '',
        e.debit.toFixed(2),
        e.credit.toFixed(2),
        e.reconciled ? 'Reconciled' : 'Pending'
      ]);

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
      const filename = `journal-entries-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      toast.success('Journal entries exported successfully');
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
      filtered = filtered.filter(e => e.entityId === selectedEntity);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(e => e.date >= filterDateFrom);
    }
    if (filterDateTo) {
      filtered = filtered.filter(e => e.date <= filterDateTo);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.description.toLowerCase().includes(search) ||
        e.category.toLowerCase().includes(search) ||
        e.internalCode?.toLowerCase().includes(search) ||
        e.referenceNumber?.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [journalEntries, selectedEntity, filterDateFrom, filterDateTo, searchTerm]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalDebits = filteredEntries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredits = filteredEntries.reduce((sum, e) => sum + e.credit, 0);
    return {
      totalDebits,
      totalCredits,
      count: filteredEntries.length,
    };
  }, [filteredEntries]);

  const totalDebits = newEntry.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredits = newEntry.lines.reduce((sum, line) => sum + line.credit, 0);
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
            Export to Excel
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
                    <Select value={newEntry.entityId} onValueChange={(value) => setNewEntry({ ...newEntry, entityId: value })}>
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
                        <div key={line.id} className="p-4 border rounded-lg space-y-3 bg-white dark:bg-gray-800">
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
                              <Label>Category Code</Label>
                              <Select
                                value={line.internalCode}
                                onValueChange={(value) => {
                                  const categoryMap: { [key: string]: string } = {
                                    '4000': '4000 - Donations',
                                    '4100': '4100 - Earned Income',
                                    '4300': '4300 - Grants',
                                    '5100': '5100 - Compensation - Officers and Directors',
                                    '5110': '5110 - Compensation - all others',
                                    '5130': '5130 - Other Employee Benefits',
                                    '5140': '5140 - Payroll Taxes',
                                    '5200': '5200 - Legal Fees',
                                    '5210': '5210 - Accounting',
                                    '5240': '5240 - Advertising Expenses',
                                    '5300': '5300 - Office Supplies',
                                    '5310': '5310 - Furniture & Equipment',
                                    '5400': '5400 - Information Technology',
                                    '5500': '5500 - Rent',
                                    '5600': '5600 - Travel and Meetings',
                                    '5700': '5700 - Insurance Premium',
                                    '5800': '5800 - Bank Fees',
                                  };
                                  updateLine(line.id, 'internalCode', value);
                                  updateLine(line.id, 'category', categoryMap[value] || '');
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="4000">4000 - Donations</SelectItem>
                                  <SelectItem value="4100">4100 - Earned Income</SelectItem>
                                  <SelectItem value="4300">4300 - Grants</SelectItem>
                                  <SelectItem value="5100">5100 - Compensation - Officers</SelectItem>
                                  <SelectItem value="5110">5110 - Compensation - Staff</SelectItem>
                                  <SelectItem value="5130">5130 - Employee Benefits</SelectItem>
                                  <SelectItem value="5140">5140 - Payroll Taxes</SelectItem>
                                  <SelectItem value="5200">5200 - Legal Fees</SelectItem>
                                  <SelectItem value="5210">5210 - Accounting</SelectItem>
                                  <SelectItem value="5240">5240 - Advertising</SelectItem>
                                  <SelectItem value="5300">5300 - Office Supplies</SelectItem>
                                  <SelectItem value="5310">5310 - Furniture & Equipment</SelectItem>
                                  <SelectItem value="5400">5400 - Information Technology</SelectItem>
                                  <SelectItem value="5500">5500 - Rent</SelectItem>
                                  <SelectItem value="5600">5600 - Travel</SelectItem>
                                  <SelectItem value="5700">5700 - Insurance</SelectItem>
                                  <SelectItem value="5800">5800 - Bank Fees</SelectItem>
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
                            <div className="space-y-2">
                              <Label>Debit</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={line.debit || ''}
                                onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Credit</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={line.credit || ''}
                                onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Totals */}
                  {newEntry.lines.length > 0 && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
                  <TableHead className="w-[110px]">Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[90px]">Code</TableHead>
                  <TableHead className="hidden lg:table-cell w-[140px]">Entity</TableHead>
                  <TableHead className="hidden xl:table-cell min-w-[180px]">Category</TableHead>
                  <TableHead className="text-right w-[100px]">Debit</TableHead>
                  <TableHead className="text-right w-[100px]">Credit</TableHead>
                  <TableHead className="text-center w-[90px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No journal entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => handleEntryClick(entry)}
                    >
                      <TableCell className="font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        {entry.referenceNumber}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={entry.description}>
                          {entry.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.internalCode || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {entities.find(e => e.id === entry.entityId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-gray-600 dark:text-gray-400">
                        {entry.category}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.debit > 0 ? (
                          <span className="text-red-600 dark:text-red-400">
                            ${entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.credit > 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            ${entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.reconciled ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Posted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Draft
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

      {/* Edit Entry Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <SheetTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Journal Entry
            </SheetTitle>
            <SheetDescription>
              Make changes to this journal entry. All fields are editable.
            </SheetDescription>
          </SheetHeader>

          {selectedEntry && (
            <div className="space-y-8 mt-8">
              <div className="space-y-5">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Entry Information</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm">Entry ID</Label>
                    <Input
                      value={selectedEntry.id}
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
                      placeholder="JE-2025-001"
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
                    placeholder="Enter entry description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-sm">Category Code</Label>
                  <Select
                    value={editForm.internalCode}
                    onValueChange={(value) => {
                      const categoryMap: { [key: string]: string } = {
                        '4000': '4000 - Donations',
                        '4100': '4100 - Earned Income',
                        '4300': '4300 - Grants',
                        '5100': '5100 - Compensation - Officers and Directors',
                        '5110': '5110 - Compensation - all others',
                        '5130': '5130 - Other Employee Benefits',
                        '5200': '5200 - Legal Fees',
                        '5210': '5210 - Accounting',
                        '5300': '5300 - Office Supplies',
                        '5310': '5310 - Furniture & Equipment',
                        '5400': '5400 - Information Technology',
                        '5500': '5500 - Rent',
                        '5600': '5600 - Travel and Meetings',
                        '5700': '5700 - Insurance Premium',
                        '5800': '5800 - Bank Fees',
                      };
                      setEditForm({
                        ...editForm,
                        internalCode: value,
                        category: categoryMap[value] || '',
                      });
                    }}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4000">4000 - Donations</SelectItem>
                      <SelectItem value="4100">4100 - Earned Income</SelectItem>
                      <SelectItem value="4300">4300 - Grants</SelectItem>
                      <SelectItem value="5100">5100 - Compensation - Officers</SelectItem>
                      <SelectItem value="5110">5110 - Compensation - Staff</SelectItem>
                      <SelectItem value="5130">5130 - Employee Benefits</SelectItem>
                      <SelectItem value="5200">5200 - Legal Fees</SelectItem>
                      <SelectItem value="5210">5210 - Accounting</SelectItem>
                      <SelectItem value="5300">5300 - Office Supplies</SelectItem>
                      <SelectItem value="5310">5310 - Furniture & Equipment</SelectItem>
                      <SelectItem value="5400">5400 - Information Technology</SelectItem>
                      <SelectItem value="5500">5500 - Rent</SelectItem>
                      <SelectItem value="5600">5600 - Travel</SelectItem>
                      <SelectItem value="5700">5700 - Insurance</SelectItem>
                      <SelectItem value="5800">5800 - Bank Fees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-debit" className="text-sm">Debit Amount</Label>
                    <Input
                      id="edit-debit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editForm.debit || ''}
                      onChange={(e) => setEditForm({ ...editForm, debit: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-credit" className="text-sm">Credit Amount</Label>
                    <Input
                      id="edit-credit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editForm.credit || ''}
                      onChange={(e) => setEditForm({ ...editForm, credit: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="mt-8 flex gap-2 sm:gap-0">
            <Button
              variant="destructive"
              onClick={handleDeleteEntry}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
