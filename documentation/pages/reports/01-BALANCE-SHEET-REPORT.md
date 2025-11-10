# Balance Sheet Report

**Component File:** `src/components/BalanceSheetReport.tsx`  
**Route:** `/reports` (with tool='balance-sheet')  
**Access Level:** Admin, Manager

## Overview
The Balance Sheet Report provides a snapshot of the organization's financial position at a specific point in time, showing assets, liabilities, and net assets (fund balance). It displays account balances organized by category, supports drill-down to transaction details, and offers export capabilities to Excel and PDF formats.

## UI Features

### Main Features
- **Report Header:**
  - Organization name
  - Report date selector
  - Export buttons (Excel, PDF)
  - Print button
- **Balance Sheet Sections:**
  - **Assets:**
    - Current Assets (Cash, Accounts Receivable, etc.)
    - Fixed Assets (Property, Equipment, etc.)
    - Other Assets
    - Total Assets
  - **Liabilities:**
    - Current Liabilities (Accounts Payable, etc.)
    - Long-term Liabilities
    - Total Liabilities
  - **Net Assets (Fund Balance):**
    - Unrestricted
    - Temporarily Restricted
    - Permanently Restricted
    - Total Net Assets
- **Account Drill-Down:**
  - Click account to view transactions
  - Transaction detail sheet/modal
  - Filter by date range
- **Comparative View:**
  - Side-by-side comparison with previous period
  - Variance column (amount and percentage)

### Balance Sheet Layout
```
ASSETS
  Current Assets
    1000 - Cash - Checking Account        $45,250
    1010 - Cash - Savings Account          $8,500
    1020 - Investments                    $125,000
    1100 - Accounts Receivable             $3,200
    ─────────────────────────────────────────────
    Total Current Assets                 $181,950

  Fixed Assets
    1500 - Property & Equipment           $85,000
    1510 - Accumulated Depreciation      ($12,000)
    ─────────────────────────────────────────────
    Total Fixed Assets                    $73,000

TOTAL ASSETS                             $254,950

LIABILITIES
  Current Liabilities
    2000 - Accounts Payable                $2,100
    2100 - Accrued Expenses                $1,500
    ─────────────────────────────────────────────
    Total Current Liabilities              $3,600

TOTAL LIABILITIES                          $3,600

NET ASSETS (FUND BALANCE)
  3000 - Unrestricted Net Assets        $225,350
  3100 - Temporarily Restricted          $20,000
  3200 - Permanently Restricted           $6,000
  ─────────────────────────────────────────────
TOTAL NET ASSETS                         $251,350

TOTAL LIABILITIES & NET ASSETS           $254,950
```

### Transaction Drill-Down Sheet
- Date
- Description
- Reference Number
- Debit
- Credit
- Balance
- Reconciled status
- Source (Donation, Expense, Journal Entry, etc.)

## Data Requirements

### Balance Sheet Data
- **report_date** (date) - As of date
- **organization_id** (uuid) - Organization
- **assets** (object) - Asset accounts and balances
- **liabilities** (object) - Liability accounts and balances
- **net_assets** (object) - Net asset accounts and balances

### Account Balance Data
- **account_code** (string) - Account code (e.g., "1000")
- **account_name** (string) - Account name
- **account_type** (string) - 'asset', 'liability', 'equity'
- **account_category** (string) - 'current_asset', 'fixed_asset', etc.
- **balance** (decimal) - Current balance
- **previous_balance** (decimal, nullable) - Previous period balance
- **variance** (decimal, nullable) - Change from previous period

### Transaction Detail Data (for drill-down)
- **id** (uuid) - Transaction ID
- **date** (date) - Transaction date
- **description** (string) - Description
- **reference_number** (string, nullable) - Check #, invoice #, etc.
- **debit** (decimal) - Debit amount
- **credit** (decimal) - Credit amount
- **balance** (decimal) - Running balance
- **source** (string) - Transaction source
- **reconciled** (boolean) - Reconciliation status

## API Endpoints Required

