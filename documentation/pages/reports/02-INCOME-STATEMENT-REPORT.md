# Income Statement Report

**Component File:** `src/components/IncomeStatementReport.tsx`  
**Route:** `/reports` (with tool='income-statement')  
**Access Level:** Admin, Manager

## Overview
The Income Statement Report (also known as Statement of Activities) provides a detailed breakdown of revenue and expenses over a specific time period, showing the organization's financial performance. It categorizes income and expenses into standard nonprofit categories and calculates net income/loss. The report supports drill-down to transaction details and export capabilities.

## UI Features

### Main Features
- **Report Header:**
  - Organization name
  - Date range selector (start and end dates)
  - Export buttons (Excel, PDF)
  - Print button
  - Back to Reports Hub button
- **Revenue Section:**
  - Donations (Direct Public Support)
  - Earned Income
  - Book Sales
  - Initial Fees
  - Interest Income
  - Miscellaneous Revenue
  - Admin Fees (for fiscal sponsor)
  - Total Revenue
- **Expense Sections:**
  - **Program Services:**
    - Tithe
    - Donations (outgoing)
    - Family Support
    - Foreign Supplies
    - Foreign Equipment
    - Foreign Construction
    - Subtotal
  - **Personnel:**
    - Salaries - Officers
    - Salaries - Other
    - Pension/Retirement
    - Benefits
    - Payroll Taxes
    - Subtotal
  - **Administrative:**
    - Legal
    - Accounting
    - Advertising
    - Office Supplies
    - Postage
    - Printing
    - IT
    - Software
    - Subtotal
  - **Facilities:**
    - Rent
    - Utilities
    - Telephone
    - Repairs
    - Mortgage Interest
    - Subtotal
  - **Other:**
    - Travel
    - Meals
    - Training
    - Insurance
    - Bank Fees
    - Contract Fees
    - Donor Appreciation
    - IFM Admin Fee
    - Miscellaneous
    - Subtotal
  - **Total Expenses**
- **Net Income/Loss:**
  - Calculated as Total Revenue - Total Expenses
  - Color-coded (green for profit, red for loss)
- **Drill-Down Capability:**
  - Click any line item to view transactions
  - Transaction detail sheet/modal
  - Filter by date range
  - Link to donor profile (for donations)

### Income Statement Layout
```
REVENUE
  Donations (Direct Public Support)        $47,204.68
  Earned Income                             $5,000.00
  Book Sales                                $1,200.00
  Initial Fees                              $2,500.00
  Interest Income                             $150.00
  Miscellaneous Revenue                       $300.00
  Admin Fees                                $1,500.00
  ─────────────────────────────────────────────────
  Total Revenue                            $57,854.68

EXPENSES
  Program Services
    Tithe                                   $4,500.00
    Donation                                $2,000.00
    Family Support                          $3,500.00
    Foreign Supplies                        $1,200.00
    Foreign Equipment                         $800.00
    Foreign Construction                    $5,000.00
    ─────────────────────────────────────────────
    Total Program Services                 $17,000.00

  Personnel
    Salaries - Officers                    $12,000.00
    Salaries - Other                        $8,000.00
    Pension/Retirement                      $1,500.00
    Benefits                                $2,000.00
    Payroll Taxes                           $1,800.00
    ─────────────────────────────────────────────
    Total Personnel                        $25,300.00

  Administrative
    Legal                                     $500.00
    Accounting                              $1,200.00
    Advertising                               $800.00
    Office Supplies                           $400.00
    Postage                                   $200.00
    Printing                                  $300.00
    IT                                        $600.00
    Software                                  $450.00
    ─────────────────────────────────────────────
    Total Administrative                    $4,450.00

  Facilities
    Rent                                    $3,000.00
    Utilities                                 $500.00
    Telephone                                 $300.00
    Repairs                                   $200.00
    Mortgage Interest                           $0.00
    ─────────────────────────────────────────────
    Total Facilities                        $4,000.00

  Other
    Travel                                  $1,500.00
    Meals                                     $600.00
    Training                                  $400.00
    Insurance                               $1,200.00
    Bank Fees                                 $150.00
    Contract Fees                             $800.00
    Donor Appreciation                        $300.00
    IFM Admin Fee                           $2,500.00
    Miscellaneous                             $200.00
    ─────────────────────────────────────────────
    Total Other                             $7,650.00

TOTAL EXPENSES                             $58,400.00

NET INCOME (LOSS)                           ($545.32)
```

### Transaction Drill-Down Sheet
- Date
- Description
- Donor Name (for donations)
- Amount
- Reference Number
- Category
- Account Code
- Link to source (Donor CRM, Expenses Manager, etc.)

## Data Requirements

