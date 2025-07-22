import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Search,
  Download,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Package,
} from 'lucide-react';
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

interface InventoryRequestsProps {
  userRole: { name: string } | string;
}

interface InventoryRequest {
  id: number;
  request_number: string;
  title: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Delivered' | 'Shipped' | 'Received' | 'Rejected';
  created_at: string;
  approved_at?: string;
  user?: { id: number; name: string };
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userRoleObj.name === 'admin') {
      setRoles([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'HR' },
        { id: 3, name: 'DevOps' },
        { id: 4, name: 'Employee' },
      ]);
    }
  }, [userRoleObj.name]);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, searchQuery, roleFilter, page]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      if (userRoleObj.name === 'admin' && roleFilter !== 'all') {
        params.role_id = Number(roleFilter);
      }
      const data = await getInventoryRequests(params);
      setRequests(data.data || []);
      setTotalPages(data.last_page || 1);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch inventory requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = async (title: string, description: string, role_id: number) => {
    try {
      await createInventoryRequest({ title, description, role_id });
      toast({
        title: 'Request Submitted',
        description: 'Your inventory request has been submitted successfully.',
      });
      fetchRequests(); // Re-fetch the list to get the full, hydrated object
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to submit request.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: InventoryRequest['status']) => {
    try {
      await updateInventoryRequestStatus(id, newStatus);
      toast({
        title: 'Status Updated',
        description: `Request ${id} updated to ${newStatus}`,
      });
      fetchRequests();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
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
        {['admin', 'devops', 'hr'].includes(userRoleObj.name) && (
          <Button onClick={() => setNewRequestOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Request
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by request number or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {userRoleObj.name === 'admin' && (
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Request Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>Overview of all inventory requests.</CardDescription>
        </CardHeader>
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
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                            { value: 'Delivered', label: 'Delivered' },
                          ];
                          break;
                        case 'Delivered':
                          statusOptions = [
                            { value: 'Delivered', label: 'Delivered' },
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
                                if (val !== request.status) handleUpdateStatus(request.id, val as InventoryRequest['status']);
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
                          <TableCell>{request.user?.name || '-'}</TableCell>
                          <TableCell>{request.role?.name || '-'}</TableCell>
                          <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{request.approved_at ? new Date(request.approved_at).toLocaleDateString() : '-'}</TableCell>
                          <TableCell className="text-right">
                            {['admin', 'devops'].includes(userRoleObj.name) ? (
                              <div className="flex justify-end gap-2">
                                {/* Remove old status buttons, as status is now handled by dropdown */}
                                <Button variant="ghost" size="icon">
                                  <Package className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="icon">
                                <Package className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="px-2 py-1 text-sm">Page {page} of {totalPages}</span>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
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
