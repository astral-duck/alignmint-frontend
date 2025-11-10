import React, { useState } from 'react';
import { Clock, Plus, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { PageHeader } from './PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { useApp, entities } from '../contexts/AppContext';

interface HourEntry {
  id: string;
  date: string;
  hours: number;
  activity: string;
  nonprofit: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export const HourTracking: React.FC = () => {
  const { selectedEntity, setPersonnelTool } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<HourEntry[]>([
    {
      id: 'HR-001',
      date: '2025-10-18',
      hours: 4,
      activity: 'Event Setup',
      nonprofit: 'Awakenings',
      description: 'Helped set up chairs and tables for community event',
      status: 'approved',
      submittedAt: '2025-10-18T14:30:00',
      approvedBy: 'Sarah Johnson',
      approvedAt: '2025-10-19T09:15:00',
    },
    {
      id: 'HR-002',
      date: '2025-10-15',
      hours: 3,
      activity: 'Administrative Support',
      nonprofit: 'Bloom Strong',
      description: 'Data entry and filing',
      status: 'approved',
      submittedAt: '2025-10-15T16:45:00',
      approvedBy: 'Sarah Johnson',
      approvedAt: '2025-10-16T10:20:00',
    },
    {
      id: 'HR-003',
      date: '2025-10-20',
      hours: 5,
      activity: 'Outreach Program',
      nonprofit: 'Bonfire',
      description: 'Participated in community outreach at local center',
      status: 'pending',
      submittedAt: '2025-10-20T17:00:00',
    },
  ]);

  const [formData, setFormData] = useState({
    date: '',
    hours: '',
    activity: '',
    nonprofit: '',
    description: '',
  });

  const totalHours = entries
    .filter((e) => e.status === 'approved')
    .reduce((sum, entry) => sum + entry.hours, 0);

  const pendingHours = entries
    .filter((e) => e.status === 'pending')
    .reduce((sum, entry) => sum + entry.hours, 0);

  const thisMonthHours = entries
    .filter(
      (e) =>
        e.status === 'approved' &&
        new Date(e.date).getMonth() === new Date().getMonth() &&
        new Date(e.date).getFullYear() === new Date().getFullYear()
    )
    .reduce((sum, entry) => sum + entry.hours, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.hours || !formData.activity || !formData.nonprofit) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newEntry: HourEntry = {
      id: `HR-${Date.now()}`,
      date: formData.date,
      hours: parseFloat(formData.hours),
      activity: formData.activity,
      nonprofit: formData.nonprofit,
      description: formData.description,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setEntries([newEntry, ...entries]);
    setFormData({ date: '', hours: '', activity: '', nonprofit: '', description: '' });
    setShowForm(false);
    toast.success('Hours submitted successfully!');
  };

  const getStatusBadge = (status: HourEntry['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setPersonnelTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Personnel
      </Button>

      <PageHeader 
        title="Hour Tracking"
        subtitle="Submit and manage your volunteer hours"
        centered={true}
      />

      {/* Stats Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-2xl sm:text-3xl font-semibold text-foreground">{totalHours} hours</div>
                <p className="text-sm text-muted-foreground">All time volunteer hours</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-2xl sm:text-3xl font-semibold text-foreground">{thisMonthHours} hours</div>
                <p className="text-sm text-muted-foreground">Hours logged this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-2xl sm:text-3xl font-semibold text-foreground">{pendingHours} hours</div>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Hours Section */}
      <Card>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submit Hours</CardTitle>
              <CardDescription>Log your volunteer hours for approval</CardDescription>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Hours
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Submit Volunteer Hours</DialogTitle>
                  <DialogDescription>
                    Enter the details of your volunteer work for approval
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                  {/* Nonprofit Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="nonprofit" className="flex items-center gap-1">
                      Nonprofit Organization
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.nonprofit}
                      onValueChange={(value) =>
                        setFormData({ ...formData, nonprofit: value })
                      }
                    >
                      <SelectTrigger id="nonprofit" className="h-11">
                        <SelectValue placeholder="Select the nonprofit you volunteered with" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {entities
                          .filter((entity) => entity.id !== 'all')
                          .map((entity) => (
                            <SelectItem key={entity.id} value={entity.name}>
                              {entity.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date and Hours Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-1">
                        Date
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        className="h-11"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hours" className="flex items-center gap-1">
                        Hours Worked
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="hours"
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="24"
                        placeholder="4.5"
                        className="h-11"
                        value={formData.hours}
                        onChange={(e) =>
                          setFormData({ ...formData, hours: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Activity Type */}
                  <div className="space-y-2">
                    <Label htmlFor="activity" className="flex items-center gap-1">
                      Activity Type
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.activity}
                      onValueChange={(value) =>
                        setFormData({ ...formData, activity: value })
                      }
                    >
                      <SelectTrigger id="activity" className="h-11">
                        <SelectValue placeholder="Select the type of volunteer work" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Event Setup">Event Setup</SelectItem>
                        <SelectItem value="Event Support">Event Support</SelectItem>
                        <SelectItem value="Administrative Support">
                          Administrative Support
                        </SelectItem>
                        <SelectItem value="Outreach Program">
                          Outreach Program
                        </SelectItem>
                        <SelectItem value="Teaching/Training">
                          Teaching/Training
                        </SelectItem>
                        <SelectItem value="Fundraising">Fundraising</SelectItem>
                        <SelectItem value="Marketing/Communications">
                          Marketing/Communications
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Briefly describe what you did during your volunteer work..."
                      rows={4}
                      className="resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="min-w-[100px]"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="min-w-[100px]"
                    >
                      Submit Hours
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Hours History - Desktop */}
      <Card className="hidden sm:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Nonprofit</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No hours logged yet
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Click "Add Hours" to submit your volunteer time
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-900 dark:text-gray-100">
                        {entry.nonprofit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-gray-900 dark:text-gray-100">
                          {entry.activity}
                        </div>
                        {entry.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {entry.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{entry.hours} hrs</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Hours History - Mobile */}
      <div className="sm:hidden">
        {entries.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400">
                No hours logged yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click "Add Hours" to submit your volunteer time
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4 touch-manipulation">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{entry.nonprofit}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    {getStatusBadge(entry.status)}
                  </div>

                  {/* Activity and Hours */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">{entry.activity}</div>
                        {entry.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {entry.description}
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-semibold ml-3">
                        {entry.hours}
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">hrs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
