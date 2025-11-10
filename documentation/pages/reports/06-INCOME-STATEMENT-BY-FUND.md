# Income Statement By Fund (Admin Fee Calculator)

**Component File:** `src/components/IncomeStatementByFund.tsx`  
**Route:** `/accounting` (with tool='income-by-fund') or embedded in reports  
**Access Level:** Fiscal Sponsor Admin Only

## Overview
The Income Statement By Fund component is a specialized tool for fiscal sponsors to calculate and confirm administrative fees for each nonprofit entity. It displays total income for each nonprofit, allows adjustment of the allocated income amount and admin fee rate, calculates the admin fee, and tracks confirmation status. This is critical for fiscal sponsor revenue management and transparent fee billing.

## UI Features

### Main Features
- **Month Selector:** Choose reporting month
- **Summary Metrics:**
  - Total Income (all nonprofits)
  - Total Admin Fees
  - Confirmed/Unconfirmed count
- **Fund Allocation Table:**
  - Nonprofit name
  - Total Income
  - Allocated Income (editable)
  - Admin Fee Rate (editable)
  - Admin Fee Amount (calculated)
  - Confirmation status
  - Expand/Edit button
- **Expandable Row Editor:**
  - Allocated Income input
  - Fee Rate input
  - Save adjustments button
  - Cancel button
- **Confirmation Actions:**
  - Confirm button (per nonprofit)
  - Confirm All button
  - Export button
- **Back to Accounting Hub button**

### Table Layout
```
Income Statement By Fund - October 2025

Total Income: $1,245,000  |  Total Admin Fees: $93,375  |  Confirmed: 12/34

Nonprofit          | Total Income | Allocated Income | Fee Rate | Admin Fee  | Status      | Actions
-------------------|--------------|------------------|----------|------------|-------------|----------
Awakenings         | $45,230      | $45,230         | 7.5%     | $3,392.25  | Unconfirmed | [Edit]
Bloom Strong       | $38,500      | $38,500         | 7.5%     | $2,887.50  | ✓ Confirmed | -
Bonfire            | $52,100      | $50,000         | 7.5%     | $3,750.00  | Unconfirmed | [Edit]
...
```

### Expanded Edit Row
```
Awakenings         | $45,230      | [Edit Mode]
                   |              |
                   |              | Allocated Income: [$45,230    ]
                   |              | Fee Rate (%):     [7.5        ]
                   |              | Calculated Fee:   $3,392.25
                   |              |
                   |              | [Cancel]  [Save Adjustments]
```

## Data Requirements

### Fund Allocation
- **entity_id** (uuid) - Nonprofit organization
- **entity_name** (string) - Nonprofit name
- **month** (string) - Reporting month (YYYY-MM)
- **total_income** (decimal) - Total income for month
- **allocated_income** (decimal) - Amount fee applies to
- **admin_fee_rate** (decimal) - Fee percentage (e.g., 0.075 for 7.5%)
- **admin_fee_amount** (decimal) - Calculated fee
- **confirmed** (boolean) - Confirmation status
- **confirmed_by** (uuid, nullable) - Who confirmed
- **confirmed_at** (timestamp, nullable) - When confirmed

### Summary Statistics
- **total_income** (decimal) - Sum of all nonprofit income
- **total_admin_fees** (decimal) - Sum of all admin fees
- **confirmed_count** (integer) - Number confirmed
- **unconfirmed_count** (integer) - Number unconfirmed

## API Endpoints Required

### GET /api/v1/fund_allocations
```
Description: Get fund allocations for a month
Query Parameters:
  - month (required, string) - YYYY-MM format
  - status (optional, enum) - 'confirmed', 'unconfirmed', 'all'

Response: {
  data: [
    {
      entity_id: "uuid",
      entity_name: "Awakenings",
      month: "2025-10",
      total_income: 45230.00,
      allocated_income: 45230.00,
      admin_fee_rate: 0.075,
      admin_fee_amount: 3392.25,
      confirmed: false,
      confirmed_by: null,
      confirmed_at: null
    }
  ],
  meta: {
    total_income: 1245000.00,
    total_admin_fees: 93375.00,
    confirmed_count: 12,
    unconfirmed_count: 22
  }
}
```

### PATCH /api/v1/fund_allocations/:entity_id
```
Description: Update allocation adjustments
Request Body: {
  month: "2025-10",
  allocated_income: 50000.00,
  admin_fee_rate: 0.075
}

Response: {
  data: {
    entity_id: "uuid",
    allocated_income: 50000.00,
    admin_fee_rate: 0.075,
    admin_fee_amount: 3750.00
  },
  message: "Allocation updated successfully"
}
```

### POST /api/v1/fund_allocations/:entity_id/confirm
```
Description: Confirm admin fee for nonprofit
Request Body: {
  month: "2025-10"
}

Response: {
  data: {
    entity_id: "uuid",
    confirmed: true,
    confirmed_by: "uuid",
    confirmed_at: "2025-10-20T10:00:00Z"
  },
  message: "Admin fee confirmed"
}
```

### POST /api/v1/fund_allocations/confirm_all
```
Description: Confirm all unconfirmed allocations
Request Body: {
  month: "2025-10"
}

Response: {
  data: {
    confirmed_count: 22
  },
  message: "All admin fees confirmed"
}
```

### GET /api/v1/fund_allocations/export
```
Description: Export fund allocations
Query Parameters:
  - month (required, string)
  - format (optional, enum) - 'csv', 'xlsx', 'pdf'

Response: {
  data: {
    download_url: "https://...",
    filename: "fund-allocations-2025-10.xlsx",
    expires_at: "2025-10-20T18:00:00Z"
  }
}
```

