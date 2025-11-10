import React, { useState } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageHeader } from './PageHeader';

// Income Categories
const INCOME_CATEGORIES = [
  { code: '4000', name: 'Donations' },
  { code: '4100', name: 'Earned Income' },
  { code: '4200', name: 'Cash Pledge Collections' },
  { code: '4300', name: 'Grants' },
  { code: '4400', name: 'Government Grants' },
  { code: '4500', name: 'Investment Income' },
  { code: '4600', name: 'Other Income' },
];

import {
  Check,
  X,
  Plus,
  ArrowLeft,
  FileText,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface DepositData {
  id: string;
  payerName: string;
  referenceNumber: string;
  amount: string;
  date: string;
  category: string;
  memo: string;
  bankName: string;
  entityId: string;
}

type Step = 'form' | 'complete';

export const RegularDepositManager: React.FC = () => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [step, setStep] = useState<Step>('form');
  const [deposits, setDeposits] = useState<DepositData[]>([]);
  const [currentDeposit, setCurrentDeposit] = useState<DepositData>({
    id: `deposit-${Date.now()}`,
    payerName: '',
    referenceNumber: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    memo: '',
    bankName: '',
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  const handleAddDeposit = () => {
    if (!currentDeposit.payerName || !currentDeposit.amount || !currentDeposit.category || !currentDeposit.entityId) {
      toast.error('Please fill in all required fields (Payer Name, Amount, Category, and Nonprofit)');
      return;
    }

    setDeposits([...deposits, currentDeposit]);
    setCurrentDeposit({
      id: `deposit-${Date.now()}`,
      payerName: '',
      referenceNumber: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      memo: '',
      bankName: '',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
    toast.success('Deposit added to batch');
  };

  const handleReviewDeposits = () => {
    if (deposits.length === 0) {
      toast.error('Please add at least one deposit');
      return;
    }
    setStep('complete');
  };

  const handleSubmitDeposit = () => {
    if (deposits.length === 0) {
      toast.error('No deposits to submit');
      return;
    }

    // Verify all deposits have entities assigned
    const depositsWithoutEntity = deposits.filter(d => !d.entityId);
    if (depositsWithoutEntity.length > 0) {
      toast.error('All deposits must have a nonprofit assigned');
      return;
    }

    const totalAmount = deposits.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0);
    
    // Group deposits by entity for better messaging
    const entitiesByDeposit = new Set(deposits.map(d => d.entityId));
    const entityNames = Array.from(entitiesByDeposit).map(id => 
      entities.find(e => e.id === id)?.name
    ).filter(Boolean);
    
    const message = entityNames.length === 1 
      ? `Deposit batch submitted to general ledger for ${entityNames[0]}: ${deposits.length} deposit${deposits.length > 1 ? 's' : ''}, $${totalAmount.toFixed(2)}`
      : `Deposit batch submitted to general ledger: ${deposits.length} deposit${deposits.length > 1 ? 's' : ''} across ${entityNames.length} nonprofits, $${totalAmount.toFixed(2)}`;
    
    toast.success(message);
    
    // Reset form
    setDeposits([]);
    setCurrentDeposit({
      id: `deposit-${Date.now()}`,
      payerName: '',
      referenceNumber: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      memo: '',
      bankName: '',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
    setStep('form');
  };

  const handleDeleteDeposit = (id: string) => {
    setDeposits(deposits.filter(d => d.id !== id));
    if (deposits.length === 1) {
      setStep('form');
    }
  };

  const totalAmount = deposits.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setAccountingTool('deposits')}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Deposits
      </Button>

      {/* Header */}
      <PageHeader 
        title="Regular Deposit"
        subtitle="Record income deposits into the general ledger"
      />

      {/* Form Step */}
      {step === 'form' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add Deposit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {deposits.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        {deposits.length} deposit{deposits.length > 1 ? 's' : ''} in batch
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Total: ${totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReviewDeposits}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payerName">Payer Name *</Label>
                  <Input
                    id="payerName"
                    value={currentDeposit.payerName}
                    onChange={(e) =>
                      setCurrentDeposit({ ...currentDeposit, payerName: e.target.value })
                    }
                    placeholder="Enter payer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={currentDeposit.referenceNumber}
                    onChange={(e) =>
                      setCurrentDeposit({ ...currentDeposit, referenceNumber: e.target.value })
                    }
                    placeholder="Transaction/deposit number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={currentDeposit.amount}
                    onChange={(e) =>
                      setCurrentDeposit({ ...currentDeposit, amount: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentDeposit.date}
                    onChange={(e) =>
                      setCurrentDeposit({ ...currentDeposit, date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Income Category *</Label>
                  <Select
                    value={currentDeposit.category}
                    onValueChange={(value) =>
                      setCurrentDeposit({ ...currentDeposit, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_CATEGORIES.map((cat, idx) => (
                        <SelectItem key={`${cat.code}-${idx}`} value={`${cat.code} - ${cat.name}`}>
                          {cat.code} - {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entityId">Nonprofit *</Label>
                  <Select
                    value={currentDeposit.entityId}
                    onValueChange={(value) =>
                      setCurrentDeposit({ ...currentDeposit, entityId: value })
                    }
                  >
                    <SelectTrigger id="entityId">
                      <SelectValue placeholder="Select nonprofit" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities
                        .filter((entity) => entity.id !== 'all')
                        .map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={currentDeposit.bankName}
                    onChange={(e) =>
                      setCurrentDeposit({ ...currentDeposit, bankName: e.target.value })
                    }
                    placeholder="Enter bank name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">Memo / Notes</Label>
                <Textarea
                  id="memo"
                  value={currentDeposit.memo}
                  onChange={(e) =>
                    setCurrentDeposit({ ...currentDeposit, memo: e.target.value })
                  }
                  placeholder="Add any notes about this deposit"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddDeposit} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Batch
                </Button>
                {deposits.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleReviewDeposits}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Review & Submit ({deposits.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Complete/Summary Step */}
      {step === 'complete' && (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-300">Total Deposits</p>
                        <p className="text-xl text-green-900 dark:text-green-100">
                          {deposits.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-blue-700 dark:text-blue-300">Total Amount</p>
                        <p className="text-xl text-blue-900 dark:text-blue-100">
                          ${totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-xs text-purple-700 dark:text-purple-300">Avg Amount</p>
                        <p className="text-xl text-purple-900 dark:text-purple-100">
                          ${deposits.length > 0 ? (totalAmount / deposits.length).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Deposit List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Deposits in Batch</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep('form')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More
                  </Button>
                </div>

                <div className="space-y-2">
                  {deposits.map((deposit) => {
                    const entity = entities.find(e => e.id === deposit.entityId);
                    return (
                      <Card key={deposit.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium truncate">{deposit.payerName}</p>
                                <Badge variant="outline" className="shrink-0">
                                  {entity?.name}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">Amount:</span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    ${parseFloat(deposit.amount).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">Date:</span>
                                  <span>{new Date(deposit.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1 sm:col-span-2">
                                  <span className="text-xs">Category:</span>
                                  <span className="truncate">{deposit.category}</span>
                                </div>
                                {deposit.referenceNumber && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">Ref:</span>
                                    <span>{deposit.referenceNumber}</span>
                                  </div>
                                )}
                                {deposit.bankName && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">Bank:</span>
                                    <span>{deposit.bankName}</span>
                                  </div>
                                )}
                                {deposit.memo && (
                                  <div className="flex items-start gap-1 sm:col-span-2">
                                    <span className="text-xs">Note:</span>
                                    <span className="break-words">{deposit.memo}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDeposit(deposit.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Form
                </Button>
                <Button onClick={handleSubmitDeposit} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Submit Deposit Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
