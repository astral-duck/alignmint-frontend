import React, { useState } from 'react';
import { entities } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface MultiNonprofitExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: 'balance-sheet' | 'profit-loss' | 'income-statement' | 'volunteer-hours';
  onExport: (selectedNonprofitIds: string[], format: 'pdf' | 'xlsx') => void;
}

export const MultiNonprofitExportDialog: React.FC<MultiNonprofitExportDialogProps> = ({
  open,
  onOpenChange,
  reportType,
  onExport,
}) => {
  // Filter out 'all' and get only the actual nonprofits
  const nonprofits = entities.filter(e => e.id !== 'all');
  
  const [selectedNonprofits, setSelectedNonprofits] = useState<string[]>(
    nonprofits.map(e => e.id)
  );
  const [exportFormat, setExportFormat] = useState<'pdf' | 'xlsx'>('pdf');

  const handleToggleAll = () => {
    if (selectedNonprofits.length === nonprofits.length) {
      setSelectedNonprofits([]);
    } else {
      setSelectedNonprofits(nonprofits.map(e => e.id));
    }
  };

  const handleToggleNonprofit = (id: string) => {
    setSelectedNonprofits(prev => {
      if (prev.includes(id)) {
        return prev.filter(npId => npId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleExport = () => {
    if (selectedNonprofits.length === 0) {
      toast.error('Please select at least one nonprofit to export');
      return;
    }

    onExport(selectedNonprofits, exportFormat);
    onOpenChange(false);
    
    const reportName = 
      reportType === 'balance-sheet' ? 'Balance Sheet' :
      reportType === 'profit-loss' ? 'P&L Statement' :
      reportType === 'volunteer-hours' ? 'Volunteer Hours Report' :
      'Income Statement';
    
    const formatName = exportFormat === 'pdf' ? 'PDF' : 'Excel';
    
    toast.success(
      `Exporting ${reportName} for ${selectedNonprofits.length} nonprofit${selectedNonprofits.length > 1 ? 's' : ''}...`,
      { description: `Your ${formatName} file will be downloaded shortly` }
    );
  };

  const allSelected = selectedNonprofits.length === nonprofits.length;
  const someSelected = selectedNonprofits.length > 0 && selectedNonprofits.length < nonprofits.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Choose which nonprofits to include and select your preferred export format.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Export Format Selection */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Label className="text-sm">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={(value) => setExportFormat(value as 'pdf' | 'xlsx')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="format-pdf" />
                <Label htmlFor="format-pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  PDF Document
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="format-xlsx" />
                <Label htmlFor="format-xlsx" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel Spreadsheet (.xlsx)
                </Label>
              </div>
            </RadioGroup>
          </div>
          {/* Select All Checkbox */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleToggleAll}
              className={someSelected ? 'data-[state=checked]:bg-blue-500' : ''}
            />
            <label
              htmlFor="select-all"
              className="text-sm cursor-pointer select-none"
            >
              {allSelected ? 'Deselect All' : 'Select All'} ({selectedNonprofits.length} of {nonprofits.length} selected)
            </label>
          </div>

          {/* Nonprofit List */}
          <ScrollArea className="h-[50vh] max-h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
              {nonprofits.map((nonprofit) => (
                <div
                  key={nonprofit.id}
                  className="flex items-start space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Checkbox
                    id={nonprofit.id}
                    checked={selectedNonprofits.includes(nonprofit.id)}
                    onCheckedChange={() => handleToggleNonprofit(nonprofit.id)}
                  />
                  <label
                    htmlFor={nonprofit.id}
                    className="text-sm cursor-pointer flex-1 select-none pt-0.5"
                  >
                    {nonprofit.name}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedNonprofits.length} nonprofit{selectedNonprofits.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={selectedNonprofits.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export {exportFormat === 'pdf' ? 'PDF' : 'Excel'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
