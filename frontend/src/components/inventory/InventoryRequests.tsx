
import { useState } from 'react';
import { Plus, Package, Clock, CheckCircle, X, MapPin, Search, Truck, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewRequestDialog } from './NewRequestDialog';
import { useToast } from '@/hooks/use-toast';

interface InventoryRequestsProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
}

interface InventoryRequest {
  id: number;
  title: string;
  department: string;
  description: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'delivered' | 'received' | 'rejected';
  requestDate: string;
  requestNumber: string;
  approvedBy?: string;
  deliveredBy?: string;
  approvedAt?: string;
  deliveredAt?: string;
}

const mockRequests: InventoryRequest[] = [
  {
    id: 1,
    title: 'Wireless Mouse',
    department: 'DevOps',
    description: 'Current mouse is not working properly, need replacement for development work',
    requestedBy: 'John Doe',
    status: 'pending',
    requestDate: '2024-01-15',
    requestNumber: 'REQ-001'
  },
  {
    id: 2,
    title: 'Office Chair',
    department: 'HR',
    description: 'Ergonomic chair needed for back support and long working hours',
    requestedBy: 'Sarah Smith',
    status: 'approved',
    requestDate: '2024-01-14',
    requestNumber: 'REQ-002',
    approvedBy: 'HR Manager',
    approvedAt: '2024-01-14 10:30'
  },
  {
    id: 3,
    title: 'HDMI Cable',
    department: 'Admin',
    description: 'For presentation setup in conference room',
    requestedBy: 'Alex Brown',
    status: 'delivered',
    requestDate: '2024-01-13',
    requestNumber: 'REQ-003',
    approvedBy: 'Admin',
    approvedAt: '2024-01-13 14:20',
    deliveredBy: 'Admin',
    deliveredAt: '2024-01-13 16:45'
  },
  {
    id: 4,
    title: 'Laptop Stand',
    department: 'Engineering',
    description: 'Adjustable laptop stand for better ergonomics',
    requestedBy: 'Mike Johnson',
    status: 'received',
    requestDate: '2024-01-12',
    requestNumber: 'REQ-004',
    approvedBy: 'DevOps Lead',
    approvedAt: '2024-01-12 09:15',
    deliveredBy: 'DevOps Lead',
    deliveredAt: '2024-01-12 11:30'
  },
  {
    id: 5,
    title: 'Coffee Machine',
    department: 'Marketing',
    description: 'New coffee machine for the break room',
    requestedBy: 'Emma Davis',
    status: 'rejected',
    requestDate: '2024-01-11',
    requestNumber: 'REQ-005',
    approvedBy: 'HR Manager',
    approvedAt: '2024-01-11 15:45'
  },
  {
    id: 6,
    title: 'Monitor Stand',
    department: 'DevOps',
    description: 'Dual monitor stand for development setup',
    requestedBy: 'Alex Brown',
    status: 'pending',
    requestDate: '2024-01-16',
    requestNumber: 'REQ-006'
  },
  {
    id: 7,
    title: 'Ergonomic Keyboard',
    department: 'HR',
    description: 'Split keyboard for better typing posture',
    requestedBy: 'John Doe',
    status: 'pending',
    requestDate: '2024-01-16',
    requestNumber: 'REQ-007'
  }
];

