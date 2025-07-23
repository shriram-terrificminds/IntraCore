import { useState, useEffect, useRef } from 'react';
import React from 'react';
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

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

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
  { id: 2, name: 'Hr' },
  { id: 3, name: 'Devops' },
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
  console.log('ComplaintManagement userRole:', userRole);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchHadFocus, setSearchHadFocus] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);
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

  // Remove frontend-only search filtering. All search/filtering is now handled by the backend.
  // The filteredComplaints state is now just the complaints state.
  useEffect(() => {
    setFilteredComplaints(complaints);
  }, [complaints]);

  // Refocus search input if it was focused before rerender
  useEffect(() => {
    if (searchHadFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [filteredComplaints]);

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
        if (debouncedSearchTerm.trim()) filters.search = debouncedSearchTerm.trim();
        const response = await api.post('/complaints/list', filters);
        const complaintsData = response.data.data || [];
        setTotalPages(response.data.last_page || 1);
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
  }, [statusFilter, roleFilter, page, debouncedSearchTerm]);

  const handleStatusUpdate = async (complaintId: number, status: string, notes?: string) => {
    setLoading(true);
    try {
      await api.patch(`/complaints/${complaintId}/update-status`, {
        resolution_status: status,
        resolution_notes: notes,
      });
      // Refresh complaints list from backend
      const filters: Record<string, string | number> = { page };
      if (statusFilter !== 'all') filters.resolution_status = statusFilter;
      if (roleFilter !== 'all') filters.role = roleFilter.toLowerCase();
      if (debouncedSearchTerm.trim()) filters.search = debouncedSearchTerm.trim();
      const response = await api.post('/complaints/list', filters);
      setComplaints(response.data.data || []);
    } catch (error) {
      toast({
        title: 'Status Update Failed',
        description: 'Could not update complaint status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
      const hasFiles = Array.isArray(newComplaint.images) && newComplaint.images.length > 0 && newComplaint.images.some(img => img instanceof File);
      if (hasFiles) {
        const formData = new FormData();
        formData.append('title', newComplaint.title);
        formData.append('description', newComplaint.description);
        formData.append('role_id', String(newComplaint.role_id));
        newComplaint.images.forEach((img) => {
          if (img instanceof File) {
            formData.append('images[]', img);
          }
        });
        await api.post('/complaints', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/complaints', {
          title: newComplaint.title,
          description: newComplaint.description,
          role_id: newComplaint.role_id,
        });
      }
      // Refresh complaints list from backend
      const filters: Record<string, string | number> = { page };
      if (statusFilter !== 'all') filters.resolution_status = statusFilter;
      if (roleFilter !== 'all') filters.role = roleFilter.toLowerCase();
      if (debouncedSearchTerm.trim()) filters.search = debouncedSearchTerm.trim();
      const response = await api.post('/complaints/list', filters);
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
                ref={searchInputRef}
                placeholder="Search by title or complaint #"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchHadFocus(true)}
                onBlur={() => setSearchHadFocus(false)}
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
                user: complaint.user || { name: 'Unknown' },
                resolution_status: complaint.resolution_status || 'Pending',
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
