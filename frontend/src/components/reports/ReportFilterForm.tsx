import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';

interface ReportFilterFormProps {
  userRole: 'admin' | 'hr' | 'devops' | 'employee';
  assignedLocations?: string[];
  onFilter: (filters: ReportFilters) => void;
}

export interface ReportFilters {
  dateRange: { from: string; to: string } | null;
  reportType: 'inventory' | 'complaints' | 'all';
  role: 'hr' | 'devops' | 'all';
  location: string;
}

const ALL_LOCATIONS = ['All', 'TVM', 'Ernakulam', 'Bangalore'];
const ADMIN_ROLE_OPTIONS: Array<'all' | 'hr' | 'devops'> = ['all', 'hr', 'devops'];

export function ReportFilterForm({ userRole, assignedLocations = [], onFilter }: ReportFilterFormProps) {
  // Role selector logic
  let roleOptions: Array<'all' | 'hr' | 'devops'> = [];
  let roleDisabled = false;
  let initialRole: 'all' | 'hr' | 'devops' = 'all';
  if (userRole === 'admin') {
    roleOptions = ADMIN_ROLE_OPTIONS;
    roleDisabled = false;
    initialRole = 'all';
  } else if (userRole === 'hr' || userRole === 'devops') {
    roleOptions = [userRole];
    roleDisabled = true;
    initialRole = userRole;
  } else {
    // employee: not shown in selector, but for completeness
    roleOptions = [];
    roleDisabled = true;
    initialRole = 'all';
  }

  // Location selector logic
  let locationOptions: string[] = [];
  let locationDisabled = false;
  let initialLocation = 'All';
  if (userRole === 'admin') {
    locationOptions = ALL_LOCATIONS;
    locationDisabled = false;
    initialLocation = 'All';
  } else if (userRole === 'hr' || userRole === 'devops') {
    locationOptions = assignedLocations.length > 0 ? assignedLocations : ['All'];
    locationDisabled = false;
    initialLocation = locationOptions[0];
  } else {
    // employee
    locationOptions = assignedLocations.length > 0 ? assignedLocations : ['All'];
    locationDisabled = true;
    initialLocation = locationOptions[0];
  }

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState<'inventory' | 'complaints' | 'all'>('all');
  const [role, setRole] = useState<'all' | 'hr' | 'devops'>(initialRole);
  const [location, setLocation] = useState(initialLocation);

  // Debounce filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilter({
        dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : null,
        reportType,
        role,
        location,
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [dateFrom, dateTo, reportType, role, location, onFilter]);

  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Date Range Picker */}
        <div>
          <Label>Date From</Label>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div>
          <Label>Date To</Label>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        {/* Report Type Dropdown */}
        <div>
          <Label>Report Type</Label>
          <Select value={reportType} onValueChange={v => setReportType(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="complaints">Complaints</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Role Selector */}
        <div>
          <Label>Role</Label>
          <Select value={role} onValueChange={v => setRole(v as any)} disabled={roleDisabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(r => (
                <SelectItem key={r} value={r}>{r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Location Dropdown */}
        <div>
          <Label>Location</Label>
          <Select value={location} onValueChange={v => setLocation(v)} disabled={locationDisabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
} 