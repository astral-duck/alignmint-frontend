import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getPersonnelProfile, getAllPersonnel, getPersonnelByEntity, PersonnelProfile } from '../lib/mockData';
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
  Briefcase,
  UserCheck,
  ArrowLeft,
  Edit,
  Search,
  UserPlus,
  ArrowUpDown,
  ChevronDown,
  Users,
  Building,
  DollarSign,
  FileText,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { PageHeader } from './PageHeader';

type SortOption = 'name-asc' | 'name-desc' | 'role-asc' | 'role-desc' | 'date-newest' | 'date-oldest';
type EmploymentFilter = 'all' | 'full-time' | 'part-time' | 'contractor' | 'volunteer';
type StatusFilter = 'all' | 'active' | 'on-leave' | 'inactive';

export const PersonnelCRM: React.FC = () => {
  const { selectedEntity, setPersonnelTool } = useApp();
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'profile'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [employmentFilter, setEmploymentFilter] = useState<EmploymentFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  
  // User Management State
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [updateRoleOpen, setUpdateRoleOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [accountStatus, setAccountStatus] = useState<'active' | 'inactive'>('active');

  // Add Person Form State
  const [newPerson, setNewPerson] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
    employmentType: 'full-time' as const,
    // User management fields
    createUserAccount: true,
    userRole: 'user' as 'admin' | 'user',
    password: '',
    confirmPassword: '',
    accountStatus: 'active' as 'active' | 'inactive',
  });

  const allPersonnel = getAllPersonnel(selectedEntity);
  const personnelByEntity = getPersonnelByEntity();
  const personnelProfile = selectedPerson ? getPersonnelProfile(selectedPerson, selectedEntity) : null;

  // Filter and sort personnel
  const filteredAndSortedPersonnel = useMemo(() => {
    let filtered = allPersonnel.filter((person) => {
      // Search filter
      const matchesSearch =
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase());

      // Employment type filter
      const matchesEmployment = employmentFilter === 'all' || person.employmentType === employmentFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || person.status === statusFilter;

      return matchesSearch && matchesEmployment && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'role-asc':
          return a.role.localeCompare(b.role);
        case 'role-desc':
          return b.role.localeCompare(a.role);
        case 'date-newest':
          return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
        case 'date-oldest':
          return new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [allPersonnel, searchQuery, sortBy, employmentFilter, statusFilter]);

  const handlePersonClick = (personName: string) => {
    setSelectedPerson(personName);
    setView('profile');
  };

  const handleBackToList = () => {
    setSelectedPerson(null);
    setView('list');
  };

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.email || !newPerson.role) {
      toast.error('Please fill in required fields (Name, Email, and Role)');
      return;
    }

    if (!newPerson.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    // Validate user account fields if creating user account
    if (newPerson.createUserAccount) {
      if (!newPerson.password || !newPerson.confirmPassword) {
        toast.error('Please enter a password for the user account');
        return;
      }
      
      if (newPerson.password !== newPerson.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (newPerson.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }
    }

    const entityName = entities.find(e => e.id === newPerson.entityId)?.name || 'the organization';
    
    if (newPerson.createUserAccount) {
      toast.success(`${newPerson.name} added to ${entityName} with ${newPerson.userRole} access!`);
    } else {
      toast.success(`${newPerson.name} added to ${entityName}!`);
    }

    setNewPerson({
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
      employmentType: 'full-time',
      createUserAccount: true,
      userRole: 'user',
      password: '',
      confirmPassword: '',
      accountStatus: 'active',
    });
    setAddPersonOpen(false);
  };

  // User Management Handlers
  const handleResetPassword = () => {
    if (personnelProfile) {
      toast.success(`Password reset email sent to ${personnelProfile.email}`);
      setResetPasswordOpen(false);
    }
  };

  const handleUpdateRole = () => {
    if (personnelProfile) {
      toast.success(`User role updated to ${userRole} for ${personnelProfile.name}`);
      setUpdateRoleOpen(false);
    }
  };

  const handleUpdateAccountStatus = (status: 'active' | 'inactive') => {
    if (personnelProfile) {
      setAccountStatus(status);
      toast.success(`Account ${status === 'active' ? 'activated' : 'deactivated'} for ${personnelProfile.name}`);
    }
  };

  const getStatusBadge = (status: PersonnelProfile['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">On Leave</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Inactive</Badge>;
    }
  };

  const getEmploymentBadge = (type: PersonnelProfile['employmentType']) => {
    switch (type) {
      case 'full-time':
        return <Badge variant="outline">Full-Time</Badge>;
      case 'part-time':
        return <Badge variant="outline">Part-Time</Badge>;
      case 'contractor':
        return <Badge variant="outline">Contractor</Badge>;
      case 'volunteer':
        return <Badge variant="outline">Volunteer</Badge>;
    }
  };

  // Profile View
  if (view === 'profile' && personnelProfile) {
    const initials = personnelProfile.name
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
            <span className="hidden sm:inline">Back to Team</span>
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
                  <h1 className="text-xl sm:text-2xl mb-2">{personnelProfile.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{personnelProfile.role}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {getStatusBadge(personnelProfile.status)}
                    {getEmploymentBadge(personnelProfile.employmentType)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{personnelProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{personnelProfile.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{personnelProfile.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <Briefcase className="h-4 w-4 flex-shrink-0" />
                  <span>{personnelProfile.department}</span>
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
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Hire Date</p>
                  <p className="text-sm sm:text-xl truncate">{personnelProfile.hireDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-950 rounded-lg flex-shrink-0">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Organization</p>
                  <p className="text-sm sm:text-base truncate">
                    {entities.find(e => e.id === personnelProfile.entityId)?.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-950 rounded-lg flex-shrink-0">
                  <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="text-sm sm:text-base capitalize truncate">{personnelProfile.employmentType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-950 rounded-lg flex-shrink-0">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Department</p>
                  <p className="text-sm sm:text-base truncate">{personnelProfile.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="employment" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employment" className="text-xs sm:text-sm">Employment</TabsTrigger>
            <TabsTrigger value="tax" className="text-xs sm:text-sm">Tax Info</TabsTrigger>
            <TabsTrigger value="user-account" className="text-xs sm:text-sm">User Account</TabsTrigger>
          </TabsList>

          <TabsContent value="employment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Position</p>
                    <p>{personnelProfile.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Department</p>
                    <p>{personnelProfile.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Employment Type</p>
                    <p className="capitalize">{personnelProfile.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <p className="capitalize">{personnelProfile.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hire Date</p>
                    <p>{personnelProfile.hireDate}</p>
                  </div>
                  {personnelProfile.salary && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Annual Salary</p>
                      <p>${personnelProfile.salary.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                  <p className="text-gray-700 dark:text-gray-300">{personnelProfile.notes}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tax" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Tax Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personnelProfile.taxInfo.ssn && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">SSN (Last 4)</p>
                      <p className="font-mono">{personnelProfile.taxInfo.ssn}</p>
                    </div>
                  )}
                  {personnelProfile.taxInfo.taxId && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tax ID</p>
                      <p className="font-mono">{personnelProfile.taxInfo.taxId}</p>
                    </div>
                  )}
                  {personnelProfile.taxInfo.w4Status && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">W-4 Filing Status</p>
                      <p>{personnelProfile.taxInfo.w4Status}</p>
                    </div>
                  )}
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <Shield className="h-4 w-4 inline mr-2" />
                    This information is encrypted and accessible only to authorized personnel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Status */}
                <div>
                  <h3 className="font-medium mb-3">Account Status</h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {accountStatus === 'active' ? (
                        <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {accountStatus === 'active' ? 'Account Active' : 'Account Inactive'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {accountStatus === 'active' 
                            ? 'User can login and access the platform' 
                            : 'User cannot login to the platform'}
                        </p>
                      </div>
                    </div>
                    <Select
                      value={accountStatus}
                      onValueChange={(value: 'active' | 'inactive') => handleUpdateAccountStatus(value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* User Role */}
                <div>
                  <h3 className="font-medium mb-3">User Role & Permissions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                          <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">Current Role</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {userRole === 'admin' ? 'Administrator - Full access' : 'User - Standard access'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setUpdateRoleOpen(true)}
                      >
                        Update Role
                      </Button>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Role Descriptions:</strong>
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 ml-4 list-disc">
                        <li><strong>Admin:</strong> Full access to all features and settings for their organization</li>
                        <li><strong>User:</strong> Standard access to view and manage assigned tasks and data</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Password Reset */}
                <div>
                  <h3 className="font-medium mb-3">Password & Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                          <KeyRound className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium">Password Reset</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Send a password reset email to {personnelProfile.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setResetPasswordOpen(true)}
                      >
                        <KeyRound className="h-4 w-4 mr-2" />
                        Reset Password
                      </Button>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <AlertCircle className="h-4 w-4 inline mr-2" />
                        The user will receive an email with instructions to create a new password. Their current password will remain valid until they complete the reset process.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Account Information */}
                <div>
                  <h3 className="font-medium mb-3">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</p>
                      <p className="font-medium">{personnelProfile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User ID</p>
                      <p className="font-mono text-sm">{personnelProfile.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Created</p>
                      <p>{personnelProfile.hireDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Login</p>
                      <p>2025-11-03 10:24 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Password Reset Dialog */}
        <AlertDialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Password</AlertDialogTitle>
              <AlertDialogDescription>
                Send a password reset email to <span className="font-medium">{personnelProfile.email}</span>?
                <br /><br />
                The user will receive instructions to create a new password. Their current password will remain valid until they complete the reset process.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetPassword}>Send Reset Email</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Update Role Dialog */}
        <Dialog open={updateRoleOpen} onOpenChange={setUpdateRoleOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update User Role</DialogTitle>
              <DialogDescription>
                Change the access level for {personnelProfile.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userRole">Select Role</Label>
                <Select
                  value={userRole}
                  onValueChange={(value: 'admin' | 'user') => setUserRole(value)}
                >
                  <SelectTrigger id="userRole">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex flex-col items-start py-1">
                        <span className="font-medium">User</span>
                        <span className="text-xs text-gray-500">Standard access to assigned features</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex flex-col items-start py-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          <span className="font-medium">Administrator</span>
                        </div>
                        <span className="text-xs text-gray-500">Full access to all features and settings</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Role changes take effect immediately. The user will be notified of their new access level.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdateRoleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole}>Update Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // List View
  if (selectedEntity === 'all') {
    // Show grouped view by nonprofit
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setPersonnelTool(null)}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Personnel Hub
        </Button>

        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl">Groups & Teams</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View all personnel across organizations
            </p>
          </div>
          <Dialog open={addPersonOpen} onOpenChange={setAddPersonOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Personnel</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>
                  Enter the team member's information and optionally create a user account for platform access.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Position *</Label>
                  <Input
                    id="role"
                    placeholder="Program Coordinator"
                    value={newPerson.role}
                    onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="Operations"
                    value={newPerson.department}
                    onChange={(e) => setNewPerson({ ...newPerson, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@email.com"
                    value={newPerson.email}
                    onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={newPerson.phone}
                    onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    value={newPerson.employmentType}
                    onValueChange={(value) => setNewPerson({ ...newPerson, employmentType: value as any })}
                  >
                    <SelectTrigger id="employmentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonprofit">Nonprofit Organization *</Label>
                  <Select
                    value={newPerson.entityId}
                    onValueChange={(value) => setNewPerson({ ...newPerson, entityId: value })}
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

                {/* User Account Management Section */}
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Create User Account</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow this person to login to the platform
                      </p>
                    </div>
                    <Switch
                      checked={newPerson.createUserAccount}
                      onCheckedChange={(checked) => setNewPerson({ ...newPerson, createUserAccount: checked })}
                    />
                  </div>

                  {newPerson.createUserAccount && (
                    <div className="space-y-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                      <div className="space-y-2">
                        <Label htmlFor="userRole">User Role</Label>
                        <Select
                          value={newPerson.userRole}
                          onValueChange={(value: 'admin' | 'user') => setNewPerson({ ...newPerson, userRole: value })}
                        >
                          <SelectTrigger id="userRole">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">
                              <div className="flex items-center gap-2">
                                <span>User</span>
                                <span className="text-xs text-gray-500">- Standard access</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <Shield className="h-3 w-3" />
                                <span>Admin</span>
                                <span className="text-xs text-gray-500">- Full access</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={newPerson.password}
                          onChange={(e) => setNewPerson({ ...newPerson, password: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Minimum 8 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={newPerson.confirmPassword}
                          onChange={(e) => setNewPerson({ ...newPerson, confirmPassword: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountStatus">Account Status</Label>
                        <Select
                          value={newPerson.accountStatus}
                          onValueChange={(value: 'active' | 'inactive') => setNewPerson({ ...newPerson, accountStatus: value })}
                        >
                          <SelectTrigger id="accountStatus">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active - Can login immediately</SelectItem>
                            <SelectItem value="inactive">Inactive - Cannot login</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddPersonOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPerson}>
                  {newPerson.createUserAccount ? 'Add Team Member & Create Account' : 'Add Team Member'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grouped Personnel Cards */}
        <div className="space-y-4 sm:space-y-6">
          {Array.from(personnelByEntity.entries()).map(([entityId, personnel]) => {
            const entity = entities.find(e => e.id === entityId);
            if (!entity || personnel.length === 0) return null;

            return (
              <Card key={entityId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                        <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl">{entity.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {personnel.length} team {personnel.length === 1 ? 'member' : 'members'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personnel.map((person) => (
                      <div
                        key={person.id}
                        onClick={() => handlePersonClick(person.name)}
                        className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback>
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{person.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{person.role}</p>
                          <div className="flex gap-2 mt-2">
                            {getStatusBadge(person.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Single Entity View
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setPersonnelTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Personnel Hub
      </Button>

      {/* Page Header */}
      <PageHeader 
        title="Personnel"
        subtitle="Manage staff, employees, and contractors"
      />

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search team members..."
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
            <DropdownMenuItem onClick={() => setSortBy('role-asc')}>Role (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('role-desc')}>Role (Z-A)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('date-newest')}>Hire Date (Newest)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('date-oldest')}>Hire Date (Oldest)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Employment Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setEmploymentFilter('all')}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEmploymentFilter('full-time')}>Full-Time</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEmploymentFilter('part-time')}>Part-Time</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEmploymentFilter('contractor')}>Contractor</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEmploymentFilter('volunteer')}>Volunteer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('on-leave')}>On Leave</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={addPersonOpen} onOpenChange={setAddPersonOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Personnel</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Enter the team member's information and optionally create a user account for platform access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name2">Full Name *</Label>
                <Input
                  id="name2"
                  placeholder="John Doe"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role2">Role/Position *</Label>
                <Input
                  id="role2"
                  placeholder="Program Coordinator"
                  value={newPerson.role}
                  onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department2">Department</Label>
                <Input
                  id="department2"
                  placeholder="Operations"
                  value={newPerson.department}
                  onChange={(e) => setNewPerson({ ...newPerson, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email2">Email *</Label>
                <Input
                  id="email2"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone2">Phone</Label>
                <Input
                  id="phone2"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={newPerson.phone}
                  onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType2">Employment Type</Label>
                <Select
                  value={newPerson.employmentType}
                  onValueChange={(value) => setNewPerson({ ...newPerson, employmentType: value as any })}
                >
                  <SelectTrigger id="employmentType2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nonprofit2">Nonprofit Organization *</Label>
                <Select
                  value={newPerson.entityId}
                  onValueChange={(value) => setNewPerson({ ...newPerson, entityId: value })}
                >
                  <SelectTrigger id="nonprofit2">
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

              {/* User Account Management Section */}
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Create User Account</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow this person to login to the platform
                    </p>
                  </div>
                  <Switch
                    checked={newPerson.createUserAccount}
                    onCheckedChange={(checked) => setNewPerson({ ...newPerson, createUserAccount: checked })}
                  />
                </div>

                {newPerson.createUserAccount && (
                  <div className="space-y-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                    <div className="space-y-2">
                      <Label htmlFor="userRole2">User Role</Label>
                      <Select
                        value={newPerson.userRole}
                        onValueChange={(value: 'admin' | 'user') => setNewPerson({ ...newPerson, userRole: value })}
                      >
                        <SelectTrigger id="userRole2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <span>User</span>
                              <span className="text-xs text-gray-500">- Standard access</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3" />
                              <span>Admin</span>
                              <span className="text-xs text-gray-500">- Full access</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password2">Password *</Label>
                      <Input
                        id="password2"
                        type="password"
                        placeholder="••••••••"
                        value={newPerson.password}
                        onChange={(e) => setNewPerson({ ...newPerson, password: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">Minimum 8 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword2">Confirm Password *</Label>
                      <Input
                        id="confirmPassword2"
                        type="password"
                        placeholder="••••••••"
                        value={newPerson.confirmPassword}
                        onChange={(e) => setNewPerson({ ...newPerson, confirmPassword: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountStatus2">Account Status</Label>
                      <Select
                        value={newPerson.accountStatus}
                        onValueChange={(value: 'active' | 'inactive') => setNewPerson({ ...newPerson, accountStatus: value })}
                      >
                        <SelectTrigger id="accountStatus2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active - Can login immediately</SelectItem>
                          <SelectItem value="inactive">Inactive - Cannot login</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddPersonOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPerson}>
                {newPerson.createUserAccount ? 'Add Team Member & Create Account' : 'Add Team Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedPersonnel.length} of {allPersonnel.length} team members
        </p>
        {(searchQuery || employmentFilter !== 'all' || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setEmploymentFilter('all');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Personnel Table - Desktop */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[120px]">Role</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[120px]">Department</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="hidden xl:table-cell min-w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPersonnel.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                      No team members found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedPersonnel.map((person) => (
                    <TableRow
                      key={person.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handlePersonClick(person.name)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate font-medium">{person.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="truncate">{person.role}</TableCell>
                      <TableCell className="hidden md:table-cell truncate">{person.department}</TableCell>
                      <TableCell className="hidden lg:table-cell truncate">{person.email}</TableCell>
                      <TableCell>
                        {getEmploymentBadge(person.employmentType)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {getStatusBadge(person.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Personnel List - Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredAndSortedPersonnel.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No team members found matching your criteria.
          </Card>
        ) : (
          filteredAndSortedPersonnel.map((person) => (
            <Card
              key={person.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow touch-manipulation"
              onClick={() => handlePersonClick(person.name)}
            >
              <div className="space-y-3">
                {/* Header with Avatar and Name */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="text-base">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate">{person.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{person.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{person.department}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {getEmploymentBadge(person.employmentType)}
                  {getStatusBadge(person.status)}
                </div>

                {/* Contact Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  <Mail className="h-3 w-3 inline mr-1" />
                  {person.email}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
