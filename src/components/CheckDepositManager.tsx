import React, { useState, useRef } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageHeader } from './PageHeader';
import {
  Camera,
  Upload,
  Check,
  X,
  Plus,
  Eye,
  Loader2,
  ArrowLeft,
  FileText,
  Trash2,
  Banknote,
  DollarSign,
} from 'lucide-react';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

// Import Account type and helpers
import { Account, createJournalEntryFromTransaction } from '../lib/journalEntryHelpers';

// Mock Chart of Accounts - Revenue Accounts
const MOCK_ACCOUNTS: Account[] = [
  // Asset
  { id: 'acc-1000', code: '1000', name: 'Cash', type: 'asset', full_name: '1000 - Cash', is_active: true },
  // Revenue Accounts
  { id: 'acc-4000', code: '4000', name: 'Donations', type: 'revenue', full_name: '4000 - Donations', is_active: true },
  { id: 'acc-4100', code: '4100', name: 'Earned Income', type: 'revenue', full_name: '4100 - Earned Income', is_active: true },
  { id: 'acc-4200', code: '4200', name: 'Cash Pledge Collections', type: 'revenue', full_name: '4200 - Cash Pledge Collections', is_active: true },
  { id: 'acc-4300', code: '4300', name: 'Grants', type: 'revenue', full_name: '4300 - Grants', is_active: true },
  { id: 'acc-4400', code: '4400', name: 'Government Grants', type: 'revenue', full_name: '4400 - Government Grants', is_active: true },
  { id: 'acc-4500', code: '4500', name: 'Investment Income', type: 'revenue', full_name: '4500 - Investment Income', is_active: true },
  { id: 'acc-4600', code: '4600', name: 'Other Income', type: 'revenue', full_name: '4600 - Other Income', is_active: true },
];

// Revenue accounts only for the selector
const REVENUE_ACCOUNTS = MOCK_ACCOUNTS.filter(acc => acc.type === 'revenue');

interface CheckData {
  id: string;
  image: string; // data URL
  payerName: string;
  checkNumber: string;
  amount: number;              // Changed from string
  date: string;
  account: Account;            // Changed from category string
  memo: string;
  bankName: string;
  entityId: string;
  // New fields for GL integration
  batchId?: string;
  journalEntryId?: string;
  reconciled: boolean;
  depositedBy: string;
  depositedAt: string;
}

type Step = 'capture' | 'review' | 'complete';