## Request/Response Schemas

```typescript
interface FundAllocation {
  entity_id: string;
  entity_name: string;
  month: string;
  total_income: number;
  allocated_income: number;
  admin_fee_rate: number;
  admin_fee_amount: number;
  confirmed: boolean;
  confirmed_by?: string;
  confirmed_at?: string;
}

interface AllocationSummary {
  total_income: number;
  total_admin_fees: number;
  confirmed_count: number;
  unconfirmed_count: number;
}
```

## Authentication & Authorization

### Required Permissions
- `fund_allocations:read` - View allocations
- `fund_allocations:update` - Adjust allocations
- `fund_allocations:confirm` - Confirm fees

### Role-Based Access
- **Fiscal Sponsor:** Full access to all functions
- **Nonprofit User:** No access (cannot see other nonprofits' fees)
- **Staff:** View-only access
- **Donor/Volunteer:** No access

### Special Rules
- Only fiscal sponsor can access this tool
- Confirmed allocations cannot be edited
- Confirmation creates ledger entries
- All changes logged in audit trail

## Business Logic & Validations

### Frontend Validations
- Allocated income cannot exceed total income
- Allocated income must be >= 0
- Fee rate must be between 0% and 100%
- Fee rate typically 5-10% (warning if outside)
- Month required

### Backend Validations (Rails)
- Valid entity access
- Valid month format
- Allocated income <= total income
- Fee rate between 0 and 1
- Cannot edit confirmed allocations
- Cannot confirm without allocated income

### Business Rules
- Admin fee = Allocated Income × Fee Rate
- Default fee rate: 7.5%
- Allocated income defaults to total income
- Confirmation creates revenue ledger entry
- Confirmed allocations locked
- Monthly reconciliation required
- Email notification on confirmation

## State Management

### Local State
- `month` - Selected month
- `allocations` - Array of fund allocations
- `expandedRow` - Currently expanded entity ID
- `editValues` - Edit form values (allocated income, rate)

### Global State (AppContext)
- `selectedEntity` - Should be fiscal sponsor

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - Generated allocations from entities
- UI components (Card, Button, Table, Input, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load allocations"
2. **Invalid Amount:** Show error "Allocated income exceeds total income"
3. **Invalid Rate:** Show error "Fee rate must be between 0% and 100%"
4. **Update Failed:** Show toast "Failed to update allocation"
5. **Confirm Failed:** Show toast "Failed to confirm admin fee"
6. **Permission Error:** Show toast "Only fiscal sponsor can access"

## Loading States
- **Initial load:** Skeleton table
- **Month change:** Loading overlay
- **Save:** Button loading state
- **Confirm:** Button loading state

## Mock Data to Remove
- `IncomeStatementByFund.tsx` - Mock allocation generation
- Move interfaces to `src/types/fund-allocations.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/fund-allocations.ts`
2. Create `src/types/fund-allocations.ts`
3. Implement list endpoint
4. Test calculations

### Phase 2: Adjustments
1. Implement update endpoint
2. Add validation
3. Test edge cases
4. Add audit logging

### Phase 3: Confirmation
1. Implement confirmation endpoint
2. Create ledger entries on confirm
3. Test locking mechanism
4. Add email notifications

### Phase 4: Reporting
1. Implement export
2. Add historical view
3. Create summary reports
4. Add analytics

## Related Documentation
- [04-FUND-ACCOUNTING-REPORT.md](./04-FUND-ACCOUNTING-REPORT.md)
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md)
- [../administration/02-NONPROFIT-MANAGEMENT.md](../administration/02-NONPROFIT-MANAGEMENT.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Admin Fee Structure
**Standard Rate:** 7.5% of income
**Adjustable:** Can be modified per nonprofit
**Applied To:** Allocated income (may differ from total income)

**Example Adjustments:**
- Exclude restricted grants from fee calculation
- Reduce rate for high-volume nonprofits
- Waive fees for specific income types

### Confirmation Workflow
1. **Monthly Close:** Fiscal sponsor reviews income
2. **Adjustments:** Make any necessary adjustments
3. **Confirmation:** Confirm each nonprofit's fee
4. **Ledger Entry:** Revenue recorded for fiscal sponsor
5. **Invoice:** Optional invoice generation
6. **Payment:** Fee deducted from next distribution

### Ledger Entries Created
**Fiscal Sponsor (InFocus Ministries):**
```
Debit:  Accounts Receivable - Awakenings  $3,392.25
Credit: Admin Fee Revenue                 $3,392.25
```

**Nonprofit (Awakenings):**
```
Debit:  Admin Fee Expense                 $3,392.25
Credit: Accounts Payable - InFocus        $3,392.25
```

### Use Cases
1. **Monthly Reconciliation:** Calculate fees for the month
2. **Custom Adjustments:** Adjust for special circumstances
3. **Bulk Confirmation:** Confirm all at once
4. **Historical Review:** View past months
5. **Revenue Forecasting:** Project admin fee revenue

### Integration Points
- **General Ledger:** Creates ledger entries on confirmation
- **Distribution Manager:** Fees deducted from distributions
- **Nonprofit Management:** Fee rates per nonprofit
- **Reports:** Admin fee revenue reports

### Best Practices
- Review allocations monthly
- Document adjustment reasons
- Confirm within 5 business days of month end
- Communicate fees transparently
- Maintain consistent fee structure
- Audit trail for all changes