### Income Statement Data
- **organization_id** (uuid) - Organization
- **start_date** (date) - Period start
- **end_date** (date) - Period end
- **revenue** (object) - Revenue categories and amounts
- **expenses** (object) - Expense categories and amounts
- **net_income** (decimal) - Calculated net income/loss

### Revenue Data
- **donations** (decimal) - Direct public support
- **earned_income** (decimal) - Program service revenue
- **book_sales** (decimal) - Product sales
- **initial_fees** (decimal) - Membership/initial fees
- **interest_income** (decimal) - Investment income
- **misc_revenue** (decimal) - Other revenue
- **admin_fees** (decimal) - Administrative fee revenue
- **total_revenue** (decimal) - Sum of all revenue

### Expense Data (by category)
Each category contains line items with amounts:
- **program_services** (object) - Program-related expenses
- **personnel** (object) - Staff-related expenses
- **administrative** (object) - Admin expenses
- **facilities** (object) - Facility-related expenses
- **other** (object) - Other operating expenses
- **total_expenses** (decimal) - Sum of all expenses

### Transaction Detail Data (for drill-down)
- **id** (uuid) - Transaction ID
- **date** (date) - Transaction date
- **description** (string) - Description
- **amount** (decimal) - Amount
- **category** (string) - Expense/revenue category
- **account_code** (string) - GL account code
- **reference_number** (string, nullable) - Reference #
- **donor_id** (uuid, nullable) - Donor ID (for donations)
- **donor_name** (string, nullable) - Donor name

## API Endpoints Required

### GET /api/v1/reports/income_statement
```
Description: Get income statement report
Query Parameters:
  - organization_id (required, uuid)
  - start_date (required, date)
  - end_date (required, date)
  - comparative (optional, boolean) - Include previous period

Response: {
  data: {
    organization_id: "uuid",
    organization_name: "Awakenings",
    start_date: "2025-01-01",
    end_date: "2025-10-20",
    revenue: {
      donations: 47204.68,
      earned_income: 5000.00,
      book_sales: 1200.00,
      initial_fees: 2500.00,
      interest_income: 150.00,
      misc_revenue: 300.00,
      admin_fees: 1500.00,
      total_revenue: 57854.68
    },
    expenses: {
      program_services: {
        tithe: 4500.00,
        donation: 2000.00,
        family_support: 3500.00,
        foreign_supplies: 1200.00,
        foreign_equipment: 800.00,
        foreign_construction: 5000.00,
        total: 17000.00
      },
      personnel: {
        salaries_officers: 12000.00,
        salaries_others: 8000.00,
        pension_retirement: 1500.00,
        benefits: 2000.00,
        payroll_taxes: 1800.00,
        total: 25300.00
      },
      administrative: {
        legal: 500.00,
        accounting: 1200.00,
        advertising: 800.00,
        office_supplies: 400.00,
        postage: 200.00,
        printing: 300.00,
        it: 600.00,
        software: 450.00,
        total: 4450.00
      },
      facilities: {
        rent: 3000.00,
        utilities: 500.00,
        telephone: 300.00,
        repairs: 200.00,
        mortgage_interest: 0.00,
        total: 4000.00
      },
      other: {
        travel: 1500.00,
        meals: 600.00,
        training: 400.00,
        insurance: 1200.00,
        bank_fees: 150.00,
        contract_fees: 800.00,
        donor_appreciation: 300.00,
        ifm_admin_fee: 2500.00,
        misc_expense: 200.00,
        total: 7650.00
      },
      total_expenses: 58400.00
    },
    net_income: -545.32
  }
}
```

### GET /api/v1/reports/income_statement/line_item_transactions
```
Description: Get transactions for specific line item (drill-down)
Query Parameters:
  - organization_id (required, uuid)
  - line_item (required, string) - e.g., 'donations', 'salaries_officers'
  - start_date (required, date)
  - end_date (required, date)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      date: "2025-05-15",
      description: "Individual Donation - John Doe",
      amount: 5000.00,
      category: "Donations",
      account_code: "4500",
      reference_number: "DON-4501",
      donor_id: "uuid",
      donor_name: "John Doe"
    },
    {
      id: "uuid",
      date: "2025-06-10",
      description: "Monthly Recurring Donations",
      amount: 3500.00,
      category: "Donations",
      account_code: "4500",
      reference_number: "DON-4502",
      donor_id: null,
      donor_name: "Multiple Donors"
    }
  ],
  meta: {
    total: 45,
    page: 1,
    per_page: 50,
    line_item: "donations",
    line_item_total: 47204.68
  }
}
```

