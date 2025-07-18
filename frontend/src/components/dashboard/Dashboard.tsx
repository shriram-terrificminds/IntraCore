
import { 
  Package, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
}

const statsData = {
  'member': [
    { title: 'My Requests', value: '5', icon: Package, color: 'text-blue-600' },
    { title: 'My Complaints', value: '2', icon: MessageSquare, color: 'text-orange-600' },
    { title: 'Pending Requests', value: '7', icon: Clock, color: 'text-yellow-600' },
    { title: 'Pending Complaints', value: '1', icon: AlertTriangle, color: 'text-red-600' },
  ],
  'admin': [
    { title: 'Active Requests', value: '12', icon: Package, color: 'text-blue-600' },
    { title: 'Active Complaints', value: '3', icon: MessageSquare, color: 'text-red-600' },
    { title: 'Total Shipped', value: '45', icon: CheckCircle, color: 'text-green-600' },
  ],
  'devops': [
    { title: 'Active Requests', value: '8', icon: Package, color: 'text-blue-600' },
    { title: 'Active Complaints', value: '2', icon: MessageSquare, color: 'text-red-600' },
    { title: 'Total Shipped', value: '32', icon: CheckCircle, color: 'text-green-600' },
  ],
  'hr': [
    { title: 'Active Requests', value: '15', icon: Package, color: 'text-blue-600' },
    { title: 'Active Complaints', value: '4', icon: MessageSquare, color: 'text-red-600' },
    { title: 'Total Shipped', value: '28', icon: CheckCircle, color: 'text-green-600' },
  ]
};

const recentActivity = [
  { type: 'inventory', title: 'New mouse requested', user: 'John Doe', time: '2 hours ago', status: 'pending' },
  { type: 'complaint', title: 'Pantry coffee machine issue', user: 'Sarah Smith', time: '4 hours ago', status: 'in-progress' },
  { type: 'inventory', title: 'Office chair approved', user: 'Mike Johnson', time: '1 day ago', status: 'approved' },
  { type: 'announcement', title: 'Weekly team meeting', user: 'Admin', time: '2 days ago', status: 'published' },
];

export function Dashboard({ userRole }: DashboardProps) {
  console.log('Dashboard userRole:', userRole);
  console.log('Available statsData keys:', Object.keys(statsData));
  const stats = statsData[userRole];
  console.log('Stats for role:', stats);
  
  if (!stats) {
    console.error('No stats found for role:', userRole, 'falling back to member stats');
    const fallbackStats = statsData['member'] || [];
    console.log('Fallback stats:', fallbackStats);
  }
  
  const finalStats = stats || statsData['member'] || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your office.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {finalStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'inventory' ? 'bg-blue-500' :
                    activity.type === 'complaint' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
                <Badge variant={
                  activity.status === 'approved' ? 'default' :
                  activity.status === 'pending' ? 'secondary' :
                  activity.status === 'in-progress' ? 'outline' :
                  'default'
                }>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
