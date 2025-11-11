import React, { useState, useRef } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageHeader } from './PageHeader';

// Mock Chart of Accounts - Expense Accounts
const MOCK_ACCOUNTS: Account[] = [
  // Asset
  { id: 'acc-1000', code: '1000', name: 'Cash', type: 'asset', full_name: '1000 - Cash', is_active: true },
  // Expense Accounts
  { id: 'acc-5000', code: '5000', name: 'Tithe', type: 'expense', full_name: '5000 - Tithe', is_active: true },
  { id: 'acc-5010', code: '5010', name: 'Family Support', type: 'expense', full_name: '5010 - Family Support', is_active: true },
  { id: 'acc-5050', code: '5050', name: 'Repairs and Maintenance - Foreign', type: 'expense', full_name: '5050 - Repairs and Maintenance - Foreign', is_active: true },
  { id: 'acc-5060', code: '5060', name: 'Construction - Foreign', type: 'expense', full_name: '5060 - Construction - Foreign', is_active: true },
  { id: 'acc-5070', code: '5070', name: 'Supplies - Foreign', type: 'expense', full_name: '5070 - Supplies - Foreign', is_active: true },
  { id: 'acc-5080', code: '5080', name: 'Equipment - Foreign', type: 'expense', full_name: '5080 - Equipment - Foreign', is_active: true },
  { id: 'acc-5100', code: '5100', name: 'Compensation - officers/directors', type: 'expense', full_name: '5100 - Compensation - officers/directors', is_active: true },
  { id: 'acc-5110', code: '5110', name: 'Compensation - all others', type: 'expense', full_name: '5110 - Compensation - all others', is_active: true },
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
  { id: 'acc-5900', code: '5900', name: 'IFM Admin fee', type: 'expense', full_name: '5900 - IFM Admin fee', is_active: true },
  { id: 'acc-6000', code: '6000', name: 'Event Expenses', type: 'expense', full_name: '6000 - Event Expenses', is_active: true },
];

// Expense accounts only for the selector
const EXPENSE_ACCOUNTS = MOCK_ACCOUNTS.filter(acc => acc.type === 'expense');

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

interface ReceiptData {
  id: string;
  image: string; // data URL
  vendor: string;
  amount: number;              // Changed from string
  date: string;
  account: Account;            // Changed from category string
  description: string;
  entityId: string;            // Now required
  notes?: string;
  // New fields for GL integration
  requestId?: string;
  journalEntryId?: string;
  status: 'pending' | 'approved' | 'paid';
  approvedBy?: string;
  approvedAt?: string;
  paidBy?: string;
  paidAt?: string;
  paymentMethod?: string;
}

type Step = 'capture' | 'review' | 'complete';

