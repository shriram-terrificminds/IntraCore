
import { useState } from 'react';
import { Download, FileText, File, Table } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'inventory' | 'complaints';
}

export function ExportDialog({ open, onOpenChange, type }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeFilters, setIncludeFilters] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    // Simulate export functionality
    toast({
      title: "Export Started",
      description: `Your ${type} report is being generated as ${exportFormat.toUpperCase()}. You'll receive a download link shortly.`,
    });
    
    // In a real implementation, this would trigger the actual export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${type} report has been exported successfully.`,
      });
      onOpenChange(false);
    }, 2000);
  };

  const exportOptions = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Comma-separated values for spreadsheet applications',
      icon: Table
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel format with formatting',
      icon: FileText
    },
    {
      value: 'pdf',
      label: 'PDF',
      description: 'Portable document format for sharing',
      icon: File
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export {type === 'inventory' ? 'Inventory Requests' : 'Complaints'} Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="mt-3">
              {exportOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex items-start space-x-3 flex-1">
                    <option.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Export Options</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-filters" 
                checked={includeFilters}
                onCheckedChange={(checked) => setIncludeFilters(checked === true)}
              />
              <Label htmlFor="include-filters" className="text-sm cursor-pointer">
                Include applied filters in export
              </Label>
            </div>

            {exportFormat === 'pdf' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-charts" 
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                />
                <Label htmlFor="include-charts" className="text-sm cursor-pointer">
                  Include summary charts (PDF only)
                </Label>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
