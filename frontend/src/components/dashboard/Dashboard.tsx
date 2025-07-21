import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '../../services/api'; // Corrected import path for API service
import { InboxIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Added necessary icons
import { useAuth } from '../../contexts/AuthContext';

interface DashboardProps {
  userRole: string; // Changed to string as roles are dynamic
}

interface DashboardStats {
  active_requests?: number;
  active_complaints?: number;
  total_shipped?: number;
  my_requests?: number;
  my_complaints?: number;
  pending_requests?: number;
  pending_complaints?: number;
}

export function Dashboard({ userRole }: DashboardProps) {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState('this_month'); // Default filter
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const response = await api.get<DashboardStats>('/dashboard/stats', {
          params: {
            date_filter: dateFilter,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [dateFilter, userRole]); // Added userRole to dependency array

  const displayCards = () => {
    if (user?.role?.name.toLowerCase() === 'admin' || user?.role?.name.toLowerCase() === 'hr' || user?.role?.name.toLowerCase() === 'devops') {
      return (
        <>
          {/* Active Requests Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <InboxIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.active_requests ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Number of requests currently marked as “Approved.”
              </p>
            </CardContent>
          </Card>

          {/* Active Complaints Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.active_complaints ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Number of complaints currently marked as “In-progress.”
              </p>
            </CardContent>
          </Card>

          {/* Total Shipped Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shipped</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.total_shipped ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Number of requests marked as “Shipped.”
              </p>
            </CardContent>
          </Card>
        </>
      );
    } else if (user?.role?.name.toLowerCase() === 'employee') {
      return (
        <>
          {/* My Requests Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Requests</CardTitle>
              <InboxIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.my_requests ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Total number of requests submitted by the logged-in employee.
              </p>
            </CardContent>
          </Card>

          {/* My Complaints Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Complaints</CardTitle>
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.my_complaints ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Total number of complaints submitted by the employee.
              </p>
            </CardContent>
          </Card>

          {/* Pending Requests Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <InboxIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.pending_requests ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Requests that are approved but not yet shipped.
              </p>
            </CardContent>
          </Card>

          {/* Pending Complaints Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.pending_complaints ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Complaints currently marked as “In-progress.”
              </p>
            </CardContent>
          </Card>
        </>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of IntraCore operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="time-range-select">Time Range</Label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger id="time-range-select" className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCards()}
      </div>
    </div>
  );
}