### GET /api/v1/reports/balance_sheet
```
Description: Get balance sheet report
Query Parameters:
  - organization_id (required, uuid)
  - as_of_date (required, date) - Report date
  - comparative (optional, boolean) - Include previous period
  - previous_date (optional, date) - Previous period date

Response: {
  data: {
    organization_id: "uuid",
    organization_name: "Awakenings",
    as_of_date: "2024-11-10",
    previous_date: "2024-10-10",
    assets: {
      current_assets: [
        {
          account_code: "1000",
          account_name: "Cash - Checking Account",
          balance: 45250.00,
          previous_balance: 42100.00,
          variance: 3150.00,
          variance_percent: 7.48
        },
        {
          account_code: "1010",
          account_name: "Cash - Savings Account",
          balance: 8500.00,
          previous_balance: 8500.00,
          variance: 0.00,
          variance_percent: 0.00
        }
      ],
      fixed_assets: [
        {
          account_code: "1500",
          account_name: "Property & Equipment",
          balance: 85000.00,
          previous_balance: 85000.00,
          variance: 0.00,
          variance_percent: 0.00
        }
      ],
      total_current_assets: 181950.00,
      total_fixed_assets: 73000.00,
      total_assets: 254950.00
    },
    liabilities: {
      current_liabilities: [
        {
          account_code: "2000",
          account_name: "Accounts Payable",
          balance: 2100.00,
          previous_balance: 1800.00,
          variance: 300.00,
          variance_percent: 16.67
        }
      ],
      total_current_liabilities: 3600.00,
      total_liabilities: 3600.00
    },
    net_assets: {
      unrestricted: [
        {
          account_code: "3000",
          account_name: "Unrestricted Net Assets",
          balance: 225350.00,
          previous_balance: 220100.00,
          variance: 5250.00,
          variance_percent: 2.39
        }
      ],
      temporarily_restricted: [],
      permanently_restricted: [],
      total_unrestricted: 225350.00,
      total_temporarily_restricted: 20000.00,
      total_permanently_restricted: 6000.00,
      total_net_assets: 251350.00
    },
    total_liabilities_and_net_assets: 254950.00,
    balanced: true
  }
}

Note: balanced should always be true (assets = liabilities + net assets)
```

### GET /api/v1/reports/balance_sheet/account_transactions
```
Description: Get transactions for specific account (drill-down)
Query Parameters:
  - organization_id (required, uuid)
  - account_code (required, string)
  - start_date (optional, date)
  - end_date (required, date) - Usually the as_of_date
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      date: "2024-11-05",
      description: "Donation - John Doe",
      reference_number: "DON-12345",
      debit: 250.00,
      credit: 0.00,
      balance: 45250.00,
      source: "donation",
      reconciled: true
    },
    {
      id: "uuid",
      date: "2024-11-03",
      description: "Check #1234 - Office Rent",
      reference_number: "CHK-1234",
      debit: 0.00,
      credit: 2500.00,
      balance: 45000.00,
      source: "expense",
      reconciled: true
    }
  ],
  meta: {
    total: 156,
    page: 1,
    per_page: 50,
    account_code: "1000",
    account_name: "Cash - Checking Account",
    opening_balance: 42100.00,
    closing_balance: 45250.00
  }
}
```

### POST /api/v1/reports/balance_sheet/export
```
Description: Export balance sheet to Excel or PDF
Request Body: {
  organization_id: "uuid",
  as_of_date: "2024-11-10",
  format: "excel", // or "pdf"
  comparative: true,
  previous_date: "2024-10-10"
}

Response: {
  data: {
    download_url: "https://...",
    filename: "BalanceSheet_Awakenings_2024-11-10.xlsx",
    expires_at: "2024-11-10T18:00:00Z"
  },
  message: "Report exported successfully"
}

Note: Returns temporary download URL
```

## Request/Response Schemas

### BalanceSheet Schema
```typescript
interface BalanceSheet {
  organization_id: string;
  organization_name: string;
  as_of_date: string;
  previous_date?: string;
  assets: AssetSection;
  liabilities: LiabilitySection;
  net_assets: NetAssetSection;
  total_liabilities_and_net_assets: number;
  balanced: boolean;
}

interface AssetSection {
  current_assets: AccountBalance[];
  fixed_assets: AccountBalance[];
  other_assets?: AccountBalance[];
  total_current_assets: number;
  total_fixed_assets: number;
  total_other_assets?: number;
  total_assets: number;
}

interface LiabilitySection {
  current_liabilities: AccountBalance[];
  long_term_liabilities?: AccountBalance[];
  total_current_liabilities: number;
  total_long_term_liabilities?: number;
  total_liabilities: number;
}

interface NetAssetSection {
  unrestricted: AccountBalance[];
  temporarily_restricted: AccountBalance[];
  permanently_restricted: AccountBalance[];
  total_unrestricted: number;
  total_temporarily_restricted: number;
  total_permanently_restricted: number;
  total_net_assets: number;
}

interface AccountBalance {
  account_code: string;
  account_name: string;
  balance: number;
  previous_balance?: number;
  variance?: number;
  variance_percent?: number;
}
```

