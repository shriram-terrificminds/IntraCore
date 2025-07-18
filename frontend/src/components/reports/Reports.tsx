
import { useState } from 'react';
import { Download, Filter, FileText, Package, MessageSquare, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportsSummary } from './ReportsSummary';
import { ExportDialog } from './ExportDialog';

interface ReportsProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
}

const mockInventoryData = [
  { id: 1, item: 'Wireless Mouse', requestedBy: 'John Doe', department: 'DevOps', status: 'pending', date: '2024-01-15', priority: 'medium' },
  { id: 2, item: 'Office Chair', requestedBy: 'Sarah Smith', department: 'HR', status: 'approved', date: '2024-01-14', priority: 'high' },
  { id: 3, item: 'HDMI Cable', requestedBy: 'Alex Brown', department: 'Admin', status: 'delivered', date: '2024-01-13', priority: 'low' },
  { id: 4, item: 'Standing Desk', requestedBy: 'Mike Johnson', department: 'DevOps', status: 'pending', date: '2024-01-12', priority: 'high' },
  { id: 5, item: 'Keyboard', requestedBy: 'Emma Wilson', department: 'HR', status: 'rejected', date: '2024-01-11', priority: 'low' },
];

const mockComplaintsData = [
  { id: 1, title: 'Coffee machine not working', reportedBy: 'John Doe', category: 'Pantry', status: 'pending-verification', date: '2024-01-15', priority: 'medium' },
  { id: 2, title: 'WiFi connectivity issues', reportedBy: 'Sarah Smith', category: 'Tech', status: 'verified', date: '2024-01-14', priority: 'high' },
  { id: 3, title: 'Air conditioning too cold', reportedBy: 'Mike Johnson', category: 'Others', status: 'resolved', date: '2024-01-13', priority: 'low' },
  { id: 4, title: 'Parking space issue', reportedBy: 'Emma Wilson', category: 'Facilities', status: 'verified', date: '2024-01-12', priority: 'medium' },
  { id: 5, title: 'Printer not working', reportedBy: 'Alex Brown', category: 'Tech', status: 'resolved', date: '2024-01-11', priority: 'high' },
];

export function Reports({ userRole }: ReportsProps) {
  const [inventoryFilter, setInventoryFilter] = useState({
    status: 'all',
    department: 'all',
    priority: 'all',
    dateRange: 'all'
  });

  const [complaintsFilter, setComplaintsFilter] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: 'all'
  });

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportType, setExportType] = useState<'inventory' | 'complaints'>('inventory');

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">Only administrators can access reports.</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string, type: 'inventory' | 'complaints') => {
    const colorMap = {
      inventory: {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-blue-100 text-blue-800',
        delivered: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
      },
      complaints: {
        'pending-verification': 'bg-yellow-100 text-yellow-800',
        verified: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        'in-progress': 'bg-orange-100 text-orange-800'
      }
    };
    
    return (
      <Badge className={colorMap[type][status] || 'bg-gray-100 text-gray-800'}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colorMap = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    return <Badge className={colorMap[priority]}>{priority}</Badge>;
  };

  const filterInventoryData = () => {
    return mockInventoryData.filter(item => {
      if (inventoryFilter.status !== 'all' && item.status !== inventoryFilter.status) return false;
      if (inventoryFilter.department !== 'all' && item.department !== inventoryFilter.department) return false;
      if (inventoryFilter.priority !== 'all' && item.priority !== inventoryFilter.priority) return false;
      return true;
    });
  };

  const filterComplaintsData = () => {
    return mockComplaintsData.filter(item => {
      if (complaintsFilter.status !== 'all' && item.status !== complaintsFilter.status) return false;
      if (complaintsFilter.category !== 'all' && item.category !== complaintsFilter.category) return false;
      if (complaintsFilter.priority !== 'all' && item.priority !== complaintsFilter.priority) return false;
      return true;
    });
  };

  const handleExport = (type: 'inventory' | 'complaints') => {
    setExportType(type);
    setShowExportDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive reporting dashboard for inventory and complaints
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      <ReportsSummary 
        inventoryData={filterInventoryData()} 
        complaintsData={filterComplaintsData()} 
      />

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Requests
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Complaints
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Inventory Requests Report
              </CardTitle>
              <Button onClick={() => handleExport('inventory')} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Select value={inventoryFilter.status} onValueChange={(value) => setInventoryFilter({...inventoryFilter, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={inventoryFilter.department} onValueChange={(value) => setInventoryFilter({...inventoryFilter, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={inventoryFilter.priority} onValueChange={(value) => setInventoryFilter({...inventoryFilter, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={inventoryFilter.dateRange} onValueChange={(value) => setInventoryFilter({...inventoryFilter, dateRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterInventoryData().map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>{item.requestedBy}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{getStatusBadge(item.status, 'inventory')}</TableCell>
                      <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                      <TableCell>{item.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Complaints Report
              </CardTitle>
              <Button onClick={() => handleExport('complaints')} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Select value={complaintsFilter.status} onValueChange={(value) => setComplaintsFilter({...complaintsFilter, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending-verification">Pending Verification</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={complaintsFilter.category} onValueChange={(value) => setComplaintsFilter({...complaintsFilter, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Pantry">Pantry</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={complaintsFilter.priority} onValueChange={(value) => setComplaintsFilter({...complaintsFilter, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={complaintsFilter.dateRange} onValueChange={(value) => setComplaintsFilter({...complaintsFilter, dateRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterComplaintsData().map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.reportedBy}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{getStatusBadge(item.status, 'complaints')}</TableCell>
                      <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                      <TableCell>{item.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ExportDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog}
        type={exportType}
      />
    </div>
  );
}
