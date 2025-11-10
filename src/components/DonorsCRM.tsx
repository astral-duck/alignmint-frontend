import React, { useState, useMemo, useEffect } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getDonorProfile, getAllDonors, DonorProfile } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Gift,
  Heart,
  ArrowLeft,
  Edit,
  MessageSquare,
  Search,
  Filter,
  UserPlus,
  ArrowUpDown,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
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
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { PageHeader } from './PageHeader';

type SortOption = 'name-asc' | 'name-desc' | 'amount-high' | 'amount-low' | 'date-newest' | 'date-oldest';
type DonationTypeFilter = 'all' | 'one-time' | 'recurring' | 'both' | 'event-attended';

export const DonorsCRM: React.FC = () => {
  const { selectedEntity, selectedDonor, setSelectedDonor, setDonorTool, administrationTool, setAdministrationTool } = useApp();
  const [view, setView] = useState<'list' | 'profile'>(selectedDonor ? 'profile' : 'list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [donationTypeFilter, setDonationTypeFilter] = useState<DonationTypeFilter>('all');
  const [addDonorOpen, setAddDonorOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedDonationForRefund, setSelectedDonationForRefund] = useState<number | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundedDonations, setRefundedDonations] = useState<Set<number>>(new Set());
  const [additionalRefunds, setAdditionalRefunds] = useState<Array<{
    date: string;
    amount: number;
    type: string;
    cause: string;
    method: string;
  }>>([]);
  
  // Add Donor Form State
  const [newDonor, setNewDonor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  const allDonors = getAllDonors(selectedEntity);
  const baseDonorProfile = selectedDonor ? getDonorProfile(selectedDonor, selectedEntity) : null;
  
  // Merge additional refunds with the donor profile
  const donorProfile = baseDonorProfile ? {
    ...baseDonorProfile,
    donationHistory: [...baseDonorProfile.donationHistory, ...additionalRefunds].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
  } : null;

  // Sync view when selectedDonor changes from external source (e.g., donations table)
  useEffect(() => {
    if (selectedDonor) {
      setView('profile');
    }
    // Reset refund state when switching donors
    setRefundedDonations(new Set());
    setAdditionalRefunds([]);
  }, [selectedDonor]);

  // Filter and sort donors
  const filteredAndSortedDonors = useMemo(() => {
    let filtered = allDonors.filter((donor) => {
      // Search filter
      const matchesSearch =
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Donation type filter
      let matchesDonationType = true;
      if (donationTypeFilter === 'event-attended') {
        matchesDonationType = donor.donationHistory.some(d => d.type === 'event');
      } else if (donationTypeFilter !== 'all') {
        matchesDonationType = donor.donationType === donationTypeFilter;
      }
      
      return matchesSearch && matchesDonationType;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'amount-high':
          return b.totalLifetimeDonations - a.totalLifetimeDonations;
        case 'amount-low':
          return a.totalLifetimeDonations - b.totalLifetimeDonations;
        case 'date-newest':
          return new Date(b.lastDonation).getTime() - new Date(a.lastDonation).getTime();
        case 'date-oldest':
          return new Date(a.lastDonation).getTime() - new Date(b.lastDonation).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [allDonors, searchQuery, sortBy, donationTypeFilter]);

  const handleDonorClick = (donorName: string) => {
    setSelectedDonor(donorName);
    setView('profile');
  };

  const handleBackToList = () => {
    setSelectedDonor(null);
    setView('list');
  };

  const handleRefundClick = (donationIndex: number) => {
    setSelectedDonationForRefund(donationIndex);
    setRefundDialogOpen(true);
  };

  const handleRefundDonation = () => {
    if (selectedDonationForRefund === null || !donorProfile) return;

    const donation = donorProfile.donationHistory[selectedDonationForRefund];
    
    // Mark this donation as refunded
    setRefundedDonations(prev => new Set(prev).add(selectedDonationForRefund));
    
    // Create a new refund transaction
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const refundTransaction = {
      date: formattedDate,
      amount: donation.amount,
      type: 'refund',
      cause: refundReason || `Refund: ${donation.cause}`,
      method: donation.method,
    };
    
    // Add the refund transaction to the list
    setAdditionalRefunds(prev => [...prev, refundTransaction]);
    
    // In a real app, this would make an API call to process the refund
    toast.success(`Refund of $${donation.amount.toLocaleString()} processed successfully!`);
    
    // Reset and close dialog
    setRefundDialogOpen(false);
    setSelectedDonationForRefund(null);
    setRefundReason('');
  };

  const handleAddDonor = () => {
    // Validate form
    if (!newDonor.name || !newDonor.email) {
      toast.error('Please fill in required fields (Name and Email)');
      return;
    }

    if (!newDonor.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    // In a real app, this would make an API call
    const entityName = entities.find(e => e.id === newDonor.entityId)?.name || 'the organization';
    toast.success(`Donor ${newDonor.name} added to ${entityName}!`);
    
    // Reset form and close dialog
    setNewDonor({ 
      name: '', 
      email: '', 
      phone: '', 
      address: '',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
    setAddDonorOpen(false);
  };

  if (view === 'profile' && donorProfile) {
    const initials = donorProfile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToList} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Donors</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start gap-3 sm:gap-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarFallback className="text-xl sm:text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-xl sm:text-2xl mb-2">{donorProfile.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {donorProfile.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{donorProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{donorProfile.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{donorProfile.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col gap-2 w-full md:w-auto">
                <Button className="gap-2 flex-1 md:flex-initial">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </Button>
                <Button variant="outline" className="gap-2 flex-1 md:flex-initial">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Note</span>
                </Button>
                <Button variant="outline" className="gap-2 flex-1 md:flex-initial">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-950 rounded-lg flex-shrink-0">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lifetime</p>
                  <p className="text-sm sm:text-xl truncate">
                    ${donorProfile.totalLifetimeDonations.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-950 rounded-lg flex-shrink-0">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Donations</p>
                  <p className="text-sm sm:text-xl">{donorProfile.donationCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-950 rounded-lg flex-shrink-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Last Contact</p>
                  <p className="text-sm sm:text-xl truncate">{donorProfile.lastContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Donation History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Notes & Activity</span>
              <span className="sm:hidden">Notes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Donation History</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[90px]">Amount</TableHead>
                        <TableHead className="hidden sm:table-cell min-w-[80px]">Type</TableHead>
                        <TableHead className="hidden md:table-cell min-w-[120px]">Purpose</TableHead>
                        <TableHead className="hidden lg:table-cell min-w-[100px]">Method</TableHead>
                        <TableHead className="min-w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donorProfile.donationHistory.map((donation, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">{donation.date}</TableCell>
                          <TableCell className="font-medium whitespace-nowrap">
                            {donation.type === 'refund' ? (
                              <span className="text-red-600 dark:text-red-400">
                                -${donation.amount.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-green-600 dark:text-green-400">
                                ${donation.amount.toLocaleString()}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge 
                              variant="outline" 
                              className={`capitalize text-xs ${
                                donation.type === 'refund' 
                                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' 
                                  : ''
                              }`}
                            >
                              {donation.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{donation.purpose}</TableCell>
                          <TableCell className="hidden lg:table-cell">{donation.method}</TableCell>
                          <TableCell>
                            {donation.type !== 'refund' && !refundedDonations.has(index) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRefundClick(index)}
                                className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950"
                              >
                                <RotateCcw className="h-3 w-3" />
                                <span className="hidden lg:inline">Refund</span>
                              </Button>
                            )}
                            {refundedDonations.has(index) && (
                              <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
                                Refunded
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Donor Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Donor Type
                    </p>
                    <p className="capitalize">{donorProfile.donationType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      First Donation
                    </p>
                    <p>{donorProfile.firstDonation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Last Donation
                    </p>
                    <p>{donorProfile.lastDonation}</p>
                  </div>
                  {donorProfile.recurringAmount && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Recurring Amount
                        </p>
                        <p>${donorProfile.recurringAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Frequency
                        </p>
                        <p className="capitalize">
                          {donorProfile.recurringFrequency}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Average Gift
                    </p>
                    <p>
                      $
                      {(
                        donorProfile.totalLifetimeDonations /
                        donorProfile.donationCount
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {donorProfile.notes}
                </p>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  Add New Note
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Refund Dialog */}
        <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Refund Donation</DialogTitle>
              <DialogDescription>
                {selectedDonationForRefund !== null && donorProfile && (
                  <>
                    Process a refund for the donation of ${donorProfile.donationHistory[selectedDonationForRefund].amount.toLocaleString()} made on {donorProfile.donationHistory[selectedDonationForRefund].date}.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {selectedDonationForRefund !== null && donorProfile && (
              <div className="space-y-4 py-4">
                {/* Donation Details */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-medium">
                      ${donorProfile.donationHistory[selectedDonationForRefund].amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="font-medium">
                      {donorProfile.donationHistory[selectedDonationForRefund].date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cause:</span>
                    <span className="font-medium">
                      {donorProfile.donationHistory[selectedDonationForRefund].cause}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                    <span className="font-medium">
                      {donorProfile.donationHistory[selectedDonationForRefund].method}
                    </span>
                  </div>
                </div>

                {/* Refund Reason */}
                <div className="space-y-2">
                  <Label htmlFor="refund-reason">Reason for Refund (Optional)</Label>
                  <textarea
                    id="refund-reason"
                    className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter reason for refund..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                  />
                </div>

                {/* Warning Message */}
                <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>Warning:</strong> This action will process a refund and add a debit entry to the donor's history. This cannot be undone.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRefundDialogOpen(false);
                  setSelectedDonationForRefund(null);
                  setRefundReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRefundDonation}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Process Refund
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => {
          if (administrationTool === 'donor-management') {
            setAdministrationTool(null);
          } else {
            setDonorTool(null);
          }
        }}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {administrationTool === 'donor-management' ? 'Back to Administration Hub' : 'Back to Donor Hub'}
      </Button>

      {/* Page Header */}
      <PageHeader 
        title="Donors"
        subtitle="Manage donor relationships and track giving history"
      />

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

        {/* Sort Dropdown */}
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
            <DropdownMenuItem onClick={() => setSortBy('name-asc')}>
              Name (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name-desc')}>
              Name (Z-A)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('amount-high')}>
              Donation Amount (High to Low)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('amount-low')}>
              Donation Amount (Low to High)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('date-newest')}>
              Last Donation (Newest)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('date-oldest')}>
              Last Donation (Oldest)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
            <DropdownMenuLabel>Donation Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDonationTypeFilter('all')}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDonationTypeFilter('one-time')}>
              One-Time Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDonationTypeFilter('recurring')}>
              Recurring Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDonationTypeFilter('both')}>
              Both (One-Time & Recurring)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDonationTypeFilter('event-attended')}>
              Event Attendees
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Donor Dialog */}
        <Dialog open={addDonorOpen} onOpenChange={setAddDonorOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Donor</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Donor</DialogTitle>
              <DialogDescription>
                Enter the donor's information to add them to your CRM.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newDonor.name}
                  onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={newDonor.email}
                  onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={newDonor.phone}
                  onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State ZIP"
                  value={newDonor.address}
                  onChange={(e) => setNewDonor({ ...newDonor, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nonprofit">Nonprofit Organization *</Label>
                <Select
                  value={newDonor.entityId}
                  onValueChange={(value) => setNewDonor({ ...newDonor, entityId: value })}
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDonorOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDonor}>Add Donor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedDonors.length} of {allDonors.length} donors
        </p>
        {(searchQuery || donationTypeFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setDonationTypeFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Donors Table - Desktop */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[180px]">Email</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[120px]">Phone</TableHead>
                  <TableHead className="min-w-[100px]">Lifetime</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[80px]"># Gifts</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[100px]">Last Gift</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[90px]">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDonors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                      No donors found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedDonors.map((donor) => (
                    <TableRow
                      key={donor.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleDonorClick(donor.name)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                              {donor.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate font-medium">{donor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[180px]">{donor.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{donor.phone}</TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        ${donor.totalLifetimeDonations.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{donor.donationCount}</TableCell>
                      <TableCell className="hidden md:table-cell">{donor.lastDonation}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="capitalize">
                          {donor.donationType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Donors List - Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredAndSortedDonors.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No donors found matching your criteria.
          </Card>
        ) : (
          filteredAndSortedDonors.map((donor) => (
            <Card
              key={donor.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow touch-manipulation"
              onClick={() => handleDonorClick(donor.name)}
            >
              <div className="space-y-3">
                {/* Header with Avatar and Name */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="text-base">
                      {donor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate">{donor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {donor.email}
                    </p>
                    <Badge variant="outline" className="capitalize mt-1">
                      {donor.donationType}
                    </Badge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Lifetime Giving</div>
                    <div className="text-xl font-semibold">
                      ${donor.totalLifetimeDonations.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Gifts</div>
                    <div className="text-xl font-semibold">{donor.donationCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last Gift</div>
                    <div className="text-sm">{donor.lastDonation}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
