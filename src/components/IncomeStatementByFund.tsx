import React, { useState } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PageHeader } from './PageHeader';
import { Badge } from './ui/badge';
import { ArrowLeft, Download, CheckCircle, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

// Import Account type and helpers
import { Account, createJournalEntryFromTransaction, getAccountByCode } from '../lib/journalEntryHelpers';
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

// Mock Chart of Accounts for admin fees
const MOCK_ACCOUNTS: Account[] = [
  // Asset
  { id: 'acc-1000', code: '1000', name: 'Cash', type: 'asset', full_name: '1000 - Cash', is_active: true },
  { id: 'acc-1300', code: '1300', name: 'Due from Nonprofits', type: 'asset', full_name: '1300 - Due from Nonprofits', is_active: true },
  // Liability
  { id: 'acc-2200', code: '2200', name: 'Due to InFocus', type: 'liability', full_name: '2200 - Due to InFocus', is_active: true },
  // Revenue
  { id: 'acc-4900', code: '4900', name: 'Admin Fee Revenue', type: 'revenue', full_name: '4900 - Admin Fee Revenue', is_active: true },
  // Expense
  { id: 'acc-5900', code: '5900', name: 'Admin Fee Expense', type: 'expense', full_name: '5900 - Admin Fee Expense', is_active: true },
];

interface FundAllocation {
  entityId: string;
  entityName: string;
  totalIncome: number;
  allocatedIncome: number; // The amount the fee rate is applied to
  adminFeeRate: number;
  adminFeeAmount: number;
  confirmed: boolean;
  // New fields for GL integration
  journalEntryId?: string;  // Link to created journal entry
  confirmedBy?: string;
  confirmedAt?: string;
}

interface SponsorFeeAllocationProps {
  readOnly?: boolean;
}

export const SponsorFeeAllocation: React.FC<SponsorFeeAllocationProps> = ({ readOnly = false }) => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [allocations, setAllocations] = useState<FundAllocation[]>(() => {
    // Generate mock data for all nonprofits (excluding InFocus)
    return entities
      .filter(e => e.id !== 'infocus')
      .map(entity => {
        const totalIncome = Math.floor(Math.random() * 50000) + 10000;
        return {
          entityId: entity.id,
          entityName: entity.name,
          totalIncome: totalIncome,
          allocatedIncome: totalIncome, // By default, fee applies to full income
          adminFeeRate: 0.075, // 7.5% admin fee
          adminFeeAmount: totalIncome * 0.075,
          confirmed: false,
        };
      });
  });

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    allocatedIncome: string;
    rate: string;
  }>({
    allocatedIncome: '',
    rate: '',
  });

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');

  const isInFocus = selectedEntity === 'infocus';

  const handleRowClick = (entityId: string) => {
    const allocation = allocations.find(a => a.entityId === entityId);
    if (!allocation || allocation.confirmed) return;

    if (expandedRow === entityId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(entityId);
      setEditValues({
        allocatedIncome: allocation.allocatedIncome.toString(),
        rate: (allocation.adminFeeRate * 100).toString(),
      });
    }
  };

  const handleAdjustmentSave = (entityId: string) => {
    const allocatedIncome = parseFloat(editValues.allocatedIncome);
    const rate = parseFloat(editValues.rate) / 100;
    
    const allocation = allocations.find(a => a.entityId === entityId);
    if (!allocation) return;

    if (isNaN(allocatedIncome) || allocatedIncome < 0 || allocatedIncome > allocation.totalIncome) {
      toast.error('Invalid allocated income amount');
      return;
    }

    if (isNaN(rate) || rate < 0 || rate > 1) {
      toast.error('Invalid rate percentage');
      return;
    }

    setAllocations(prev =>
      prev.map(alloc =>
        alloc.entityId === entityId
          ? {
              ...alloc,
              allocatedIncome,
              adminFeeRate: rate,
              adminFeeAmount: allocatedIncome * rate,
            }
          : alloc
      )
    );

    setExpandedRow(null);
    toast.success('Allocation adjusted');
  };

  const handleConfirm = (entityId: string) => {
    const allocation = allocations.find(a => a.entityId === entityId);
    if (!allocation) return;

    // Create journal entry for the nonprofit (expense and liability)
    const nonprofitJournalEntry = {
      id: `je-admin-fee-${entityId}-${Date.now()}`,
      organization_id: 'org-1',
      entity_id: allocation.entityId,
      entry_number: `ADMIN-FEE-${month}-${entityId.toUpperCase()}`,
      entry_date: `${month}-01`,
      description: `Admin fee allocation - ${allocation.entityName}`,
      memo: `${(allocation.adminFeeRate * 100).toFixed(2)}% admin fee on $${allocation.allocatedIncome.toFixed(2)}`,
      status: 'posted' as const,
      source_type: 'manual' as const,
      source_id: null,
      created_by: 'Current User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      posted_at: new Date().toISOString(),
      posted_by: 'System',
      lines: [
        {
          id: `je-admin-fee-${entityId}-${Date.now()}-line-1`,
          journal_entry_id: `je-admin-fee-${entityId}-${Date.now()}`,
          account: getAccountByCode('5900', MOCK_ACCOUNTS), // Admin Fee Expense
          line_number: 1,
          description: `Admin fee expense - ${allocation.entityName}`,
          memo: '',
          debit_amount: allocation.adminFeeAmount,
          credit_amount: 0,
        },
        {
          id: `je-admin-fee-${entityId}-${Date.now()}-line-2`,
          journal_entry_id: `je-admin-fee-${entityId}-${Date.now()}`,
          account: getAccountByCode('2200', MOCK_ACCOUNTS), // Due to InFocus (liability)
          line_number: 2,
          description: `Admin fee payable to InFocus`,
          memo: '',
          debit_amount: 0,
          credit_amount: allocation.adminFeeAmount,
        },
      ],
    };

    // Create journal entry for InFocus (asset and revenue)
    const infocusJournalEntry = {
      id: `je-admin-fee-revenue-${entityId}-${Date.now()}`,
      organization_id: 'org-1',
      entity_id: 'infocus',
      entry_number: `ADMIN-REV-${month}-${entityId.toUpperCase()}`,
      entry_date: `${month}-01`,
      description: `Admin fee revenue - ${allocation.entityName}`,
      memo: `${(allocation.adminFeeRate * 100).toFixed(2)}% admin fee on $${allocation.allocatedIncome.toFixed(2)}`,
      status: 'posted' as const,
      source_type: 'manual' as const,
      source_id: null,
      created_by: 'Current User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      posted_at: new Date().toISOString(),
      posted_by: 'System',
      lines: [
        {
          id: `je-admin-fee-revenue-${entityId}-${Date.now()}-line-1`,
          journal_entry_id: `je-admin-fee-revenue-${entityId}-${Date.now()}`,
          account: getAccountByCode('1300', MOCK_ACCOUNTS), // Due from Nonprofits (asset)
          line_number: 1,
          description: `Admin fee receivable from ${allocation.entityName}`,
          memo: '',
          debit_amount: allocation.adminFeeAmount,
          credit_amount: 0,
        },
        {
          id: `je-admin-fee-revenue-${entityId}-${Date.now()}-line-2`,
          journal_entry_id: `je-admin-fee-revenue-${entityId}-${Date.now()}`,
          account: getAccountByCode('4900', MOCK_ACCOUNTS), // Admin Fee Revenue
          line_number: 2,
          description: `Admin fee revenue from ${allocation.entityName}`,
          memo: '',
          debit_amount: 0,
          credit_amount: allocation.adminFeeAmount,
        },
      ],
    };

    // Dispatch events to update General Ledger
    const event = new CustomEvent('journal-entries-created', {
      detail: { entries: [nonprofitJournalEntry, infocusJournalEntry] }
    });
    window.dispatchEvent(event);

    // Update allocation
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.entityId === entityId 
          ? { 
              ...alloc, 
              confirmed: true,
              journalEntryId: nonprofitJournalEntry.id,
              confirmedBy: 'Current User',
              confirmedAt: new Date().toISOString(),
            } 
          : alloc
      )
    );

    setExpandedRow(null);
    toast.success(`Admin fee posted to General Ledger - $${allocation.adminFeeAmount.toFixed(2)}`);
  };

  const handleConfirmAll = () => {
    const unconfirmedAllocations = allocations.filter(a => !a.confirmed);
    
    if (unconfirmedAllocations.length === 0) {
      toast.info('All allocations are already confirmed');
      return;
    }

    // Create journal entries for all unconfirmed allocations
    const allJournalEntries = unconfirmedAllocations.flatMap(allocation => {
      const nonprofitEntry = {
        id: `je-admin-fee-${allocation.entityId}-${Date.now()}`,
        organization_id: 'org-1',
        entity_id: allocation.entityId,
        entry_number: `ADMIN-FEE-${month}-${allocation.entityId.toUpperCase()}`,
        entry_date: `${month}-01`,
        description: `Admin fee allocation - ${allocation.entityName}`,
        memo: `${(allocation.adminFeeRate * 100).toFixed(2)}% admin fee on $${allocation.allocatedIncome.toFixed(2)}`,
        status: 'posted' as const,
        source_type: 'manual' as const,
        source_id: null,
        created_by: 'Current User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        posted_at: new Date().toISOString(),
        posted_by: 'System',
        lines: [
          {
            id: `je-admin-fee-${allocation.entityId}-${Date.now()}-line-1`,
            journal_entry_id: `je-admin-fee-${allocation.entityId}-${Date.now()}`,
            account: getAccountByCode('5900', MOCK_ACCOUNTS),
            line_number: 1,
            description: `Admin fee expense - ${allocation.entityName}`,
            memo: '',
            debit_amount: allocation.adminFeeAmount,
            credit_amount: 0,
          },
          {
            id: `je-admin-fee-${allocation.entityId}-${Date.now()}-line-2`,
            journal_entry_id: `je-admin-fee-${allocation.entityId}-${Date.now()}`,
            account: getAccountByCode('2200', MOCK_ACCOUNTS),
            line_number: 2,
            description: `Admin fee payable to InFocus`,
            memo: '',
            debit_amount: 0,
            credit_amount: allocation.adminFeeAmount,
          },
        ],
      };

      const infocusEntry = {
        id: `je-admin-fee-revenue-${allocation.entityId}-${Date.now()}`,
        organization_id: 'org-1',
        entity_id: 'infocus',
        entry_number: `ADMIN-REV-${month}-${allocation.entityId.toUpperCase()}`,
        entry_date: `${month}-01`,
        description: `Admin fee revenue - ${allocation.entityName}`,
        memo: `${(allocation.adminFeeRate * 100).toFixed(2)}% admin fee on $${allocation.allocatedIncome.toFixed(2)}`,
        status: 'posted' as const,
        source_type: 'manual' as const,
        source_id: null,
        created_by: 'Current User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        posted_at: new Date().toISOString(),
        posted_by: 'System',
        lines: [
          {
            id: `je-admin-fee-revenue-${allocation.entityId}-${Date.now()}-line-1`,
            journal_entry_id: `je-admin-fee-revenue-${allocation.entityId}-${Date.now()}`,
            account: getAccountByCode('1300', MOCK_ACCOUNTS),
            line_number: 1,
            description: `Admin fee receivable from ${allocation.entityName}`,
            memo: '',
            debit_amount: allocation.adminFeeAmount,
            credit_amount: 0,
          },
          {
            id: `je-admin-fee-revenue-${allocation.entityId}-${Date.now()}-line-2`,
            journal_entry_id: `je-admin-fee-revenue-${allocation.entityId}-${Date.now()}`,
            account: getAccountByCode('4900', MOCK_ACCOUNTS),
            line_number: 2,
            description: `Admin fee revenue from ${allocation.entityName}`,
            memo: '',
            debit_amount: 0,
            credit_amount: allocation.adminFeeAmount,
          },
        ],
      };

      return [nonprofitEntry, infocusEntry];
    });

    // Dispatch events to update General Ledger
    const event = new CustomEvent('journal-entries-created', {
      detail: { entries: allJournalEntries }
    });
    window.dispatchEvent(event);

    // Update all allocations
    setAllocations(prev => prev.map(alloc => 
      !alloc.confirmed 
        ? {
            ...alloc,
            confirmed: true,
            confirmedBy: 'Current User',
            confirmedAt: new Date().toISOString(),
          }
        : alloc
    ));

    setExpandedRow(null);
    const totalAmount = unconfirmedAllocations.reduce((sum, a) => sum + a.adminFeeAmount, 0);
    toast.success(`${unconfirmedAllocations.length} admin fees posted to GL - $${totalAmount.toFixed(2)}`);
  };

  const handleUnconfirm = (entityId: string) => {
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.entityId === entityId ? { ...alloc, confirmed: false } : alloc
      )
    );
    toast.success('Admin fee allocation unconfirmed');
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleConfirmExport = () => {
    // Prepare data for all allocations
    const data = filteredAllocations.map(allocation => [
      allocation.entityName,
      formatCurrency(allocation.totalIncome),
      `${(allocation.adminFeeRate * 100).toFixed(1)}%`,
      formatCurrency(allocation.adminFeeAmount),
      allocation.confirmed ? 'Confirmed' : 'Pending',
    ]);

    const headers = ['Nonprofit', 'Total Income', 'Rate', 'Admin Fee', 'Status'];
    const filename = `Sponsor_Fee_Allocation_${month}`;
    const sheetName = 'Sponsor Fee Allocation';

    exportToExcel(data, headers, filename, sheetName);
    
    setExportDialogOpen(false);
    const formatName = exportFormat === 'csv' ? 'CSV' : 'Excel';
    toast.success(
      `Exporting Sponsor Fee Allocation as ${formatName}...`,
      { description: `Your file will be downloaded shortly` }
    );
  };

  const totalIncome = allocations.reduce((sum, alloc) => sum + alloc.totalIncome, 0);
  const totalAdminFees = allocations.reduce((sum, alloc) => sum + alloc.adminFeeAmount, 0);
  const confirmedCount = allocations.filter(alloc => alloc.confirmed).length;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter allocations based on selected entity
  const filteredAllocations = isInFocus
    ? allocations
    : allocations.filter(alloc => alloc.entityId === selectedEntity);

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
          title="Sponsor Fee Allocation"
          subtitle={isInFocus
            ? 'Review and confirm monthly admin fees across all nonprofits'
            : 'Review your monthly admin fee calculation'}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2">
        {isInFocus && !readOnly && (
          <Button onClick={handleConfirmAll} className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Confirm All
          </Button>
        )}
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="text-center space-y-2">
              <Label htmlFor="month" className="text-sm font-medium block">Month</Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-11 max-w-[200px] mx-auto"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Total Admin Fees (7.5%)</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalAdminFees)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {isInFocus && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Nonprofits</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{allocations.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl text-green-600 dark:text-green-400">{confirmedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl text-orange-600 dark:text-orange-400">
                  {allocations.length - confirmedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Allocations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Fee Allocations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nonprofit</TableHead>
                  <TableHead className="text-right">Total Income</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Admin Fee</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {isInFocus && !readOnly && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllocations.map((allocation) => (
                  <React.Fragment key={allocation.entityId}>
                    <TableRow 
                      className={`${!allocation.confirmed && isInFocus && !readOnly ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}`}
                    >
                      <TableCell className="font-medium">{allocation.entityName}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(allocation.totalIncome)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(allocation.adminFeeRate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell 
                        className="text-right font-mono text-green-600 dark:text-green-400"
                        onClick={() => !allocation.confirmed && isInFocus && !readOnly && handleRowClick(allocation.entityId)}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {formatCurrency(allocation.adminFeeAmount)}
                          {!allocation.confirmed && isInFocus && !readOnly && (
                            expandedRow === allocation.entityId ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Edit className="h-4 w-4 text-gray-400" />
                            )
                          )}
                        </div>
                        {allocation.allocatedIncome < allocation.totalIncome && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Discount applied
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {allocation.confirmed ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      {isInFocus && !readOnly && (
                        <TableCell className="text-right">
                          {!allocation.confirmed ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirm(allocation.entityId);
                              }}
                              className="gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Confirm
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnconfirm(allocation.entityId);
                              }}
                              className="gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                            >
                              <Edit className="h-3 w-3" />
                              Unconfirm
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                    
                    {/* Expandable Adjustment Row */}
                    {expandedRow === allocation.entityId && !allocation.confirmed && isInFocus && !readOnly && (
                      <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                        <TableCell colSpan={6}>
                          <div className="py-4 px-2 space-y-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              Adjust Allocation for {allocation.entityName}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`allocated-${allocation.entityId}`}>
                                  Allocated Income (max: {formatCurrency(allocation.totalIncome)})
                                </Label>
                                <Input
                                  id={`allocated-${allocation.entityId}`}
                                  type="number"
                                  value={editValues.allocatedIncome}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, allocatedIncome: e.target.value }))}
                                  placeholder="Enter amount"
                                  step="0.01"
                                  min="0"
                                  max={allocation.totalIncome}
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Not allocated: {formatCurrency(allocation.totalIncome - parseFloat(editValues.allocatedIncome || '0'))}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`rate-${allocation.entityId}`}>
                                  Admin Fee Rate (%)
                                </Label>
                                <Input
                                  id={`rate-${allocation.entityId}`}
                                  type="number"
                                  value={editValues.rate}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, rate: e.target.value }))}
                                  placeholder="7.5"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Calculated fee: {formatCurrency((parseFloat(editValues.allocatedIncome || '0') * parseFloat(editValues.rate || '0')) / 100)}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                onClick={() => handleAdjustmentSave(allocation.entityId)}
                              >
                                Save Adjustment
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setExpandedRow(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gray-50 dark:bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Admin Fees for {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-3xl text-green-600 dark:text-green-400">
                {formatCurrency(totalAdminFees)}
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Admin fee rate: 7.5% of allocated income</p>
              <p>Applied to all sponsored nonprofits</p>
              <p className="text-xs mt-1 text-gray-500">Click on admin fee to adjust allocation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Format Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Export Sponsor Fee Allocation</DialogTitle>
            <DialogDescription className="text-center">
              Select your preferred export format for the sponsor fee allocation data.
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
