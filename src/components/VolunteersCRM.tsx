import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getVolunteerProfile, getAllVolunteers, VolunteerProfile } from '../lib/mockData';
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
  Phone,
  MapPin,
  Calendar,
  Clock,
  Heart,
  ArrowLeft,
  Edit,
  Search,
  UserPlus,
  ArrowUpDown,
  ChevronDown,
  Award,
  Shield,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { PageHeader } from './PageHeader';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner';

type SortOption = 'name-asc' | 'name-desc' | 'hours-high' | 'hours-low' | 'date-newest' | 'date-oldest';
type TypeFilter = 'all' | 'regular' | 'occasional' | 'event-based';

export const VolunteersCRM: React.FC = () => {
  const { selectedEntity, setPersonnelTool } = useApp();
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'profile'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [addVolunteerOpen, setAddVolunteerOpen] = useState(false);

  // Add Volunteer Form State
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });

  const allVolunteers = getAllVolunteers(selectedEntity);
  const volunteerProfile = selectedVolunteer ? getVolunteerProfile(selectedVolunteer, selectedEntity) : null;

  // Filter and sort volunteers
  const filteredAndSortedVolunteers = useMemo(() => {
    let filtered = allVolunteers.filter((volunteer) => {
      const matchesSearch =
        volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || volunteer.volunteerType === typeFilter;

      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'hours-high':
          return b.totalHours - a.totalHours;
        case 'hours-low':
          return a.totalHours - b.totalHours;
        case 'date-newest':
          return new Date(b.lastVolunteered).getTime() - new Date(a.lastVolunteered).getTime();
        case 'date-oldest':
          return new Date(a.lastVolunteered).getTime() - new Date(b.lastVolunteered).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [allVolunteers, searchQuery, sortBy, typeFilter]);

  const handleVolunteerClick = (volunteerName: string) => {
    setSelectedVolunteer(volunteerName);
    setView('profile');
  };

  const handleBackToList = () => {
    setSelectedVolunteer(null);
    setView('list');
  };

  const handleAddVolunteer = () => {
    if (!newVolunteer.name || !newVolunteer.email) {
      toast.error('Please fill in required fields (Name and Email)');
      return;
    }

    if (!newVolunteer.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    const entityName = entities.find(e => e.id === newVolunteer.entityId)?.name || 'the organization';
    toast.success(`Volunteer ${newVolunteer.name} added to ${entityName}!`);

    setNewVolunteer({
      name: '',
      email: '',
      phone: '',
      address: '',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
    setAddVolunteerOpen(false);
  };

  const getBackgroundCheckBadge = (status: VolunteerProfile['backgroundCheckStatus']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 gap-1">
            <AlertCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      case 'not-required':
        return (
          <Badge variant="outline" className="gap-1">
            N/A
          </Badge>
        );
    }
  };

  // Profile View
  if (view === 'profile' && volunteerProfile) {
    const initials = volunteerProfile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToList} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Volunteers</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start gap-3 sm:gap-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarFallback className="text-xl sm:text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-xl sm:text-2xl mb-2">{volunteerProfile.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="outline" className="capitalize text-xs">
                      {volunteerProfile.volunteerType}
                    </Badge>
                    {getBackgroundCheckBadge(volunteerProfile.backgroundCheckStatus)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{volunteerProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{volunteerProfile.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{volunteerProfile.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col gap-2 w-full md:w-auto">
                <Button className="gap-2 flex-1 md:flex-initial">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </Button>
                <Button variant="outline" className="gap-2 flex-1 md:flex-initial">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-950 rounded-lg flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
                  <p className="text-sm sm:text-xl truncate">{volunteerProfile.totalHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-950 rounded-lg flex-shrink-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                  <p className="text-sm sm:text-xl">{volunteerProfile.sessionCount}</p>
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
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Last Visit</p>
                  <p className="text-sm sm:text-base truncate">{volunteerProfile.lastVolunteered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Volunteer History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs sm:text-sm">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Volunteer History</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[60px]">Hours</TableHead>
                        <TableHead className="min-w-[150px]">Activity</TableHead>
                        <TableHead className="hidden md:table-cell min-w-[150px]">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {volunteerProfile.volunteerHistory.map((session, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">{session.date}</TableCell>
                          <TableCell className="font-medium">{session.hours}</TableCell>
                          <TableCell>{session.activity}</TableCell>
                          <TableCell className="hidden md:table-cell">{session.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Volunteer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volunteer Type</p>
                    <p className="capitalize">{volunteerProfile.volunteerType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">First Volunteered</p>
                    <p>{volunteerProfile.firstVolunteered}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Volunteered</p>
                    <p>{volunteerProfile.lastVolunteered}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Background Check</p>
                    {getBackgroundCheckBadge(volunteerProfile.backgroundCheckStatus)}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteerProfile.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Availability</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteerProfile.availability.map((time) => (
                      <Badge key={time} variant="secondary">{time}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteerProfile.interests.map((interest) => (
                      <Badge key={interest} className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                  <p className="text-gray-700 dark:text-gray-300">{volunteerProfile.notes}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Contact Name</p>
                    <p>{volunteerProfile.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Relationship</p>
                    <p>{volunteerProfile.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone Number</p>
                    <p>{volunteerProfile.emergencyContact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button and Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setPersonnelTool(null)}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Personnel Hub
        </Button>
        
        <PageHeader 
          title="Volunteers"
          subtitle="Manage volunteer information and hours"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search volunteers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('name-asc')}>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name-desc')}>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('hours-high')}>Total Hours (High to Low)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('hours-low')}>Total Hours (Low to High)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('date-newest')}>Last Visit (Newest)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('date-oldest')}>Last Visit (Oldest)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Heart className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Volunteer Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('regular')}>Regular</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('occasional')}>Occasional</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('event-based')}>Event-Based</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={addVolunteerOpen} onOpenChange={setAddVolunteerOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Volunteer</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Volunteer</DialogTitle>
              <DialogDescription>
                Enter the volunteer's information to add them to your program.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newVolunteer.name}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={newVolunteer.email}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={newVolunteer.phone}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State ZIP"
                  value={newVolunteer.address}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nonprofit">Nonprofit Organization *</Label>
                <Select
                  value={newVolunteer.entityId}
                  onValueChange={(value) => setNewVolunteer({ ...newVolunteer, entityId: value })}
                >
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddVolunteerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVolunteer}>Add Volunteer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedVolunteers.length} of {allVolunteers.length} volunteers
        </p>
        {(searchQuery || typeFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Volunteers Table - Desktop */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[180px]">Email</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[120px]">Phone</TableHead>
                  <TableHead className="min-w-[80px]">Hours</TableHead>
                  <TableHead className="min-w-[80px]">Sessions</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[100px]">Last Visit</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[90px]">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedVolunteers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                      No volunteers found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedVolunteers.map((volunteer) => (
                    <TableRow
                      key={volunteer.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleVolunteerClick(volunteer.name)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                              {volunteer.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate font-medium">{volunteer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[180px]">
                        {volunteer.email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{volunteer.phone}</TableCell>
                      <TableCell className="font-semibold">{volunteer.totalHours}</TableCell>
                      <TableCell>{volunteer.sessionCount}</TableCell>
                      <TableCell className="hidden md:table-cell">{volunteer.lastVolunteered}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="capitalize">
                          {volunteer.volunteerType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers List - Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredAndSortedVolunteers.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No volunteers found matching your criteria.
          </Card>
        ) : (
          filteredAndSortedVolunteers.map((volunteer) => (
            <Card
              key={volunteer.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow touch-manipulation"
              onClick={() => handleVolunteerClick(volunteer.name)}
            >
              <div className="space-y-3">
                {/* Header with Avatar and Name */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="text-base">
                      {volunteer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate">{volunteer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {volunteer.email}
                    </p>
                    <Badge variant="outline" className="capitalize mt-1">
                      {volunteer.volunteerType}
                    </Badge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Hours</div>
                    <div className="text-xl font-semibold">{volunteer.totalHours}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Sessions</div>
                    <div className="text-xl font-semibold">{volunteer.sessionCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last Visit</div>
                    <div className="text-sm">{volunteer.lastVolunteered}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