export const ReimbursementsManager: React.FC = () => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [step, setStep] = useState<Step>('capture');
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewReceiptOpen, setViewReceiptOpen] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<ReceiptData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  // Simulate OCR processing
  const processReceiptOCR = async (imageDataUrl: string): Promise<Partial<ReceiptData>> => {
    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock OCR results - in production this would call an OCR API
    const mockVendors = ['Office Depot', 'Staples', 'Amazon', 'Home Depot', 'Target', 'Walmart', 'FedEx'];
    
    // Get default account (Office Supplies)
    const defaultAccount = EXPENSE_ACCOUNTS.find(acc => acc.code === '5300') || EXPENSE_ACCOUNTS[0];
    
    return {
      vendor: mockVendors[Math.floor(Math.random() * mockVendors.length)],
      amount: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      date: new Date().toISOString().split('T')[0],
      account: defaultAccount,
      description: 'Extracted from receipt',
      status: 'pending',
    };
  };

  const handleFileCapture = async (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      
      setIsProcessing(true);
      try {
        const ocrData = await processReceiptOCR(imageDataUrl);
        const defaultAccount = EXPENSE_ACCOUNTS.find(acc => acc.code === '5300') || EXPENSE_ACCOUNTS[0];
        
        setCurrentReceipt({
          id: `receipt-${Date.now()}`,
          image: imageDataUrl,
          vendor: ocrData.vendor || '',
          amount: ocrData.amount || 0,
          date: ocrData.date || new Date().toISOString().split('T')[0],
          account: ocrData.account || defaultAccount,
          description: ocrData.description || '',
          entityId: formData.entityId,
          status: 'pending',
        });
        setStep('review');
      } catch (error) {
        toast.error('Failed to process receipt');
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

  const handleConfirmReceipt = () => {
    if (!currentReceipt) return;

    if (!currentReceipt.vendor || !currentReceipt.amount || !currentReceipt.account || !currentReceipt.entityId) {
      toast.error('Please fill in all required fields (including nonprofit)');
      return;
    }

    setReceipts([...receipts, currentReceipt]);
    setCurrentReceipt(null);
    setStep('complete');
  };

  const handleAddMore = () => {
    setStep('capture');
  };

  const handleSubmitReimbursement = () => {
    if (receipts.length === 0) {
      toast.error('No receipts to submit');
      return;
    }

    if (!formData.entityId) {
      toast.error('Please select a nonprofit');
      return;
    }

    // Create request ID for this reimbursement
    const requestId = `reimb-${Date.now()}`;
    
    // Create journal entries for each receipt
    const journalEntries = receipts.map(receipt => 
      createJournalEntryFromTransaction('reimbursement', {
        ...receipt,
        requestId,
        notes: receipt.description,
      }, MOCK_ACCOUNTS)
    );
    
    // Dispatch event to update General Ledger
    const event = new CustomEvent('journal-entries-created', {
      detail: { entries: journalEntries }
    });
    window.dispatchEvent(event);
    
    const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
    toast.success(`Reimbursement posted - $${totalAmount.toFixed(2)} to General Ledger`);
    
    // Reset form
    setReceipts([]);
    setCurrentReceipt(null);
    setStep('capture');
    setFormData({
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
  };

  const handleDeleteReceipt = (id: string) => {
    setReceipts(receipts.filter(r => r.id !== id));
    if (receipts.length === 1) {
      setStep('capture');
    }
  };

  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

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
      <PageHeader 
        title="Submit Reimbursement"
        subtitle="Take photos of your receipts to submit for reimbursement"
      />

      {/* Capture Step */}
      {step === 'capture' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Capture Receipt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {receipts.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {receipts.length} receipt{receipts.length > 1 ? 's' : ''} added
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
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
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                  <p className="text-lg font-medium">Processing receipt...</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Extracting information from your receipt
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleCameraClick}
                      className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group"
                    >
                      <Camera className="h-12 w-12 mx-auto text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-3" />
                      <p className="font-medium text-gray-900 dark:text-gray-100">Take Photo</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Use your camera
                      </p>
                    </button>

                    <button
                      onClick={handleUploadClick}
                      className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group"
                    >
                      <Upload className="h-12 w-12 mx-auto text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-3" />
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
                    We'll automatically extract receipt details using OCR
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && currentReceipt && (
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentReceipt(null);
              setStep('capture');
            }}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Review Receipt Details</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Please verify the extracted information is correct
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Receipt Image Preview */}
              <div className="relative aspect-[3/4] max-h-80 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={currentReceipt.image}
                  alt="Receipt"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Input
                    id="vendor"
                    value={currentReceipt.vendor}
                    onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendor: e.target.value })}
                    placeholder="e.g., Office Depot"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={currentReceipt.amount}
                      onChange={(e) => setCurrentReceipt({ ...currentReceipt, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={currentReceipt.date}
                      onChange={(e) => setCurrentReceipt({ ...currentReceipt, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Expense Account *</Label>
                  <Select
                    value={currentReceipt.account?.id}
                    onValueChange={(value: string) => {
                      const account = EXPENSE_ACCOUNTS.find(acc => acc.id === value);
                      if (account) {
                        setCurrentReceipt({ ...currentReceipt, account });
                      }
                    }}
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select expense account..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_ACCOUNTS.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.code} - {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentReceipt.description}
                    onChange={(e) => setCurrentReceipt({ ...currentReceipt, description: e.target.value })}
                    placeholder="Add any notes about this expense..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <Button
                  onClick={handleConfirmReceipt}
                  className="w-full gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirm Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Complete Step - Review All Receipts */}
      {step === 'complete' && receipts.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleAddMore}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Add More Receipts
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Review Reimbursement Request</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {receipts.length} receipt{receipts.length > 1 ? 's' : ''} • Total: ${totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nonprofit Selection */}
              <div className="space-y-2">
                <Label htmlFor="nonprofit">Nonprofit *</Label>
                <Select
                  value={formData.entityId}
                  onValueChange={(value) => setFormData({ ...formData, entityId: value })}
                >
                  <SelectTrigger id="nonprofit">
                    <SelectValue placeholder="Select organization..." />
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

              {/* Receipts List */}
              <div className="space-y-3">
                <Label>Receipts</Label>
                <div className="border dark:border-gray-700 rounded-lg divide-y dark:divide-gray-700">
                  {receipts.map((receipt) => (
                    <div key={receipt.id} className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={receipt.image}
                          alt={receipt.vendor}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{receipt.vendor}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {receipt.date} • {receipt.account.code} - {receipt.account.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold">${receipt.amount.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedReceiptForView(receipt);
                            setViewReceiptOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                          onClick={() => handleDeleteReceipt(receipt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-2xl font-semibold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleAddMore}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add More Receipts
                </Button>
                <Button
                  onClick={handleSubmitReimbursement}
                  className="flex-1 gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Submit for Approval
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {step === 'complete' && receipts.length === 0 && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Receipts Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by capturing a receipt to submit for reimbursement
              </p>
              <Button onClick={() => setStep('capture')}>
                Capture Receipt
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Receipt Dialog */}
      <Dialog open={viewReceiptOpen} onOpenChange={setViewReceiptOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
          </DialogHeader>
          {selectedReceiptForView && (
            <div className="space-y-4">
              <div className="aspect-[3/4] max-h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={selectedReceiptForView.image}
                  alt="Receipt"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Vendor</Label>
                  <p>{selectedReceiptForView.vendor}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Amount</Label>
                  <p className="font-semibold">${selectedReceiptForView.amount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Date</Label>
                  <p>{selectedReceiptForView.date}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Account</Label>
                  <p>{selectedReceiptForView.account.code} - {selectedReceiptForView.account.name}</p>
                </div>
                {selectedReceiptForView.description && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-500">Description</Label>
                    <p>{selectedReceiptForView.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewReceiptOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
