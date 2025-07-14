
import { useState } from 'react';
import { Plus, Package, Clock, CheckCircle, X, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewRequestDialog } from './NewRequestDialog';

interface InventoryRequestsProps {
  userRole: 'admin' | 'member' | 'devops' | 'hr';
}

const mockRequests = [
  {
    id: 1,
    item: 'Wireless Mouse',
    category: 'Tech',
    requestedBy: 'John Doe',
    department: 'DevOps',
    location: 'Headquarters',
    status: 'pending',
    requestDate: '2024-01-15',
    priority: 'medium',
    description: 'Current mouse is not working properly'
  },
  {
    id: 2,
    item: 'Office Chair',
    category: 'Furniture',
    requestedBy: 'Sarah Smith',
    department: 'HR',
    location: 'North Branch',
    status: 'approved',
    approvedBy: 'Mike Johnson',
    requestDate: '2024-01-14',
    priority: 'high',
    description: 'Ergonomic chair needed for back support'
  },
  {
    id: 3,
    item: 'HDMI Cable',
    category: 'Tech',
    requestedBy: 'Alex Brown',
    department: 'Admin',
    location: 'South Branch',
    status: 'delivered',
    requestDate: '2024-01-13',
    deliveredDate: '2024-01-15',
    priority: 'low',
    description: 'For presentation setup'
  }
];

export function InventoryRequests({ userRole }: InventoryRequestsProps) {
  const [showNewRequest, setShowNewRequest] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <Package className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterRequests = (status?: string) => {
    if (!status) return mockRequests;
    return mockRequests.filter(request => request.status === status);
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
        {(userRole === 'member' || userRole === 'devops' || userRole === 'hr') && (
          <Button onClick={() => setShowNewRequest(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{request.item}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                      <Badge variant="outline">{request.priority}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Requested by:</span>
                        <p>{request.requestedBy}</p>
                      </div>
                      <div>
                        <span className="font-medium">Department:</span>
                        <p>{request.department}</p>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{request.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p>{request.requestDate}</p>
                      </div>
                    </div>
                  </div>
                  {userRole === 'admin' && request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {filterRequests('pending').map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{request.item}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                  </div>
                  {userRole === 'admin' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved">
          {filterRequests('approved').map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{request.item}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>
                  {userRole === 'admin' && (
                    <Button size="sm">
                      <Package className="h-4 w-4 mr-1" />
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="delivered">
          {filterRequests('delivered').map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{request.item}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                    {request.deliveredDate && (
                      <p className="text-xs text-green-600 mt-1">
                        Delivered on {request.deliveredDate}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <NewRequestDialog 
        open={showNewRequest} 
        onOpenChange={setShowNewRequest}
      />
    </div>
  );
}
