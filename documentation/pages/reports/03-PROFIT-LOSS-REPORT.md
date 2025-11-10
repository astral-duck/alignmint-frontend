# Profit & Loss Report (Income Statement by Fund)

**Component File:** `src/components/ProfitLossReport.tsx`  
**Route:** `/reports` (with tool='profit-loss')  
**Access Level:** Admin, Manager

## Overview
The Profit & Loss Report (also called Income Statement by Fund) provides a detailed breakdown of income and expenses using specific GL account codes. This report follows standard nonprofit accounting practices with account codes (4000-series for income, 5000-series for expenses) and supports drill-down to view individual transactions for each line item. It's similar to the Income Statement but uses more granular account-level detail.

## UI Features

### Main Features
- **Report Header:**
  - Organization name
  - Date range selector (start and end dates)
  - Export button (Excel, PDF)
  - Back to Reports Hub button
- **Income Section:**
  - 4500 - Direct Public Support (Donations)
  - 4510 - Initial Fee
  - 4520 - Interest Income
  - 4530 - Miscellaneous Revenue
  - 4600 - Sales from Inventories
  - Total Income
- **Expense Section:**
  - 5001 - Advertising Expenses
  - 5002 - Bank Fees
  - 5003 - Board Education
  - 5011 - Fundraising Expenses
  - 5013 - Insurance Premium
  - 5014 - Meals & Office Supplies
  - 5018 - Parking
  - 5019 - Payroll Expenses
  - 5020 - Postage & Mailing Service
  - 5023 - Rent
  - 5026 - Professional Services & Software
  - 5027 - Supplies
  - 5028 - Telephone/Telecommunications
  - 5031 - Transportation
  - 5032 - Travel & Meetings
  - 5033 - Donor Appreciation
  - 5034 - Business Expenses
  - 6001 - Reconciliation Discrepancies
  - 6004 - Ask My Accountant
  - Total Expenses
- **Net Income/Loss:**
  - Total Income - Total Expenses
  - Color-coded display
- **Drill-Down Feature:**
  - Click any line item to view transactions
  - Transaction detail sheet with:
    - Date
    - Description
    - Source (donation, expense, etc.)
    - Amount (debit/credit)
    - Reference number
    - Reconciliation status

### Account Code Structure
```
INCOME (4000-4999)
  4500 - Direct Public Support          $47,204.68
  4510 - Initial Fee                     $2,500.00
  4520 - Interest Income                   $150.00
  4530 - Miscellaneous Revenue             $300.00
  4600 - Sales from Inventories          $1,200.00
  ───────────────────────────────────────────────
  Total Income                          $51,354.68

EXPENSES (5000-6999)
  5001 - Advertising Expenses            $2,855.35
  5002 - Bank Fees                       $1,432.01
  5003 - Board Education                     $0.00
  5011 - Fundraising Expenses                $0.00
  5013 - Insurance Premium                   $0.00
  5014 - Meals                               $0.00
  5018 - Parking                             $0.00
  5019 - Payroll Expenses               $12,874.16
  5020 - Postage & Mailing Service           $0.00
  5023 - Rent                            $1,500.00
  5026 - Professional Services               $0.00
  5027 - Supplies                            $0.00
  5028 - Telephone/Telecommunications       $86.53
  5031 - Transportation                      $0.00
  5032 - Travel & Meetings                   $0.00
  5033 - Donor Appreciation                  $0.00
  5034 - Business Expenses                  $70.38
  6001 - Reconciliation Discrepancies        $0.00
  6004 - Ask My Accountant                   $0.00
  ───────────────────────────────────────────────
  Total Expenses                        $18,818.43

NET INCOME                              $32,536.25
```

## Data Requirements

### Profit & Loss Data
- **organization_id** (uuid) - Organization
- **start_date** (date) - Period start
- **end_date** (date) - Period end
- **income** (object) - Income by account code
- **expense** (object) - Expenses by account code
- **net_income** (decimal) - Calculated net income

### Income Accounts (4000-4999)
- **direct_public_support** (4500) - Donations
- **initial_fee** (4510) - Initial/membership fees
- **interest_income** (4520) - Investment income
- **miscellaneous_revenue** (4530) - Other revenue
- **sales_from_inventories** (4600) - Product sales
- **total_income** (decimal) - Sum of all income

