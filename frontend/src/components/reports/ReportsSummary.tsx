
import { Package, MessageSquare, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportsSummaryProps {
  inventoryData: any[];
  complaintsData: any[];
}

export function ReportsSummary({ inventoryData, complaintsData }: ReportsSummaryProps) {
  const inventoryStats = {
    total: inventoryData.length,
    pending: inventoryData.filter(item => item.status === 'pending').length,
    approved: inventoryData.filter(item => item.status === 'approved').length,
    delivered: inventoryData.filter(item => item.status === 'delivered').length,
    rejected: inventoryData.filter(item => item.status === 'rejected').length,
  };

  const complaintsStats = {
    total: complaintsData.length,
    pending: complaintsData.filter(item => item.status === 'pending-verification').length,
    verified: complaintsData.filter(item => item.status === 'verified').length,
    resolved: complaintsData.filter(item => item.status === 'resolved').length,
    inProgress: complaintsData.filter(item => item.status === 'in-progress').length,
  };

  const summaryCards = [
    {
      title: 'Total Inventory Requests',
      value: inventoryStats.total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Requests',
      value: inventoryStats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Complaints',
      value: complaintsStats.total,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Resolved Complaints',
      value: complaintsStats.resolved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Delivered Items',
      value: inventoryStats.delivered,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Pending Complaints',
      value: complaintsStats.pending + complaintsStats.verified,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {summaryCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
