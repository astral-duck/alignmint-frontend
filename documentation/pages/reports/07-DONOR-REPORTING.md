# Donor Reporting

**Component File:** `src/components/DonorReporting.tsx`  
**Route:** `/reports` (with tool='donor-reporting')  
**Access Level:** Admin, Manager

## Overview
Donor Reporting generates and sends end-of-year tax reports to donors. It provides a comprehensive interface for selecting donors, previewing tax receipts, and batch-sending annual giving statements for tax purposes.

## UI Features

### Main Features
- **Header:**
  - Title: "Donor Reporting"
  - Subtitle: "Generate and send end-of-year tax reports to donors"
  - Back to Reports Hub button

### Stats Cards (4 cards)
1. **Total Donors** - Count of donors with YTD donations
2. **Selected** - Count of currently selected donors
3. **[Year] Total** - Sum of all YTD donations
4. **Report Year** - Currently selected tax year

### Search and Filters
- Search by donor name or email
- Year selector dropdown
- Select All / Deselect All functionality

### Action Buttons
- **Send Reports** - Batch send to selected donors
- **Export PDF** - Download donor list

### Donors Table
Columns:
- Checkbox for selection
- Donor Name
- Email
- Nonprofit (entity they donated to)
- YTD Total (donations for selected year)
- Actions (Preview button)

### Preview Report Dialog
Shows a preview of the tax receipt including:
- Organization letterhead
- Donor information
- Donation summary by date
- Total contributions
- Tax-deductible statement
- IRS compliance language

### Send Confirmation Dialog
Confirms batch sending of reports to selected donors.

### Desktop-Only Warning
Mobile users see a warning that this tool requires desktop access.

## Data Requirements

### DonorWithSelection Interface
```typescript
interface DonorWithSelection extends DonorProfile {
  selected: boolean;
  ytdTotal: number;
}
```

### Stats Object
```typescript
interface Stats {
  totalDonors: number;
  selectedCount: number;
  totalYTD: number;
  selectedYTD: number;
}
```

## State Management

### Local State
- `searchQuery` - Search filter text
- `selectedDonors` - Set of selected donor IDs
- `previewOpen` - Preview dialog visibility
- `sendConfirmOpen` - Send confirmation dialog visibility
- `previewDonor` - Donor being previewed
- `reportYear` - Selected tax year

### Global State (AppContext)
- `setReportTool` - Navigation function

## Key Functions

### Selection
- `handleSelectAll()` - Toggle select/deselect all visible donors
- `handleSelectDonor(donorId)` - Toggle individual donor selection

### Actions
- `handlePreviewReport(donor)` - Open preview dialog for donor
- `handleSendReports()` - Initiate batch send
- `confirmSendReports()` - Confirm and execute batch send
- `handleExportPDF()` - Export donor list to PDF

### Filtering
- Filters donors by search query
- Filters to only show donors with YTD donations > 0
- Sorts alphabetically by name

## Dependencies

### Internal Dependencies
- `AppContext` - Global state and entities
- `mockData` - Donor profiles and donation history
- UI components (Card, Button, Badge, Checkbox, Table, Dialog, Select, Input)
- `PageHeader` component
- `DesktopOnlyWarning` component

### External Libraries
- `lucide-react` - Icons (Mail, Search, ArrowLeft, FileText, Send, CheckCircle2, Users, DollarSign, Calendar, Eye, Download)
- `sonner` - Toast notifications

## Use Cases

1. **Year-End Tax Receipts** - Generate annual giving statements
2. **Batch Email** - Send reports to multiple donors at once
3. **Preview Before Send** - Review individual reports before sending
4. **Donor Selection** - Choose specific donors or select all
5. **Multi-Year Support** - Generate reports for previous years
6. **Export for Records** - Download donor list as PDF

## Tax Receipt Content

The generated report includes:
- Organization name and address
- Donor name and address
- Tax year
- Itemized list of donations with dates and amounts
- Total contributions
- Statement that no goods/services were provided
- IRS compliance statement
- Organization EIN

## Related Documentation
- [00-REPORTS-HUB.md](./00-REPORTS-HUB.md)
- [../donor-hub/01-DONORS-CRM.md](../donor-hub/01-DONORS-CRM.md)
- [../donor-hub/02-DONATIONS-MANAGER.md](../donor-hub/02-DONATIONS-MANAGER.md)
