
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, User, UserPlus, Settings, Edit, Trash2, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';

interface UserManagementProps {
  userRole: 'admin' | 'member' | 'devops' | 'hr';
}

interface LiveUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  joinedDate: string;
  role: 'admin' | 'member' | 'devops' | 'hr';
  profileImage?: string;
  lastEditedBy: string;
  lastEditedTime: string;
}

export function UserManagement({ userRole }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [users, setUsers] = useState<LiveUser[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      location: 'Trivandrum',
      joinedDate: '2024-01-15',
      role: 'member',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 8, 2025 – 2:30 PM'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@email.com',
      location: 'Kochi',
      joinedDate: '2024-02-20',
      role: 'devops',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b593?w=64&h=64&fit=crop&crop=face',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 7, 2025 – 10:45 AM'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@email.com',
      location: 'Bangalore',
      joinedDate: '2024-01-08',
      role: 'devops',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      lastEditedBy: 'sarah.wilson',
      lastEditedTime: 'July 6, 2025 – 4:20 PM'
    },
    {
      id: '4',
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@email.com',
      location: 'Trivandrum',
      joinedDate: '2024-03-01',
      role: 'hr',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 5, 2025 – 11:15 AM'
    },
    {
      id: '5',
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'alex.chen@email.com',
      location: 'Kochi',
      joinedDate: '2024-02-14',
      role: 'member',
      profileImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=64&h=64&fit=crop&crop=face',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 4, 2025 – 3:00 PM'
    }
  ]);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);

  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesLocation = locationFilter === 'all' || user.location === locationFilter;
    return matchesSearch && matchesRole && matchesLocation;
  });

  const handleCreateUser = (userData: Omit<LiveUser, 'id' | 'lastEditedBy' | 'lastEditedTime'>) => {
    const newUser: LiveUser = {
      ...userData,
      id: Date.now().toString(),
      lastEditedBy: 'admin',
      lastEditedTime: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/,/, ' –')
    };
    setUsers(prev => [...prev, newUser]);
    
    // Send welcome email notification
    toast({
      title: "User Created",
      description: `Welcome email sent to ${userData.email} with login instructions`,
    });
  };

  const handleEditUser = (userData: Partial<LiveUser>) => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? { 
        ...user, 
        ...userData,
        lastEditedBy: 'admin',
        lastEditedTime: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/,/, ' –')
      } : user
    ));
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-blue-100 text-blue-800 border-blue-200',
      member: 'bg-green-100 text-green-800 border-green-200',
      devops: 'bg-purple-100 text-purple-800 border-purple-200',
      hr: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const totalUsers = users.length;
  const adminCount = users.filter(user => user.role === 'admin').length;
  const devopsCount = users.filter(user => user.role === 'devops').length;
  const hrCount = users.filter(user => user.role === 'hr').length;
  const memberCount = users.filter(user => user.role === 'member').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and monitor users
          </p>
        </div>
        <div className="flex gap-2">
          {['admin', 'devops', 'hr'].includes(userRole) && (
            <Button onClick={() => setCreateUserOpen(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create User
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
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
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              Admin users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{memberCount}</div>
            <p className="text-xs text-muted-foreground">
              Regular members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Trivandrum">Trivandrum</SelectItem>
                <SelectItem value="Kochi">Kochi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Last Edited By</TableHead>
                  <TableHead>Last Edited Time</TableHead>
                  {['admin', 'devops', 'hr'].includes(userRole) && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.joinedDate}</TableCell>
                    <TableCell>
                      <span className="font-medium">{user.lastEditedBy}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.lastEditedTime}</span>
                    </TableCell>
                    {['admin', 'devops', 'hr'].includes(userRole) && (
                      <TableCell>
                        <div className="flex items-center gap-1">
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
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserDialog 
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onCreateUser={handleCreateUser}
      />
      
      <EditUserDialog 
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        user={selectedUser}
        onEditUser={handleEditUser}
      />
      
      <DeleteUserDialog 
        open={deleteUserOpen}
        onOpenChange={setDeleteUserOpen}
        user={selectedUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
