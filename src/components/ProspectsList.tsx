import React, { useState } from 'react';
import { Upload, UserPlus, Trash2, Mail, Search, Download, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';

export const ProspectsList: React.FC = () => {
  const { prospects, addProspect, deleteProspect, setMarketingTool } = useApp();
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newProspect, setNewProspect] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    notes: '',
  });

  const filteredProspects = prospects.filter((prospect) =>
    prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prospect.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProspect = () => {
    if (!newProspect.name || !newProspect.email) {
      toast.error('Please enter name and email');
      return;
    }

    addProspect({
      name: newProspect.name,
      email: newProspect.email,
      phone: newProspect.phone,
      source: newProspect.source || 'Manual',
      notes: newProspect.notes,
    });

    setNewProspect({ name: '', email: '', phone: '', source: '', notes: '' });
    setShowAddDialog(false);
    toast.success('Prospect added successfully');
  };

  const handleDeleteProspect = (id: string) => {
    deleteProspect(id);
    setSelectedProspects(selectedProspects.filter((pId) => pId !== id));
    toast.success('Prospect deleted');
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newProspects: Prospect[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const nameIdx = headers.indexOf('name');
        const emailIdx = headers.indexOf('email');
        const phoneIdx = headers.indexOf('phone');
        const sourceIdx = headers.indexOf('source');
        const notesIdx = headers.indexOf('notes');

        if (nameIdx === -1 || emailIdx === -1) {
          toast.error('CSV must have "name" and "email" columns');
          return;
        }

        newProspects.push({
          id: Date.now().toString() + i,
          name: values[nameIdx] || '',
          email: values[emailIdx] || '',
          phone: phoneIdx !== -1 ? values[phoneIdx] : '',
          source: sourceIdx !== -1 ? values[sourceIdx] : 'CSV Import',
          addedDate: new Date().toISOString().split('T')[0],
          notes: notesIdx !== -1 ? values[notesIdx] : '',
        });
      }

      // Add all prospects using the context
      newProspects.forEach(p => {
        addProspect({
          name: p.name,
          email: p.email,
          phone: p.phone,
          source: p.source,
          notes: p.notes,
        });
      });

      setShowUploadDialog(false);
      toast.success(`${newProspects.length} prospects imported`);
    };

    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Added Date', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...prospects.map(p => [
        p.name,
        p.email,
        p.phone || '',
        p.source,
        p.addedDate,
        p.notes || '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prospects-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('All prospects exported');
  };

  const handleExportSelected = () => {
    const selectedData = prospects.filter(p => selectedProspects.includes(p.id));
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Added Date', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(p => [
        p.name,
        p.email,
        p.phone || '',
        p.source,
        p.addedDate,
        p.notes || '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prospects-selected-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${selectedData.length} selected prospects exported`);
  };

  const toggleProspectSelection = (id: string) => {
    setSelectedProspects(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const toggleAllProspects = () => {
    if (selectedProspects.length === filteredProspects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(filteredProspects.map(p => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setMarketingTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketing Hub
      </Button>

      <div className="text-center">
        <PageHeader 
          title="Prospects"
          subtitle="Manage potential donors who haven't donated yet"
        />
      </div>

      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Prospect
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Prospect List</CardTitle>
              <CardDescription>
                {prospects.length} total prospects
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search prospects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Prospects</DialogTitle>
                    <DialogDescription>
                      Choose which prospects to export to CSV
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        handleExportCSV();
                        document.querySelector('[data-state="open"]')?.closest('[role="dialog"]')?.querySelector('button[aria-label="Close"]')?.click();
                      }}
                    >
                      Export All Prospects ({prospects.length})
                    </Button>
                    {selectedProspects.length > 0 && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          handleExportSelected();
                          document.querySelector('[data-state="open"]')?.closest('[role="dialog"]')?.querySelector('button[aria-label="Close"]')?.click();
                        }}
                      >
                        Export Selected Prospects ({selectedProspects.length})
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedProspects.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {selectedProspects.length} prospect{selectedProspects.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Desktop Table */}
          <div className="hidden sm:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProspects.length === filteredProspects.length && filteredProspects.length > 0}
                      onCheckedChange={toggleAllProspects}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">Source</TableHead>
                  <TableHead className="hidden lg:table-cell">Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProspects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No prospects found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProspects.map((prospect) => (
                    <TableRow key={prospect.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProspects.includes(prospect.id)}
                          onCheckedChange={() => toggleProspectSelection(prospect.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-gray-900 dark:text-gray-100">{prospect.name}</p>
                          {prospect.notes && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{prospect.notes}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{prospect.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{prospect.phone || '—'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{prospect.source}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(prospect.addedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProspect(prospect.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile List */}
          <div className="sm:hidden space-y-3">
            {filteredProspects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No prospects found
              </div>
            ) : (
              filteredProspects.map((prospect) => (
                <Card key={prospect.id} className="p-4 touch-manipulation">
                  <div className="space-y-3">
                    {/* Header with checkbox and name */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedProspects.includes(prospect.id)}
                        onCheckedChange={() => toggleProspectSelection(prospect.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg">{prospect.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {prospect.email}
                        </p>
                        {prospect.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {prospect.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProspect(prospect.id)}
                        className="min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Phone</div>
                        <div>{prospect.phone || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Source</div>
                        <div>{prospect.source}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Added</div>
                        <div>{new Date(prospect.addedDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Prospect Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Prospect</DialogTitle>
            <DialogDescription>
              Add a potential donor to your prospects list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newProspect.name}
                onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newProspect.email}
                onChange={(e) => setNewProspect({ ...newProspect, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={newProspect.phone}
                onChange={(e) => setNewProspect({ ...newProspect, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="e.g., Website, Event, Referral"
                value={newProspect.source}
                onChange={(e) => setNewProspect({ ...newProspect, source: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Additional information"
                value={newProspect.notes}
                onChange={(e) => setNewProspect({ ...newProspect, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddProspect} className="flex-1">
                Add Prospect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload CSV Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Prospects from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with columns: name, email, phone, source, notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select a CSV file to upload
                </p>
                <label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">CSV Format:</p>
              <code className="text-xs text-blue-800 dark:text-blue-200 block">
                name,email,phone,source,notes<br />
                John Doe,john@example.com,(555) 123-4567,Website,Interested in programs
              </code>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
