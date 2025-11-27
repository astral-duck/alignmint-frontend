# Comparative Report

**Component File:** `src/components/ComparativeReport.tsx`  
**Route:** `/reports` (with tool='comparative')  
**Access Level:** Admin, Manager

## Overview
The Comparative Report allows accountants to view two reports side by side for comparison. Each report panel can be configured independently with its own report type and date range, enabling period-over-period analysis, year-over-year comparisons, or cross-report analysis. Each report displays full accounting data with clickable line items that open a transaction detail drawer.

## UI Features

### Main Features
- **Report Header:**
  - Title: "Comparative Report"
  - Subtitle showing organization name
  - Back to Reports Hub button

### Side-by-Side Layout
Two independent report panels (Report A and Report B), each with:
- **Panel Title:** Centered with icon (Report A in blue, Report B in purple)
- **Report Type Selector:** Dropdown to choose between:
  - Balance Sheet
  - Cash Flow Statement
  - Income Statement
- **Date Range Controls:**
  - Start Date picker
  - End Date picker
- **Report Display:**
  - Full report content rendered based on selected type (same as standalone report modules)
  - Scrollable content area (max-height: 600px)
  - Date range displayed in header
  - Clickable line items with hover effects and chevron indicators

### Report Content
Each panel renders the selected report type with full accounting detail:

**Balance Sheet:**
- Assets section with account codes and names
- Liabilities section with account codes and names
- Equity (Fund Balances) section with account codes and names
- Total Liabilities & Equity summary
- All line items are clickable to view transaction details

**Cash Flow Statement:**
- Cash Flows from Operating Activities with account codes
- Cash Received from Operations (income accounts)
- Cash Disbursements (expense accounts)
- Net Cash Provided by (Used in) Operating Activities
- Color-coded amounts (green for inflows, red for outflows)
- All line items are clickable to view transaction details

**Income Statement:**
- Revenue section with categorized income
- Expenses section (Personnel, Facilities, Administrative, Program Services)
- Net Income / (Loss) with color-coded display
- All line items are clickable to view transaction details

### Transaction Detail Drawer
When clicking any line item in either report panel, a slide-out drawer appears showing:
- **Header:** Account name with external link icon
- **Summary Cards:**
  - Account Balance amount
  - Transaction count
- **Transaction Details Table:**
  - Date (formatted as Month Day, Year)
  - Description with account code/category
  - Reference Number
  - Debit amount (green)
  - Credit amount (red)
  - Reconciliation Status (Reconciled/Pending badges)

## Data Requirements

### Report Configuration
- **type** (enum) - 'balance-sheet' | 'cash-flow' | 'income-statement'
- **startDate** (date) - Period start
- **endDate** (date) - Period end

### Data Sources
- Balance Sheet: `generateLegacyBalanceSheet()` from `legacyReportData.ts`
- Cash Flow / Income Statement: `getProfitLoss()` from `financialData.ts`
- Transaction Details: `generateMockTransactions()` (mock data generator)

### Selected Line Item
- **name** (string) - Account display name
- **amount** (number) - Account balance
- **accountCode** (string) - GL account code
- **category** (string) - Account category (asset, liability, equity, income, expense)

## State Management

### Local State
- `leftReport` - Configuration for left panel (type, startDate, endDate)
- `rightReport` - Configuration for right panel (type, startDate, endDate)
- `drawerOpen` - Boolean controlling transaction drawer visibility
- `selectedLineItem` - Currently selected line item for drawer display
- `drawerTransactions` - Array of transactions for the selected line item

### Global State (AppContext)
- `selectedEntity` - Current organization
- `setReportTool` - Navigation function

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- `generateLegacyBalanceSheet` - Balance sheet data
- `getProfitLoss` - P&L/Cash flow data
- UI components (Card, Button, Select, Input, Label, Separator, Badge)
- Sheet components (Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription)
- Table components (Table, TableBody, TableCell, TableHead, TableHeader, TableRow)
- `PageHeader` component

### External Libraries
- `lucide-react` - Icons (ArrowLeft, ChevronRight, GitCompare, ExternalLink)

## Use Cases

1. **Period Comparison:** Compare Q1 vs Q2 of the same year
2. **Year-over-Year:** Compare 2024 vs 2025 for the same period
3. **Report Type Comparison:** View Balance Sheet alongside Income Statement
4. **Month-End Analysis:** Compare current month to prior month
5. **Transaction Drill-Down:** Click any line item to view underlying transactions
6. **Audit Support:** Review transaction details for specific accounts across periods

## Related Documentation
- [01-BALANCE-SHEET-REPORT.md](./01-BALANCE-SHEET-REPORT.md)
- [02-INCOME-STATEMENT-REPORT.md](./02-INCOME-STATEMENT-REPORT.md)
- [03-CASH-FLOW-REPORT.md](./03-CASH-FLOW-REPORT.md)
- [00-REPORTS-HUB.md](./00-REPORTS-HUB.md)
