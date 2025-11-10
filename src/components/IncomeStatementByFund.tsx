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
import { toast } from 'sonner@2.0.3';

interface FundAllocation {
  entityId: string;
  entityName: string;
  totalIncome: number;
  allocatedIncome: number; // The amount the fee rate is applied to
  adminFeeRate: number;
  adminFeeAmount: number;
  confirmed: boolean;
}

interface IncomeStatementByFundProps {
  readOnly?: boolean;
}

export const IncomeStatementByFund: React.FC<IncomeStatementByFundProps> = ({ readOnly = false }) => {
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
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.entityId === entityId ? { ...alloc, confirmed: true } : alloc
      )
    );
    setExpandedRow(null);
    toast.success('Admin fee allocation confirmed');
  };

  const handleConfirmAll = () => {
    setAllocations(prev => prev.map(alloc => ({ ...alloc, confirmed: true })));
    setExpandedRow(null);
    toast.success('All admin fee allocations confirmed');
  };

  const handleExport = () => {
    toast.success('Exporting sponsor fee allocations as CSV...');
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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader 
          title="Sponsor Fee Allocation"
          subtitle={isInFocus
            ? 'Review and confirm monthly admin fees across all nonprofits'
            : 'Review your monthly admin fee calculation'}
        />
        <div className="flex gap-2">
          {isInFocus && !readOnly && (
            <Button onClick={handleConfirmAll} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirm All
            </Button>
          )}
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-xl text-gray-900 dark:text-gray-100">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Admin Fees (7.5%)</p>
              <p className="text-xl text-green-600 dark:text-green-400">
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
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Nonprofits</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{allocations.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl text-green-600 dark:text-green-400">{confirmedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
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
                          {!allocation.confirmed && (
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
    </div>
  );
};
