import React, { useState, useRef } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageHeader } from './PageHeader';

// Expense Categories
const EXPENSE_CATEGORIES = [
  { code: '5000', name: 'Tithe' },
  { code: '5000', name: 'Donation' },
  { code: '5010', name: 'Family Support' },
  { code: '5050', name: 'Repairs and Maintenance - Foreign' },
  { code: '5060', name: 'Construction - Foreign' },
  { code: '5070', name: 'Supplies - Foreign' },
  { code: '5080', name: 'Equipment - Foreign' },
  { code: '5100', name: 'Compensation - officers/directors' },
  { code: '5110', name: 'Compensation - all others' },
  { code: '5120', name: 'Pension/Retirement' },
  { code: '5130', name: 'Other Employee Benefits' },
  { code: '5140', name: 'Payroll Taxes' },
  { code: '5200', name: 'Legal Fees' },
  { code: '5210', name: 'Accounting' },
  { code: '5240', name: 'Advertising Expenses' },
  { code: '5300', name: 'Office Supplies' },
  { code: '5310', name: 'Books, Subscriptions, Reference' },
  { code: '5320', name: 'Postage, Mailing Service' },
  { code: '5330', name: 'Printing and Copying' },
  { code: '5340', name: 'Business Expenses' },
  { code: '5400', name: 'Information Technology' },
  { code: '5410', name: 'Software Programs' },
  { code: '5500', name: 'Rent' },
  { code: '5510', name: 'Utilities' },
  { code: '5520', name: 'Telephone, Telecommunications' },
  { code: '5530', name: 'Repairs and Maintenance - Domestic' },
  { code: '5540', name: 'Mortgage Interest' },
  { code: '5600', name: 'Travel and Meetings' },
  { code: '5610', name: 'Transportation' },
  { code: '5620', name: 'Parking' },
  { code: '5650', name: 'Continuing Education' },
  { code: '5660', name: 'Meals' },
  { code: '5670', name: 'Training' },
  { code: '5700', name: 'Insurance Premium' },
  { code: '5710', name: 'Insurance - Liability, D and O' },
  { code: '5800', name: 'Bank Fees' },
  { code: '5810', name: 'Contract fees' },
  { code: '5820', name: 'Donor Appreciation' },
  { code: '5830', name: 'Materials' },
  { code: '5840', name: 'Outside Contract Services' },
  { code: '5850', name: 'Construction - Domestic' },
  { code: '5860', name: 'Supplies - Domestic' },
  { code: '5870', name: 'Equipment - Domestic' },
  { code: '5890', name: 'Miscellaneous Expense' },
  { code: '5895', name: 'Reconciliation Discrepancies' },
  { code: '5899', name: 'Ask My Accountant' },
  { code: '5900', name: 'IFM Admin fee' },
  { code: '6000', name: 'Event Expenses' },
  { code: '6010', name: 'Event Expenses - Cash Prizes' },
  { code: '6020', name: 'Event Expenses - Non-Cash Prizes' },
  { code: '6030', name: 'Event Expenses - Facility Rent' },
  { code: '6040', name: 'Event Expenses - Food' },
  { code: '6050', name: 'Event Expenses - Entertainment' },
  { code: '6060', name: 'Event Expenses - Fund Raising' },
  { code: '6070', name: 'Event Expenses - Other' },
];
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
import { toast } from 'sonner@2.0.3';

interface Receipt {
  id: string;
  image: string; // data URL
  vendor: string;
  amount: string;
  date: string;
  category: string;
  description: string;
}

type Step = 'capture' | 'review' | 'complete';

export const ReimbursementsManager: React.FC = () => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [step, setStep] = useState<Step>('capture');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewReceiptOpen, setViewReceiptOpen] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<Receipt | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  // Simulate OCR processing
  const processReceiptOCR = async (imageDataUrl: string): Promise<Partial<Receipt>> => {
    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock OCR results - in production this would call an OCR API
    const mockVendors = ['Office Depot', 'Staples', 'Amazon', 'Home Depot', 'Target', 'Walmart', 'FedEx'];
    const mockCategories = ['Office Supplies', 'Equipment', 'Marketing', 'Travel', 'Utilities'];
    
    return {
      vendor: mockVendors[Math.floor(Math.random() * mockVendors.length)],
      amount: (Math.random() * 200 + 10).toFixed(2),
      date: new Date().toISOString().split('T')[0],
      category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
      description: 'Extracted from receipt',
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
        
        setCurrentReceipt({
          id: `receipt-${Date.now()}`,
          image: imageDataUrl,
          vendor: ocrData.vendor || '',
          amount: ocrData.amount || '',
          date: ocrData.date || new Date().toISOString().split('T')[0],
          category: ocrData.category || '',
          description: ocrData.description || '',
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

    if (!currentReceipt.vendor || !currentReceipt.amount || !currentReceipt.category) {
      toast.error('Please fill in all required fields');
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

    const totalAmount = receipts.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);
    const entityName = entities.find(e => e.id === formData.entityId)?.name || 'the organization';
    
    toast.success(
      `Reimbursement request submitted for ${entityName}: ${receipts.length} receipt${receipts.length > 1 ? 's' : ''}, $${totalAmount.toFixed(2)}`
    );
    
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

  const totalAmount = receipts.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

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
                      onChange={(e) => setCurrentReceipt({ ...currentReceipt, amount: e.target.value })}
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
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={currentReceipt.category}
                    onValueChange={(value) => setCurrentReceipt({ ...currentReceipt, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {EXPENSE_CATEGORIES.map((cat, idx) => (
                        <SelectItem key={`${cat.code}-${idx}`} value={`${cat.code} - ${cat.name}`}>
                          {cat.code} - {cat.name}
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
                          {receipt.date} • {receipt.category}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold">${parseFloat(receipt.amount).toFixed(2)}</p>
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
                  <p className="font-semibold">${parseFloat(selectedReceiptForView.amount).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Date</Label>
                  <p>{selectedReceiptForView.date}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Category</Label>
                  <p>{selectedReceiptForView.category}</p>
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
