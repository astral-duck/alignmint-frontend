import React, { useState } from 'react';
import { entities } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface DonorPageConfig {
  id: string;
  entityId: string;
  entityName: string;
  title: string;
  description: string;
  heroImage: string;
  goalAmount: number;
  suggestedAmounts: number[];
  allowCustomAmount: boolean;
  allowRecurring: boolean;
  thankYouMessage: string;
  createdAt: string;
}

interface DonorPageBuilderProps {
  onClose: () => void;
  onSave: (config: DonorPageConfig) => void;
  onPreview: (config: DonorPageConfig) => void;
}

export const DonorPageBuilder: React.FC<DonorPageBuilderProps> = ({ onClose, onSave, onPreview }) => {
  const [config, setConfig] = useState<Omit<DonorPageConfig, 'id' | 'createdAt'>>({
    entityId: '',
    entityName: '',
    title: 'Support Our Mission',
    description: 'Your generous donation helps us make a difference in our community. Every contribution, no matter the size, brings us closer to achieving our goals and creating lasting impact.',
    heroImage: 'https://images.unsplash.com/photo-1758599669406-d5179ccefcb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub25wcm9maXQlMjBjb21tdW5pdHklMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc2MDM1ODgzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    goalAmount: 50000,
    suggestedAmounts: [25, 50, 100, 250, 500, 1000],
    allowCustomAmount: true,
    allowRecurring: true,
    thankYouMessage: 'Thank you for your generous donation! Your support means the world to us and helps us continue our important work.',
  });

  const handleEntityChange = (entityId: string) => {
    const entity = entities.find((e) => e.id === entityId);
    if (entity) {
      setConfig({ ...config, entityId, entityName: entity.name });
    }
  };

  const handleSuggestedAmountChange = (index: number, value: string) => {
    const newAmounts = [...config.suggestedAmounts];
    newAmounts[index] = parseInt(value) || 0;
    setConfig({ ...config, suggestedAmounts: newAmounts });
  };

  const handleSave = () => {
    if (!config.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    if (!config.title.trim()) {
      toast.error('Please enter a page title');
      return;
    }

    const fullConfig: DonorPageConfig = {
      ...config,
      id: `donor-page-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    onSave(fullConfig);
    toast.success(`Donor page created for ${config.entityName}!`);
  };

  const handlePreview = () => {
    if (!config.entityId) {
      toast.error('Please select a nonprofit organization first');
      return;
    }

    const fullConfig: DonorPageConfig = {
      ...config,
      id: `preview-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    onPreview(fullConfig);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1>Create Donor Page</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set up a custom donation page for one of your nonprofits
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save & Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nonprofit">Nonprofit Organization *</Label>
                <Select value={config.entityId} onValueChange={handleEntityChange}>
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
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Support Our Mission"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your mission and how donations help..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input
                  id="heroImage"
                  value={config.heroImage}
                  onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalAmount">Fundraising Goal ($)</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  value={config.goalAmount}
                  onChange={(e) => setConfig({ ...config, goalAmount: parseInt(e.target.value) || 0 })}
                  placeholder="50000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Donation Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Suggested Donation Amounts ($)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {config.suggestedAmounts.map((amount, index) => (
                    <Input
                      key={index}
                      type="number"
                      value={amount}
                      onChange={(e) => handleSuggestedAmountChange(index, e.target.value)}
                      placeholder="25"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowCustomAmount"
                  checked={config.allowCustomAmount}
                  onChange={(e) => setConfig({ ...config, allowCustomAmount: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="allowCustomAmount" className="font-normal">
                  Allow custom donation amounts
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowRecurring"
                  checked={config.allowRecurring}
                  onChange={(e) => setConfig({ ...config, allowRecurring: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="allowRecurring" className="font-normal">
                  Enable recurring donations
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <Card>
            <CardHeader>
              <CardTitle>Thank You Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thankYouMessage">Message after donation</Label>
                <Textarea
                  id="thankYouMessage"
                  value={config.thankYouMessage}
                  onChange={(e) => setConfig({ ...config, thankYouMessage: e.target.value })}
                  rows={3}
                  placeholder="Thank you for your support!"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-[#0D0D0D]">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={config.heroImage}
                    alt="Hero"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <h3>{config.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{config.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Goal Progress</span>
                    <span>${config.goalAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/3"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {config.suggestedAmounts.slice(0, 3).map((amount, index) => (
                    <Button key={index} variant="outline" size="sm">
                      ${amount}
                    </Button>
                  ))}
                </div>
                {config.allowRecurring && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    ✓ Monthly recurring available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