export const CheckDepositManager: React.FC = () => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [step, setStep] = useState<Step>('capture');
  const [checks, setChecks] = useState<CheckData[]>([]);
  const [currentCheck, setCurrentCheck] = useState<CheckData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewCheckOpen, setViewCheckOpen] = useState(false);
  const [selectedCheckForView, setSelectedCheckForView] = useState<CheckData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  // Simulate OCR processing for checks
  const processCheckOCR = async (imageDataUrl: string): Promise<Partial<CheckData>> => {
    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock OCR results - in production this would call an OCR API
    const mockPayers = ['John Smith', 'Mary Johnson', 'ABC Company', 'Tech Corp', 'Jane Doe', 'Community Foundation'];
    const mockBanks = ['Chase Bank', 'Bank of America', 'Wells Fargo', 'US Bank', 'Citibank'];
    
    // Get default account (Donations)
    const defaultAccount = REVENUE_ACCOUNTS.find(acc => acc.code === '4000') || REVENUE_ACCOUNTS[0];
    
    return {
      payerName: mockPayers[Math.floor(Math.random() * mockPayers.length)],
      checkNumber: String(Math.floor(Math.random() * 9000) + 1000),
      amount: parseFloat((Math.random() * 5000 + 50).toFixed(2)),
      date: new Date().toISOString().split('T')[0],
      account: defaultAccount,
      memo: 'Donation',
      bankName: mockBanks[Math.floor(Math.random() * mockBanks.length)],
      reconciled: false,
      depositedBy: '',
      depositedAt: '',
    };
  };

  const handleFileCapture = async (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      
      setIsProcessing(true);
      try {
        const ocrData = await processCheckOCR(imageDataUrl);
        const defaultAccount = REVENUE_ACCOUNTS.find(acc => acc.code === '4000') || REVENUE_ACCOUNTS[0];
        
        setCurrentCheck({
          id: `check-${Date.now()}`,
          image: imageDataUrl,
          payerName: ocrData.payerName || '',
          checkNumber: ocrData.checkNumber || '',
          amount: ocrData.amount || 0,
          date: ocrData.date || new Date().toISOString().split('T')[0],
          account: ocrData.account || defaultAccount,
          memo: ocrData.memo || '',
          bankName: ocrData.bankName || '',
          entityId: selectedEntity === 'all' ? '' : selectedEntity,
          reconciled: false,
          depositedBy: '',
          depositedAt: '',
        });
        setStep('review');
      } catch (error) {
        toast.error('Failed to process check');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmCheck = () => {
    if (!currentCheck) return;

    if (!currentCheck.payerName || !currentCheck.amount || !currentCheck.account || !currentCheck.entityId) {
      toast.error('Please fill in all required fields (including nonprofit)');
      return;
    }

    setChecks([...checks, currentCheck]);
    setCurrentCheck(null);
    setStep('complete');
  };

  const handleAddMore = () => {
    setStep('capture');
  };

  const handleSubmitDeposit = () => {
    if (checks.length === 0) {
      toast.error('No checks to deposit');
      return;
    }

    // Verify all checks have entities assigned
    const checksWithoutEntity = checks.filter(c => !c.entityId);
    if (checksWithoutEntity.length > 0) {
      toast.error('All checks must have a nonprofit assigned');
      return;
    }

    // Create batch ID for this deposit
    const batchId = `batch-${Date.now()}`;
    
    // Create journal entries for each check
    const journalEntries = checks.map(check => 
      createJournalEntryFromTransaction('check-deposit', {
        ...check,
        batchId,
        depositedBy: 'Current User',
        depositedAt: new Date().toISOString(),
      }, MOCK_ACCOUNTS)
    );
    
    // Dispatch event to update General Ledger
    const event = new CustomEvent('journal-entries-created', {
      detail: { entries: journalEntries }
    });
    window.dispatchEvent(event);
    
    const totalAmount = checks.reduce((sum, c) => sum + c.amount, 0);
    toast.success(`${checks.length} check(s) deposited - $${totalAmount.toFixed(2)} posted to General Ledger`);
    
    // Reset form
    setChecks([]);
    setCurrentCheck(null);
    setStep('capture');
    setFormData({
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
  };

  const handleDeleteCheck = (id: string) => {
    setChecks(checks.filter(c => c.id !== id));
    if (checks.length === 1) {
      setStep('capture');
    }
  };

  const totalAmount = checks.reduce((sum, c) => sum + c.amount, 0);

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
        title="Check Deposit"
        subtitle="Scan checks to deposit them into the general ledger"
      />

      {/* Capture Step */}
      {step === 'capture' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Scan Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {checks.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        {checks.length} check{checks.length > 1 ? 's' : ''} scanned
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Total: ${totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep('complete')}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              )}

              {isProcessing ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-600 dark:text-green-400 mb-4" />
                  <p className="text-lg font-medium">Processing check...</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Extracting information from your check
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleCameraClick}
                      className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors group"
                    >
                      <Camera className="h-12 w-12 mx-auto text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 mb-3" />
                      <p className="font-medium text-gray-900 dark:text-gray-100">Take Photo</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Use your camera
                      </p>
                    </button>

                    <button
                      onClick={handleUploadClick}
                      className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors group"
                    >
                      <Upload className="h-12 w-12 mx-auto text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 mb-3" />
                      <p className="font-medium text-gray-900 dark:text-gray-100">Upload Photo</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Choose from files
                      </p>
                    </button>
                  </div>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileCapture(e.target.files[0])}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileCapture(e.target.files[0])}
                  />

                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    We'll automatically extract check details using OCR
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && currentCheck && (
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentCheck(null);
              setStep('capture');
            }}
            className="gap-2 mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Review Check Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Check Image Preview */}
              <div className="relative">
                <img
                  src={currentCheck.image}
                  alt="Check"
                  className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedCheckForView(currentCheck);
                    setViewCheckOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payerName">Payer Name *</Label>
                  <Input
                    id="payerName"
                    value={currentCheck.payerName}
                    onChange={(e) =>
                      setCurrentCheck({ ...currentCheck, payerName: e.target.value })
                    }
                    placeholder="Enter payer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkNumber">Check Number</Label>
                  <Input
                    id="checkNumber"
                    value={currentCheck.checkNumber}
                    onChange={(e) =>
                      setCurrentCheck({ ...currentCheck, checkNumber: e.target.value })
                    }
                    placeholder="Enter check number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={currentCheck.amount}
                    onChange={(e) =>
                      setCurrentCheck({ ...currentCheck, amount: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentCheck.date}
                    onChange={(e) =>
                      setCurrentCheck({ ...currentCheck, date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Revenue Account *</Label>
                  <Select
                    value={currentCheck.account?.id}
                    onValueChange={(value) => {
                      const account = REVENUE_ACCOUNTS.find(acc => acc.id === value);
                      if (account) {
                        setCurrentCheck({ ...currentCheck, account });
                      }
                    }}
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select revenue account" />
                    </SelectTrigger>
                    <SelectContent>
                      {REVENUE_ACCOUNTS.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.code} - {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entityId">Nonprofit *</Label>
                  <Select
                    value={currentCheck.entityId}
                    onValueChange={(value) =>
                      setCurrentCheck({ ...currentCheck, entityId: value })
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
                    value={currentCheck.bankName}
                    onChange={(e) =>
                      setCurrentCheck({ ...currentCheck, bankName: e.target.value })
                    }
                    placeholder="Enter bank name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">Memo / Notes</Label>
                <Textarea
                  id="memo"
                  value={currentCheck.memo}
                  onChange={(e) =>
                    setCurrentCheck({ ...currentCheck, memo: e.target.value })
                  }
                  placeholder="Add any notes about this check"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentCheck(null);
                    setStep('capture');
                  }}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleConfirmCheck} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Check
                </Button>
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
                      <Banknote className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-300">Total Checks</p>
                        <p className="text-xl text-green-900 dark:text-green-100">
                          {checks.length}
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
                          ${checks.length > 0 ? (totalAmount / checks.length).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Checks List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Checks to Deposit ({checks.length})</h3>
                </div>

                {checks.map((check) => (
                  <Card key={check.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={check.image}
                          alt="Check"
                          className="w-24 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedCheckForView(check);
                            setViewCheckOpen(true);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {check.payerName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Check #{check.checkNumber} • {check.bankName}
                              </p>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                                → {entities.find(e => e.id === check.entityId)?.name || 'Unknown Nonprofit'}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCheck(check.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              ${check.amount.toFixed(2)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {check.account.code} - {check.account.name}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {check.date}
                            </Badge>
                          </div>
                          {check.memo && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {check.memo}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleAddMore}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Checks
                </Button>
                <Button
                  onClick={handleSubmitDeposit}
                  className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Submit Deposit to Ledger
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Check Image Dialog */}
      <Dialog open={viewCheckOpen} onOpenChange={setViewCheckOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Check Image</DialogTitle>
            <DialogDescription>
              {selectedCheckForView?.payerName} - ${selectedCheckForView?.amount}
            </DialogDescription>
          </DialogHeader>
          {selectedCheckForView && (
            <div className="space-y-4">
              <img
                src={selectedCheckForView.image}
                alt="Check"
                className="w-full h-auto rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Nonprofit</p>
                  <p className="font-medium">{entities.find(e => e.id === selectedCheckForView.entityId)?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Check Number</p>
                  <p className="font-medium">{selectedCheckForView.checkNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium">{selectedCheckForView.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Bank</p>
                  <p className="font-medium">{selectedCheckForView.bankName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Category</p>
                  <p className="font-medium">{selectedCheckForView.category}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
