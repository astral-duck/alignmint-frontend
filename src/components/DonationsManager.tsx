import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getAllDonationRecords, DonationRecord, getAllDonors } from '../lib/mockData';
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
  Search,
  ArrowUpDown,
  ChevronDown,
  Plus,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  FileText,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { toast } from 'sonner@2.0.3';

type SortOption = 'date-newest' | 'date-oldest' | 'amount-high' | 'amount-low' | 'donor-asc' | 'donor-desc';
type StatusFilter = 'all' | 'completed' | 'pending' | 'failed' | 'refunded';
type TypeFilter = 'all' | 'one-time' | 'recurring' | 'event';
type AssignmentFilter = 'all' | 'assigned' | 'unassigned';

export const DonationsManager: React.FC = () => {
  const { selectedEntity, setCurrentPage, setSelectedDonor, setDonorTool } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all');
  const [addDonationOpen, setAddDonationOpen] = useState(false);
  const [assignDonorOpen, setAssignDonorOpen] = useState(false);
  const [addNewDonorOpen, setAddNewDonorOpen] = useState(false);
  const [donorSearchOpen, setDonorSearchOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);

  // Add Donation Form State
  const [newDonation, setNewDonation] = useState({
    donorName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'one-time' as const,
    method: 'credit-card' as const,
    cause: '',
    campaign: '',
    notes: '',
    receiptSent: false,
    taxDeductible: true,
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  // Assign Donor State
  const [selectedDonorForAssignment, setSelectedDonorForAssignment] = useState('');

  // Add New Donor State
  const [newDonor, setNewDonor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  const allDonations = getAllDonationRecords(selectedEntity);
  const allDonors = getAllDonors(selectedEntity);

  // Filter and sort donations
  const filteredAndSortedDonations = useMemo(() => {
    let filtered = allDonations.filter((donation) => {
      // Search filter
      const matchesSearch =
        (donation.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        donation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.cause.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || donation.type === typeFilter;

      // Assignment filter
      let matchesAssignment = true;
      if (assignmentFilter === 'assigned') {
        matchesAssignment = donation.donorName !== null;
      } else if (assignmentFilter === 'unassigned') {
        matchesAssignment = donation.donorName === null;
      }

      return matchesSearch && matchesStatus && matchesType && matchesAssignment;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        case 'donor-asc':
          return (a.donorName || 'zzz').localeCompare(b.donorName || 'zzz');
        case 'donor-desc':
          return (b.donorName || 'zzz').localeCompare(a.donorName || 'zzz');
        default:
          return 0;
      }
    });

    return filtered;
  }, [allDonations, searchQuery, sortBy, statusFilter, typeFilter, assignmentFilter]);

  const handleDonorClick = (donorName: string | null) => {
    if (donorName) {
      setSelectedDonor(donorName);
      setCurrentPage('donor-hub');
      setDonorTool('donors');
    }
  };

  const handleAddDonation = () => {
    if (!newDonation.amount || !newDonation.cause) {
      toast.error('Please fill in required fields (Amount and Cause)');
      return;
    }

    if (!newDonation.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    const entityName = entities.find(e => e.id === newDonation.entityId)?.name || 'the organization';
    toast.success(`Donation of $${parseFloat(newDonation.amount).toLocaleString()} added to ${entityName}!`);

    setNewDonation({
      donorName: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'one-time',
      method: 'credit-card',
      cause: '',
      campaign: '',
      notes: '',
      receiptSent: false,
      taxDeductible: true,
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
    setAddDonationOpen(false);
  };

  const handleAssignDonor = () => {
    if (!selectedDonorForAssignment) {
      toast.error('Please select a donor');
      return;
    }

    const donation = allDonations.find(d => d.id === selectedDonationId);
    if (donation) {
      toast.success(`Donation ${donation.id} assigned to ${selectedDonorForAssignment}`);
      setAssignDonorOpen(false);
      setSelectedDonationId(null);
      setSelectedDonorForAssignment('');
    }
  };

  const openAssignDialog = (donationId: string) => {
    setSelectedDonationId(donationId);
    setAssignDonorOpen(true);
  };

  const getStatusBadge = (status: DonationRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 gap-1">
            <XCircle className="h-3 w-3" />
            Refunded
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: DonationRecord['type']) => {
    switch (type) {
      case 'recurring':
        return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">Recurring</Badge>;
      case 'one-time':
        return <Badge variant="outline">One-Time</Badge>;
      case 'event':
        return <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950">Event</Badge>;
    }
  };

  const getMethodBadge = (method: DonationRecord['method']) => {
    const methodLabels = {
      'credit-card': 'Credit Card',
      'bank-transfer': 'Bank Transfer',
      'check': 'Check',
      'cash': 'Cash',
      'paypal': 'PayPal',
      'other': 'Other',
    };
    return <Badge variant="outline" className="text-xs">{methodLabels[method]}</Badge>;
  };

  // Calculate summary stats
  const totalAmount = filteredAndSortedDonations.reduce((sum, d) => sum + d.amount, 0);
  const completedCount = filteredAndSortedDonations.filter(d => d.status === 'completed').length;
  const unassignedCount = filteredAndSortedDonations.filter(d => d.donorName === null).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setDonorTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Donor Hub
      </Button>

      {/* Header with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-2xl">${totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unassigned</p>
                <p className="text-2xl">{unassignedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('date-newest')}>Date (Newest)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('date-oldest')}>Date (Oldest)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('amount-high')}>Amount (High to Low)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('amount-low')}>Amount (Low to High)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('donor-asc')}>Donor (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('donor-desc')}>Donor (Z-A)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('completed')}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('failed')}>Failed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('refunded')}>Refunded</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('one-time')}>One-Time</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('recurring')}>Recurring</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('event')}>Event</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Assignment</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAssignmentFilter('all')}>All Donations</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAssignmentFilter('assigned')}>Assigned</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAssignmentFilter('unassigned')}>Unassigned</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={addDonationOpen} onOpenChange={setAddDonationOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Donation</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Donation</DialogTitle>
              <DialogDescription>
                Manually add a donation that was received externally.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Donor (Optional)</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={() => setAddNewDonorOpen(true)}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Add New
                    </Button>
                  </div>
                  <Popover open={donorSearchOpen} onOpenChange={setDonorSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={donorSearchOpen}
                        className="w-full justify-between"
                      >
                        {newDonation.donorName || "Search donors..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search donors..." />
                        <CommandList>
                          <CommandEmpty>No donor found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="__none__"
                              onSelect={() => {
                                setNewDonation({ ...newDonation, donorName: '' });
                                setDonorSearchOpen(false);
                              }}
                            >
                              <span className="text-muted-foreground italic">None (Unassigned)</span>
                            </CommandItem>
                            {allDonors.map((donor) => (
                              <CommandItem
                                key={donor.id}
                                value={donor.name}
                                onSelect={(currentValue) => {
                                  setNewDonation({ ...newDonation, donorName: currentValue });
                                  setDonorSearchOpen(false);
                                }}
                              >
                                {donor.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDonation.date}
                    onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newDonation.type}
                    onValueChange={(value) => setNewDonation({ ...newDonation, type: value as any })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-Time</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select
                    value={newDonation.method}
                    onValueChange={(value) => setNewDonation({ ...newDonation, method: value as any })}
                  >
                    <SelectTrigger id="method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cause">Cause/Fund *</Label>
                  <Input
                    id="cause"
                    placeholder="General Fund"
                    value={newDonation.cause}
                    onChange={(e) => setNewDonation({ ...newDonation, cause: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign (Optional)</Label>
                <Input
                  id="campaign"
                  placeholder="e.g., Annual Appeal 2025"
                  value={newDonation.campaign}
                  onChange={(e) => setNewDonation({ ...newDonation, campaign: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nonprofit">Nonprofit Organization *</Label>
                <Select
                  value={newDonation.entityId}
                  onValueChange={(value) => setNewDonation({ ...newDonation, entityId: value })}
                >
                  <SelectTrigger id="nonprofit">
                    <SelectValue placeholder="Select a nonprofit..." />
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional information about this donation..."
                  value={newDonation.notes}
                  onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="taxDeductible"
                  checked={newDonation.taxDeductible}
                  onCheckedChange={(checked) =>
                    setNewDonation({ ...newDonation, taxDeductible: checked as boolean })
                  }
                />
                <Label htmlFor="taxDeductible" className="text-sm font-normal">
                  Tax deductible
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receiptSent"
                  checked={newDonation.receiptSent}
                  onCheckedChange={(checked) =>
                    setNewDonation({ ...newDonation, receiptSent: checked as boolean })
                  }
                />
                <Label htmlFor="receiptSent" className="text-sm font-normal">
                  Receipt sent to donor
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDonationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDonation}>Add Donation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add New Donor Dialog */}
        <Dialog open={addNewDonorOpen} onOpenChange={setAddNewDonorOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Donor</DialogTitle>
              <DialogDescription>
                Enter the donor's information to add them to your CRM.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-donor-name">Full Name *</Label>
                <Input
                  id="new-donor-name"
                  placeholder="John Doe"
                  value={newDonor.name}
                  onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-donor-email">Email *</Label>
                <Input
                  id="new-donor-email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={newDonor.email}
                  onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-donor-phone">Phone Number</Label>
                <Input
                  id="new-donor-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={newDonor.phone}
                  onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-donor-address">Address</Label>
                <Input
                  id="new-donor-address"
                  placeholder="123 Main St, City, State ZIP"
                  value={newDonor.address}
                  onChange={(e) => setNewDonor({ ...newDonor, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewDonor({ name: '', email: '', phone: '', address: '', entityId: selectedEntity === 'all' ? '' : selectedEntity });
                  setAddNewDonorOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                if (!newDonor.name || !newDonor.email) {
                  toast.error('Please fill in required fields (Name and Email)');
                  return;
                }
                const entityName = entities.find(e => e.id === (selectedEntity === 'all' ? newDonation.entityId : selectedEntity))?.name || 'the organization';
                toast.success(`Donor ${newDonor.name} added to ${entityName}!`);
                setNewDonation({ ...newDonation, donorName: newDonor.name });
                setNewDonor({ name: '', email: '', phone: '', address: '', entityId: selectedEntity === 'all' ? '' : selectedEntity });
                setAddNewDonorOpen(false);
              }}>
                Add Donor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedDonations.length} of {allDonations.length} donations
        </p>
        {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || assignmentFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setTypeFilter('all');
              setAssignmentFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Donations Table - Desktop */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">ID</TableHead>
                  <TableHead className="min-w-[150px]">Donor</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[100px]">Date</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[90px]">Type</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[120px]">Method</TableHead>
                  <TableHead className="hidden xl:table-cell min-w-[120px]">Cause</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500 text-sm">
                      No donations found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedDonations.map((donation) => (
                    <TableRow key={donation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-mono text-xs">{donation.id}</TableCell>
                      <TableCell>
                        {donation.donorName ? (
                          <button
                            onClick={() => handleDonorClick(donation.donorName)}
                            className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[150px] block"
                          >
                            {donation.donorName}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unassigned
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">
                        ${donation.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{donation.date}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getTypeBadge(donation.type)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getMethodBadge(donation.method)}</TableCell>
                      <TableCell className="hidden xl:table-cell truncate max-w-[120px]">
                        {donation.cause}
                      </TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell>
                        {!donation.donorName && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAssignDialog(donation.id)}
                            className="gap-1 min-h-[44px]"
                          >
                            <UserPlus className="h-4 w-4" />
                            <span className="hidden lg:inline">Assign</span>
                          </Button>
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

      {/* Donations List - Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredAndSortedDonations.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No donations found matching your criteria.
          </Card>
        ) : (
          filteredAndSortedDonations.map((donation) => (
            <Card key={donation.id} className="p-4 touch-manipulation">
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    {donation.donorName ? (
                      <button
                        onClick={() => handleDonorClick(donation.donorName)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium truncate block"
                      >
                        {donation.donorName}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Unassigned
                        </Badge>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: {donation.id}
                    </div>
                  </div>
                  {getStatusBadge(donation.status)}
                </div>

                {/* Amount and Date */}
                <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-2xl font-semibold">
                      ${donation.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {donation.date}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {getTypeBadge(donation.type)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Cause</div>
                    <div className="font-medium truncate">{donation.cause}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Method</div>
                    <div>{getMethodBadge(donation.method)}</div>
                  </div>
                </div>

                {/* Action Button */}
                {!donation.donorName && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAssignDialog(donation.id)}
                    className="w-full gap-2 min-h-[44px] mt-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign Donor
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Assign Donor Dialog */}
      <Dialog open={assignDonorOpen} onOpenChange={setAssignDonorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Donor</DialogTitle>
            <DialogDescription>
              Select a donor to assign to donation {selectedDonationId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assignDonor">Select Donor</Label>
              <Select
                value={selectedDonorForAssignment}
                onValueChange={setSelectedDonorForAssignment}
              >
                <SelectTrigger id="assignDonor">
                  <SelectValue placeholder="Choose a donor..." />
                </SelectTrigger>
                <SelectContent>
                  {allDonors.map((donor) => (
                    <SelectItem key={donor.id} value={donor.name}>
                      {donor.name} - {donor.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't see the donor? Add them from the Donors page first.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDonorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignDonor}>Assign Donor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