### Expense Accounts (5000-6999)
Each account code with amount:
- **advertising_expenses** (5001)
- **bank_fees** (5002)
- **board_education** (5003)
- **fundraising_expenses** (5011)
- **insurance_premium** (5013)
- **meals** (5014)
- **parking** (5018)
- **payroll_expenses** (5019)
- **postage_mailing_service** (5020)
- **rent** (5023)
- **professional_services** (5026)
- **supplies** (5027)
- **telephone_telecommunications** (5028)
- **transportation** (5031)
- **travel_meetings** (5032)
- **donor_appreciation** (5033)
- **business_expenses** (5034)
- **reconciliation_discrepancies** (6001)
- **ask_my_accountant** (6004)
- **total_expenses** (decimal) - Sum of all expenses

### Transaction Detail (for drill-down)
- **id** (uuid)
- **date** (date)
- **description** (string)
- **source** (string) - donation, expense, journal, etc.
- **entity_id** (uuid)
- **category** (string) - Account code and name
- **internal_code** (string) - Account code
- **debit** (decimal)
- **credit** (decimal)
- **reference_number** (string, nullable)
- **reconciled** (boolean)

## API Endpoints Required

### GET /api/v1/reports/profit_loss
```
Description: Get profit & loss report by account code
Query Parameters:
  - organization_id (required, uuid)
  - start_date (required, date)
  - end_date (required, date)

Response: {
  data: {
    organization_id: "uuid",
    organization_name: "Awakenings",
    start_date: "2025-01-01",
    end_date: "2025-10-20",
    income: {
      direct_public_support: 47204.68,
      initial_fee: 2500.00,
      interest_income: 150.00,
      miscellaneous_revenue: 300.00,
      sales_from_inventories: 1200.00,
      total_income: 51354.68
    },
    expense: {
      advertising_expenses: 2855.35,
      bank_fees: 1432.01,
      board_education: 0.00,
      fundraising_expenses: 0.00,
      insurance_premium: 0.00,
      meals: 0.00,
      parking: 0.00,
      payroll_expenses: 12874.16,
      postage_mailing_service: 0.00,
      rent: 1500.00,
      professional_services: 0.00,
      supplies: 0.00,
      telephone_telecommunications: 86.53,
      transportation: 0.00,
      travel_meetings: 0.00,
      donor_appreciation: 0.00,
      business_expenses: 70.38,
      reconciliation_discrepancies: 0.00,
      ask_my_accountant: 0.00,
      total_expenses: 18818.43
    },
    net_income: 32536.25
  }
}
```

### GET /api/v1/reports/profit_loss/transactions
```
Description: Get transactions for specific account code (drill-down)
Query Parameters:
  - organization_id (required, uuid)
  - account_code (required, string) - e.g., '4500', '5001'
  - start_date (required, date)
  - end_date (required, date)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      date: "2025-01-15",
      description: "Individual Donation - John Doe",
      source: "donation",
      entity_id: "uuid",
      category: "4500 - Direct Public Support",
      internal_code: "4500",
      debit: 0.00,
      credit: 5000.00,
      reference_number: "DON-4501",
      reconciled: true
    }
  ],
  meta: {
    total: 10,
    page: 1,
    per_page: 50,
    account_code: "4500",
    account_name: "Direct Public Support",
    account_total: 47204.68
  }
}
```

### POST /api/v1/reports/profit_loss/export
```
Description: Export P&L report
Request Body: {
  organization_id: "uuid",
  start_date: "2025-01-01",
  end_date: "2025-10-20",
  format: "excel", // or "pdf"
  include_transactions: false
}

Response: {
  data: {
    download_url: "https://...",
    filename: "ProfitLoss_Awakenings_2025-01-01_2025-10-20.xlsx",
    expires_at: "2025-10-20T18:00:00Z"
  }
}
```

## Request/Response Schemas

```typescript
interface ProfitLoss {
  organization_id: string;
  organization_name: string;
  start_date: string;
  end_date: string;
  income: IncomeAccounts;
  expense: ExpenseAccounts;
  net_income: number;
}

interface IncomeAccounts {
  direct_public_support: number;      // 4500
  initial_fee: number;                 // 4510
  interest_income: number;             // 4520
  miscellaneous_revenue: number;       // 4530
  sales_from_inventories: number;      // 4600
  total_income: number;
}

interface ExpenseAccounts {
  advertising_expenses: number;        // 5001
  bank_fees: number;                   // 5002
  board_education: number;             // 5003
  fundraising_expenses: number;        // 5011
  insurance_premium: number;           // 5013
  meals: number;                       // 5014
  parking: number;                     // 5018
  payroll_expenses: number;            // 5019
  postage_mailing_service: number;     // 5020
  rent: number;                        // 5023
  professional_services: number;       // 5026
  supplies: number;                    // 5027
  telephone_telecommunications: number; // 5028
  transportation: number;              // 5031
  travel_meetings: number;             // 5032
  donor_appreciation: number;          // 5033
  business_expenses: number;           // 5034
  reconciliation_discrepancies: number; // 6001
  ask_my_accountant: number;           // 6004
  total_expenses: number;
}

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  source: string;
  entity_id: string;
  category: string;
  internal_code: string;
  debit: number;
  credit: number;
  reference_number?: string;
  reconciled: boolean;
}
```

