
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, PlusCircle, CheckCircle2, XCircle, Clock, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { NewRequestDialog } from './NewRequestDialog';

interface InventoryRequestsProps {
  userRole: UserRole;
}

interface InventoryRequest {
  id: string;
  item: string;
  quantity: number;
  requestor: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  approvalDate?: string;
}

export function InventoryRequests({ userRole }: InventoryRequestsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requests, setRequests] = useState<InventoryRequest[]>([
    {
      id: '1',
      item: 'Laptop',
      quantity: 1,
      requestor: 'John Doe',
      status: 'Pending',
      requestDate: '2024-07-10',
    },
    {
      id: '2',
      item: 'Monitor',
      quantity: 2,
      requestor: 'Sarah Smith',
      status: 'Approved',
      requestDate: '2024-07-08',
      approvalDate: '2024-07-09',
    },
    {
      id: '3',
      item: 'Keyboard',
      quantity: 1,
      requestor: 'Mike Johnson',
      status: 'Rejected',
      requestDate: '2024-07-05',
      approvalDate: '2024-07-06',
    },
    {
      id: '4',
      item: 'Mouse',
      quantity: 3,
      requestor: 'Emma Davis',
      status: 'Pending',
      requestDate: '2024-07-12',
    },
  ]);

  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const { toast } = useToast();

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.requestor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleNewRequest = (item: string, quantity: number) => {
    const newRequest: InventoryRequest = {
      id: Date.now().toString(),
      item,
      quantity,
      requestor: 'Current User', // This should be dynamically set from auth context
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [...prev, newRequest]);
    toast({
      title: "Request Submitted",
      description: "Your inventory request has been submitted successfully.",
    });
  };

  const handleUpdateStatus = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(request => 
      request.id === id ? { 
        ...request, 
        status: newStatus,
        approvalDate: newStatus === 'Approved' ? new Date().toISOString().split('T')[0] : undefined
      } : request
    ));
    toast({
      title: "Request Status Updated",
      description: `Request ${id} has been ${newStatus}.`,
    });
  };

  const getStatusBadge = (status: InventoryRequest['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Requests</h1>
          <p className="text-muted-foreground">
            Manage and track all inventory requests
          </p>
        </div>
        <div className="flex gap-2">
          {['admin', 'devops', 'hr'].includes(userRole) && (
            <Button onClick={() => setNewRequestOpen(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Request
            </Button>
          )}
        </div>
      </div>

      {/* Request Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            Overview of all inventory requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Requestor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Approval Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(request => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.item}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.requestor}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(request.status)}>{request.status}</Badge>
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.approvalDate || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    {userRole === 'admin' || userRole === 'devops' ? (
                      <div className="flex items-center justify-end gap-2">
                        {request.status === 'Pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(request.id, 'Approved')}
                              title="Approve Request"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                              title="Reject Request"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon" title="View Details">
                          <Package className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon" title="View Details">
                        <Package className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
