import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { NewRequestDialog } from './NewRequestDialog';
import {
  getInventoryRequests,
  createInventoryRequest,
  updateInventoryRequestStatus,
} from '@/services/api';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface InventoryRequestsProps {
  userRole: { name: string } | string;
}

interface InventoryRequest {
  id: number;
  request_number: number;
  title: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Received' | 'Rejected';
  created_at: string;
  approved_at?: string;
  user: { name?: string; first_name?: string; last_name?: string };
  role?: { id: number; name: string };
}

interface RoleOption {
  id: number;
  name: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Received', label: 'Received' },
  { value: 'Rejected', label: 'Rejected' },
];

export function InventoryRequests({ userRole }: InventoryRequestsProps) {
  const userRoleObj = typeof userRole === 'object' ? userRole : { name: userRole };
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 700);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(10);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (roleFilter !== 'all') params.role = roleFilter.toLowerCase();
      params.sort_by = 'created_at';
      params.sort_order = sortOrder;
      if (debouncedSearchTerm.trim()) params.search = debouncedSearchTerm.trim();
      const data = await getInventoryRequests(params);
      setRequests(data.data || []);
      setTotalPages(data.last_page || 1);
      setTotalRecords(data.total || 10);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch inventory requests.');
    } finally {
      setLoading(false);
    }
  };
    fetchRequests();
  }, [statusFilter, debouncedSearchTerm, roleFilter, page, sortOrder]);

  const handleNewRequest = async (title: string, description: string, role_id: number) => {
    try {
      await createInventoryRequest({ title, description, role_id });
      const params: any = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (roleFilter !== 'all') params.role = roleFilter.toLowerCase();
      params.sort_by = 'created_at';
      params.sort_order = sortOrder;
      if (debouncedSearchTerm.trim()) params.search = debouncedSearchTerm.trim();
      if (userRoleObj.name === 'admin' && roleFilter !== 'all') {
        params.role_id = Number(roleFilter);
      }
      const data = await getInventoryRequests(params);
      setRequests(data.data || []);
      toast({
        title: 'Request Submitted',
        description: 'Your inventory request has been submitted successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response.data.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (id: number, request_number: number, newStatus: InventoryRequest['status']) => {
    try {
      await updateInventoryRequestStatus(id, newStatus);
      const params: any = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (roleFilter !== 'all') params.role = roleFilter.toLowerCase();
      params.sort_by = 'created_at';
      params.sort_order = sortOrder;
      if (debouncedSearchTerm.trim()) params.search = debouncedSearchTerm.trim();
      if (userRoleObj.name === 'admin' && roleFilter !== 'all') {
        params.role_id = Number(roleFilter);
      }
      const data = await getInventoryRequests(params);
      setRequests(data.data || []);
      toast({
        title: 'Status Updated',
        description: `Request ${request_number} updated to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response.data.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: InventoryRequest['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Received': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Requests</h1>
          <p className="text-muted-foreground">Manage and track all inventory requests</p>
        </div>
        <Button onClick={() => setNewRequestOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4 mr-2" />
            New Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by request number or title or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem key="2" value="Hr">Hr</SelectItem>
              <SelectItem key="3" value="Devops">Devops</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Latest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalRecords} requests
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {statusFilter !== 'all' && `Status: ${statusFilter}`}
            {roleFilter !== 'all' && ` • Role: ${roleFilter}`}
            {searchQuery && ` • Search: "${searchQuery}"`}
          </span>
        </div>
      </div>

      {/* Request Table */}
      <Card>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-6">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-6">{error}</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Created on</TableHead>
                    <TableHead>Approved on</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">No requests found.</TableCell>
                    </TableRow>
                  ) : (
                    requests.map(request => {
                      // Determine allowed status transitions
                      let statusOptions: { value: InventoryRequest['status'], label: string }[] = [];
                      let disabled = false;
                      switch (request.status) {
                        case 'Pending':
                          statusOptions = [
                            { value: 'Pending', label: 'Pending' },
                            { value: 'Approved', label: 'Approved' },
                            { value: 'Rejected', label: 'Rejected' },
                          ];
                          break;
                        case 'Approved':
                          statusOptions = [
                            { value: 'Approved', label: 'Approved' },
                            { value: 'Shipped', label: 'Shipped' },
                          ];
                          break;
                        case 'Shipped':
                          statusOptions = [
                            { value: 'Shipped', label: 'Shipped' },
                            { value: 'Received', label: 'Received' },
                          ];
                          break;
                        case 'Rejected':
                        case 'Received':
                        default:
                          statusOptions = [
                            { value: request.status, label: request.status },
                          ];
                          disabled = true;
                          break;
                      }
                      return (
                        <TableRow key={request.id}>
                          <TableCell>{request.request_number ?? `REQ-${String(request.id).padStart(3, '0')}`}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.description}</TableCell>
                          <TableCell>
                            <Select
                              value={request.status}
                              onValueChange={val => {
                                if (val !== request.status) handleUpdateStatus(request.id, request.request_number, val as InventoryRequest['status']);
                              }}
                              disabled={disabled}
                            >
                              <SelectTrigger
                                className={`w-[120px] rounded-full border-0 font-semibold text-center flex items-center justify-center ${getStatusBadge(request.status)}`}
                                style={{ minHeight: '32px', paddingLeft: 0, paddingRight: 0 }}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value} className={`rounded-full ${getStatusBadge(opt.value)}`}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{request.user?.first_name && request.user?.last_name ? `${request.user.first_name} ${request.user.last_name}` : 'Unknown'}</TableCell>
                          <TableCell>{request.role?.name || '-'}</TableCell>
                          <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{request.approved_at ? new Date(request.approved_at).toLocaleDateString() : '-'}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-center mt-4 gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</Button>
                <span className="px-2 py-1">Page {page} of {totalPages}</span>
                <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <NewRequestDialog
        open={newRequestOpen}
        onOpenChange={setNewRequestOpen}
        onSubmit={handleNewRequest}
      />
    </div>
  );
}
