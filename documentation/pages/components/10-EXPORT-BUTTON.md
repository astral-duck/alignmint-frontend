# Export Button Component

**Component File:** Reusable utility component  
**Usage:** Export data to various formats  
**Access Level:** All authenticated users (context-dependent)

## Overview
The Export Button component provides a reusable button for exporting data to various formats (CSV, Excel, PDF). It appears in reports, tables, and data views throughout the application. The button handles format selection, data preparation, and file download.

## UI Features

### Export Formats
- **CSV** - Comma-separated values
- **Excel** - XLSX spreadsheet
- **PDF** - Formatted PDF document

### Features
- Format selector dropdown
- Loading state during export
- Download progress indicator
- Error handling
- Success notification

## Props Interface

```typescript
interface ExportButtonProps {
  data: any[];              // Data to export
  filename: string;         // Base filename (without extension)
  formats?: ('csv' | 'xlsx' | 'pdf')[];  // Available formats
  onExport?: (format: string) => void;   // Custom export handler
}
```

## Usage Example

```tsx
<ExportButton
  data={donations}
  filename="donations-report"
  formats={['csv', 'xlsx', 'pdf']}
/>
```

## Export Process

1. User clicks Export button
2. Select format from dropdown
3. Data formatted for selected type
4. File generated client-side or via API
5. Browser download initiated
6. Success toast shown

## API Endpoints (Optional)

### POST /api/v1/exports
```
Description: Generate export file server-side
Request Body: {
  data: [...],
  format: "xlsx",
  filename: "donations-report"
}

Response: {
  data: {
    download_url: "https://...",
    expires_at: "2025-10-20T18:00:00Z"
  }
}
```

## Dependencies

### External Libraries
- `xlsx` - Excel file generation
- `jspdf` - PDF generation
- `file-saver` - File download

## Related Documentation
- [../reports/01-BALANCE-SHEET-REPORT.md](../reports/01-BALANCE-SHEET-REPORT.md)
- [../donor-hub/02-DONATIONS-MANAGER.md](../donor-hub/02-DONATIONS-MANAGER.md)
