
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

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  joinedDate: string;
  role: string;
  status: string;
  department: string;
  lastEditedBy: string;
  lastEditedTime: string;
}

interface UserManagementProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
}

export function UserManagement({ userRole }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      location: 'Trivandrum',
      joinedDate: '2024-01-15',
      role: 'team-member',
      status: 'active',
      department: 'Engineering',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 8, 2025 – 2:30 PM'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      location: 'Bangalore',
      joinedDate: '2024-02-20',
      role: 'admin',
      status: 'active',
      department: 'HR',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 7, 2025 – 10:45 AM'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      location: 'Kochi',
      joinedDate: '2024-01-08',
      role: 'team-member',
      status: 'inactive',
      department: 'DevOps',
      lastEditedBy: 'sarah.wilson',
      lastEditedTime: 'July 6, 2025 – 4:20 PM'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      location: 'Trivandrum',
      joinedDate: '2024-03-01',
      role: 'team-member',
      status: 'active',
      department: 'Marketing/BA',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 5, 2025 – 11:15 AM'
    },
    {
      id: '5',
      name: 'Alex Chen',
      email: 'alex.chen@email.com',
      location: 'Bangalore',
      joinedDate: '2024-02-14',
      role: 'team-member',
      status: 'pending',
      department: 'Finance',
      lastEditedBy: 'admin',
      lastEditedTime: 'July 4, 2025 – 3:00 PM'
    }
  ]);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      status: userData.status || 'active',
      department: userData.department || 'Engineering',
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
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter(user => user.role === 'admin').length;

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
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(user => user.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
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
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Marketing/BA">Marketing/BA</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
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
