# Reports Hub

**Component File:** `src/components/ReportsHub.tsx`  
**Route:** `/reports`  
**Access Level:** Admin, Manager

## Overview
The Reports Hub is a navigation landing page that provides access to all financial and operational reports. It displays a grid of report cards for viewing and exporting comprehensive reports.

## UI Features

### Report Cards (6 reports)
1. **Balance Sheet** - View assets, liabilities, and net assets
2. **Cash Flow Statement** - Track cash inflows and outflows by activity
3. **Income Statement** - Revenue minus expenses for net income
4. **Volunteer Hours** - Track and report volunteer time
5. **Donor Reporting** - Send end-of-year tax reports to donors
6. **Comparative Report** - Compare reports side by side across periods

### Features
- Grid layout (responsive: 1/2/3 columns)
- Icon-based report cards
- Hover effects
- Report descriptions
- Click to navigate

## Navigation Mapping

| Report ID | Routes To | Component |
|-----------|-----------|-----------|
| `balance-sheet` | Reports → Balance Sheet | BalanceSheetReport |
| `cash-flow` | Reports → Cash Flow | CashFlowReport |
| `income-statement` | Reports → Income Statement | IncomeStatementReport |
| `volunteer-hours` | Reports → Volunteer Hours | VolunteerHoursReport |
| `donor-reporting` | Reports → Donor Reporting | DonorReporting |
| `comparative` | Reports → Comparative Report | ComparativeReport |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
None required

## Related Documentation
- [01-BALANCE-SHEET-REPORT.md](./01-BALANCE-SHEET-REPORT.md)
- [02-INCOME-STATEMENT-REPORT.md](./02-INCOME-STATEMENT-REPORT.md)
- [03-CASH-FLOW-REPORT.md](./03-CASH-FLOW-REPORT.md)
- [04-FUND-ACCOUNTING.md](./04-FUND-ACCOUNTING.md)
- [05-VOLUNTEER-HOURS-REPORT.md](./05-VOLUNTEER-HOURS-REPORT.md)
- [06-INCOME-STATEMENT-BY-FUND.md](./06-INCOME-STATEMENT-BY-FUND.md)
- [07-DONOR-REPORTING.md](./07-DONOR-REPORTING.md)
- [08-COMPARATIVE-REPORT.md](./08-COMPARATIVE-REPORT.md)
