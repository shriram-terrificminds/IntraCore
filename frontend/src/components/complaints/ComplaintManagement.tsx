import { useState, useEffect } from 'react';
import { Plus, Search, Filter, SortDesc } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewComplaintDialog } from './NewComplaintDialog';
import { ComplaintCard } from './ComplaintCard';
import { useToast } from '@/hooks/use-toast';
import { User } from '../../types'; // Import User to get UserRole

interface ComplaintManagementProps {
  userRole: User['role']; // Corrected type for userRole
}

// Mock data for demonstration
const mockComplaints = [
  {
    id: 1,
    title: 'Coffee machine not working',
    description: 'The coffee machine in the main pantry is not dispensing coffee properly. It makes a grinding noise but no coffee comes out.',
    role: { name: 'Admin' },
    resolution_status: 'Pending',
    resolution_notes: null,
    created_at: '2024-01-15T10:30:00Z',
    resolved_at: null,
    user: { name: 'John Doe' },
    resolvedBy: null,
    images: [
      { image_url: 'complaints/coffee-machine-1.jpg' },
      { image_url: 'complaints/coffee-machine-2.jpg' }
    ]
  },
  {
    id: 2,
    title: 'WiFi connectivity issues',
    description: 'Frequent disconnections and slow internet speed in the conference room. Affecting video calls and presentations.',
    role: { name: 'DevOps' },
    resolution_status: 'In-progress',
    resolution_notes: 'Investigating network configuration. Will check router settings and signal strength.',
    created_at: '2024-01-14T14:20:00Z',
    resolved_at: null,
    user: { name: 'Sarah Smith' },
    resolvedBy: null,
    images: [
      { image_url: 'complaints/wifi-issue.jpg' }
    ]
  },
  {
    id: 3,
    title: 'Air conditioning too cold',
    description: 'The AC in the open workspace is set too cold, making it uncomfortable for employees. Temperature needs adjustment.',
    role: { name: 'Admin' },
    resolution_status: 'Resolved',
    resolution_notes: 'Temperature adjusted from 18°C to 22°C. All employees notified of the change.',
    created_at: '2024-01-13T09:15:00Z',
    resolved_at: '2024-01-15T16:45:00Z',
    user: { name: 'Mike Johnson' },
    resolvedBy: { name: 'Admin Team' },
    images: []
  },
  {
    id: 4,
    title: 'Printer paper jam',
    description: 'The main office printer has a paper jam that needs to be cleared. Affecting document printing for the entire floor.',
    role: { name: 'Admin' },
    resolution_status: 'Rejected',
    resolution_notes: 'Issue resolved by user after following troubleshooting guide. No further action needed.',
    created_at: '2024-01-12T11:00:00Z',
    resolved_at: '2024-01-12T11:30:00Z',
    user: { name: 'Lisa Chen' },
    resolvedBy: { name: 'Admin Team' },
    images: [
      { image_url: 'complaints/printer-jam.jpg' }
    ]
  },
  {
    id: 5,
    title: 'Broken office chair',
    description: 'Office chair in cubicle A3 has a broken wheel and won\'t roll properly. Needs replacement or repair.',
    role: { name: 'HR' },
    resolution_status: 'Pending',
    resolution_notes: null,
    created_at: '2024-01-16T08:45:00Z',
    resolved_at: null,
    user: { name: 'David Wilson' },
    resolvedBy: null,
    images: [
      { image_url: 'complaints/broken-chair.jpg' }
    ]
  }
];

const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'HR' },
  { id: 3, name: 'DevOps' },
  { id: 4, name: 'Employee' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In-progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Rejected', label: 'Rejected' },
];

export function ComplaintManagement({ userRole }: ComplaintManagementProps) {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const { toast } = useToast();

  const [newComplaintOpen, setNewComplaintOpen] = useState(false); // Initialize state

  const handleNewComplaint = (newComplaint: any) => { // Placeholder function
    // This will be replaced with actual API call later
    console.log('New complaint:', newComplaint);
    // For now, just add to mock data
    setComplaints(prev => [...prev, { ...newComplaint, id: prev.length + 1, created_at: new Date().toISOString(), resolution_status: 'Pending', role: { name: userRole }, user: { name: 'Current User' } }]);
    setNewComplaintOpen(false);
    toast({
      title: 'Complaint Submitted',
      description: 'Your complaint has been successfully submitted.',
    });
  };

  // Filter and search complaints
  useEffect(() => {
    let filtered = [...complaints];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.resolution_status === statusFilter);
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.role.name === roleFilter);
    }

    // Search by title or complaint number
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(search) ||
        complaint.id.toString().includes(search)
      );
    }

    // Sort complaints
    filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, statusFilter, roleFilter, sortBy]);

  const handleStatusUpdate = async (complaintId: number, status: string, notes?: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setComplaints(prev => prev.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          resolution_status: status,
          resolution_notes: notes || complaint.resolution_notes,
          resolved_at: status === 'Resolved' || status === 'Rejected' ? new Date().toISOString() : null,
          resolvedBy: status === 'Resolved' || status === 'Rejected' ? { name: 'Current User' } : complaint.resolvedBy,
        };
      }
      return complaint;
    }));
  };

  const getStats = () => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.resolution_status === 'Pending').length,
      inProgress: complaints.filter(c => c.resolution_status === 'In-progress').length,
      resolved: complaints.filter(c => c.resolution_status === 'Resolved').length,
      rejected: complaints.filter(c => c.resolution_status === 'Rejected').length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
          <p className="text-muted-foreground">
            Track and resolve employee complaints
          </p>
        </div>
        {(userRole === 'employee' || userRole === 'devops' || userRole === 'hr' || userRole === 'admin') && ( // Corrected 'member' to 'employee'
          <Button onClick={() => setNewComplaintOpen(true)}> {/* Changed to setNewComplaintOpen */}
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or complaint #"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLES.map(role => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {statusFilter !== 'all' && `Status: ${statusFilter}`}
            {roleFilter !== 'all' && ` • Role: ${roleFilter}`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </span>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No complaints found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              userRole={userRole}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>

      {/* New Complaint Dialog */}
      <NewComplaintDialog 
        open={newComplaintOpen} 
        onOpenChange={setNewComplaintOpen}
        onSubmit={handleNewComplaint}
      />
    </div>
  );
}
