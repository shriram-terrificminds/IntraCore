
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, User, UserPlus, Settings, Edit, Trash2 } from 'lucide-react';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  userRole: UserRole;
}

interface LiveUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  joinedDate: string;
  role: UserRole;
  profileImage?: string;
  joinedDate: string;
  lastEditedBy: string;
  lastEditedTime: string;
  password?: string;
}

interface UserManagementProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
}

const roleMap = {
  1: 'Admin',
  2: 'HR', 
  3: 'DevOps',
  4: 'Employee'
};

const locationMap = {
  'TVM': 'TVM',
  'Ernakulam': 'Ernakulam', 
  'Bangalore': 'Bangalore'
};

export function UserManagement({ userRole }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      location: 'TVM',
      role: 4,
      joinedDate: '2024-01-15',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 8, 2025 – 2:30 PM'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@email.com',
      location: 'Bangalore',
      role: 1,
      joinedDate: '2024-02-20',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 7, 2025 – 10:45 AM'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@email.com',
      location: 'Ernakulam',
      role: 3,
      joinedDate: '2024-01-08',
      lastEditedBy: 'sarah.wilson',
      lastEditedTime: 'July 6, 2025 – 4:20 PM'
    },
    {
      id: '4',
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@email.com',
      location: 'TVM',
      role: 4,
      joinedDate: '2024-03-01',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 5, 2025 – 11:15 AM'
    },
    {
      id: '5',
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'alex.chen@email.com',
      location: 'Bangalore',
      role: 2,
      joinedDate: '2024-02-14',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 4, 2025 – 3:00 PM'
    }
  ]);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role.toString() === roleFilter;
    const matchesLocation = locationFilter === 'all' || user.location === locationFilter;
    
    return matchesSearch && matchesRole && matchesLocation;
  });

  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      role: userData.role || 4, // Default to Employee (4)
      joinedDate: new Date().toISOString().split('T')[0],
      lastEditedBy: 'admin',
      lastEditedTime: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/,/, ' –')
    } as User;
    
    setUsers(prev => [...prev, newUser]);
    
    toast({
      title: "User Created",
      description: "User has been created successfully with temporary password. Welcome email sent.",
    });
  };

  const handleEditUser = (userData: Partial<User>) => {
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
    
    toast({
      title: "User Updated",
      description: "User information has been updated successfully",
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    
    toast({
      title: "User Deleted",
      description: "User has been deleted successfully",
    });
  };

  const getRoleBadge = (role: number) => {
    switch (role) {
      case 1:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 2:
        return 'bg-green-100 text-green-800 border-green-200';
      case 3:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 4:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter(user => user.role === 1).length;

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
          {userRole === 'admin' && (
            <Button onClick={() => setCreateUserOpen(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create User
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">HR</SelectItem>
                  <SelectItem value="3">DevOps</SelectItem>
                  <SelectItem value="4">Employee</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="TVM">TVM</SelectItem>
                  <SelectItem value="Ernakulam">Ernakulam</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
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
                <TableHead>Joined Date</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      {roleMap[user.role as keyof typeof roleMap]}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{user.lastEditedBy}</div>
                      <div className="text-muted-foreground">{user.lastEditedTime}</div>
                    </div>
                  </TableCell>
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
        onCreateUser={handleCreateUser}
      />

      <EditUserDialog
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        onEditUser={handleEditUser}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={deleteUserOpen}
        onOpenChange={setDeleteUserOpen}
        onDeleteUser={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
}
