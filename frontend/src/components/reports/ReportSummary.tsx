interface ReportSummaryProps {
  summary: {
    totalRequests: number;
    totalComplaints: number;
    resolved: number;
    rejected: number;
    pending: number;
    inProgress: number;
  };
}

export function ReportSummary({ summary }: ReportSummaryProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Monthly Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold">{summary.totalRequests}</div>
          <div className="text-sm text-muted-foreground">Requests</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold">{summary.totalComplaints}</div>
          <div className="text-sm text-muted-foreground">Complaints</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.resolved}</div>
          <div className="text-sm text-muted-foreground">Resolved</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{summary.rejected}</div>
          <div className="text-sm text-muted-foreground">Rejected</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{summary.inProgress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
      </div>
    </div>
  );
} 