import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { getDonorProfile } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Download,
  FileText,
  DollarSign,
  Calendar,
  Heart,
  TrendingUp,
  ArrowLeft,
  LogOut,
  CreditCard,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

// Mock donor authentication - in real app, this would be handled by auth system
// Using Sarah Johnson as our logged-in donor example
const MOCK_DONOR_EMAIL = 'sarah.johnson@email.com';
const MOCK_DONOR_NAME = 'Sarah Johnson';

export const DonorPortal: React.FC = () => {
  const { selectedEntity, setDonorTool } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // In real app, check actual auth
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get donor profile data
  const donorProfile = getDonorProfile(MOCK_DONOR_NAME, selectedEntity);

  if (!donorProfile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setDonorTool(null)}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Donor Hub
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Donor profile not found. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const generateContributionStatement = () => {
    // Group donations by purpose/fund
    const fundTotals: { [key: string]: { amount: number; ntdAmount: number } } = {};
    
    yearDonations.forEach(donation => {
      const fund = donation.cause;
      if (!fundTotals[fund]) {
        fundTotals[fund] = { amount: 0, ntdAmount: 0 };
      }
      fundTotals[fund].amount += donation.amount;
      fundTotals[fund].ntdAmount += donation.amount; // Assuming all donations are NTD (non-tax-deductible would be 0)
    });

    const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const periodStart = `01/01/${selectedYear}`;
    const periodEnd = `12/31/${selectedYear}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contribution Statement - ${donorProfile.name}</title>
  <style>
    @page {
      margin: 0.5in;
      size: letter;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      background: white;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    
    .org-info {
      font-size: 9pt;
      line-height: 1.5;
    }
    
    .org-name {
      font-size: 14pt;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 5px;
    }
    
    .logo {
      text-align: right;
      font-size: 24pt;
      font-weight: bold;
      color: #2563eb;
    }
    
    .donor-info {
      margin-bottom: 30px;
      font-size: 10pt;
      line-height: 1.6;
    }
    
    .statement-header {
      text-align: right;
      margin-bottom: 30px;
    }
    
    .statement-title {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .statement-date {
      font-size: 9pt;
      color: #666;
    }
    
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      margin: 25px 0 10px 0;
      padding-bottom: 5px;
      border-bottom: 2px solid #000;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 9pt;
    }
    
    th {
      background-color: #f3f4f6;
      padding: 8px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #d1d5db;
    }
    
    th.right, td.right {
      text-align: right;
    }
    
    td {
      padding: 6px 8px;
      border: 1px solid #d1d5db;
    }
    
    tr.total {
      font-weight: bold;
      background-color: #f9fafb;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      font-size: 8pt;
      color: #666;
      line-height: 1.5;
    }
    
    .footer-note {
      margin-bottom: 10px;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="org-info">
      <div class="org-name">InFocus Ministries</div>
      1500 E College Way #556<br>
      Mount Vernon, WA 98273<br>
      US
    </div>
    <div class="logo">
      InFocus<br>MINISTRIES
    </div>
  </div>
  
  <div class="donor-info">
    ${donorProfile.name}<br>
    ${donorProfile.email || ''}<br>
    ${donorProfile.address || 'Address on file'}
  </div>
  
  <div class="statement-header">
    <div class="statement-title">Contribution Statement</div>
    <div class="statement-date">As of: ${currentDate}</div>
    <div class="statement-date">Period: ${periodStart} - ${periodEnd}</div>
  </div>
  
  <div class="section-title">Total Contributions by Purpose/Fund</div>
  <table>
    <thead>
      <tr>
        <th>Purpose/Fund</th>
        <th class="right">Amount</th>
        <th class="right">NTD Amount</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(fundTotals).map(([fund, totals]) => `
        <tr>
          <td>${fund}</td>
          <td class="right">${totals.amount.toFixed(2)}</td>
          <td class="right">${totals.ntdAmount.toFixed(2)}</td>
          <td class="right">${totals.amount.toFixed(2)}</td>
        </tr>
      `).join('')}
      <tr class="total">
        <td>Total</td>
        <td class="right">${yearTotal.toFixed(2)}</td>
        <td class="right">${yearTotal.toFixed(2)}</td>
        <td class="right">${yearTotal.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
  
  <div class="section-title">List of Individual Contributions</div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Ref ID</th>
        <th>Purpose/Fund</th>
        <th class="right">Amount</th>
        <th class="right">NTD Amount</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${yearDonations
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((donation, index) => {
          const refId = `${donation.method.substring(0, 3).toUpperCase()}${String(index + 1).padStart(4, '0')}`;
          return `
        <tr>
          <td>${donation.date}</td>
          <td>${refId}</td>
          <td>${donation.cause}</td>
          <td class="right">${donation.amount.toFixed(2)}</td>
          <td class="right">${donation.amount.toFixed(2)}</td>
          <td class="right">${donation.amount.toFixed(2)}</td>
        </tr>
      `;
        }).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <div class="footer-note">
      <strong>Unless otherwise noted, no goods or services were received in return for these contributions.</strong>
    </div>
    <div>InFocus Ministries Tax ID: 45-1998567</div>
  </div>
  
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
    `;

    return html;
  };

  const handleGenerateTaxReport = () => {
    toast.success(`Generating ${selectedYear} tax report...`);
    
    setTimeout(() => {
      const reportHTML = generateContributionStatement();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        toast.success('Tax report opened! Use your browser\'s print dialog to save as PDF.');
      } else {
        toast.error('Please allow popups to download the tax report.');
      }
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    setDonorTool(null);
  };

  // Calculate year-to-date total for selected year
  const yearDonations = donorProfile.donationHistory.filter(d => {
    const donationYear = new Date(d.date).getFullYear();
    return donationYear === selectedYear;
  });

  const yearTotal = yearDonations.reduce((sum, d) => {
    return sum + d.amount;
  }, 0);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'recurring':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">Recurring</Badge>;
      case 'one-time':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">One-Time</Badge>;
      case 'event':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">Event</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const availableYears = Array.from(
    new Set(donorProfile.donationHistory.map(d => new Date(d.date).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => setDonorTool(null)}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Donor Hub
        </Button>

        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Welcome Section */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-blue-600 text-white">
                {donorProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-gray-900 dark:text-gray-100 mb-1">
                Welcome back, {donorProfile.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Thank you for your continued support. View your donation history and download tax reports below.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Donor since {donorProfile.firstDonation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {donorProfile.donationCount} total donations
                  </span>
                </div>
                {donorProfile.donationType === 'recurring' && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Monthly Sustainer
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-base flex items-center justify-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              Lifetime Total
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl">
              ${donorProfile.totalLifetimeDonations.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-base flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl">{donorProfile.donationCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Since {donorProfile.firstDonation}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-base flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Last Donation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {donorProfile.lastDonation}
            </p>
            {donorProfile.donationType === 'recurring' && donorProfile.recurringAmount && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ${donorProfile.recurringAmount}/{donorProfile.recurringFrequency}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-base flex items-center justify-center gap-2">
              <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              {selectedYear} Total
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl">
              ${yearTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {yearDonations.length} donation{yearDonations.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tax Report Section */}
      <Card>
        <CardHeader>
          <CardTitle>End of Year Tax Report</CardTitle>
          <CardDescription>
            Download your official donation receipt for tax purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-2">Select Year</label>
              <select
                className="w-full sm:w-48 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleGenerateTaxReport} className="gap-2 mt-6 sm:mt-0">
              <Download className="h-4 w-4" />
              Download {selectedYear} Tax Report
            </Button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Note:</strong> This report includes all tax-deductible donations made in {selectedYear}. 
              Please consult with a tax professional for specific tax advice.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>
            Complete record of all your donations (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Cause</th>
                  <th className="text-left py-3 px-4">Method</th>
                </tr>
              </thead>
              <tbody>
                {donorProfile.donationHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((donation, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">{donation.date}</td>
                      <td className="py-3 px-4">${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4">{getTypeBadge(donation.type)}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{donation.cause}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{donation.method}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {donorProfile.donationHistory
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((donation, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-lg">
                          ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{donation.date}</div>
                      </div>
                      {getTypeBadge(donation.type)}
                    </div>
                    <Separator />
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Cause: </span>
                      <span>{donation.cause}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Method: </span>
                      <span>{donation.method}</span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {donorProfile.donationHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No donation history available.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thank You Message */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-gray-900 dark:text-gray-100 mb-2">
            Thank You for Your Generosity
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your donations make a real difference in the lives we serve. Every contribution helps us continue 
            our mission and expand our impact in the community. We are deeply grateful for your support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
