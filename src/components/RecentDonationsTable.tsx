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
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { getRecentDonations } from '../lib/mockData';
import { ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';

export const RecentDonationsTable: React.FC = () => {
  const { selectedEntity, timePeriod, setCurrentPage, setSelectedDonor, setDonorTool } = useApp();
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const data = getRecentDonations(selectedEntity, timePeriod);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey as keyof typeof a];
    const bValue = b[sortKey as keyof typeof b];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRowClick = (donor: string) => {
    setSelectedDonor(donor);
    setCurrentPage('donor-hub');
    setDonorTool('donors');
  };

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



  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Donations</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View recent donor contributions (click to view donor profile)
        </p>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('id')} className="h-8 px-2">
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('donor')} className="h-8 px-2">
                    Donor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('amount')} className="h-8 px-2">
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((donation) => (
                <TableRow 
                  key={donation.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleRowClick(donation.donor)}
                >
                  <TableCell>{donation.id}</TableCell>
                  <TableCell>{donation.donor}</TableCell>
                  <TableCell>{donation.amount}</TableCell>
                  <TableCell>{getTypeBadge(donation.type)}</TableCell>
                  <TableCell>{donation.cause}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {sortedData.map((donation) => (
            <Card
              key={donation.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow touch-manipulation"
              onClick={() => handleRowClick(donation.donor)}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-lg">{donation.donor}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {donation.id}</div>
                  </div>
                  {getTypeBadge(donation.type)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Amount</div>
                    <div className="font-medium">{donation.amount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Date</div>
                    <div>{donation.date}</div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Cause</div>
                  <div>{donation.cause}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
