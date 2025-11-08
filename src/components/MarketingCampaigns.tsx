import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getAllDonors, getAllVolunteers } from '../lib/mockData';
import { emailTemplates, EmailTemplate } from '../lib/emailTemplates';
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
  Send,
  FileText,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  DollarSign,
  CheckCircle,
  Clock,
  User,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  ArrowLeft,
} from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  recipients: string;
  recipientCount: number;
  status: 'draft' | 'scheduled' | 'sent';
  sentDate?: string;
  scheduledDate?: string;
  openRate?: number;
  clickRate?: number;
  entityId: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: 'CAMP-001',
    name: 'Year-End Appeal 2025',
    subject: 'Make a Difference This Year - Your Gift Matters',
    recipients: 'All Donors',
    recipientCount: 15,
    status: 'sent',
    sentDate: '2025-10-01',
    openRate: 68,
    clickRate: 24,
    entityId: 'all',
  },
  {
    id: 'CAMP-002',
    name: 'October Newsletter',
    subject: 'Your Impact in October',
    recipients: 'All Donors & Volunteers',
    recipientCount: 29,
    status: 'sent',
    sentDate: '2025-10-05',
    openRate: 72,
    clickRate: 18,
    entityId: 'all',
  },
  {
    id: 'CAMP-003',
    name: 'Thanksgiving Event Invitation',
    subject: "You're Invited! Thanksgiving Community Dinner",
    recipients: 'Major Donors',
    recipientCount: 8,
    status: 'scheduled',
    scheduledDate: '2025-10-15',
    entityId: 'all',
  },
  {
    id: 'CAMP-004',
    name: 'Volunteer Appreciation',
    subject: 'Thank You for Your Service!',
    recipients: 'All Volunteers',
    recipientCount: 14,
    status: 'draft',
    entityId: 'all',
  },
];

