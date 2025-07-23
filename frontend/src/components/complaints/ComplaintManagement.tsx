import { useState, useEffect } from 'react';
import api from '../../services/api'; // Add this import at the top
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
import { Complaint } from '@/types/Complaint';

// Set axios base URL and ensure credentials are sent for Sanctum
// axios.defaults.baseURL = 'http://localhost:8000';
// axios.defaults.withCredentials = true;

// Set up axios interceptor to always add Authorization header if token exists
// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem('auth_token');
//   if (token) {
//     config.headers = Object.assign({}, config.headers);
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// });

// Remove any local interface Complaint definition in this file. Only use the imported Complaint type from '@/types/Complaint'.
interface ComplaintManagementProps {
  userRole: { id: string; name: string; description: string } | undefined;
}

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

// Helper to get token from localStorage (or wherever you store it after login)
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function ComplaintManagement({ userRole }: ComplaintManagementProps) {
  console.log('ComplaintManagement userRole:', userRole);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const { toast } = useToast();

  const [newComplaintOpen, setNewComplaintOpen] = useState(false); // Initialize state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/complaints/list', {});
        setComplaints(response.data.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError('Failed to fetch complaints: ' + err.message);
        } else {
          setError('Failed to fetch complaints');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Filter and search complaints
  useEffect(() => {
    let filtered = [...complaints];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.resolution_status === statusFilter);
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(complaint =>
        complaint.role?.name?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Search by title or complaint number
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(search) ||
        (complaint.complaint_number && complaint.complaint_number.toLowerCase().includes(search))
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

  // Remove frontend-only filtering for status and role
  // Add useEffect to fetch complaints from backend when filters change
  useEffect(() => {
    const fetchFilteredComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: Record<string, string | number> = { page };
        if (statusFilter !== 'all') filters.resolution_status = statusFilter;
        if (roleFilter !== 'all') filters.role = roleFilter.toLowerCase();
        const response = await api.post('/complaints/list', filters);
        let complaintsData = response.data.data || [];
        setTotalPages(response.data.last_page || 1);
        // Fallback: If backend returns all data for 'Pending', filter on frontend
        if (statusFilter !== 'all' && response.data.data && response.data.data.length && !response.data.data[0].resolution_status) {
          complaintsData = complaintsData.filter((c: Complaint) => c.resolution_status === statusFilter);
        }
        setComplaints(complaintsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError('Failed to fetch complaints: ' + err.message);
        } else {
          setError('Failed to fetch complaints');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredComplaints();
  }, [statusFilter, roleFilter, page]);

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

  const handleNewComplaint = async (newComplaint: Complaint) => {
    setLoading(true);
    try {
      await api.post('/complaints', newComplaint);
      // Refresh complaints list
      const response = await api.post('/complaints/list', {});
      setComplaints(response.data.data || []);
      setNewComplaintOpen(false);
      toast({
        title: 'Complaint Submitted',
        description: 'Your complaint has been successfully submitted.',
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit complaint. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading complaints...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
        <Button onClick={() => setNewComplaintOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Complaint
        </Button>
      </div>

      {/* Stats Cards */}
      {/* Removed stats cards as per request */}

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
              complaint={{
                ...complaint,
                role: complaint.role || { name: 'Unknown' },
                resolution_status: complaint.resolution_status || 'Pending',
                user: complaint.user || { name: 'Unknown' },
              }}
              userRole={userRole?.name}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4 gap-2">
        <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</Button>
        <span className="px-2 py-1">Page {page} of {totalPages}</span>
        <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
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
