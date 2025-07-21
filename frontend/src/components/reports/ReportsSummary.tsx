
import { Package, MessageSquare, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportsSummaryProps {
  reportData: {
    title: string;
    description: string;
    chartData: any[]; // Can be more specific if needed
    summary: { label: string; value: string | number; }[];
  };
  userRole: UserRole;
}

export function ReportsSummary({ reportData, userRole }: ReportsSummaryProps) {
  const getIconForLabel = (label: string) => {
    switch (label) {
      case 'Total Requests':
      case 'Total Complaints':
      case 'Total Users':
        return Package; // General icon for totals
      case 'Pending Requests':
      case 'Open Complaints':
      case 'Pending Complaints':
        return Clock; // Icon for pending/open
      case 'Approved':
      case 'Resolved':
      case 'Active Users':
        return CheckCircle; // Icon for approved/resolved/active
      case 'Rejected':
      case 'New Users (Last 30 Days)':
        return AlertTriangle; // Icon for rejected/new users
      default:
        return TrendingUp; // Default icon
    }
  };

  const getColorForLabel = (label: string) => {
    switch (label) {
      case 'Total Requests':
      case 'Total Complaints':
      case 'Total Users':
        return 'text-blue-600';
      case 'Pending Requests':
      case 'Pending Complaints':
      case 'Open Complaints':
        return 'text-yellow-600';
      case 'Approved':
      case 'Resolved':
      case 'Active Users':
        return 'text-green-600';
      case 'Rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColorForLabel = (label: string) => {
    switch (label) {
      case 'Total Requests':
      case 'Total Complaints':
      case 'Total Users':
        return 'bg-blue-50';
      case 'Pending Requests':
      case 'Pending Complaints':
      case 'Open Complaints':
        return 'bg-yellow-50';
      case 'Approved':
      case 'Resolved':
      case 'Active Users':
        return 'bg-green-50';
      case 'Rejected':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {reportData.summary.map((card, index) => {
        const Icon = getIconForLabel(card.label);
        const color = getColorForLabel(card.label);
        const bgColor = getBgColorForLabel(card.label);
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`p-2 rounded-full ${bgColor}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
