import React, { useState } from 'react';
import { useApp, entities, Entity, EntityId } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  ArrowLeft,
  Building2,
  Plus,
  Search,
  Edit2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface NonprofitWithStatus extends Entity {
  isActive: boolean;
  dateAdded: string;
  lastActivity?: string;
}

// Generate initial nonprofit data with active status
const generateInitialNonprofits = (): NonprofitWithStatus[] => {
  return entities.map((entity, index) => ({
    ...entity,
    isActive: true, // All active by default
    dateAdded: new Date(2024, 0, index + 1).toISOString().split('T')[0],
    lastActivity: index < 20 ? new Date(2025, 9, Math.floor(Math.random() * 27) + 1).toISOString().split('T')[0] : undefined,
  }));
};

export const NonprofitManagement: React.FC = () => {
  const { setAdministrationTool } = useApp();
  const [nonprofits, setNonprofits] = useState<NonprofitWithStatus[]>(generateInitialNonprofits());
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogType, setDialogType] = useState<'add' | 'edit' | null>(null);
  const [selectedNonprofit, setSelectedNonprofit] = useState<NonprofitWithStatus | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'nonprofit' as 'nonprofit' | 'parent',
  });

  // Filter and sort nonprofits alphabetically by name
  const filteredNonprofits = nonprofits
    .filter((nonprofit) =>
      nonprofit.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Calculate stats
  const stats = {
    total: nonprofits.length,
    active: nonprofits.filter(n => n.isActive).length,
    inactive: nonprofits.filter(n => !n.isActive).length,
    parent: nonprofits.filter(n => n.type === 'parent').length,
  };

  const openAddDialog = () => {
    setFormData({
      name: '',
      type: 'nonprofit',
    });
    setDialogType('add');
  };

  const openEditDialog = (nonprofit: NonprofitWithStatus) => {
    setSelectedNonprofit(nonprofit);
    setFormData({
      name: nonprofit.name,
      type: nonprofit.type as 'nonprofit' | 'parent',
    });
    setDialogType('edit');
  };

  const handleAddNonprofit = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a nonprofit name');
      return;
    }

    // Generate a simple ID from the name
    const id = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) as EntityId;

    // Check if ID already exists
    if (nonprofits.find(n => n.id === id)) {
      toast.error('A nonprofit with this name already exists');
      return;
    }

    const newNonprofit: NonprofitWithStatus = {
      id,
      name: formData.name.trim(),
      type: formData.type,
      isActive: true,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setNonprofits(prev => [...prev, newNonprofit]);
    toast.success(`${formData.name} has been added to the platform`);
    setDialogType(null);
  };

  const handleEditNonprofit = () => {
    if (!selectedNonprofit) return;
    
    if (!formData.name.trim()) {
      toast.error('Please enter a nonprofit name');
      return;
    }

    setNonprofits(prev =>
      prev.map(n =>
        n.id === selectedNonprofit.id
          ? { ...n, name: formData.name.trim(), type: formData.type }
          : n
      )
    );

    toast.success(`${formData.name} has been updated`);
    setDialogType(null);
  };

  const toggleNonprofitStatus = (id: EntityId) => {
    // Prevent deactivating InFocus Ministries
    if (id === 'infocus-ministries') {
      toast.error('Cannot deactivate the parent organization');
      return;
    }

    setNonprofits(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isActive: !n.isActive } : n
      )
    );

    const nonprofit = nonprofits.find(n => n.id === id);
    if (nonprofit) {
      toast.success(`${nonprofit.name} has been ${nonprofit.isActive ? 'deactivated' : 'activated'}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="Nonprofit Management"
          subtitle="Manage nonprofits on the platform and control visibility"
        />
        <Button onClick={openAddDialog} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Nonprofit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Nonprofits</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Parent Org</p>
                <p className="text-2xl text-gray-900 dark:text-gray-100">{stats.parent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search nonprofits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Nonprofits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nonprofits ({filteredNonprofits.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Nonprofit Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNonprofits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No nonprofits found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNonprofits.map((nonprofit) => (
                    <TableRow key={nonprofit.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={nonprofit.isActive}
                            onCheckedChange={() => toggleNonprofitStatus(nonprofit.id)}
                            disabled={nonprofit.id === 'infocus-ministries'}
                          />
                          {nonprofit.isActive ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{nonprofit.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            nonprofit.type === 'parent'
                              ? 'border-purple-500 text-purple-700 dark:text-purple-400'
                              : 'border-blue-500 text-blue-700 dark:text-blue-400'
                          }
                        >
                          {nonprofit.type === 'parent' ? 'Parent Org' : 'Nonprofit'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(nonprofit.dateAdded)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(nonprofit.lastActivity)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(nonprofit)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Nonprofit Dialog */}
      <Dialog
        open={dialogType === 'add' || dialogType === 'edit'}
        onOpenChange={(open) => !open && setDialogType(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'add' ? 'Add Nonprofit' : 'Edit Nonprofit'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'add'
                ? 'Add a new nonprofit to the platform'
                : 'Update nonprofit information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nonprofit Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter nonprofit name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="nonprofit"
                    checked={formData.type === 'nonprofit'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: 'nonprofit' }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Nonprofit</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="parent"
                    checked={formData.type === 'parent'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: 'parent' }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Parent Organization</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={dialogType === 'add' ? handleAddNonprofit : handleEditNonprofit}>
              {dialogType === 'add' ? 'Add Nonprofit' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