## Authentication & Authorization

### Required Permissions
- `reports:read` - View reports
- `reports:export` - Export reports

### Role-Based Access
- **Admin:** Full access to all reports
- **Manager:** Access to assigned organization reports
- **Staff:** View-only access
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- As of date required
- As of date cannot be in future
- Previous date must be before as of date

### Backend Validations (Rails)
- Valid organization access
- Valid date format
- Account codes must exist in chart of accounts
- Balance sheet must balance (assets = liabilities + net assets)
- Export format must be 'excel' or 'pdf'

### Business Rules
- Balance sheet shows point-in-time snapshot
- All account balances calculated from general ledger
- Negative balances shown in parentheses
- Subtotals and totals calculated automatically
- Comparative view shows variance
- Drill-down shows all transactions affecting account
- Export includes all sections and formatting
- Report date defaults to today
- Previous period defaults to same date last month

## State Management

### Local State
- `asOfDate` - Report date
- `comparativeMode` - Show comparative view
- `previousDate` - Previous period date
- `selectedAccount` - Account for drill-down
- `drillDownOpen` - Drill-down sheet visibility
- `transactions` - Transaction detail data

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `getBalanceSheet()`
- UI components (Card, Button, Table, Sheet, etc.)
- Export utilities

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Excel export library (e.g., xlsx, exceljs)
- PDF export library (e.g., jsPDF, pdfmake)

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load report", retry
2. **No Data:** Show empty state "No data available for this date"
3. **Unbalanced:** Show warning "Balance sheet does not balance"
4. **Export Failed:** Show toast "Failed to export report"
5. **Invalid Date:** Show error "Invalid date selected"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton report structure
- **Date change:** Loading overlay
- **Drill-down:** Loading spinner in sheet
- **Export:** Progress indicator

## Mock Data to Remove
- `BalanceSheetReport.tsx` - `getBalanceSheet()` call
- `BalanceSheetReport.tsx` - `generateMockGLTransactions()` function
- `financialData.ts` - Mock balance sheet data
- Move interfaces to `src/types/reports.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/reports.ts`
2. Create `src/types/reports.ts`
3. Implement balance sheet endpoint
4. Test balance calculations

### Phase 2: Drill-Down
1. Implement account transactions endpoint
2. Implement drill-down UI
3. Test transaction filtering
4. Add pagination

### Phase 3: Export
1. Implement Excel export
2. Implement PDF export
3. Test formatting and layout
4. Implement download handling

### Phase 4: Comparative View
1. Implement previous period comparison
2. Calculate variances
3. Test variance calculations
4. Add variance highlighting

## Related Documentation
- [02-INCOME-STATEMENT-REPORT.md](./02-INCOME-STATEMENT-REPORT.md) - Income statement
- [03-PROFIT-LOSS-REPORT.md](./03-PROFIT-LOSS-REPORT.md) - P&L report
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md) - Transaction source
- [../accounting/03-CHART-OF-ACCOUNTS.md](../accounting/03-CHART-OF-ACCOUNTS.md) - Account structure
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Data models

## Additional Notes

### Account Code Structure
- **1000-1999:** Assets
  - 1000-1499: Current Assets
  - 1500-1999: Fixed Assets
- **2000-2999:** Liabilities
  - 2000-2499: Current Liabilities
  - 2500-2999: Long-term Liabilities
- **3000-3999:** Net Assets (Equity)
  - 3000-3099: Unrestricted
  - 3100-3199: Temporarily Restricted
  - 3200-3299: Permanently Restricted

### Balance Sheet Equation
```
Assets = Liabilities + Net Assets
```

This fundamental accounting equation must always balance.

### Comparative Analysis
When comparative mode is enabled:
- Shows side-by-side balances
- Calculates dollar variance
- Calculates percentage variance
- Highlights significant changes
