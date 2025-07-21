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
    createdBy: 'Alex Brown',
    category: 'Pantry',
    description: 'The coffee machine in the main pantry is not dispensing coffee properly',
    reportedBy: 'John Doe',
    assignedTo: 'Admin Team',
    status: 'pending-verification',
    priority: 'medium',
    createdDate: '2024-01-15',
    location: 'Main Office - Floor 3',
    role: { name: 'hr' },
    images: [
      { image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' },
      { image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400' }
    ],
    // Fields for compatibility
    resolution_status: 'Pending',
    resolution_notes: null,
    created_at: '2024-01-15T10:30:00Z',
    resolved_at: null,
    user: { name: 'John Doe' },
    resolvedBy: null
  },
  {
    id: 2,
    title: 'WiFi connectivity issues',
    createdBy: 'Sarah Smith',
    category: 'Tech',
    description: 'Frequent disconnections and slow internet speed in the conference room',
    reportedBy: 'Sarah Smith',
    assignedTo: 'DevOps Team',
    status: 'verified',
    priority: 'high',
    createdDate: '2024-01-14',
    verifiedDate: '2024-01-15',
    location: 'Conference Room B',
    role: { name: 'devops' },
    images: [
      { image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400' }
    ],
    // Fields for compatibility
    resolution_status: 'In-progress',
    resolution_notes: 'Investigating network configuration. Will check router settings and signal strength.',
    created_at: '2024-01-14T14:20:00Z',
    resolved_at: null,
    user: { name: 'Sarah Smith' },
    resolvedBy: null
  },
  {
    id: 3,
    title: 'Air conditioning too cold',
    createdBy: 'Mike Johnson',
    category: 'Others',
    description: 'The AC in the open workspace is set too cold, making it uncomfortable',
    reportedBy: 'Mike Johnson',
    assignedTo: 'Admin Team',
    status: 'resolved',
    priority: 'low',
    createdDate: '2024-01-13',
    resolvedDate: '2024-01-15',
    location: 'Open Workspace',
    role: { name: 'admin' },
    images: [],
    // Fields for compatibility
    resolution_status: 'Resolved',
    resolution_notes: 'Temperature adjusted from 18°C to 22°C. All employees notified of the change.',
    created_at: '2024-01-13T09:15:00Z',
    resolved_at: '2024-01-15T16:45:00Z',
    user: { name: 'Mike Johnson' },
    resolvedBy: { name: 'Admin Team' }
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [complaintTypeFilter, setComplaintTypeFilter] = useState('all');
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

  const currentUser = 'Alex Brown'; // Replace with actual current user in real app

  // Filter and search complaints
  useEffect(() => {
    let filtered = [...complaints];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.resolution_status === statusFilter);
    }

    // Filter by role
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.role.name === departmentFilter);
    }

    // Filter by complaint type
    if (userRole === 'hr' || userRole === 'devops') {
      if (complaintTypeFilter === 'my-complaints') {
        filtered = filtered.filter(complaint => complaint.createdBy === currentUser);
      } else if (complaintTypeFilter === 'to-handle') {
        filtered = filtered.filter(
          complaint =>
            complaint.role.name.toLowerCase() === userRole &&
            complaint.createdBy !== currentUser
        );
      }
      // If 'all', do nothing extra!
    } else {
      // For other users, apply a generic complaint type filter if not 'all'
      if (complaintTypeFilter !== 'all') {
        filtered = filtered.filter(complaint =>
          complaint.title.toLowerCase().includes(complaintTypeFilter.toLowerCase())
        );
      }
    }

    // Search by title or request number
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter(complaint => {
        // Match by title
        if (complaint.title.toLowerCase().includes(search)) return true;
        // Match by request number (with or without REQ- prefix and leading zeros)
        const reqNumber = `req-${complaint.id.toString().padStart(3, '0')}`;
        if (reqNumber.includes(search)) return true;
        if (complaint.id.toString().includes(search)) return true;
        return false;
      });
    }

    // All Complaints dropdown logic for HR/DevOps
    if (userRole === 'hr' || userRole === 'devops') {
      if (complaintTypeFilter === 'my-complaints') {
        filtered = filtered.filter(complaint => complaint.createdBy === currentUser);
      } else if (complaintTypeFilter === 'to-handle') {
        filtered = filtered.filter(
          complaint =>
            complaint.role.name.toLowerCase() === userRole &&
            complaint.createdBy !== currentUser
        );
      }
      // 'all' means no extra filter
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
  }, [complaints, searchQuery, statusFilter, departmentFilter, complaintTypeFilter, sortBy, userRole, currentUser]);

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

      {/* Filters & Search - all users get 3 fields, HR/DevOps get a 4th field */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by request number, title, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In-progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
        {(userRole === 'hr' || userRole === 'devops') && (
          <Select value={complaintTypeFilter} onValueChange={setComplaintTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Complaints" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complaints</SelectItem>
              <SelectItem value="my-complaints">My Complaints</SelectItem>
              <SelectItem value="to-handle">Complaints to Handle</SelectItem>
            </SelectContent>
          </Select>
        )}
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
