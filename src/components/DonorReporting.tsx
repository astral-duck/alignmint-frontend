import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getAllDonors, DonorProfile } from '../lib/mockData';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
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
  Search,
  ArrowLeft,
  FileText,
  Send,
  CheckCircle2,
  Users,
  DollarSign,
  Calendar,
  Eye,
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
import { toast } from 'sonner@2.0.3';
import { PageHeader } from './PageHeader';
import { Download } from 'lucide-react';
import { DesktopOnlyWarning } from './DesktopOnlyWarning';

interface DonorWithSelection extends DonorProfile {
  selected: boolean;
  ytdTotal: number;
}

export const DonorReporting: React.FC = () => {
  const { setAdministrationTool } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonors, setSelectedDonors] = useState<Set<string>>(new Set());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [previewDonor, setPreviewDonor] = useState<DonorWithSelection | null>(null);
  const [reportYear, setReportYear] = useState<string>(new Date().getFullYear().toString());

  // Get all donors across all entities for fiscal sponsor view
  const allDonors = useMemo(() => {
    const donors = getAllDonors('all');
    const currentYear = parseInt(reportYear);
    return donors.map(donor => {
      const ytdTotal = donor.donationHistory
        .filter(d => {
          const donationYear = new Date(d.date).getFullYear();
          return donationYear === currentYear && d.type !== 'refund';
        })
        .reduce((sum, d) => sum + d.amount, 0);
      
      return {
        ...donor,
        selected: selectedDonors.has(donor.id),
        ytdTotal,
      };
    });
  }, [reportYear, selectedDonors]);

  // Filter donors by search and YTD donations, sort by name
  const filteredAndSortedDonors = useMemo(() => {
    let filtered = allDonors.filter((donor) => {
      const matchesSearch =
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchQuery.toLowerCase());
      const hasYTDDonations = donor.ytdTotal > 0;
      return matchesSearch && hasYTDDonations;
    });

    // Sort by name A-Z
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [allDonors, searchQuery]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedDonors.size === filteredAndSortedDonors.length) {
      setSelectedDonors(new Set());
    } else {
      setSelectedDonors(new Set(filteredAndSortedDonors.map(d => d.id)));
    }
  };

  const handleSelectDonor = (donorId: string) => {
    const newSelected = new Set(selectedDonors);
    if (newSelected.has(donorId)) {
      newSelected.delete(donorId);
    } else {
      newSelected.add(donorId);
    }
    setSelectedDonors(newSelected);
  };

  const handlePreviewReport = (donor: DonorWithSelection) => {
    setPreviewDonor(donor);
    setPreviewOpen(true);
  };

  const handleSendReports = () => {
    if (selectedDonors.size === 0) {
      toast.error('Please select at least one donor to send reports to');
      return;
    }
    setSendConfirmOpen(true);
  };

  const confirmSendReports = () => {
    const count = selectedDonors.size;
    toast.success(`End of Year reports queued for ${count} donor${count > 1 ? 's' : ''}!`);
    setSendConfirmOpen(false);
    setSelectedDonors(new Set());
  };

  const handleExportPDF = () => {
    toast.success('Donor list exported to PDF');
  };

  // Get nonprofit name
  const getNonprofitName = (entityId: string) => {
    return entities.find(e => e.id === entityId)?.name || entityId;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const selected = filteredAndSortedDonors.filter(d => selectedDonors.has(d.id));
    return {
      totalDonors: filteredAndSortedDonors.length,
      selectedCount: selectedDonors.size,
      totalYTD: filteredAndSortedDonors.reduce((sum, d) => sum + d.ytdTotal, 0),
      selectedYTD: selected.reduce((sum, d) => sum + d.ytdTotal, 0),
    };
  }, [filteredAndSortedDonors, selectedDonors]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Desktop-Only Warning for Mobile */}
      <DesktopOnlyWarning 
        toolName="Donor Reporting"
        description="The Donor Reporting tool requires a desktop computer for managing donor selections, previewing reports, and batch email operations. Please access this feature from a larger screen."
        onBack={() => setAdministrationTool(null)}
      />

      {/* Desktop Content */}
      <div className="hidden md:block space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setAdministrationTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Administration Hub
      </Button>

      {/* Page Header */}
      <PageHeader 
        title="Donor Reporting"
        subtitle="Generate and send end-of-year tax reports to donors"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-950 rounded-lg flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Donors</p>
                <p className="text-sm sm:text-xl">{stats.totalDonors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-950 rounded-lg flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Selected</p>
                <p className="text-sm sm:text-xl">{stats.selectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-950 rounded-lg flex-shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{reportYear} Total</p>
                <p className="text-sm sm:text-xl truncate">${stats.totalYTD.toLocaleString()}</p>
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
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Report Year</p>
                <p className="text-sm sm:text-xl">{reportYear}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Year Selector */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search donors by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={reportYear} onValueChange={setReportYear}>
          <SelectTrigger className="w-[120px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedDonors.size === filteredAndSortedDonors.length && filteredAndSortedDonors.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="select-all" className="text-sm cursor-pointer">
            Select All ({filteredAndSortedDonors.length})
          </Label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            onClick={handleSendReports} 
            disabled={selectedDonors.size === 0}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send Reports ({selectedDonors.size})
          </Button>
        </div>
      </div>

      {/* Donors Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="min-w-[180px]">Donor</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[180px]">Nonprofit</TableHead>
                  <TableHead className="min-w-[120px]">{reportYear} Total</TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[100px]">Donations</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDonors.map((donor) => (
                  <TableRow key={donor.id} className={selectedDonors.has(donor.id) ? 'bg-blue-50 dark:bg-blue-950/20' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDonors.has(donor.id)}
                        onCheckedChange={() => handleSelectDonor(donor.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {donor.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {getNonprofitName(donor.entityId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        ${donor.ytdTotal.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {donor.donationHistory.filter(d => 
                        new Date(d.date).getFullYear() === parseInt(reportYear) && d.type !== 'refund'
                      ).length}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline" className="capitalize text-xs">
                        {donor.donationType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewReport(donor)}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden lg:inline">Preview</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndSortedDonors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No donors found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Preview Report Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              End of Year Donation Report
            </DialogTitle>
            <DialogDescription>
              Preview of the tax receipt that will be sent to {previewDonor?.name}
            </DialogDescription>
          </DialogHeader>
          
          {previewDonor && (
            <div className="space-y-6 py-4">
              {/* Report Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-semibold">InFocus Ministries</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  123 Main Street, Seattle, WA 98101
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  EIN: 12-3456789
                </p>
              </div>

              {/* Donor Info */}
              <div className="space-y-2">
                <h3 className="font-medium">Donor Information</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-1">
                  <p><strong>{previewDonor.name}</strong></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{previewDonor.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{previewDonor.email}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h3 className="font-medium">{reportYear} Donation Summary</h3>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Tax-Deductible Contributions:</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${previewDonor.ytdTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div className="space-y-2">
                <h3 className="font-medium">Donation Details</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Purpose</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewDonor.donationHistory
                        .filter(d => new Date(d.date).getFullYear() === parseInt(reportYear) && d.type !== 'refund')
                        .map((donation, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{donation.date}</TableCell>
                            <TableCell>${donation.amount.toLocaleString()}</TableCell>
                            <TableCell>{donation.purpose}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-4">
                <p>
                  This letter serves as your official receipt for tax purposes. No goods or services were 
                  provided in exchange for these contributions. Please retain this document for your tax records.
                </p>
                <p className="mt-2">
                  InFocus Ministries is a 501(c)(3) tax-exempt organization. Contributions are tax-deductible 
                  to the extent allowed by law.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast.success(`Report sent to ${previewDonor?.email}`);
              setPreviewOpen(false);
            }} className="gap-2">
              <Send className="h-4 w-4" />
              Send to Donor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Dialog */}
      <Dialog open={sendConfirmOpen} onOpenChange={setSendConfirmOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send End of Year Reports</DialogTitle>
            <DialogDescription>
              You are about to send {reportYear} donation reports to {selectedDonors.size} donor{selectedDonors.size > 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Recipients:</span>
                <span className="font-medium">{selectedDonors.size} donors</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Report Year:</span>
                <span className="font-medium">{reportYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Donations:</span>
                <span className="font-medium">${stats.selectedYTD.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Each donor will receive a personalized email with their 
                individual donation summary and tax receipt attached as a PDF.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSendConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSendReports} className="gap-2">
              <Mail className="h-4 w-4" />
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};