export function InventoryRequests({ userRole }: InventoryRequestsProps) {
  // For demo, assume current user is 'Alex Brown'
  const currentUser = 'Alex Brown';
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [requestTypeFilter, setRequestTypeFilter] = useState<'all' | 'my-requests' | 'to-handle'>('all');
  const [requests, setRequests] = useState<InventoryRequest[]>(mockRequests);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      case 'received': return <CheckSquare className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'received': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = (requestId: number, newStatus: 'pending' | 'approved' | 'delivered' | 'received' | 'rejected') => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq = { ...req, status: newStatus };
        
        if (newStatus === 'approved') {
          updatedReq.approvedBy = currentUser;
          updatedReq.approvedAt = new Date().toLocaleString();
        } else if (newStatus === 'delivered') {
          updatedReq.deliveredBy = currentUser;
          updatedReq.deliveredAt = new Date().toLocaleString();
        }
        
        return updatedReq;
      }
      return req;
    }));
    
    toast({
      title: "Status Updated",
      description: `Request status updated to ${newStatus}`,
    });
  };

  const handleMarkReceived = (requestId: number) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'received' } : req));
    toast({
      title: "Request Received",
      description: "Item has been marked as received",
    });
  };

  const filteredRequests = requests.filter(request => {
    // Role-based filtering
    let shouldShow = false;
    
    if (userRole === 'admin') {
      // Admin sees all requests
      shouldShow = true;
    } else if (userRole === 'hr') {
      // HR sees requests made to HR department and their own requests
      shouldShow = request.department === 'HR' || request.requestedBy === currentUser;
    } else if (userRole === 'devops') {
      // DevOps sees requests made to DevOps department and their own requests
      shouldShow = request.department === 'DevOps' || request.requestedBy === currentUser;
    } else if (userRole === 'employee') {
      // Employees see only their own requests
      shouldShow = request.requestedBy === currentUser;
    }
    
    if (!shouldShow) return false;
    
    // Request type filtering for HR and DevOps
    if ((userRole === 'hr' || userRole === 'devops') && requestTypeFilter !== 'all') {
      if (requestTypeFilter === 'my-requests') {
        // Show only requests created by the current user
        if (request.requestedBy !== currentUser) return false;
      } else if (requestTypeFilter === 'to-handle') {
        // Show only requests made to their department (not their own)
        if (request.requestedBy === currentUser) return false;
        if (userRole === 'hr' && request.department !== 'HR') return false;
        if (userRole === 'devops' && request.department !== 'DevOps') return false;
      }
    }
    
    const matchesSearch = 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || request.department.toLowerCase() === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const renderActionButtons = (request: InventoryRequest) => {
    // Show 'Mark as Received' for delivered status if the current user is the requester and role is employee, devops, or hr
    if (
      request.status === 'delivered' &&
      request.requestedBy === currentUser &&
      (userRole === 'employee' || userRole === 'devops' || userRole === 'hr')
    ) {
      return (
        <Button 
          size="sm"
          onClick={() => handleMarkReceived(request.id)}
        >
          <CheckSquare className="h-4 w-4 mr-1" />
          Mark as Received
        </Button>
      );
    }

    switch (userRole) {
      case 'admin':
        if (request.status === 'pending') {
          return (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleStatusUpdate(request.id, 'approved')}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleStatusUpdate(request.id, 'rejected')}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          );
        } else if (request.status === 'approved') {
          return (
            <Button 
              size="sm"
              onClick={() => handleStatusUpdate(request.id, 'delivered')}
            >
              <Truck className="h-4 w-4 mr-1" />
              Mark Delivered
            </Button>
          );
        } else if (request.status === 'delivered') {
          return (
            <Select onValueChange={(value: 'pending' | 'approved' | 'delivered' | 'received' | 'rejected') => handleStatusUpdate(request.id, value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received">Mark Received</SelectItem>
                <SelectItem value="pending">Back to Pending</SelectItem>
              </SelectContent>
            </Select>
          );
        }
        break;

      case 'hr':
        // HR can only manage requests made to HR department
        if (request.department === 'HR') {
          if (request.status === 'pending') {
            return (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusUpdate(request.id, 'approved')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleStatusUpdate(request.id, 'rejected')}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            );
          } else if (request.status === 'approved') {
            return (
              <Button 
                size="sm"
                onClick={() => handleStatusUpdate(request.id, 'delivered')}
              >
                <Truck className="h-4 w-4 mr-1" />
                Mark Delivered
              </Button>
            );
          } else if (request.status === 'delivered') {
            return (
              <Select onValueChange={(value: 'pending' | 'approved' | 'delivered' | 'received' | 'rejected') => handleStatusUpdate(request.id, value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Mark Received</SelectItem>
                  <SelectItem value="pending">Back to Pending</SelectItem>
                </SelectContent>
              </Select>
            );
          }
        }
        break;

      case 'devops':
        // DevOps can only manage requests made to DevOps department
        if (request.department === 'DevOps') {
          if (request.status === 'pending') {
            return (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusUpdate(request.id, 'approved')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleStatusUpdate(request.id, 'rejected')}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            );
          } else if (request.status === 'approved') {
            return (
              <Button 
                size="sm"
                onClick={() => handleStatusUpdate(request.id, 'delivered')}
              >
                <Truck className="h-4 w-4 mr-1" />
                Mark Delivered
              </Button>
            );
          } else if (request.status === 'delivered') {
            return (
              <Select onValueChange={(value: 'pending' | 'approved' | 'delivered' | 'received' | 'rejected') => handleStatusUpdate(request.id, value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Mark Received</SelectItem>
                  <SelectItem value="pending">Back to Pending</SelectItem>
                </SelectContent>
              </Select>
            );
          }
        }
        break;

      case 'employee':
        // Employee role - no additional actions needed as 'Mark as Received' is handled above
        break;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Inventory Requests</h2>
          <p className="text-muted-foreground">
            Manage office equipment and supply requests
          </p>
        </div>
        {(userRole === 'employee' || userRole === 'devops' || userRole === 'hr') && (
          <Button onClick={() => setShowNewRequest(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by request number, title, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by department" />
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
        {/* Request Type Filter for HR and DevOps */}
        {(userRole === 'hr' || userRole === 'devops') && (
          <Select value={requestTypeFilter} onValueChange={(value: 'all' | 'my-requests' | 'to-handle') => setRequestTypeFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by request type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="my-requests">My Requests</SelectItem>
              <SelectItem value="to-handle">Requests to Handle</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="font-mono">
                      {request.requestNumber}
                    </Badge>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                    <Badge variant="secondary">
                      {request.department}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{request.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{request.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Requested by:</span>
                      <p>{request.requestedBy}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Department:</span>
                      <p>{request.department}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Request Date:</span>
                      <p>{request.requestDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Status:</span>
                      <p className="capitalize">{request.status}</p>
                    </div>
                  </div>
                  
                  {/* Approval and Delivery Tracking */}
                  {(request.approvedBy || request.deliveredBy) && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {request.approvedBy && (
                          <div>
                            <span className="font-medium text-muted-foreground">Approved by:</span>
                            <p className="text-green-600">{request.approvedBy}</p>
                            {request.approvedAt && (
                              <p className="text-xs text-muted-foreground">{request.approvedAt}</p>
                            )}
                          </div>
                        )}
                        {request.deliveredBy && (
                          <div>
                            <span className="font-medium text-muted-foreground">Delivered by:</span>
                            <p className="text-blue-600">{request.deliveredBy}</p>
                            {request.deliveredAt && (
                              <p className="text-xs text-muted-foreground">{request.deliveredAt}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {renderActionButtons(request)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No requests found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || departmentFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No inventory requests have been created yet'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <NewRequestDialog 
        open={showNewRequest} 
        onOpenChange={setShowNewRequest}
      />
    </div>
  );
}
