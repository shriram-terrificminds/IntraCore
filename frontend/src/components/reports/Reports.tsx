
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ExportDialog } from './ExportDialog';
import { ReportsSummary } from './ReportsSummary';
import { Label } from '@/components/ui/label';
import { getReportData, getReportLocations } from '@/services/api';
import type { UserRole } from '@/types/User';

interface ReportsProps {
  userRole: UserRole;
  userLocation?: string;
  assignedLocations?: { id: number; name: string }[];
}

type ReportRow = {
  type: string;
  number: string;
  title: string;
  status: string;
  role: string;
  user: string;
  location: string;
  date: string;
  resolution_note?: string;
};

export function Reports({ userRole, userLocation, assignedLocations = [] }: ReportsProps) {
  const [reportType, setReportType] = useState<'inventory' | 'complaints' | 'all'>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [data, setData] = useState<ReportRow[]>([]);
  const [summary, setSummary] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locationOptions, setLocationOptions] = useState<string[]>(['All']);

  const fetchedLocations = useRef(false);
  useEffect(() => {
    if (fetchedLocations.current) return;
    fetchedLocations.current = true;
    const fetchLocations = async () => {
      if (userRole === 'admin') {
        const locations = await getReportLocations();
        setLocationOptions(['All', ...locations]);
      } else if (assignedLocations.length > 0) {
        setLocationOptions(assignedLocations.map((loc) => loc.name));
      } else if (userLocation) {
        setLocationOptions([userLocation]);
      }
    };
    fetchLocations();
  }, [userRole, assignedLocations, userLocation]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [reportType, roleFilter, locationFilter, startDate, endDate]);

  // Ensure current page never exceeds totalPages
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages]);

  // Fetch report data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const filters: Record<string, string | number | undefined> = {
        type: reportType,
        role: roleFilter !== 'All' ? roleFilter : undefined,
        location: locationFilter !== 'All' ? locationFilter : undefined,
        date_from: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        date_to: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      };
      const res: { data: ReportRow[]; total: number; per_page: number } = await getReportData({ ...filters, page });
      setData(res.data || []);
      setTotalPages(Math.ceil((res.total || 0) / (res.per_page || 20)));
      // Calculate summary
      const summaryData = [
        { label: 'Total', value: res.total || 0 },
        { label: 'Resolved', value: (res.data || []).filter((d) => d.status === 'Resolved').length },
        { label: 'Rejected', value: (res.data || []).filter((d) => d.status === 'Rejected').length },
        { label: 'In-progress', value: (res.data || []).filter((d) => d.status === 'In-progress').length },
      ];
      setSummary(summaryData);
      setLoading(false);
    };
    fetchData();
  }, [reportType, roleFilter, locationFilter, startDate, endDate, page]);

  // Role dropdown logic
  const roleOptions = ['All', 'HR', 'DevOps'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and analyze data for better insights</p>
        </div>
        <div className="flex gap-2">
          {['admin', 'hr', 'devops'].includes(userRole.toLowerCase()) && (
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
          <CardDescription>Filter by type, date, role, and location.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={(v) => setReportType(v as 'inventory' | 'complaints' | 'all')}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="complaints">Complaints</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
              disabled={userRole !== 'admin'}
            >
              <SelectTrigger id="role">
                <SelectValue>{roleFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
              disabled={userRole !== 'admin'}
            >
              <SelectTrigger id="location">
                <SelectValue>{locationFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {startDate ? format(startDate, 'PPP') : 'Start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {endDate ? format(endDate, 'PPP') : 'End date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Report Results</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">No.</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted-foreground">No report data found for the selected filters.</td>
                    </tr>
                  ) : (
                    data.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{row.type}</td>
                        <td className="px-4 py-2">{row.number}</td>
                        <td className="px-4 py-2">{row.title}</td>
                        <td className="px-4 py-2">{row.status}</td>
                        <td className="px-4 py-2">{row.role}</td>
                        <td className="px-4 py-2">{row.user}</td>
                        <td className="px-4 py-2">{row.location}</td>
                        <td className="px-4 py-2">{row.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
      </div>
      <ExportDialog 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen}
        type={reportType === 'all' ? 'inventory' : reportType}
      />
    </div>
  );
}
