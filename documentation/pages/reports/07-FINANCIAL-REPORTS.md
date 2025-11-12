# Financial Reports

**Component:** `FinancialReports.tsx`  
**Module:** Reports  
**Access Level:** All authenticated users  
**Status:** Complete

---

## Overview

The Financial Reports component provides a centralized hub for accessing all financial reports in the system. It serves as the main entry point for report generation and viewing.

### Purpose

- Centralized access to all financial reports
- Quick report generation
- Report filtering and search
- Export capabilities
- Report scheduling (future)

---

## Features

### 1. Report Dashboard
- Overview of available reports
- Quick access to common reports
- Recent reports list
- Favorite reports
- Report categories

### 2. Report Categories

#### Standard Reports
- Balance Sheet
- Income Statement
- Income Statement by Fund
- Profit & Loss
- Cash Flow Statement
- Trial Balance

#### Donor Reports
- Donation Summary
- Donor Contribution Report
- Recurring Donations Report
- Donor Retention Analysis

#### Accounting Reports
- General Ledger
- Account Activity
- Journal Entry Report
- Reconciliation Report

#### Personnel Reports
- Volunteer Hours Report
- Staff Time Report
- Leave Balance Report

#### Compliance Reports
- Form 990 Data
- Audit Trail Report
- Tax Receipt Summary

### 3. Report Generation
- Select report type
- Choose date range
- Apply filters
- Preview report
- Export to PDF/Excel
- Email report

### 4. Report History
- View previously generated reports
- Re-run reports
- Download saved reports
- Delete old reports

---

## Data Requirements

### Report Configuration

```typescript
interface ReportConfig {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'donor' | 'accounting' | 'personnel' | 'compliance';
  component: string;
  parameters: ReportParameter[];
  permissions: string[];
  icon: string;
}

interface ReportParameter {
  name: string;
  label: string;
  type: 'date' | 'daterange' | 'select' | 'multiselect' | 'text';
  required: boolean;
  options?: { value: string; label: string }[];
  default?: any;
}

interface GeneratedReport {
  id: string;
  report_type: string;
  parameters: Record<string, any>;
  generated_at: string;
  generated_by: string;
  file_url?: string;
  status: 'generating' | 'completed' | 'failed';
}
```

---

## Report Catalog

### 1. Balance Sheet
**Path:** `/reports/balance-sheet`  
**Parameters:**
- As of Date (required)
- Fund (optional)
- Include Zero Balances (boolean)

**Output:** PDF, Excel

### 2. Income Statement
**Path:** `/reports/income-statement`  
**Parameters:**
- Start Date (required)
- End Date (required)
- Fund (optional)
- Comparison Period (optional)

**Output:** PDF, Excel

### 3. Income Statement by Fund
**Path:** `/reports/income-by-fund`  
**Parameters:**
- Start Date (required)
- End Date (required)
- Selected Funds (multiselect)

**Output:** PDF, Excel

### 4. Profit & Loss
**Path:** `/reports/profit-loss`  
**Parameters:**
- Start Date (required)
- End Date (required)
- Grouping (month/quarter/year)

**Output:** PDF, Excel

### 5. Donation Summary
**Path:** `/reports/donation-summary`  
**Parameters:**
- Start Date (required)
- End Date (required)
- Donor Type (optional)
- Payment Method (optional)

**Output:** PDF, Excel

### 6. Volunteer Hours
**Path:** `/reports/volunteer-hours`  
**Parameters:**
- Start Date (required)
- End Date (required)
- Volunteer (optional)
- Activity Type (optional)

**Output:** PDF, Excel

---

## API Endpoints

### List Available Reports
```
GET /api/v1/reports
Response: ReportConfig[]
```

### Generate Report
```
POST /api/v1/reports/generate
Body: {
  report_type: string,
  parameters: Record<string, any>,
  format: 'pdf' | 'excel' | 'json'
}
Response: {
  report_id: string,
  status: 'generating',
  estimated_time: number
}
```

### Get Report Status
```
GET /api/v1/reports/:id/status
Response: {
  status: 'generating' | 'completed' | 'failed',
  progress: number,
  file_url?: string,
  error?: string
}
```

### Download Report
```
GET /api/v1/reports/:id/download
Response: File (PDF or Excel)
```

### List Generated Reports
```
GET /api/v1/reports/history
Query Parameters:
  - page: number
  - page_size: number
  - report_type: string
  - start_date: string
  - end_date: string
```

### Delete Report
```
DELETE /api/v1/reports/:id
```

---

## User Interface

