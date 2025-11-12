# Distribution Manager

**Component:** `DistributionManager.tsx`  
**Module:** Accounting  
**Access Level:** Fiscal Sponsor Only  
**Status:** Complete

---

## Overview

The Distribution Manager allows fiscal sponsors to manage fund distributions to subsidiary nonprofits. This is a critical component for fiscal sponsor organizations to track and process payments to their managed entities.

### Purpose

- Manage distributions from fiscal sponsor to nonprofits
- Track distribution history
- Process distribution payments
- Generate distribution reports
- Maintain audit trail

---

## Features

### 1. Distribution List
- View all distributions
- Filter by nonprofit, status, date range
- Sort by date, amount, nonprofit
- Search distributions
- Export distribution history

### 2. Create Distribution
- Select nonprofit recipient
- Enter distribution amount
- Specify distribution date
- Add description/purpose
- Attach supporting documents
- Set payment method

### 3. Distribution Approval
- Multi-level approval workflow
- Approval history tracking
- Comments and notes
- Rejection with reason
- Approval notifications

### 4. Payment Processing
- Mark as paid
- Record payment method
- Upload payment confirmation
- Generate payment receipt
- Update nonprofit balance

### 5. Distribution Reports
- Distribution summary by nonprofit
- Year-to-date distributions
- Distribution trends
- Pending distributions report
- Export to Excel/PDF

---

## Data Requirements

### Distribution Model

```typescript
interface Distribution {
  id: string;
  organization_id: string;  // Fiscal sponsor
  recipient_nonprofit_id: string;
  amount: number;
  distribution_date: string;
  payment_date?: string;
  payment_method?: 'check' | 'ach' | 'wire';
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  purpose: string;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  paid_by?: string;
  paid_at?: string;
  journal_entry_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

---

## API Endpoints

### List Distributions
```
GET /api/v1/distributions
Query Parameters:
  - page: number
  - page_size: number
  - nonprofit_id: string
  - status: string
  - start_date: string
  - end_date: string
  - search: string
```

### Get Distribution
```
GET /api/v1/distributions/:id
```

### Create Distribution
```
POST /api/v1/distributions
Body: {
  recipient_nonprofit_id: string,
  amount: number,
  distribution_date: string,
  purpose: string,
  notes?: string
}
```

### Update Distribution
```
PATCH /api/v1/distributions/:id
Body: Partial<Distribution>
```

### Approve Distribution
```
POST /api/v1/distributions/:id/approve
Body: {
  notes?: string
}
```

### Mark as Paid
```
POST /api/v1/distributions/:id/mark_paid
Body: {
  payment_date: string,
  payment_method: string,
  notes?: string
}
```

### Cancel Distribution
```
POST /api/v1/distributions/:id/cancel
Body: {
  reason: string
}
```

---

## Business Logic

### Distribution Creation
1. Validate nonprofit exists
2. Validate amount > 0
3. Check fiscal sponsor has sufficient funds
4. Create distribution record (status: pending)
5. Send notification to approvers

### Approval Workflow
1. Verify user has approval permission
2. Update status to approved
3. Record approver and timestamp
4. Create journal entry (if configured)
5. Send notification to payment processor

### Payment Processing
1. Verify distribution is approved
2. Record payment details
3. Update status to paid
4. Create journal entry:
   - Debit: Distribution Expense
   - Credit: Cash/Bank Account
5. Update nonprofit balance
6. Generate payment receipt
7. Send notification to nonprofit

### Accounting Integration
```
Distribution Payment Journal Entry:
  Debit:  Distribution Expense (6000)  $X,XXX.XX
  Credit: Checking Account (1000)      $X,XXX.XX
