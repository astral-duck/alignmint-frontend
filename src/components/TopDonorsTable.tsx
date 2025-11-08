import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useApp } from '../contexts/AppContext';
import { getTopDonors } from '../lib/mockData';
import { ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const TopDonorsTable: React.FC = () => {
  const { selectedEntity, setCurrentPage, setSelectedDonor, setDonorTool } = useApp();
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>('one-time');
  const [sortBy, setSortBy] = useState<'amount' | 'count'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const data = getTopDonors(selectedEntity, donationType);

  const handleSort = (key: 'amount' | 'count') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = sortBy === 'amount' ? a.totalAmount : a.donationCount;
    const bValue = sortBy === 'amount' ? b.totalAmount : b.donationCount;
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRowClick = (donorName: string) => {
    setSelectedDonor(donorName);
    setCurrentPage('donor-hub');
    setDonorTool('donors');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Top Donors</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View top contributors by donation amount
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Sort By Dropdown */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'amount' | 'count')}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">By Amount</SelectItem>
                <SelectItem value="count">By Count</SelectItem>
              </SelectContent>
            </Select>

            {/* Donation Type Toggle */}
            <ToggleGroup 
              type="single" 
              value={donationType} 
              onValueChange={(v) => v && setDonationType(v as 'one-time' | 'recurring')}
              className="border rounded-lg p-1"
            >
              <ToggleGroupItem value="one-time" className="px-3 py-2 text-sm">
                One-Time
              </ToggleGroupItem>
              <ToggleGroupItem value="recurring" className="px-3 py-2 text-sm">
                Recurring
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Donor Name</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('amount')} className="h-8 px-2">
                    Total Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('count')} className="h-8 px-2">
                    # Donations
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Last Donation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((donor, index) => (
                <TableRow 
                  key={donor.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleRowClick(donor.name)}
                >
                  <TableCell>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>{donor.name}</TableCell>
                  <TableCell>
                    ${donor.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{donor.donationCount}</TableCell>
                  <TableCell>{donor.lastDonation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {sortedData.map((donor, index) => (
            <Card
              key={donor.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow touch-manipulation"
              onClick={() => handleRowClick(donor.name)}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-lg truncate">{donor.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last: {donor.lastDonation}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Amount</div>
                    <div className="font-medium text-lg">
                      ${donor.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Donations</div>
                    <div className="font-medium text-lg">{donor.donationCount}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