### Main Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  Financial Reports                           [⚙️] [🔍]  │
├─────────────────────────────────────────────────────────┤
│  Quick Access                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Balance      │ │ Income       │ │ Profit &     │   │
│  │ Sheet        │ │ Statement    │ │ Loss         │   │
│  │ [Generate]   │ │ [Generate]   │ │ [Generate]   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────┤
│  All Reports                                             │
│  📊 Financial Reports (6)                                │
│     • Balance Sheet                                      │
│     • Income Statement                                   │
│     • Income Statement by Fund                           │
│     • Profit & Loss                                      │
│     • Cash Flow Statement                                │
│     • Trial Balance                                      │
│                                                          │
│  👥 Donor Reports (4)                                    │
│     • Donation Summary                                   │
│     • Donor Contribution Report                          │
│     • Recurring Donations                                │
│     • Donor Retention Analysis                           │
│                                                          │
│  📈 Accounting Reports (4)                               │
│     • General Ledger                                     │
│     • Account Activity                                   │
│     • Journal Entry Report                               │
│     • Reconciliation Report                              │
├─────────────────────────────────────────────────────────┤
│  Recent Reports                                          │
│  2025-01-15 │ Balance Sheet      │ [Download] [Delete]  │
│  2025-01-14 │ Income Statement   │ [Download] [Delete]  │
│  2025-01-13 │ Donation Summary   │ [Download] [Delete]  │
└─────────────────────────────────────────────────────────┘
```

### Report Generation Dialog
```
┌─────────────────────────────────────────┐
│  Generate Balance Sheet              [×]│
├─────────────────────────────────────────┤
│  As of Date: [2025-01-15]      [📅]    │
│  Fund:       [All Funds        ▼]      │
│  Format:     [PDF              ▼]      │
│                                          │
│  Options:                                │
│  ☑ Include Zero Balances                │
│  ☑ Show Account Numbers                 │
│  ☐ Detailed View                        │
│                                          │
│           [Cancel]  [Generate Report]   │
└─────────────────────────────────────────┘
```

---

## Report Generation Flow

### 1. User Initiates
```typescript
// User clicks "Generate Report"
const handleGenerateReport = async () => {
  const response = await reportsAPI.generate({
    report_type: 'balance_sheet',
    parameters: {
      as_of_date: '2025-01-15',
      fund_id: 'all',
      include_zero_balances: true
    },
    format: 'pdf'
  });
  
  // Start polling for status
  pollReportStatus(response.report_id);
};
```

### 2. Backend Processing
```python
# Backend generates report asynchronously
@shared_task
def generate_report(report_id, report_type, parameters):
    # 1. Fetch data
    data = fetch_report_data(report_type, parameters)
    
    # 2. Generate report
    if format == 'pdf':
        file = generate_pdf(data)
    elif format == 'excel':
        file = generate_excel(data)
    
    # 3. Upload to S3
    file_url = upload_to_s3(file)
    
    # 4. Update report record
    Report.objects.filter(id=report_id).update(
        status='completed',
        file_url=file_url
    )
```

### 3. Frontend Polling
```typescript
const pollReportStatus = async (reportId: string) => {
  const interval = setInterval(async () => {
    const status = await reportsAPI.getStatus(reportId);
    
    if (status.status === 'completed') {
      clearInterval(interval);
      // Download or display report
      window.open(status.file_url, '_blank');
    } else if (status.status === 'failed') {
      clearInterval(interval);
      toast.error('Report generation failed');
    }
  }, 2000); // Poll every 2 seconds
};
```

---

## Report Templates

### PDF Template Structure
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Report styling */
  </style>
</head>
<body>
  <header>
    <h1>{{ report_title }}</h1>
    <p>{{ organization_name }}</p>
    <p>{{ date_range }}</p>
  </header>
  
  <main>
    {{ report_content }}
  </main>
  
  <footer>
    <p>Generated on {{ generated_date }}</p>
    <p>Page {{ page_number }}</p>
  </footer>
</body>
</html>
```

---

## Permissions

### All Users
- ✅ View available reports
- ✅ Generate reports for their organization
- ✅ Download their generated reports

### Managers
- ✅ All user permissions
- ✅ Schedule reports
- ✅ Share reports with team

### Fiscal Sponsor
- ✅ All permissions
- ✅ Generate reports for all nonprofits
- ✅ Cross-organization reports

---

## Performance Optimization

### Caching Strategy
```python
# Cache report data for common date ranges
@cache_page(60 * 15)  # Cache for 15 minutes
def get_balance_sheet_data(organization_id, as_of_date):
    # Expensive query
    return calculate_balance_sheet(organization_id, as_of_date)
```

### Async Generation
- Generate reports in background (Celery)
- Notify user when complete
- Store in S3 for download

### Data Optimization
- Use database views for complex reports
- Pre-aggregate common calculations
- Index frequently queried fields

---

## Export Formats

### PDF
- Professional formatting
- Print-ready
- Includes header/footer
- Page numbers
- Organization branding

### Excel
- Editable data
- Multiple sheets
- Formulas included
- Pivot table ready
- Charts included

### CSV
- Raw data export
- Import into other systems
- Lightweight
- No formatting

---

## Testing Scenarios

1. **Generate Standard Report**
   - Select Balance Sheet
   - Choose date
   - Generate PDF
   - Verify download

2. **Report with Filters**
   - Generate Income Statement
   - Filter by fund
   - Verify data accuracy

3. **Export Formats**
   - Generate same report in PDF and Excel
   - Verify data consistency

4. **Report History**
   - Generate multiple reports
   - View history
   - Download previous report

5. **Error Handling**
   - Invalid date range
   - No data available
   - Generation timeout

---

## Related Components

- **Balance Sheet Report** - Specific report implementation
- **Income Statement Report** - Specific report implementation
- **General Ledger** - Data source
- **Chart of Accounts** - Account structure

---

## Future Enhancements

### Scheduled Reports
- Schedule recurring report generation
- Email delivery
- Automatic archiving

### Custom Reports
- Report builder interface
- Custom calculations
- Save custom reports

### Report Sharing
- Share reports with external users
- Public report links
- Expiring access

### Advanced Analytics
- Trend analysis
- Comparative reports
- Forecasting

---

## Notes for Backend Team

### Report Generation
- Use Celery for async processing
- Store reports in S3
- Clean up old reports (30 days)
- Implement rate limiting

### Data Accuracy
- Use transactions for consistency
- Validate date ranges
- Handle timezone conversions
- Round currency properly

### Performance
- Optimize database queries
- Use database views
- Implement caching
- Monitor generation time

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