export const MarketingCampaigns: React.FC = () => {
  const { selectedEntity, prospects, setMarketingTool } = useApp();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'compose' | 'templates'>('campaigns');
  const [composeOpen, setComposeOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Compose Email State
  const [emailData, setEmailData] = useState({
    name: '',
    subject: '',
    body: '',
    recipientType: 'all-donors' as 'all-donors' | 'all-volunteers' | 'all-prospects' | 'individual' | 'custom',
    individualRecipient: '',
    includeDonateButton: false,
    entityId: selectedEntity === 'infocus' ? '' : selectedEntity,
    mediaUrl: '',
    mediaType: '' as 'image' | 'video' | '',
  });

  const allDonors = getAllDonors(selectedEntity);
  const allVolunteers = getAllVolunteers(selectedEntity);

  const handleSendEmail = () => {
    if (!emailData.subject || !emailData.body) {
      toast.error('Please fill in subject and body');
      return;
    }

    if (!emailData.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    let recipientCount = 0;
    let recipientDesc = '';

    switch (emailData.recipientType) {
      case 'all-donors':
        recipientCount = allDonors.length;
        recipientDesc = 'All Donors';
        break;
      case 'all-volunteers':
        recipientCount = allVolunteers.length;
        recipientDesc = 'All Volunteers';
        break;
      case 'all-prospects':
        recipientCount = prospects.length;
        recipientDesc = 'All Prospects';
        break;
      case 'individual':
        recipientCount = 1;
        recipientDesc = emailData.individualRecipient;
        break;
      default:
        recipientCount = 0;
        recipientDesc = 'Custom List';
    }

    const entityName = entities.find(e => e.id === emailData.entityId)?.name || 'the organization';
    toast.success(`Email sent to ${recipientCount} recipients (${recipientDesc}) from ${entityName}!`);

    setEmailData({
      name: '',
      subject: '',
      body: '',
      recipientType: 'all-donors',
      individualRecipient: '',
      includeDonateButton: false,
      entityId: selectedEntity === 'infocus' ? '' : selectedEntity,
      mediaUrl: '',
      mediaType: '',
    });
    setComposeOpen(false);
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    setEmailData({
      ...emailData,
      subject: template.subject,
      body: template.body,
      includeDonateButton: template.includeDonateButton,
      mediaUrl: template.mediaUrl || '',
      mediaType: template.mediaType || '',
    });
    setSelectedTemplate(null);
    setActiveTab('compose');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error('Please upload an image or video file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setEmailData({
      ...emailData,
      mediaUrl: previewUrl,
      mediaType: isImage ? 'image' : 'video',
    });
    toast.success(`${isImage ? 'Image' : 'Video'} uploaded successfully`);
  };

  const handleRemoveMedia = () => {
    if (emailData.mediaUrl) {
      URL.revokeObjectURL(emailData.mediaUrl);
    }
    setEmailData({
      ...emailData,
      mediaUrl: '',
      mediaType: '',
    });
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const renderEmailBodyWithMedia = (body: string, mediaUrl?: string, mediaType?: 'image' | 'video' | '') => {
    // Replace {{media}} tag with actual media or placeholder
    if (body.includes('{{media}}')) {
      if (mediaUrl && mediaType) {
        const mediaElement = mediaType === 'image' 
          ? `<img src="${mediaUrl}" alt="Email media" class="max-w-full h-auto rounded-lg my-4" />`
          : `<video src="${mediaUrl}" controls class="max-w-full h-auto rounded-lg my-4"></video>`;
        return body.replace('{{media}}', mediaElement);
      } else {
        return body.replace('{{media}}', '[Image or Video will appear here]');
      }
    }
    return body;
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'sent':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1">
            <CheckCircle className="h-3 w-3" />
            Sent
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 gap-1">
            <Clock className="h-3 w-3" />
            Scheduled
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="gap-1">
            <Edit className="h-3 w-3" />
            Draft
          </Badge>
        );
    }
  };

  const getCategoryBadge = (category: EmailTemplate['category']) => {
    const colors = {
      'thank-you': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      'appeal': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
      'update': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      'event': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
      'newsletter': 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    };

    return (
      <Badge className={colors[category]}>
        {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setMarketingTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketing Hub
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">Marketing & Email Campaigns</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and send email campaigns to donors and volunteers
          </p>
        </div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Compose Email Campaign</DialogTitle>
              <DialogDescription>
                Create a new email to send to your supporters.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name (Internal)</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., October Newsletter"
                  value={emailData.name}
                  onChange={(e) => setEmailData({ ...emailData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject line"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Recipients *</Label>
                <Select
                  value={emailData.recipientType}
                  onValueChange={(value: any) => setEmailData({ ...emailData, recipientType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-donors">
                      All Donors ({allDonors.length})
                    </SelectItem>
                    <SelectItem value="all-volunteers">
                      All Volunteers ({allVolunteers.length})
                    </SelectItem>
                    <SelectItem value="all-prospects">
                      All Prospects ({prospects.length})
                    </SelectItem>
                    <SelectItem value="individual">Individual Recipient</SelectItem>
                    <SelectItem value="custom">Custom List (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {emailData.recipientType === 'individual' && (
                <div className="space-y-2">
                  <Label htmlFor="individual">Select Recipient</Label>
                  <Select
                    value={emailData.individualRecipient}
                    onValueChange={(value) => setEmailData({ ...emailData, individualRecipient: value })}
                  >
                    <SelectTrigger id="individual">
                      <SelectValue placeholder="Choose a donor or volunteer..." />
                    </SelectTrigger>
                    <SelectContent>
                      <DropdownMenuLabel>Donors</DropdownMenuLabel>
                      {allDonors.map((donor) => (
                        <SelectItem key={donor.id} value={donor.name}>
                          {donor.name} - {donor.email}
                        </SelectItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Volunteers</DropdownMenuLabel>
                      {allVolunteers.map((volunteer) => (
                        <SelectItem key={volunteer.id} value={volunteer.name}>
                          {volunteer.name} - {volunteer.email}
                        </SelectItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Prospects</DropdownMenuLabel>
                      {prospects.map((prospect) => (
                        <SelectItem key={prospect.id} value={prospect.name}>
                          {prospect.name} - {prospect.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nonprofit">From Organization *</Label>
                <Select
                  value={emailData.entityId}
                  onValueChange={(value) => setEmailData({ ...emailData, entityId: value })}
                >
                  <SelectTrigger id="nonprofit">
                    <SelectValue placeholder="Select organization..." />
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

              <Separator />

              <div className="flex items-center justify-between">
                <Label>Use a Template</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Select Template
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Email Templates</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {emailTemplates.slice(0, 5).map((template) => (
                      <DropdownMenuItem
                        key={template.id}
                        onClick={() => handleUseTemplate(template)}
                      >
                        {template.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab('templates')}>
                      View All Templates
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Email Body *</Label>
                <Textarea
                  id="body"
                  placeholder="Enter your email message here..."
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Tip: Use variables like {'{{donor_name}}'}, {'{{organization_name}}'}, {'{{donation_amount}}'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-upload">Attach Image or Video (Optional)</Label>
                <div className="space-y-2">
                  {emailData.mediaUrl ? (
                    <div className="relative border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveMedia}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {emailData.mediaType === 'image' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ImageIcon className="h-4 w-4" />
                            <span>Image attached</span>
                          </div>
                          <img
                            src={emailData.mediaUrl}
                            alt="Email attachment"
                            className="max-h-48 rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Video className="h-4 w-4" />
                            <span>Video attached</span>
                          </div>
                          <video
                            src={emailData.mediaUrl}
                            controls
                            className="max-h-48 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Input
                        id="media-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <label
                        htmlFor="media-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-blue-600 dark:text-blue-400 hover:underline">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">
                          Image or video (max 10MB)
                        </p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="donate-button"
                  checked={emailData.includeDonateButton}
                  onCheckedChange={(checked) =>
                    setEmailData({ ...emailData, includeDonateButton: checked as boolean })
                  }
                />
                <Label htmlFor="donate-button" className="text-sm font-normal flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Include "Donate Now" button in email
                </Label>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setComposeOpen(false)}>
                Save as Draft
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEmailPreviewOpen(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleSendEmail} className="gap-2">
                <Send className="h-4 w-4" />
                Send Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
                <p className="text-2xl">{mockCampaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sent This Month</p>
                <p className="text-2xl">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Open Rate</p>
                <p className="text-2xl">70%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Campaigns List */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Campaign Name</TableHead>
                      <TableHead className="min-w-[200px]">Subject</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[120px]">Recipients</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[80px]">Count</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="hidden sm:table-cell min-w-[100px]">Date</TableHead>
                      <TableHead className="hidden xl:table-cell min-w-[80px]">Open Rate</TableHead>
                      <TableHead className="min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCampaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell className="truncate max-w-[200px]">{campaign.subject}</TableCell>
                        <TableCell className="hidden md:table-cell">{campaign.recipients}</TableCell>
                        <TableCell className="hidden lg:table-cell">{campaign.recipientCount}</TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {campaign.sentDate || campaign.scheduledDate || '-'}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {campaign.openRate ? `${campaign.openRate}%` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {campaign.status === 'draft' && (
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Compose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the "New Campaign" button above to compose and send emails.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => {
                    setEmailData({ ...emailData, recipientType: 'all-donors' });
                    setComposeOpen(true);
                  }}
                >
                  <Users className="h-8 w-8" />
                  <span>Email All Donors</span>
                  <span className="text-xs text-gray-500">({allDonors.length} recipients)</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => {
                    setEmailData({ ...emailData, recipientType: 'all-volunteers' });
                    setComposeOpen(true);
                  }}
                >
                  <Users className="h-8 w-8" />
                  <span>Email All Volunteers</span>
                  <span className="text-xs text-gray-500">({allVolunteers.length} recipients)</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => {
                    setEmailData({ ...emailData, recipientType: 'all-prospects' });
                    setComposeOpen(true);
                  }}
                >
                  <Users className="h-8 w-8" />
                  <span>Email All Prospects</span>
                  <span className="text-xs text-gray-500">({prospects.length} recipients)</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => {
                    setEmailData({ ...emailData, recipientType: 'individual' });
                    setComposeOpen(true);
                  }}
                >
                  <User className="h-8 w-8" />
                  <span>Email Individual</span>
                  <span className="text-xs text-gray-500">Select one person</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {template.subject}
                      </p>
                    </div>
                    {getCategoryBadge(template.category)}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                    {template.body.split('\n')[0]}...
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Send className="h-4 w-4" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>Template Preview</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Subject:</Label>
                <p className="font-medium mt-1">{selectedTemplate.subject}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Body:</Label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {selectedTemplate.body}
                  </pre>
                </div>
              </div>
              {selectedTemplate.mediaUrl && (
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Attached Media:</Label>
                  <div className="mt-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    {selectedTemplate.mediaType === 'image' ? (
                      <img
                        src={selectedTemplate.mediaUrl}
                        alt="Email attachment"
                        className="max-h-64 rounded-lg object-cover"
                      />
                    ) : (
                      <video
                        src={selectedTemplate.mediaUrl}
                        controls
                        className="max-h-64 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}
              {selectedTemplate.includeDonateButton && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span>This template includes a "Donate Now" button</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedTemplate) {
                handleUseTemplate(selectedTemplate);
                setPreviewOpen(false);
              }
            }}>
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog open={emailPreviewOpen} onOpenChange={setEmailPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              Preview how your email will look to recipients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Email Header */}
            <div className="border-b pb-4">
              <div className="mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">From: </span>
                <span className="font-medium">
                  {entities.find(e => e.id === emailData.entityId)?.name || 'Select Organization'}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">To: </span>
                <span className="font-medium">
                  {emailData.recipientType === 'all-donors' && `All Donors (${allDonors.length})`}
                  {emailData.recipientType === 'all-volunteers' && `All Volunteers (${allVolunteers.length})`}
                  {emailData.recipientType === 'all-prospects' && `All Prospects (${prospects.length})`}
                  {emailData.recipientType === 'individual' && emailData.individualRecipient}
                  {emailData.recipientType === 'custom' && 'Custom List'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Subject: </span>
                <span className="font-medium">{emailData.subject || 'No subject'}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: renderEmailBodyWithMedia(
                    emailData.body.replace(/\n/g, '<br/>'),
                    emailData.mediaUrl,
                    emailData.mediaType
                  )
                }}
              />
              
              {emailData.mediaUrl && !emailData.body.includes('{{media}}') && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Attached Media:</p>
                  {emailData.mediaType === 'image' ? (
                    <img
                      src={emailData.mediaUrl}
                      alt="Email attachment"
                      className="max-h-64 rounded-lg object-cover"
                    />
                  ) : (
                    <video
                      src={emailData.mediaUrl}
                      controls
                      className="max-h-64 rounded-lg"
                    />
                  )}
                </div>
              )}

              {emailData.includeDonateButton && (
                <div className="mt-6 text-center">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    Donate Now
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Use <code>{'{{media}}'}</code> in your email body to position the image/video exactly where you want it to appear.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setEmailPreviewOpen(false);
              // Keep compose dialog open
            }}>
              Continue Editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