```

---

## User Interface

### Main View
```
┌─────────────────────────────────────────────────────────┐
│  Distribution Manager                    [+ New]  [⚙️]  │
├─────────────────────────────────────────────────────────┤
│  Filters: [Nonprofit ▼] [Status ▼] [Date Range]  [🔍]  │
├─────────────────────────────────────────────────────────┤
│  Date       │ Nonprofit    │ Amount    │ Status  │ ...  │
│  2025-01-15 │ Awakenings   │ $5,000.00 │ Paid    │ [>]  │
│  2025-01-10 │ Bloom Strong │ $3,500.00 │ Approved│ [>]  │
│  2025-01-05 │ Bonfire      │ $2,000.00 │ Pending │ [>]  │
├─────────────────────────────────────────────────────────┤
│  Total: $10,500.00                    Showing 1-3 of 15 │
└─────────────────────────────────────────────────────────┘
```

### Create Distribution Dialog
```
┌─────────────────────────────────────────┐
│  New Distribution                    [×]│
├─────────────────────────────────────────┤
│  Nonprofit: [Select Nonprofit     ▼]   │
│  Amount:    [$____________]             │
│  Date:      [2025-01-15]      [📅]     │
│  Purpose:   [Monthly distribution]      │
│  Notes:     [_____________________]     │
│                                          │
│           [Cancel]  [Create Distribution]│
└─────────────────────────────────────────┘
```

---

## Permissions

### Fiscal Sponsor
- ✅ View all distributions
- ✅ Create distributions
- ✅ Approve distributions
- ✅ Process payments
- ✅ Cancel distributions
- ✅ View reports

### Nonprofit User
- ✅ View distributions to their nonprofit
- ❌ Create distributions
- ❌ Approve distributions
- ❌ Process payments

---

## Validation Rules

### Amount
- Must be greater than 0
- Must be numeric
- Maximum: $1,000,000 (configurable)

### Date
- Cannot be in the future
- Must be within fiscal year

### Nonprofit
- Must be active
- Must be managed by fiscal sponsor
- Cannot distribute to self

---

## Notifications

### On Creation
- **To:** Approvers
- **Subject:** New Distribution Pending Approval
- **Content:** Distribution of $X to [Nonprofit] requires approval

### On Approval
- **To:** Payment processor
- **Subject:** Distribution Approved for Payment
- **Content:** Distribution #X approved, ready for payment

### On Payment
- **To:** Nonprofit contact
- **Subject:** Distribution Payment Processed
- **Content:** Payment of $X has been processed

---

## Reports

### Distribution Summary
- Total distributions by nonprofit
- Year-to-date totals
- Average distribution amount
- Distribution frequency

### Pending Distributions
- All pending approvals
- Total pending amount
- Aging analysis

### Payment History
- All paid distributions
- Payment methods breakdown
- Monthly payment totals

---

## Integration Points

### With General Ledger
- Creates journal entries on payment
- Updates account balances
- Maintains audit trail

### With Nonprofit Management
- Links to nonprofit records
- Updates nonprofit balance
- Tracks distribution history

### With Reporting
- Provides data for financial reports
- Distribution analytics
- Compliance reporting

---

## Testing Scenarios

1. **Create Distribution**
   - Create distribution to nonprofit
   - Verify pending status
   - Check notification sent

2. **Approval Workflow**
   - Approve distribution
   - Verify status change
   - Check journal entry created

3. **Payment Processing**
   - Mark as paid
   - Verify journal entry
   - Check nonprofit balance updated

4. **Validation**
   - Attempt negative amount
   - Try future date
   - Test duplicate prevention

5. **Permissions**
   - Verify fiscal sponsor access
   - Test nonprofit user restrictions

---

## Related Components

- **Nonprofit Management** - Recipient selection
- **General Ledger** - Accounting integration
- **Journal Entry Manager** - Transaction recording
- **Financial Reports** - Distribution reporting

---

## Notes for Backend Team

### Critical Business Rules
1. Only fiscal sponsors can create distributions
2. Distributions require approval before payment
3. Journal entries must be created on payment
4. Nonprofit balances must be updated
5. Complete audit trail required

### Performance Considerations
- Index on nonprofit_id for filtering
- Index on status for pending queries
- Paginate large result sets
- Cache nonprofit list

### Security Considerations
- Validate fiscal sponsor role
- Prevent unauthorized access
- Audit all distribution actions
- Encrypt sensitive data

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
