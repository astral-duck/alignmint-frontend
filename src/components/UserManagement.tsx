import React, { useState, useMemo } from 'react';
import { useApp, entities, EntityId } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Search,
  Plus,
  UserPlus,
  Trash2,
  KeyRound,
  Shield,
  AlertCircle,
  CheckCircle2,
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
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  email: string;
  name: string;
  entityId: EntityId;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

// Mock user data
const generateMockUsers = (): User[] => {
  const users: User[] = [
    {
      id: 'USR-001',
      email: 'admin@infocusministries.org',
      name: 'System Administrator',
      entityId: 'all',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-10-20',
      createdAt: '2024-01-15',
    },
    {
      id: 'USR-002',
      email: 'sarah.johnson@awakenings.org',
      name: 'Sarah Johnson',
      entityId: 'awakenings',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-10-19',
      createdAt: '2024-03-20',
    },
    {
      id: 'USR-003',
      email: 'mike.chen@bloomstrong.org',
      name: 'Mike Chen',
      entityId: 'bloom-strong',
      role: 'user',
      status: 'active',
      lastLogin: '2025-10-18',
      createdAt: '2024-04-12',
    },
    {
      id: 'USR-004',
      email: 'lisa.martinez@bonfire.org',
      name: 'Lisa Martinez',
      entityId: 'bonfire',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-10-20',
      createdAt: '2024-02-08',
    },
    {
      id: 'USR-005',
      email: 'james.wilson@breakthrough.org',
      name: 'James Wilson',
      entityId: 'breakthrough',
      role: 'user',
      status: 'active',
      lastLogin: '2025-10-17',
      createdAt: '2024-05-22',
    },
    {
      id: 'USR-006',
      email: 'emma.davis@childyouthcare.org',
      name: 'Emma Davis',
      entityId: 'child-youth-care',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-10-19',
      createdAt: '2024-01-30',
    },
    {
      id: 'USR-007',
      email: 'david.thompson@awakenings.org',
      name: 'David Thompson',
      entityId: 'awakenings',
      role: 'user',
      status: 'inactive',
      lastLogin: '2025-09-15',
      createdAt: '2024-06-10',
    },
    {
      id: 'USR-008',
      email: 'maria.garcia@hugs.org',
      name: 'Maria Garcia',
      entityId: 'hugs-center',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-10-20',
      createdAt: '2024-03-05',
    },
  ];

  return users;
};

export const UserManagement: React.FC = () => {
  const { selectedEntity, setAdministrationTool } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(generateMockUsers());

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
    role: 'user' as 'admin' | 'user',
  });

  const isInFocusAdmin = selectedEntity === 'all';

  // Filter users based on selected entity
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // If not InFocus admin, only show users from their entity
    if (!isInFocusAdmin) {
      filtered = filtered.filter(user => user.entityId === selectedEntity);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [users, selectedEntity, searchQuery, isInFocusAdmin]);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isInFocusAdmin && !newUser.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    if (isInFocusAdmin && !newUser.entityId) {
      toast.error('Please select a nonprofit organization');
      return;
    }

    const entityName = entities.find(e => e.id === newUser.entityId)?.name || 'organization';
    
    const user: User = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      entityId: newUser.entityId as EntityId,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, user]);
    toast.success(`User ${newUser.name} added to ${entityName}!`);

    // Reset form
    setNewUser({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
      role: 'user',
    });
    setAddUserOpen(false);
  };

  const handleResetPassword = () => {
    if (selectedUser) {
      toast.success(`Password reset email sent to ${selectedUser.email}`);
      setResetPasswordOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success(`User ${selectedUser.name} has been removed`);
      setDeleteUserOpen(false);
      setSelectedUser(null);
    }
  };

  const openResetPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setResetPasswordOpen(true);
  };

  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteUserOpen(true);
  };

  const getStatusBadge = (status: User['status']) => {
    if (status === 'active') {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 gap-1">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    }
    return <Badge variant="outline">User</Badge>;
  };

  // Calculate stats
  const activeUsers = filteredUsers.filter(u => u.status === 'active').length;
  const adminUsers = filteredUsers.filter(u => u.role === 'admin').length;

  // Check if user has access to User Management
  if (selectedEntity !== 'infocus-ministries') {
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

        {/* Access Denied Message */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-950 rounded-full mb-4">
                <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Access Restricted
              </h3>
              <p className="text-orange-800 dark:text-orange-200 max-w-md">
                User Management is only available for InFocus Ministries. Please select InFocus Ministries from the entity selector to access this feature.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100 mb-1">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isInFocusAdmin
              ? 'Manage all users across all nonprofits'
              : 'Manage users for your nonprofit'}
          </p>
        </div>
      </div>

      {/* Admin Notice */}
      {isInFocusAdmin && (
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">
                  InFocus Ministries Admin Access
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  You have full access to manage users across all nonprofits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl">{filteredUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl">{activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                <p className="text-2xl">{adminUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add User */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account {!isInFocusAdmin && 'for your nonprofit'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.org"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              {isInFocusAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="entity">Nonprofit Organization *</Label>
                  <Select
                    value={newUser.entityId}
                    onValueChange={(value) => setNewUser({ ...newUser, entityId: value })}
                  >
                    <SelectTrigger id="entity">
                      <SelectValue placeholder="Select nonprofit..." />
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
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'admin' | 'user') => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
        </p>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </Button>
        )}
      </div>

      {/* Users Table - Desktop */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">ID</TableHead>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  {isInFocusAdmin && (
                    <TableHead className="min-w-[150px]">Organization</TableHead>
                  )}
                  <TableHead className="min-w-[100px]">Role</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[100px]">Status</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[120px]">Last Login</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isInFocusAdmin ? 8 : 7} className="text-center py-8 text-gray-500 text-sm">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      {isInFocusAdmin && (
                        <TableCell>
                          <span className="text-sm">
                            {entities.find((e) => e.id === user.entityId)?.name || 'Unknown'}
                          </span>
                        </TableCell>
                      )}
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-gray-600 dark:text-gray-400">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openResetPasswordDialog(user)}
                            title="Reset password"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteUserDialog(user)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            title="Delete user"
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
          </div>
        </CardContent>
      </Card>

      {/* Users List - Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No users found.
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 touch-manipulation">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                      {user.id}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm">
                  {isInFocusAdmin && (
                    <div className="col-span-2">
                      <div className="text-gray-500 dark:text-gray-400">Organization</div>
                      <div>{entities.find((e) => e.id === user.entityId)?.name || 'Unknown'}</div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <div className="text-gray-500 dark:text-gray-400">Last Login</div>
                    <div>{user.lastLogin}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-h-[44px]"
                    onClick={() => openResetPasswordDialog(user)}
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[44px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    onClick={() => openDeleteUserDialog(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reset Password Dialog */}
      <AlertDialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Send a password reset email to <span className="font-medium">{selectedUser?.email}</span>?
              <br />
              The user will receive instructions to create a new password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>Send Reset Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">{selectedUser?.name}</span>?
              <br />
              This action cannot be undone and the user will lose access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
