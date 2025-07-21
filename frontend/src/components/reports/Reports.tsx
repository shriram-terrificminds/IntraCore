
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportFilterForm, ReportFilters } from './ReportFilterForm';
import { ReportTable, ReportTableColumn } from './ReportTable';
import { ReportSummary } from './ReportSummary';
import * as XLSX from 'xlsx';

// Mock data for demonstration
const MOCK_INVENTORY = [
  { id: 1, title: 'Laptop Request', status: 'Resolved', assignedRole: 'hr', date: '2024-06-01', resolutionNote: 'Delivered', location: 'TVM' },
  { id: 2, title: 'Monitor Request', status: 'Pending', assignedRole: 'devops', date: '2024-06-05', resolutionNote: '', location: 'Ernakulam' },
  { id: 3, title: 'Keyboard', status: 'Rejected', assignedRole: 'hr', date: '2024-06-10', resolutionNote: 'Out of stock', location: 'Bangalore' },
];
const MOCK_COMPLAINTS = [
  { id: 101, title: 'WiFi Issue', status: 'In Progress', assignedRole: 'devops', date: '2024-06-03', resolutionNote: '', location: 'TVM' },
  { id: 102, title: 'AC Not Working', status: 'Resolved', assignedRole: 'hr', date: '2024-06-07', resolutionNote: 'Fixed', location: 'Ernakulam' },
  { id: 103, title: 'Broken Chair', status: 'Pending', assignedRole: 'devops', date: '2024-06-12', resolutionNote: '', location: 'Bangalore' },
];

const INVENTORY_COLUMNS: ReportTableColumn[] = [
  { key: 'id', label: 'Request No.' },
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'assignedRole', label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Date' },
  { key: 'resolutionNote', label: 'Resolution Note' },
];
const COMPLAINTS_COLUMNS: ReportTableColumn[] = [
  { key: 'id', label: 'Request No.' },
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'assignedRole', label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Date' },
  { key: 'resolutionNote', label: 'Resolution Note' },
];

function filterData<T extends { date: string; assignedRole: string; location: string }>(data: T[], filters: ReportFilters | null, type: 'inventory' | 'complaints'): T[] {
  if (!filters) return data;
  return data.filter(row => {
    // Report type
    if (filters.reportType !== 'all' && filters.reportType !== type) return false;
    // Assigned Role
    if (filters.role !== 'all' && row.assignedRole !== filters.role) return false;
    // Location
    if (filters.location && filters.location !== 'All' && row.location !== filters.location) return false;
    // Date range
    if (filters.dateRange) {
      if (filters.dateRange.from && row.date < filters.dateRange.from) return false;
      if (filters.dateRange.to && row.date > filters.dateRange.to) return false;
    }
    return true;
  });
}

function getSummary(inventory: typeof MOCK_INVENTORY, complaints: typeof MOCK_COMPLAINTS) {
  return {
    totalRequests: inventory.length,
    totalComplaints: complaints.length,
    resolved: inventory.filter(i => i.status === 'Resolved').length + complaints.filter(c => c.status === 'Resolved').length,
    rejected: inventory.filter(i => i.status === 'Rejected').length + complaints.filter(c => c.status === 'Rejected').length,
    pending: inventory.filter(i => i.status === 'Pending').length + complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
  };
}

function exportToExcel(data: any[], columns: ReportTableColumn[], filename: string, sheetName: string) {
  const exportData = data.map(row => {
    const obj: Record<string, any> = {};
    columns.forEach(col => {
      let value = row[col.key];
      if (value === undefined || value === null) value = '';
      obj[col.label] = typeof value === 'object' ? JSON.stringify(value) : value;
    });
    return obj;
  });
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

export function Reports({ userRole = 'admin', assignedLocations = ['TVM', 'Ernakulam'] }: { userRole?: 'admin' | 'hr' | 'devops' | 'employee', assignedLocations?: string[] }) {
  const [filters, setFilters] = useState<ReportFilters | null>(null);
  const [tab, setTab] = useState<'inventory' | 'complaints' | 'all'>('inventory');

  const filteredInventory = filterData(MOCK_INVENTORY, filters, 'inventory');
  const filteredComplaints = filterData(MOCK_COMPLAINTS, filters, 'complaints');
  const summary = getSummary(filteredInventory, filteredComplaints);

  const handleDownload = (type: 'inventory' | 'complaints') => {
    if (type === 'inventory') {
      exportToExcel(filteredInventory, INVENTORY_COLUMNS, 'Inventory.xlsx', 'Inventory');
    } else {
      exportToExcel(filteredComplaints, COMPLAINTS_COLUMNS, 'Complaints.xlsx', 'Complaints');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Reports</h2>
      <ReportFilterForm userRole={userRole} assignedLocations={assignedLocations} onFilter={setFilters} />
      <ReportSummary summary={summary} />
      <Tabs value={tab} onValueChange={v => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <ReportTable
            columns={INVENTORY_COLUMNS}
            data={filteredInventory}
            tableTitle="Inventory Requests"
            onDownload={() => handleDownload('inventory')}
          />
        </TabsContent>
        <TabsContent value="complaints">
          <ReportTable
            columns={COMPLAINTS_COLUMNS}
            data={filteredComplaints}
            tableTitle="Complaints"
            onDownload={() => handleDownload('complaints')}
          />
        </TabsContent>
        <TabsContent value="all">
          <ReportTable
            columns={INVENTORY_COLUMNS}
            data={filteredInventory}
            tableTitle="Inventory Requests"
            onDownload={() => handleDownload('inventory')}
          />
          <ReportTable
            columns={COMPLAINTS_COLUMNS}
            data={filteredComplaints}
            tableTitle="Complaints"
            onDownload={() => handleDownload('complaints')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