## Authentication & Authorization

### Required Permissions
- `reports:read` - View reports
- `reports:export` - Export reports

### Role-Based Access
- **Fiscal Sponsor:** Full access to all organization reports
- **Nonprofit User:** Access to their organization reports only
- **Staff:** View-only access
- **Donor/Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Start date required
- End date required
- End date must be after start date
- Date range cannot exceed 5 years

### Backend Validations (Rails)
- Valid organization access
- Valid date format
- Valid account codes
- Date range reasonable

### Business Rules
- Net income = Total Income - Total Expenses
- All amounts from General Ledger
- Transactions grouped by account code
- Drill-down shows all GL entries for account
- Account codes follow standard nonprofit chart
- Zero-balance accounts still displayed

## State Management

### Local State
- `startDate` - Period start
- `endDate` - Period end
- `selectedAccount` - Account for drill-down
- `drillDownOpen` - Sheet visibility
- `transactions` - Transaction details
- `exportDialogOpen` - Export dialog state

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `generateMockPLTransactions()`
- UI components (Card, Button, Table, Sheet, etc.)
- Export utilities

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Excel/PDF export libraries

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load report"
2. **No Data:** Show empty state "No transactions"
3. **Invalid Date Range:** Show error "Invalid dates"
4. **Export Failed:** Show toast "Export failed"
5. **Permission Error:** Show toast "No permission"

## Loading States
- **Initial load:** Skeleton structure
- **Date change:** Loading overlay
- **Drill-down:** Loading spinner
- **Export:** Progress indicator

## Mock Data to Remove
- `ProfitLossReport.tsx` - `generateMockPLTransactions()` function
- `financialData.ts` - Mock P&L data
- Move interfaces to `src/types/reports.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/reports.ts`
2. Create `src/types/reports.ts`
3. Implement P&L endpoint
4. Test calculations

### Phase 2: Drill-Down
1. Implement account transactions endpoint
2. Implement drill-down UI
3. Test filtering
4. Add pagination

### Phase 3: Integration
1. Link to General Ledger
2. Test navigation
3. Implement "View in Ledger" links

### Phase 4: Export
1. Implement Excel export
2. Implement PDF export
3. Test formatting

## Related Documentation
- [01-BALANCE-SHEET-REPORT.md](./01-BALANCE-SHEET-REPORT.md)
- [02-INCOME-STATEMENT-REPORT.md](./02-INCOME-STATEMENT-REPORT.md)
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Account Code Reference
**Income Accounts (4000-4999):**
- 4500 - Direct Public Support (Donations)
- 4510 - Initial/Membership Fees
- 4520 - Interest & Investment Income
- 4530 - Miscellaneous Revenue
- 4600 - Sales from Inventories/Products

**Expense Accounts (5000-5999):**
- 5001 - Advertising & Marketing
- 5002 - Bank Fees & Charges
- 5003 - Board Education & Development
- 5011 - Fundraising Expenses
- 5013 - Insurance Premiums
- 5014 - Meals & Entertainment
- 5018 - Parking & Transportation
- 5019 - Payroll & Payroll Taxes
- 5020 - Postage & Mailing
- 5023 - Rent & Lease Payments
- 5026 - Professional Services & Software
- 5027 - Supplies & Materials
- 5028 - Telephone & Internet
- 5031 - Transportation & Vehicle
- 5032 - Travel & Meetings
- 5033 - Donor Appreciation
- 5034 - Business Expenses

**Special Accounts (6000-6999):**
- 6001 - Reconciliation Discrepancies
- 6004 - Ask My Accountant (Unclassified)

### Drill-Down Navigation
Click account line → Opens transaction sheet → Shows all GL entries → Can navigate to source (Donation, Expense, etc.)
