
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart, Download } from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ExportDialog } from './ExportDialog';
import { ReportsSummary } from './ReportsSummary';
import { Label } from '@/components/ui/label';

interface ReportsProps {
  userRole: UserRole;
}

interface ReportDataPoint {
  name: string;
  value: number;
}

export function Reports({ userRole }: ReportsProps) {
  const [reportType, setReportType] = useState('inventory');
  const [timeRange, setTimeRange] = useState('monthly');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Dummy Data - In a real application, this would come from API calls
  const getReportData = () => {
    switch (reportType) {
      case 'inventory':
        return {
          title: 'Inventory Overview',
          description: 'Summary of inventory requests and approvals.',
          chartData: [
            { name: 'Laptops', requested: 120, approved: 100 },
            { name: 'Monitors', requested: 80, approved: 70 },
            { name: 'Keyboards', requested: 50, approved: 45 },
            { name: 'Mice', requested: 60, approved: 55 },
          ],
          summary: [
            { label: 'Total Requests', value: 310 },
            { label: 'Approved', value: 270 },
            { label: 'Pending', value: 40 },
            { label: 'Rejected', value: 10 },
          ],
        };
      case 'complaints':
        return {
          title: 'Complaint Analysis',
          description: 'Breakdown of complaint statuses and categories.',
          chartData: [
            { name: 'Open', value: 30 },
            { name: 'In Progress', value: 20 },
            { name: 'Resolved', value: 150 },
            { name: 'Closed', value: 100 },
          ],
          summary: [
            { label: 'Total Complaints', value: 300 },
            { label: 'Resolved', value: 250 },
            { label: 'Open', value: 50 },
            { label: 'Average Resolution Time', value: '3 days' },
          ],
        };
      case 'users':
        return {
          title: 'User Demographics',
          description: 'Distribution of users by role and location.',
          chartData: [
            { name: 'Admin', value: 5 },
            { name: 'Member', value: 150 },
            { name: 'DevOps', value: 20 },
            { name: 'HR', value: 10 },
          ],
          summary: [
            { label: 'Total Users', value: 185 },
            { label: 'Active Users', value: 170 },
            { label: 'New Users (Last 30 Days)', value: 5 },
            { label: 'Locations', value: 3 },
          ],
        };
      default:
        return { title: '', description: '', chartData: [], summary: [] };
    }
  };

  const reportData = getReportData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate and analyze data for better insights
          </p>
        </div>
        <div className="flex gap-2">
          {['admin', 'hr'].includes(userRole) && (
            <Button onClick={() => setExportDialogOpen(true)} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select report type, time range, and custom dates.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="complaints">Complaints</SelectItem>
                <SelectItem value="users">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-range">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="time-range">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timeRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports Summary and Charts */}
      <ReportsSummary reportData={reportData} userRole={userRole} />

      <Card>
        <CardHeader>
          <CardTitle>{reportData.title}</CardTitle>
          <CardDescription>{reportData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === 'inventory' ? (
                <BarChart data={reportData.chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requested" fill="#8884d8" name="Requested" />
                  <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
                </BarChart>
              ) : reportType === 'complaints' ? (
                <PieChart>
                  <Pie
                    data={reportData.chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {reportData.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : reportType === 'users' ? (
                <PieChart>
                  <Pie
                    data={reportData.chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {reportData.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <LineChart data={[]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <ExportDialog 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen}
        reportType={reportType}
        timeRange={timeRange}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
