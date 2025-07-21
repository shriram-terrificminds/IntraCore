import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';

export interface ReportTableColumn {
  key: string;
  label: string;
}

export interface ReportTableProps {
  columns: ReportTableColumn[];
  data: any[];
  tableTitle: string;
  onDownload: () => void;
}

export function ReportTable({ columns, data, tableTitle, onDownload }: ReportTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{tableTitle}</h3>
        <Button variant="outline" onClick={onDownload} size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download Excel
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={row.id || idx}>
                  {columns.map(col => (
                    <TableCell key={col.key} className="whitespace-nowrap">
                      {row[col.key] ?? ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 