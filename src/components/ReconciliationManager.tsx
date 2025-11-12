import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { PageHeader } from './PageHeader';
import { DesktopOnlyWarning } from './DesktopOnlyWarning';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Circle,
  Info,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface BankTransaction {
  id: string;
  date: string;
  ref: string;
  description: string;
  debit: number;
  credit: number;
  selected: boolean;
  reconciled: boolean;
}

interface LedgerTransaction {
  id: string;
  date: string;
  ref: string;
  description: string;
  debit: number;
  credit: number;
  selected: boolean;
  reconciled: boolean;
  isBatch?: boolean;
  batchItems?: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    donor?: string;
  }>;
}

interface ReconciledPair {
  id: string;
  bankId: string;
  ledgerId: string;
  bank: BankTransaction;
  ledger: LedgerTransaction;
  reconciledDate: string;
}

// Generate mock bank transactions from uploaded statement
const generateMockBankTransactions = (): BankTransaction[] => {
  const transactions: BankTransaction[] = [];
  const today = new Date();
  
  const descriptions = [
    'ACH DEPOSIT - JOHN SMITH',
    'CHECK #1234',
    'WIRE TRANSFER - ABC FOUNDATION',
    'ACH DEPOSIT - TECH CORP',
    'CHECK #1235',
    'DEBIT CARD #4321',
    'ACH WITHDRAWAL - RENT',
    'CHECK #1236',
    'WIRE TRANSFER OUT',
    'ACH DEPOSIT - ROBERT WILLIAMS',
  ];

  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const isCredit = Math.random() > 0.3;
    const amount = Math.floor(Math.random() * 5000) + 50;
    
    // Mark some transactions as already reconciled (about 30%)
    const isAlreadyReconciled = i < 7;
    
    transactions.push({
      id: `bank-${i}`,
      date: date.toISOString().split('T')[0],
      ref: isCredit ? `DEP${1000 + i}` : `CHK${2000 + i}`,
      description: descriptions[i % descriptions.length],
      debit: isCredit ? 0 : amount,
      credit: isCredit ? amount : 0,
      selected: false,
      reconciled: isAlreadyReconciled,
    });
  }
  
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Generate mock ledger transactions
const generateMockLedgerTransactions = (): LedgerTransaction[] => {
  const transactions: LedgerTransaction[] = [];
  const today = new Date();

  // Regular donations
  const donors = ['John Smith', 'Mary Johnson', 'ABC Foundation', 'Tech Corp', 'Robert Williams'];
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    // Mark some transactions as already reconciled (about 30%)
    const isAlreadyReconciled = i < 3;
    
    transactions.push({
      id: `ledger-don-${i}`,
      date: date.toISOString().split('T')[0],
      ref: `DON-${1000 + i}`,
      description: `Donation - ${donors[Math.floor(Math.random() * donors.length)]}`,
      debit: 0,
      credit: Math.floor(Math.random() * 5000) + 100,
      selected: false,
      reconciled: isAlreadyReconciled,
    });
  }

  // Batched deposits
  for (let i = 0; i < 3; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const batchItems = [];
    const itemCount = Math.floor(Math.random() * 5) + 3; // 3-7 items
    let totalAmount = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const amount = Math.floor(Math.random() * 1000) + 50;
      totalAmount += amount;
      batchItems.push({
        id: `batch-${i}-item-${j}`,
        date: date.toISOString().split('T')[0],
        description: `Online Donation`,
        amount: amount,
        donor: donors[Math.floor(Math.random() * donors.length)],
      });
    }
    
    // Mark some batches as already reconciled
    const isAlreadyReconciled = i < 1;
    
    transactions.push({
      id: `ledger-batch-${i}`,
      date: date.toISOString().split('T')[0],
      ref: `BATCH-${2000 + i}`,
      description: `Batched Deposits (${itemCount} items)`,
      debit: 0,
      credit: totalAmount,
      selected: false,
      reconciled: isAlreadyReconciled,
      isBatch: true,
      batchItems: batchItems,
    });
  }

  // Expenses
  const expenses = ['Rent Payment', 'Office Supplies', 'Utilities', 'Bank Fees'];
  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    // Mark some expenses as already reconciled
    const isAlreadyReconciled = i < 2;
    
    transactions.push({
      id: `ledger-exp-${i}`,
      date: date.toISOString().split('T')[0],
      ref: `EXP-${3000 + i}`,
      description: expenses[Math.floor(Math.random() * expenses.length)],
      debit: Math.floor(Math.random() * 2000) + 100,
      credit: 0,
      selected: false,
      reconciled: isAlreadyReconciled,
    });
  }
  
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const ReconciliationManager: React.FC = () => {
  const { setAccountingTool } = useApp();
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [ledgerTransactions, setLedgerTransactions] = useState<LedgerTransaction[]>([]);
  const [reconciledPairs, setReconciledPairs] = useState<ReconciledPair[]>([]);
  const [openingBalance] = useState(95000.00);
  const [selectedBatchTransaction, setSelectedBatchTransaction] = useState<LedgerTransaction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate balances
  const { payments, deposits, clearedBalance, reconciledCount, unreconciledCount } = useMemo(() => {
    const unreconciledBank = bankTransactions.filter(t => !t.reconciled);
    const payments = unreconciledBank.reduce((sum, t) => sum + t.debit, 0);
    const deposits = unreconciledBank.reduce((sum, t) => sum + t.credit, 0);
    const clearedBalance = openingBalance - payments + deposits;
    const reconciledCount = reconciledPairs.length;
    const unreconciledCount = unreconciledBank.length;

    return { payments, deposits, clearedBalance, reconciledCount, unreconciledCount };
  }, [bankTransactions, openingBalance, reconciledPairs]);

  const statementBalance = 99671.95;
  const difference = clearedBalance - statementBalance;

  const selectedBank = useMemo(() => bankTransactions.find(t => t.selected && !t.reconciled), [bankTransactions]);
  const selectedLedger = useMemo(() => ledgerTransactions.find(t => t.selected && !t.reconciled), [ledgerTransactions]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In production, this would parse the CSV/Excel file
    const mockBank = generateMockBankTransactions();
    const mockLedger = generateMockLedgerTransactions();
    setBankTransactions(mockBank);
    setLedgerTransactions(mockLedger);
    
    // Create reconciled pairs for already-reconciled transactions
    const alreadyReconciledBank = mockBank.filter(t => t.reconciled);
    const alreadyReconciledLedger = mockLedger.filter(t => t.reconciled);
    const newPairs: ReconciledPair[] = [];
    
    // Match up reconciled transactions (simplified - in production would use more sophisticated matching)
    alreadyReconciledBank.forEach((bank, index) => {
      if (index < alreadyReconciledLedger.length) {
        const ledger = alreadyReconciledLedger[index];
        newPairs.push({
          id: `pair-${Date.now()}-${index}`,
          bankId: bank.id,
          ledgerId: ledger.id,
          bank: bank,
          ledger: ledger,
          reconciledDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
      }
    });
    
    setReconciledPairs(newPairs);
    setHasUploadedFile(true);
    
    toast.success(`Bank statement "${file.name}" uploaded successfully`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleBankSelect = (id: string) => {
    setBankTransactions(prev => prev.map(t => ({
      ...t,
      selected: t.id === id ? !t.selected : false,
    })));
  };

  const handleLedgerSelect = (id: string) => {
    setLedgerTransactions(prev => prev.map(t => ({
      ...t,
      selected: t.id === id ? !t.selected : false,
    })));
  };

  const handleReconcile = () => {
    if (!selectedBank || !selectedLedger) {
      toast.error('Please select one transaction from both Bank Statement and General Ledger');
      return;
    }

    // Check if amounts match
    const bankAmount = selectedBank.credit > 0 ? selectedBank.credit : selectedBank.debit;
    const ledgerAmount = selectedLedger.credit > 0 ? selectedLedger.credit : selectedLedger.debit;
    const amountDiff = Math.abs(bankAmount - ledgerAmount);

    if (amountDiff > 0.01) {
      toast.warning(`Amounts don't match exactly (difference: $${amountDiff.toFixed(2)}). Reconciling anyway.`);
    }

    // Create reconciled pair
    const pair: ReconciledPair = {
      id: `pair-${Date.now()}`,
      bankId: selectedBank.id,
      ledgerId: selectedLedger.id,
      bank: { ...selectedBank },
      ledger: { ...selectedLedger },
      reconciledDate: new Date().toISOString().split('T')[0],
    };

    setReconciledPairs(prev => [...prev, pair]);

    // Mark as reconciled and deselect
    setBankTransactions(prev => prev.map(t =>
      t.id === selectedBank.id ? { ...t, reconciled: true, selected: false } : t
    ));
    setLedgerTransactions(prev => prev.map(t =>
      t.id === selectedLedger.id ? { ...t, reconciled: true, selected: false } : t
    ));

    // Dispatch reconciliation event to update General Ledger
    const event = new CustomEvent('reconciliation-update', {
      detail: {
        transactionIds: [selectedLedger.id],
        reconciled: true,
        metadata: {
          reconciled_by: 'Current User',
          reconciliation_method: 'import',
          bank_statement_ref: selectedBank.ref,
          reconciled_at: new Date().toISOString(),
        },
      },
    });
    window.dispatchEvent(event);

    toast.success('Transaction reconciled successfully');
  };

  const handleUnreconcile = (pairId: string) => {
    const pair = reconciledPairs.find(p => p.id === pairId);
    if (!pair) return;

    // Mark as unreconciled
    setBankTransactions(prev => prev.map(t =>
      t.id === pair.bankId ? { ...t, reconciled: false } : t
    ));
    setLedgerTransactions(prev => prev.map(t =>
      t.id === pair.ledgerId ? { ...t, reconciled: false } : t
    ));

    // Dispatch unreconciliation event to update General Ledger
    const event = new CustomEvent('reconciliation-update', {
      detail: {
        transactionIds: [pair.ledgerId],
        reconciled: false,
        metadata: {
          reconciled_by: 'Current User',
          reconciliation_method: 'manual',
          reconciled_at: new Date().toISOString(),
        },
      },
    });
    window.dispatchEvent(event);

    // Remove pair
    setReconciledPairs(prev => prev.filter(p => p.id !== pairId));

    toast.success('Transaction unreconciled');
  };

  const handleShowBatch = (transaction: LedgerTransaction) => {
    if (transaction.isBatch && transaction.batchItems) {
      setSelectedBatchTransaction(transaction);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const unreconciledBank = bankTransactions.filter(t => !t.reconciled);
  const unreconciledLedger = ledgerTransactions.filter(t => !t.reconciled);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Desktop-Only Warning for Mobile */}
      <DesktopOnlyWarning 
        toolName="Reconciliation Manager"
        description="The Reconciliation Manager requires a desktop computer for complex transaction matching, batch processing, and detailed analysis. Please access this feature from a larger screen."
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
      <PageHeader 
        title="Bank Reconciliation"
        subtitle="Upload bank statements, match transactions, and reconcile balances"
      />

      {!hasUploadedFile ? (
        /* Upload State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-gray-900 dark:text-gray-100 mb-2">Upload Bank Statement</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              Upload your bank statement in CSV or Excel format to begin reconciliation
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={handleUploadClick} className="gap-2">
              <Upload className="h-4 w-4" />
              Select File
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Reconciliation State */
        <>
          {/* Balance Summary */}
          <div className="mb-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Payments (Debits) */}
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Payments</p>
                  <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(payments)}
                  </p>
                </CardContent>
              </Card>

              {/* Deposits (Credits) */}
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Deposits</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(deposits)}
                  </p>
                </CardContent>
              </Card>

              {/* Cleared Balance */}
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Cleared Balance</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(clearedBalance)}
                  </p>
                </CardContent>
              </Card>

              {/* Difference */}
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Difference</p>
                  <p className={`text-2xl font-semibold ${
                    difference === 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(Math.abs(difference))}
                  </p>
                </CardContent>
              </Card>
              </div>
            </div>
          </div>

          {/* Tabs for Unreconciled/Reconciled */}
          <Tabs defaultValue="unreconciled" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="unreconciled" className="gap-2">
                  <Circle className="h-4 w-4" />
                  Unreconciled ({unreconciledCount})
                </TabsTrigger>
                <TabsTrigger value="reconciled" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Reconciled ({reconciledCount})
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button onClick={handleUploadClick} variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload New File
                </Button>
                <Button onClick={handleReconcile} disabled={!selectedBank || !selectedLedger} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Reconcile
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <TabsContent value="unreconciled">
              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bank Statement (Left) */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-gray-900 dark:text-gray-100 mb-3">Bank Statement</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
                            <TableRow>
                              <TableHead className="w-[40px]"></TableHead>
                              <TableHead className="w-[90px]">Date</TableHead>
                              <TableHead className="w-[80px]">Ref</TableHead>
                              <TableHead className="text-right w-[100px]">Debit</TableHead>
                              <TableHead className="text-right w-[100px]">Credit</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unreconciledBank.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                  All transactions reconciled
                                </TableCell>
                              </TableRow>
                            ) : (
                              unreconciledBank.map((transaction) => (
                                <TableRow
                                  key={transaction.id}
                                  className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer ${
                                    transaction.selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                  }`}
                                  onClick={() => handleBankSelect(transaction.id)}
                                >
                                  <TableCell>
                                    <Checkbox
                                      checked={transaction.selected}
                                      onCheckedChange={() => handleBankSelect(transaction.id)}
                                    />
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">
                                    {new Date(transaction.date).toLocaleDateString('en-US', {
                                      month: '2-digit',
                                      day: '2-digit',
                                      year: '2-digit',
                                    })}
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">{transaction.ref}</TableCell>
                                  <TableCell className="text-right font-mono text-sm">
                                    {transaction.debit > 0 ? formatCurrency(transaction.debit) : '—'}
                                  </TableCell>
                                  <TableCell className="text-right font-mono text-sm">
                                    {transaction.credit > 0 ? formatCurrency(transaction.credit) : '—'}
                                  </TableCell>
                                  <TableCell className="text-sm truncate max-w-[200px]">
                                    {transaction.description}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* General Ledger (Right) */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-gray-900 dark:text-gray-100 mb-3">General Ledger</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
                            <TableRow>
                              <TableHead className="w-[40px]"></TableHead>
                              <TableHead className="w-[90px]">Date</TableHead>
                              <TableHead className="w-[80px]">Ref</TableHead>
                              <TableHead className="text-right w-[100px]">Debit</TableHead>
                              <TableHead className="text-right w-[100px]">Credit</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unreconciledLedger.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                  All transactions reconciled
                                </TableCell>
                              </TableRow>
                            ) : (
                              unreconciledLedger.map((transaction) => (
                                <TableRow
                                  key={transaction.id}
                                  className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer ${
                                    transaction.selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                  }`}
                                  onClick={() => handleLedgerSelect(transaction.id)}
                                >
                                  <TableCell>
                                    <Checkbox
                                      checked={transaction.selected}
                                      onCheckedChange={() => handleLedgerSelect(transaction.id)}
                                    />
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">
                                    {new Date(transaction.date).toLocaleDateString('en-US', {
                                      month: '2-digit',
                                      day: '2-digit',
                                      year: '2-digit',
                                    })}
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">{transaction.ref}</TableCell>
                                  <TableCell className="text-right font-mono text-sm">
                                    {transaction.debit > 0 ? formatCurrency(transaction.debit) : '—'}
                                  </TableCell>
                                  <TableCell className="text-right font-mono text-sm">
                                    {transaction.credit > 0 ? formatCurrency(transaction.credit) : '—'}
                                  </TableCell>
                                  <TableCell className="text-sm max-w-[200px]">
                                    <div className="flex items-center gap-2">
                                      <span className="truncate">{transaction.description}</span>
                                      {transaction.isBatch && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowBatch(transaction);
                                          }}
                                        >
                                          <Info className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reconciled">
              <Card>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Bank Ref</TableHead>
                          <TableHead>Ledger Ref</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reconciledPairs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No reconciled transactions yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          reconciledPairs.map((pair) => (
                            <TableRow key={pair.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                              <TableCell className="font-mono text-sm">
                                {new Date(pair.reconciledDate).toLocaleDateString('en-US', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric',
                                })}
                              </TableCell>
                              <TableCell className="font-mono text-xs">{pair.bank.ref}</TableCell>
                              <TableCell className="font-mono text-xs">{pair.ledger.ref}</TableCell>
                              <TableCell className="text-sm">
                                <div className="space-y-1">
                                  <div className="text-gray-900 dark:text-gray-100">Bank: {pair.bank.description}</div>
                                  <div className="text-gray-600 dark:text-gray-400">Ledger: {pair.ledger.description}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {pair.bank.credit > 0 ? (
                                  <span className="text-green-600 dark:text-green-400">
                                    {formatCurrency(pair.bank.credit)}
                                  </span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400">
                                    {formatCurrency(pair.bank.debit)}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnreconcile(pair.id)}
                                >
                                  Unreconcile
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Batch Details Dialog */}
      <Dialog open={!!selectedBatchTransaction} onOpenChange={() => setSelectedBatchTransaction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Batch Details - {selectedBatchTransaction?.ref}</DialogTitle>
            <DialogDescription>
              Individual items in this batched transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBatchTransaction?.batchItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{item.donor || '—'}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                {selectedBatchTransaction?.batchItems && (
                  <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                    <TableCell colSpan={3} className="font-medium text-right">Total:</TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(
                        selectedBatchTransaction.batchItems.reduce((sum, item) => sum + item.amount, 0)
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};
