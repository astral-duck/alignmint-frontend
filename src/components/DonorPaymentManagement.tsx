import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  ArrowLeft,
  CreditCard,
  RefreshCw,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  Edit,
  Ban,
  Building2,
  Calendar,
} from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { PageHeader } from './PageHeader';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
}

interface DonorPayment {
  id: string;
  name: string;
  email: string;
  phone: string;
  entityId: string;
  paymentMethods: PaymentMethod[];
  isRecurring: boolean;
  recurringAmount?: number;
  recurringFrequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';
  nextBillingDate?: string;
  subscriptionStatus: 'active' | 'cancelled' | 'paused' | 'none';
  totalDonated: number;
  lastDonationDate: string;
  startDate: string;
}

type PaymentStatusFilter = 'all' | 'active-recurring' | 'cancelled' | 'one-time-only' | 'payment-failed';

// Generate comprehensive fake donor data
const generateMockDonors = (): DonorPayment[] => {
  const firstNames = ['Robert', 'Susan', 'Michael', 'Sarah', 'David', 'Jennifer', 'James', 'Patricia', 'Christopher', 'Linda', 'Daniel', 'Elizabeth', 'Matthew', 'Maria', 'Joseph', 'Barbara', 'Thomas', 'Jessica', 'Charles', 'Karen'];
  const lastNames = ['Thompson', 'Chen', 'Williams', 'Martinez', 'Anderson', 'Brown', 'Lee', 'Garcia', 'Rodriguez', 'Wilson', 'Taylor', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson'];
  
  const cardBrands = ['Visa', 'Mastercard', 'Amex', 'Discover'];
  const bankNames = ['Chase Bank', 'Bank of America', 'Wells Fargo', 'US Bank', 'Citibank'];

  const donors: DonorPayment[] = [];

  for (let i = 0; i < 45; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const isRecurring = i < 25; // First 25 are recurring
    const hasMultiplePaymentMethods = i < 10; // First 10 have multiple payment methods
    
    const paymentMethods: PaymentMethod[] = [];
    
    // Primary payment method
    const primaryIsCard = Math.random() > 0.3;
    paymentMethods.push({
      id: `pm_${i}_1`,
      type: primaryIsCard ? 'card' : 'bank',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      brand: primaryIsCard ? cardBrands[Math.floor(Math.random() * cardBrands.length)] : undefined,
      bankName: !primaryIsCard ? bankNames[Math.floor(Math.random() * bankNames.length)] : undefined,
      expiryMonth: primaryIsCard ? String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') : undefined,
      expiryYear: primaryIsCard ? String(2025 + Math.floor(Math.random() * 5)) : undefined,
      isDefault: true,
    });

    // Add second payment method for some donors
    if (hasMultiplePaymentMethods) {
      const secondaryIsCard = !primaryIsCard;
      paymentMethods.push({
        id: `pm_${i}_2`,
        type: secondaryIsCard ? 'card' : 'bank',
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        brand: secondaryIsCard ? cardBrands[Math.floor(Math.random() * cardBrands.length)] : undefined,
        bankName: !secondaryIsCard ? bankNames[Math.floor(Math.random() * bankNames.length)] : undefined,
        expiryMonth: secondaryIsCard ? String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') : undefined,
        expiryYear: secondaryIsCard ? String(2025 + Math.floor(Math.random() * 5)) : undefined,
        isDefault: false,
      });
    }

    // Determine subscription status
    let subscriptionStatus: 'active' | 'cancelled' | 'paused' | 'none' = 'none';
    if (isRecurring) {
      if (i < 20) subscriptionStatus = 'active';
      else if (i < 23) subscriptionStatus = 'paused';
      else subscriptionStatus = 'cancelled';
    }

    const frequencies: Array<'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually'> = 
      ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'];
    const recurringFrequency = frequencies[i % frequencies.length];
    
    const recurringAmounts = [25, 50, 100, 250, 500, 1000, 2500, 5000];
    const recurringAmount = isRecurring ? recurringAmounts[i % recurringAmounts.length] : undefined;

    // Calculate next billing date
    let nextBillingDate: string | undefined;
    if (subscriptionStatus === 'active' && recurringAmount) {
      const today = new Date();
      const next = new Date(today);
      
      switch (recurringFrequency) {
        case 'weekly':
          next.setDate(next.getDate() + 7);
          break;
        case 'bi-weekly':
          next.setDate(next.getDate() + 14);
          break;
        case 'monthly':
          next.setMonth(next.getMonth() + 1);
          break;
        case 'quarterly':
          next.setMonth(next.getMonth() + 3);
          break;
        case 'annually':
          next.setFullYear(next.getFullYear() + 1);
          break;
      }
      
      nextBillingDate = next.toISOString().split('T')[0];
    }

    // Total donated and last donation date
    const monthsActive = Math.floor(Math.random() * 24) + 1;
    let totalDonated = 0;
    if (isRecurring && recurringAmount) {
      const paymentsCount = Math.floor(monthsActive * (recurringFrequency === 'monthly' ? 1 : recurringFrequency === 'quarterly' ? 0.33 : 12));
      totalDonated = recurringAmount * Math.max(1, paymentsCount);
    } else {
      totalDonated = Math.floor(Math.random() * 5000) + 100;
    }

    const lastDonationDate = new Date();
    lastDonationDate.setDate(lastDonationDate.getDate() - Math.floor(Math.random() * 30));

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsActive);

    donors.push({
      id: `donor_${i}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      entityId: entities[Math.floor(Math.random() * (entities.length - 1)) + 1].id,
      paymentMethods,
      isRecurring,
      recurringAmount,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      nextBillingDate,
      subscriptionStatus,
      totalDonated,
      lastDonationDate: lastDonationDate.toISOString().split('T')[0],
      startDate: startDate.toISOString().split('T')[0],
    });
  }

  return donors;
};

export const DonorPaymentManagement: React.FC = () => {
  const { selectedEntity, setAdministrationTool } = useApp();
  const [donors, setDonors] = useState<DonorPayment[]>(generateMockDonors());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all');
  const [selectedDonor, setSelectedDonor] = useState<DonorPayment | null>(null);
  const [dialogType, setDialogType] = useState<'edit' | 'payment' | 'refund' | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    isRecurring: false,
    recurringAmount: '',
    recurringFrequency: 'monthly' as 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually',
    nextBillingDate: '',
    subscriptionStatus: 'active' as 'active' | 'cancelled' | 'paused',
  });

  // Payment method form state
  const [paymentForm, setPaymentForm] = useState({
    type: 'card' as 'card' | 'bank',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    accountHolderName: '',
  });

  // Refund form state
  const [refundForm, setRefundForm] = useState({
    transactionId: '',
    amount: '',
    reason: '',
  });

  // Filter donors
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      // Entity filter
      if (selectedEntity !== 'all' && donor.entityId !== selectedEntity) {
        return false;
      }

      // Search filter
      const matchesSearch =
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'active-recurring') {
        matchesStatus = donor.subscriptionStatus === 'active';
      } else if (statusFilter === 'cancelled') {
        matchesStatus = donor.subscriptionStatus === 'cancelled';
      } else if (statusFilter === 'one-time-only') {
        matchesStatus = donor.subscriptionStatus === 'none';
      } else if (statusFilter === 'payment-failed') {
        matchesStatus = false; // Mock - would check for failed payments
      }

      return matchesSearch && matchesStatus;
    });
  }, [donors, searchQuery, statusFilter, selectedEntity]);

  // Summary stats
  const stats = useMemo(() => {
    const activeRecurring = donors.filter(d => d.subscriptionStatus === 'active').length;
    const oneTimeOnly = donors.filter(d => d.subscriptionStatus === 'none').length;
    const cancelled = donors.filter(d => d.subscriptionStatus === 'cancelled').length;
    const paymentIssues = 0; // Mock

    return { activeRecurring, oneTimeOnly, cancelled, paymentIssues, total: donors.length };
  }, [donors]);

  const openEditDialog = (donor: DonorPayment) => {
    setSelectedDonor(donor);
    setEditForm({
      isRecurring: donor.isRecurring,
      recurringAmount: donor.recurringAmount?.toString() || '',
      recurringFrequency: donor.recurringFrequency || 'monthly',
      nextBillingDate: donor.nextBillingDate || new Date().toISOString().split('T')[0],
      subscriptionStatus: donor.subscriptionStatus === 'none' ? 'active' : donor.subscriptionStatus,
    });
    setDialogType('edit');
  };

  const openPaymentDialog = (donor: DonorPayment) => {
    setSelectedDonor(donor);
    setPaymentForm({
      type: 'card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      accountHolderName: '',
    });
    setDialogType('payment');
  };

  const openRefundDialog = (donor: DonorPayment) => {
    setSelectedDonor(donor);
    setRefundForm({
      transactionId: '',
      amount: '',
      reason: '',
    });
    setDialogType('refund');
  };

  const handleSaveEdit = () => {
    if (!selectedDonor) return;

    if (editForm.isRecurring && (!editForm.recurringAmount || parseFloat(editForm.recurringAmount) <= 0)) {
      toast.error('Please enter a valid recurring amount');
      return;
    }

    // Update donor
    setDonors(prev => prev.map(d => {
      if (d.id === selectedDonor.id) {
        return {
          ...d,
          isRecurring: editForm.isRecurring,
          recurringAmount: editForm.isRecurring ? parseFloat(editForm.recurringAmount) : undefined,
          recurringFrequency: editForm.isRecurring ? editForm.recurringFrequency : undefined,
          nextBillingDate: editForm.isRecurring ? editForm.nextBillingDate : undefined,
          subscriptionStatus: editForm.isRecurring ? editForm.subscriptionStatus : 'none',
        };
      }
      return d;
    }));

    toast.success(`Donation settings updated for ${selectedDonor.name}`);
    setDialogType(null);
  };

  const handleSavePaymentMethod = () => {
    if (!selectedDonor) return;

    if (paymentForm.type === 'card') {
      if (!paymentForm.cardNumber || !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv || !paymentForm.cardholderName) {
        toast.error('Please fill in all card details');
        return;
      }
    } else {
      if (!paymentForm.accountNumber || !paymentForm.routingNumber || !paymentForm.bankName || !paymentForm.accountHolderName) {
        toast.error('Please fill in all bank account details');
        return;
      }
    }

    // In a real app, this would save to the backend
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: paymentForm.type,
      last4: paymentForm.type === 'card' 
        ? paymentForm.cardNumber.slice(-4)
        : paymentForm.accountNumber.slice(-4),
      brand: paymentForm.type === 'card' ? 'Visa' : undefined,
      bankName: paymentForm.type === 'bank' ? paymentForm.bankName : undefined,
      expiryMonth: paymentForm.type === 'card' ? paymentForm.expiryMonth : undefined,
      expiryYear: paymentForm.type === 'card' ? paymentForm.expiryYear : undefined,
      isDefault: true,
    };

    // Update donor with new payment method
    setDonors(prev => prev.map(d => {
      if (d.id === selectedDonor.id) {
        return {
          ...d,
          paymentMethods: [
            newMethod,
            ...d.paymentMethods.map(pm => ({ ...pm, isDefault: false })),
          ],
        };
      }
      return d;
    }));

    toast.success(`Payment method updated for ${selectedDonor.name}`);
    setDialogType(null);
  };

  const handleProcessRefund = () => {
    if (!selectedDonor) return;

    if (!refundForm.transactionId || !refundForm.amount || !refundForm.reason) {
      toast.error('Please fill in all refund details');
      return;
    }

    if (parseFloat(refundForm.amount) <= 0) {
      toast.error('Please enter a valid refund amount');
      return;
    }

    toast.success(`Refund of $${parseFloat(refundForm.amount).toFixed(2)} processed for ${selectedDonor.name}`);
    setDialogType(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getFrequencyLabel = (frequency?: string) => {
    switch (frequency) {
      case 'weekly': return 'Weekly';
      case 'bi-weekly': return 'Bi-weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'annually': return 'Annually';
      default: return '—';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setAdministrationTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Administration Hub
      </Button>

      {/* Header */}
      <PageHeader 
        title="Donor Payment Management"
        subtitle="Manage payment methods, subscriptions, and process refunds"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Recurring</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">
                  {stats.activeRecurring}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">One-Time Only</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">
                  {stats.oneTimeOnly}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Issues</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{stats.paymentIssues}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Donors</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search donors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Donors
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active-recurring')}>
              Active Recurring
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('one-time-only')}>
              One-Time Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
              Cancelled Subscriptions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('payment-failed')}>
              Payment Failed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Donors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donors ({filteredDonors.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead className="text-right">Total Donated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No donors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonors.map((donor) => {
                    const defaultPayment = donor.paymentMethods.find(pm => pm.isDefault);
                    const entity = entities.find(e => e.id === donor.entityId);
                    
                    return (
                      <TableRow key={donor.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{donor.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {donor.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{entity?.name || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {defaultPayment ? (
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {defaultPayment.type === 'card' 
                                  ? `${defaultPayment.brand} •••• ${defaultPayment.last4}`
                                  : `${defaultPayment.bankName} •••• ${defaultPayment.last4}`
                                }
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No payment method</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSubscriptionStatusColor(donor.subscriptionStatus)}>
                            {donor.subscriptionStatus === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {donor.subscriptionStatus === 'cancelled' && <Ban className="h-3 w-3 mr-1" />}
                            {donor.subscriptionStatus === 'active' ? 'Active' : 
                             donor.subscriptionStatus === 'cancelled' ? 'Cancelled' :
                             donor.subscriptionStatus === 'paused' ? 'Paused' : 'One-Time'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{getFrequencyLabel(donor.recurringFrequency)}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {donor.recurringAmount ? formatCurrency(donor.recurringAmount) : '—'}
                        </TableCell>
                        <TableCell>
                          {donor.nextBillingDate ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {new Date(donor.nextBillingDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(donor.totalDonated)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(donor)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Donation Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openPaymentDialog(donor)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Update Payment Method
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openRefundDialog(donor)}>
                                <DollarSign className="h-4 w-4 mr-2" />
                                Process Refund
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Edit Donation Settings Dialog */}
      <Dialog open={dialogType === 'edit'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Donation Settings</DialogTitle>
            <DialogDescription>
              Update donation settings for {selectedDonor?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Recurring Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recurring">Recurring Donations</Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Enable automatic recurring donations
                </p>
              </div>
              <Switch
                id="recurring"
                checked={editForm.isRecurring}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isRecurring: checked }))}
              />
            </div>

            {editForm.isRecurring && (
              <>
                {/* Recurring Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Recurring Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editForm.recurringAmount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, recurringAmount: e.target.value }))}
                    placeholder="100.00"
                    step="0.01"
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={editForm.recurringFrequency}
                    onValueChange={(value: any) => setEditForm(prev => ({ ...prev, recurringFrequency: value }))}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Next Billing Date */}
                <div className="space-y-2">
                  <Label htmlFor="nextBilling">Next Billing Date</Label>
                  <Input
                    id="nextBilling"
                    type="date"
                    value={editForm.nextBillingDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nextBillingDate: e.target.value }))}
                  />
                </div>

                {/* Subscription Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Subscription Status</Label>
                  <Select
                    value={editForm.subscriptionStatus}
                    onValueChange={(value: any) => setEditForm(prev => ({ ...prev, subscriptionStatus: value }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Method Dialog */}
      <Dialog open={dialogType === 'payment'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Add or update payment information for {selectedDonor?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Payment Type Selector */}
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select
                value={paymentForm.type}
                onValueChange={(value: 'card' | 'bank') => setPaymentForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="paymentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Account (ACH)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentForm.type === 'card' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardholder">Cardholder Name</Label>
                  <Input
                    id="cardholder"
                    value={paymentForm.cardholderName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Input
                      id="expiryMonth"
                      value={paymentForm.expiryMonth}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryMonth: e.target.value }))}
                      placeholder="MM"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Year</Label>
                    <Input
                      id="expiryYear"
                      value={paymentForm.expiryYear}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryYear: e.target.value }))}
                      placeholder="YYYY"
                      maxLength={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Account Holder Name</Label>
                  <Input
                    id="accountHolder"
                    value={paymentForm.accountHolderName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={paymentForm.bankName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Chase Bank"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    value={paymentForm.routingNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, routingNumber: e.target.value }))}
                    placeholder="123456789"
                    maxLength={9}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={paymentForm.accountNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="1234567890"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePaymentMethod}>
              Save Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={dialogType === 'refund'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Issue a refund for {selectedDonor?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={refundForm.transactionId}
                onChange={(e) => setRefundForm(prev => ({ ...prev, transactionId: e.target.value }))}
                placeholder="txn_1234567890"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Enter the transaction ID for the donation to refund
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundAmount">Refund Amount</Label>
              <Input
                id="refundAmount"
                type="number"
                value={refundForm.amount}
                onChange={(e) => setRefundForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="100.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Refund</Label>
              <Select
                value={refundForm.reason}
                onValueChange={(value) => setRefundForm(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duplicate">Duplicate Charge</SelectItem>
                  <SelectItem value="fraudulent">Fraudulent</SelectItem>
                  <SelectItem value="requested">Requested by Donor</SelectItem>
                  <SelectItem value="error">Processing Error</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleProcessRefund}>
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
