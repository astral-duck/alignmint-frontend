# Reports Hub

**Component File:** `src/components/ReportsHub.tsx`  
**Route:** `/reports`  
**Access Level:** Admin, Manager

## Overview
The Reports Hub is a navigation landing page that provides access to all financial and operational reports. It displays a grid of report cards for viewing and exporting comprehensive reports.

## UI Features

### Report Cards (5 reports)
1. **Balance Sheet** - View assets, liabilities, and net assets
2. **P&L Statement** - Revenue and expenses statement
3. **Income Statement** - Revenue minus expenses for net income
4. **Volunteer Hours** - Track and report volunteer time
5. **Donor Reporting** - Send end-of-year tax reports to donors

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
| `profit-loss` | Reports → P&L | ProfitLossReport |
| `income-statement` | Reports → Income Statement | IncomeStatementReport |
| `volunteer-hours` | Reports → Volunteer Hours | VolunteerHoursReport |
| `donor-reporting` | Reports → Donor Reporting | DonorReporting |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
None required

## Related Documentation
- [../reports/01-BALANCE-SHEET-REPORT.md](../reports/01-BALANCE-SHEET-REPORT.md)
- [../reports/02-INCOME-STATEMENT-REPORT.md](../reports/02-INCOME-STATEMENT-REPORT.md)
- [../reports/03-PROFIT-LOSS-REPORT.md](../reports/03-PROFIT-LOSS-REPORT.md)
- [../reports/04-FUND-ACCOUNTING-REPORT.md](../reports/04-FUND-ACCOUNTING-REPORT.md)
- [../reports/05-VOLUNTEER-HOURS-REPORT.md](../reports/05-VOLUNTEER-HOURS-REPORT.md)
- [../reports/06-INCOME-STATEMENT-BY-FUND.md](../reports/06-INCOME-STATEMENT-BY-FUND.md)
- [../../docs/DONOR_REPORTING_MODULE.md](../../docs/DONOR_REPORTING_MODULE.md)