### POST /api/v1/reports/income_statement/export
```
Description: Export income statement to Excel or PDF
Request Body: {
  organization_id: "uuid",
  start_date: "2025-01-01",
  end_date: "2025-10-20",
  format: "excel", // or "pdf"
  include_transactions: false // Include transaction details
}

Response: {
  data: {
    download_url: "https://...",
    filename: "IncomeStatement_Awakenings_2025-01-01_2025-10-20.xlsx",
    expires_at: "2025-10-20T18:00:00Z"
  },
  message: "Report exported successfully"
}
```

## Request/Response Schemas

### IncomeStatement Schema
```typescript
interface IncomeStatement {
  organization_id: string;
  organization_name: string;
  start_date: string;
  end_date: string;
  revenue: RevenueData;
  expenses: ExpenseData;
  net_income: number;
}

interface RevenueData {
  donations: number;
  earned_income: number;
  book_sales: number;
  initial_fees: number;
  interest_income: number;
  misc_revenue: number;
  admin_fees: number;
  total_revenue: number;
}

interface ExpenseData {
  program_services: ExpenseCategory;
  personnel: ExpenseCategory;
  administrative: ExpenseCategory;
  facilities: ExpenseCategory;
  other: ExpenseCategory;
  total_expenses: number;
}

interface ExpenseCategory {
  [key: string]: number;
  total: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account_code: string;
  reference_number?: string;
  donor_id?: string;
  donor_name?: string;
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
- Date range reasonable (not too large)
- Export format must be 'excel' or 'pdf'

### Business Rules
- Net income = Total Revenue - Total Expenses
- All amounts calculated from General Ledger
- Transactions grouped by account code/category
- Drill-down shows all transactions for line item
- Export includes all sections and formatting
- Negative net income shown in red/parentheses
- Date range defaults to current fiscal year

## State Management

### Local State
- `startDate` - Period start date
- `endDate` - Period end date
- `selectedLineItem` - Line item for drill-down
- `drillDownOpen` - Drill-down sheet visibility
- `transactions` - Transaction detail data
- `exportDialogOpen` - Export dialog state

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `generateMockIncomeStatement()`
- UI components (Card, Button, Table, Sheet, etc.)
- Export utilities

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Excel export library (xlsx, exceljs)
- PDF export library (jsPDF, pdfmake)

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load report", retry
2. **No Data:** Show empty state "No transactions for this period"
3. **Invalid Date Range:** Show error "Invalid date range selected"
4. **Export Failed:** Show toast "Failed to export report"
5. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton report structure
- **Date change:** Loading overlay
- **Drill-down:** Loading spinner in sheet
- **Export:** Progress indicator

## Mock Data to Remove
- `IncomeStatementReport.tsx` - `generateMockIncomeStatement()` function
- `financialData.ts` - Mock income statement data
- Move interfaces to `src/types/reports.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/reports.ts`
2. Create `src/types/reports.ts`
3. Implement income statement endpoint
4. Test calculations

### Phase 2: Drill-Down
1. Implement line item transactions endpoint
2. Implement drill-down UI
3. Test transaction filtering
4. Add pagination

### Phase 3: Integration with Source Modules
1. Link donations to Donor CRM
2. Link expenses to Expenses Manager
3. Test navigation flows
4. Implement "View Source" links

### Phase 4: Export
1. Implement Excel export
2. Implement PDF export
3. Test formatting and layout
4. Implement download handling

## Related Documentation
- [01-BALANCE-SHEET-REPORT.md](./01-BALANCE-SHEET-REPORT.md) - Balance sheet
- [03-PROFIT-LOSS-REPORT.md](./03-PROFIT-LOSS-REPORT.md) - P&L report
- [../donor-hub/02-DONATIONS-MANAGER.md](../donor-hub/02-DONATIONS-MANAGER.md) - Donation source
- [../accounting/06-EXPENSES-MANAGER.md](../accounting/06-EXPENSES-MANAGER.md) - Expense source
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md) - Transaction source
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Data models

## Additional Notes

### Account Code Mapping
Revenue accounts (4000-4999):
- 4500 - Direct Public Support (Donations)
- 4510 - Initial Fees
- 4520 - Interest Income
- 4530 - Miscellaneous Revenue
- 4600 - Sales from Inventories

Expense accounts (5000-5999):
- 5000-5010 - Program Services
- 5011-5019 - Personnel
- 5020-5029 - Administrative
- 5030-5039 - Facilities
- 5040+ - Other

### Nonprofit Accounting Standards
Follows FASB ASC 958 (Not-for-Profit Entities):
- Statement of Activities format
- Functional expense classification
- Program vs. supporting services
- Net asset classification

### Drill-Down Navigation
When user clicks line item:
1. Opens transaction detail sheet
2. Shows all transactions for that category
3. Can click donor name → Opens Donor CRM
4. Can click "View in Ledger" → Opens General Ledger
5. Can filter by date range within period
