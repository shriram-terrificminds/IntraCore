import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import type { User, UserRole, UserLocation } from '@/types';
import { USER_ROLES, USER_LOCATIONS } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserManagementProps {
  userRole: 'Admin' | 'Devops'  | 'Hr'| 'Employee';
}

export function UserManagement({ userRole }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const roles = USER_ROLES;
  const locations = USER_LOCATIONS;
  const [loading, setLoading] = useState(true);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Fetch users, roles, and locations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users with filters
        const response = await api.get('/users', {
          params: {
            search: searchQuery,
            role_id: roleFilter !== 'all' ? roleFilter : undefined,
            location_id: locationFilter !== 'all' ? locationFilter : undefined,
          },
        });
        setUsers(response.data.data || response.data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load user data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, roleFilter, locationFilter]);

  // Create user
  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await api.post('/users', userData);
      toast({ title: 'User Created', description: 'User has been created successfully.' });
      setCreateUserOpen(false);
      // Refresh user list
      const response = await api.get('/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create user', variant: 'destructive' });
    }
  };

  // Edit user
  const handleEditUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;
    try {
      await api.patch(`/users/${selectedUser.id}`, userData);
      toast({ title: 'User Updated', description: 'User information has been updated successfully.' });
      setEditUserOpen(false);
      // Refresh user list
      const response = await api.get('/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/users/${selectedUser.id}`);
      toast({ title: 'User Deleted', description: 'User has been deleted successfully.' });
      setDeleteUserOpen(false);
      // Refresh user list
      const response = await api.get('/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.id.toString() === roleFilter;
    const matchesLocation = locationFilter === 'all' || user.location.id.toString() === locationFilter;
    return matchesSearch && matchesRole && matchesLocation;
  });

  const getRoleBadge = (role: User['role']) => {
    switch (role.name) {
      case 'Admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Hr':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Devops':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Employee':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to get avatar initials safely
  const getAvatarInitials = (user) => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const totalUsers = users.length;
  const adminCount = users.filter(user => user.role.name === 'Admin').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and monitor users
          </p>
        </div>
        <Button onClick={() => setCreateUserOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">👤</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">👤</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              Admin users
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {/* Avatar Fallback Only */}
                    <div className="flex flex-row items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {getAvatarInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      {user.first_name} {user.last_name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.location.name}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(user.updated_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setEditUserOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteUserOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateUserDialog
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onCreateUser={(userData) => {
          // userData already has correct fields from dialog
          handleCreateUser({
            ...userData,
            location: userData.location,
            role: userData.role,
            profile_image: userData.profile_image || null,
          });
        }}
      />

      <EditUserDialog
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        onEditUser={(userData) => {
          handleEditUser({
            ...userData,
            location: userData.location,
            role: userData.role,
            profile_image: userData.profile_image || null,
          });
        }}
        user={selectedUser ? {
          id: selectedUser.id,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          location: selectedUser.location,
          role: selectedUser.role,
          profile_image: selectedUser.profile_image || '',
          created_at: selectedUser.created_at,
          updated_at: selectedUser.updated_at,
        } : null}
      />

      <DeleteUserDialog
        open={deleteUserOpen}
        onOpenChange={setDeleteUserOpen}
        onDeleteUser={handleDeleteUser}
        user={selectedUser ? {
          id: selectedUser.id,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          location: selectedUser.location,
          role: selectedUser.role,
          profile_image: selectedUser.profile_image || '',
          created_at: selectedUser.created_at,
          updated_at: selectedUser.updated_at,
        } : null}
      />
    </div>
  );
}
