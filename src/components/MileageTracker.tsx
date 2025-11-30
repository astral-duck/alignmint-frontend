import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getMileageEntries, MileageEntry } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { PageHeader } from './PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
import {
  ArrowLeft,
  Plus,
  Car,
  Calendar,
  MapPin,
  Trash2,
  Edit,
} from 'lucide-react';
import { toast } from 'sonner';

// IRS standard mileage rate for 2025 (70 cents per mile)
const IRS_MILEAGE_RATE = 0.70;

export const MileageTracker: React.FC = () => {
  const { selectedEntity, setToolsTool } = useApp();
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<MileageEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'this-month' | 'this-year'>('this-year');

  const entityName = entities.find(e => e.id === selectedEntity)?.name || 'All Organizations';
  const isInFocus = selectedEntity === 'infocus' || selectedEntity === 'all';

  // Form state
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    miles: '',
    purpose: '',
    entityId: selectedEntity === 'all' || selectedEntity === 'infocus' ? '' : selectedEntity,
  });

  // Get mileage data from shared source
  const mileageData = useMemo(() => {
    return getMileageEntries(selectedEntity);
  }, [selectedEntity]);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = mileageData;

    // Date filter
    const now = new Date();
    if (dateFilter === 'this-month') {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      });
    } else if (dateFilter === 'this-year') {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === now.getFullYear();
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.entityName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [mileageData, dateFilter, searchQuery]);

  // Calculate totals
  const totalMiles = filteredData.reduce((sum, entry) => sum + entry.miles, 0);
  const totalValue = totalMiles * IRS_MILEAGE_RATE;
  const entryCount = filteredData.length;

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.miles || !newEntry.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isInFocus && !newEntry.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    const entityName = entities.find(e => e.id === newEntry.entityId)?.name || '';
    toast.success(`Mileage entry added: ${newEntry.miles} miles for ${entityName}`);
    
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      miles: '',
      purpose: '',
      entityId: selectedEntity === 'all' || selectedEntity === 'infocus' ? '' : selectedEntity,
    });
    setAddEntryOpen(false);
  };

  const handleEditEntry = () => {
    if (!editEntry) return;
    toast.success('Mileage entry updated');
    setEditEntry(null);
  };

  const handleDeleteEntry = (entry: MileageEntry) => {
    toast.success(`Mileage entry deleted: ${entry.miles} miles`);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setToolsTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </Button>

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4">
        <PageHeader
          title="Mileage Tracker"
          subtitle={isInFocus ? 'Track mileage across all nonprofits' : `Track mileage for ${entityName}`}
        />
        <Button onClick={() => setAddEntryOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Mileage
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Miles</p>
            <p className="text-3xl font-bold">
              {totalMiles.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Deduction Value</p>
            <p className="text-3xl font-bold">
              {formatCurrency(totalValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Entries</p>
            <p className="text-3xl font-bold">
              {entryCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by purpose or organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={dateFilter} onValueChange={(value: string) => setDateFilter(value as 'all' | 'this-month' | 'this-year')}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mileage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mileage Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {isInFocus && <TableHead>Organization</TableHead>}
                <TableHead>Purpose</TableHead>
                <TableHead className="text-right">Miles</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isInFocus ? 6 : 5} className="text-center py-8 text-gray-500">
                    No mileage entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {formatDate(entry.date)}
                    </TableCell>
                    {isInFocus && (
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {entry.entityName}
                      </TableCell>
                    )}
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {entry.purpose}
                    </TableCell>
                    <TableCell className="text-right font-mono text-gray-900 dark:text-gray-100">
                      {entry.miles}
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                      {formatCurrency(entry.miles * IRS_MILEAGE_RATE)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditEntry(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Entry Dialog */}
      <Dialog open={addEntryOpen} onOpenChange={setAddEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Mileage Entry</DialogTitle>
            <DialogDescription>
              Record miles driven for nonprofit business purposes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="miles">Miles *</Label>
                <Input
                  id="miles"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={newEntry.miles}
                  onChange={(e) => setNewEntry({ ...newEntry, miles: e.target.value })}
                />
              </div>
            </div>

            {isInFocus && (
              <div className="space-y-2">
                <Label htmlFor="entity">Organization *</Label>
                <Select
                  value={newEntry.entityId}
                  onValueChange={(value: string) => setNewEntry({ ...newEntry, entityId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities
                      .filter(e => e.id !== 'all' && e.id !== 'infocus' && e.type === 'nonprofit')
                      .map(entity => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="Describe the business purpose of this trip..."
                value={newEntry.purpose}
                onChange={(e) => setNewEntry({ ...newEntry, purpose: e.target.value })}
                rows={2}
              />
            </div>

            {newEntry.miles && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Deduction</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(parseFloat(newEntry.miles || '0') * IRS_MILEAGE_RATE)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={!!editEntry} onOpenChange={(open: boolean) => !open && setEditEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mileage Entry</DialogTitle>
            <DialogDescription>
              Update the mileage entry details
            </DialogDescription>
          </DialogHeader>
          {editEntry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editEntry.date}
                    onChange={(e) => setEditEntry({ ...editEntry, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-miles">Miles *</Label>
                  <Input
                    id="edit-miles"
                    type="number"
                    min="0"
                    step="0.1"
                    value={editEntry.miles}
                    onChange={(e) => setEditEntry({ ...editEntry, miles: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-purpose">Purpose *</Label>
                <Textarea
                  id="edit-purpose"
                  value={editEntry.purpose}
                  onChange={(e) => setEditEntry({ ...editEntry, purpose: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Deduction</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(editEntry.miles * IRS_MILEAGE_RATE)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEntry(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditEntry}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
