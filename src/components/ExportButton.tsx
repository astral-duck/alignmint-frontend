import React, { useState } from 'react';
import { Button } from './ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface ExportButtonProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExportExcel,
  onExportPDF,
  variant = 'outline',
  size = 'default',
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'excel' | 'pdf', exportFn: () => void) => {
    setIsExporting(true);
    try {
      await exportFn();
      toast.success(`Exported to ${type === 'excel' ? 'Excel' : 'PDF'} successfully!`);
    } catch (error) {
      toast.error(`Failed to export to ${type === 'excel' ? 'Excel' : 'PDF'}`);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting} className="gap-2">
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('excel', onExportExcel)}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export to Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf', onExportPDF)}>
          <FileText className="h-4 w-4 mr-2" />
          Export to PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
