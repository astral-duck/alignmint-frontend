# Distribution Manager

**Component File:** `src/components/DistributionManager.tsx`  
**Route:** `/accounting` (with tool='distribution')  
**Access Level:** Fiscal Sponsor Admin Only

## Overview
The Distribution Manager allows fiscal sponsor administrators to distribute funds to nonprofit organizations via ACH (Automated Clearing House) payments. This component manages approved reimbursement requests and facilitates the actual fund transfer process. It's a critical financial function for fiscal sponsors managing fund distributions to their subsidiary nonprofits.

## UI Features

### Main Features
- **Summary Statistics Cards:**
  - Pending Payouts (count and total amount)
  - Paid This Month (count)
- **Ready to Distribute Table:**
  - Request ID
  - Nonprofit name
  - Requested by
  - Date
  - Amount
  - Status badge
  - Distribute button
- **Distribution History Table:**
  - Past distributions
  - Payment details
  - Status tracking
- **Distribution Confirmation Dialog:**
  - Request details
  - Nonprofit information
  - Amount confirmation
  - ACH payment initiation
- **Back to Accounting Hub button**

### Summary Cards Layout
```
┌─────────────────────┐ ┌─────────────────────┐
│ 📤 Pending Payouts  │ │ ✅ Paid This Month  │
│ 5 requests          │ │ 12 payments         │
│ $12,450.00          │ │                     │
└─────────────────────┘ └─────────────────────┘
```

### Ready to Distribute Table
```
Request ID | Nonprofit        | Requested By  | Date       | Amount     | Status        | Actions
-----------|------------------|---------------|------------|------------|---------------|------------
REQ-001    | Awakenings       | John Doe      | 2025-10-15 | $2,500.00  | Ready to Pay  | [Distribute]
REQ-002    | Bloom Strong     | Jane Smith    | 2025-10-16 | $1,800.00  | Ready to Pay  | [Distribute]
REQ-003    | Bonfire          | Mike Johnson  | 2025-10-17 | $3,200.00  | Ready to Pay  | [Distribute]
```

### Distribution Confirmation Dialog
```
┌─────────────────────────────────────────┐
│ Confirm Fund Distribution               │
├─────────────────────────────────────────┤
│                                         │
│ Request ID: REQ-001                     │
│ Nonprofit: Awakenings                   │
│ Requested By: John Doe                  │
│ Amount: $2,500.00                       │
│                                         │
│ This will initiate an ACH payment to    │
│ the nonprofit's bank account.           │
│                                         │
│ [Cancel]              [Confirm Payment] │
└─────────────────────────────────────────┘
```

## Data Requirements

### Reimbursement Request (Ready to Distribute)
- **id** (uuid) - Request ID
- **entity_id** (uuid) - Nonprofit organization
- **entity_name** (string) - Nonprofit name
- **employee_id** (uuid) - Requester
- **employee_name** (string) - Requester name
- **submission_date** (date) - Request date
- **total_amount** (decimal) - Amount to distribute
- **status** (enum) - 'approved' (ready to pay)
- **expense_items** (array) - List of expenses
- **notes** (string, nullable)

### Distribution Record
- **id** (uuid) - Distribution ID
- **reimbursement_id** (uuid) - Source request
- **from_entity_id** (uuid) - Fiscal sponsor
- **to_entity_id** (uuid) - Nonprofit
- **amount** (decimal) - Distribution amount
- **distribution_date** (date) - Payment date
- **payment_method** (enum) - 'ach', 'wire', 'check'
- **payment_reference** (string) - ACH reference number
- **status** (enum) - 'pending', 'processing', 'completed', 'failed'
- **created_by** (uuid) - Admin who initiated
- **created_at** (timestamp)

### Summary Statistics
- **pending_count** (integer) - Number of pending payouts
- **pending_total** (decimal) - Total pending amount
- **paid_count** (integer) - Payments this month

## API Endpoints Required

### GET /api/v1/distributions/pending
```
Description: Get reimbursement requests ready for distribution
Query Parameters:
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      entity_id: "uuid",
      entity_name: "Awakenings",
      employee_id: "uuid",
      employee_name: "John Doe",
      submission_date: "2025-10-15",
      total_amount: 2500.00,
      status: "approved",
      expense_items: [
        {
          description: "Program supplies",
          amount: 1500.00,
          category: "Program Expenses"
        },
        {
          description: "Office equipment",
          amount: 1000.00,
          category: "Administrative"
        }
      ]
    }
  ],
  meta: {
    total: 5,
    total_amount: 12450.00,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/distributions
```
Description: Initiate fund distribution (ACH payment)
Request Body: {
  reimbursement_id: "uuid",
  payment_method: "ach",
  notes: "Monthly distribution"
}

Response: {
  data: {
    id: "uuid",
    reimbursement_id: "uuid",
    from_entity_id: "uuid",
    to_entity_id: "uuid",
    amount: 2500.00,
    distribution_date: "2025-10-20",
    payment_method: "ach",
    payment_reference: "ACH-20251020-001",
    status: "processing",
    created_by: "uuid",
    created_at: "2025-10-20T10:00:00Z"
  },
  message: "ACH payment initiated successfully"
}
```

### GET /api/v1/distributions/history
```
Description: Get distribution history
Query Parameters:
  - start_date (optional, date)
  - end_date (optional, date)
  - entity_id (optional, uuid) - Filter by nonprofit
  - status (optional, enum) - 'completed', 'failed', 'all'
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      reimbursement_id: "uuid",
      to_entity_name: "Awakenings",
      amount: 2500.00,
      distribution_date: "2025-10-15",
      payment_method: "ach",
      payment_reference: "ACH-20251015-001",
      status: "completed",
      created_by_name: "Admin User"
    }
  ],
  meta: {
    total: 12,
    page: 1,
    per_page: 50
  }
}
```

### GET /api/v1/distributions/:id
```
Description: Get distribution details
Response: {
  data: {
    id: "uuid",
    reimbursement_id: "uuid",
    from_entity: {
      id: "uuid",
      name: "InFocus Ministries"
    },
    to_entity: {
      id: "uuid",
      name: "Awakenings",
      bank_account: {
        account_number_last4: "1234",
        routing_number: "123456789",
        account_type: "checking"
      }
    },
    amount: 2500.00,
    distribution_date: "2025-10-15",
    payment_method: "ach",
    payment_reference: "ACH-20251015-001",
    status: "completed",
    expense_items: [...],
    created_by: {
      id: "uuid",
      name: "Admin User"
    },
    created_at: "2025-10-15T10:00:00Z",
    completed_at: "2025-10-15T14:30:00Z"
  }
}
```

### GET /api/v1/distributions/summary
```
Description: Get distribution summary statistics
Query Parameters:
  - period (optional, enum) - 'month', 'quarter', 'year'

Response: {
  data: {
    pending: {
      count: 5,
      total: 12450.00
    },
    paid_this_month: {
      count: 12,
      total: 45000.00
    },
    by_nonprofit: [
      {
        entity_id: "uuid",
        entity_name: "Awakenings",
        count: 3,
        total: 7500.00
      }
    ]
  }
}
```

## Request/Response Schemas

```typescript
interface ReimbursementRequest {
  id: string;
  entity_id: string;
  entity_name: string;
  employee_id: string;
  employee_name: string;
  submission_date: string;
  total_amount: number;
  status: 'approved';
  expense_items: ExpenseItem[];
  notes?: string;
}

interface ExpenseItem {
  description: string;
  amount: number;
  category: string;
}

interface Distribution {
  id: string;
  reimbursement_id: string;
  from_entity_id: string;
  to_entity_id: string;
  amount: number;
  distribution_date: string;
  payment_method: 'ach' | 'wire' | 'check';
  payment_reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_by: string;
  created_at: string;
  completed_at?: string;
}

interface DistributionSummary {
  pending: {
    count: number;
    total: number;
  };
  paid_this_month: {
    count: number;
    total: number;
  };
}
```

## Authentication & Authorization

### Required Permissions
- `distributions:read` - View distributions
- `distributions:create` - Initiate distributions
- `distributions:manage` - Full distribution management

### Role-Based Access
- **Fiscal Sponsor:** Full access to all distribution functions
- **Nonprofit User:** No access (cannot distribute funds)
- **Staff:** View-only access
- **Donor/Volunteer:** No access

### Special Rules
- Only fiscal sponsor can initiate distributions
- Requires approved reimbursement request
- Cannot distribute to inactive nonprofits
- Audit log all distribution actions
- Two-person approval for large amounts (future)

## Business Logic & Validations

### Frontend Validations
- Reimbursement must be in 'approved' status
- Amount must be positive
- Nonprofit must be active
- Confirmation required before distribution

### Backend Validations (Rails)
- Valid reimbursement ID
- Reimbursement not already distributed
- Nonprofit has valid bank account
- Sufficient funds available
- Valid payment method
- User has distribution permission

### Business Rules
- Only approved reimbursements can be distributed
- Distribution creates ledger entries (both entities)
- Payment reference generated automatically
- Status updates: pending → processing → completed
- Failed distributions can be retried
- All distributions logged in audit trail
- Email notifications sent to nonprofit
- Reimbursement status updated to 'paid'

## State Management

### Local State
- `distributeOpen` - Confirmation dialog visibility
- `selectedReimbursement` - Reimbursement being distributed

### Global State (AppContext)
- `selectedEntity` - Current organization (should be fiscal sponsor)

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `getReimbursementRequests()` from mockData
- UI components (Card, Button, Table, AlertDialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load distributions"
2. **Distribution Failed:** Show toast "Payment initiation failed"
3. **Invalid Reimbursement:** Show toast "Invalid reimbursement request"
4. **Insufficient Funds:** Show toast "Insufficient funds available"
5. **Bank Account Error:** Show toast "Invalid bank account information"
6. **Permission Error:** Show toast "You don't have permission"
7. **Already Distributed:** Show toast "This request has already been paid"

## Loading States
- **Initial load:** Skeleton cards and table
- **Distribute action:** Button loading state
- **Confirmation:** Dialog loading during processing

## Mock Data to Remove
- `DistributionManager.tsx` - `getReimbursementRequests()` from mockData
- `mockData.ts` - Mock reimbursement data
- Move interfaces to `src/types/distributions.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/distributions.ts`
2. Create `src/types/distributions.ts`
3. Implement pending distributions endpoint
4. Test distribution creation

### Phase 2: Payment Processing
1. Integrate with ACH payment provider
2. Implement payment status tracking
3. Add webhook handling for payment updates
4. Test payment flows

### Phase 3: Ledger Integration
1. Create ledger entries on distribution
2. Update reimbursement status
3. Test double-entry bookkeeping
4. Verify fund tracking

### Phase 4: Advanced Features
1. Add distribution history
2. Implement bulk distributions
3. Add payment method options (wire, check)
4. Implement approval workflow for large amounts

## Related Documentation
- [../accounting/07-REIMBURSEMENTS-MANAGER.md](../accounting/07-REIMBURSEMENTS-MANAGER.md)
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md)
- [02-NONPROFIT-MANAGEMENT.md](./02-NONPROFIT-MANAGEMENT.md)
- [../../../04-USER-ROLES-AND-PERMISSIONS.md](../../04-USER-ROLES-AND-PERMISSIONS.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### ACH Payment Process
1. **Initiation:** Admin clicks "Distribute" button
2. **Validation:** System validates reimbursement and bank account
3. **Creation:** Distribution record created with status 'pending'
4. **Processing:** ACH payment initiated with payment provider
5. **Status Update:** Status changes to 'processing'
6. **Completion:** Payment provider confirms, status → 'completed'
7. **Ledger:** Entries created in both fiscal sponsor and nonprofit ledgers
8. **Notification:** Email sent to nonprofit confirming payment

### Payment Methods
**ACH (Primary):**
- 1-3 business days
- Lower fees
- Automated processing
- Preferred method

**Wire Transfer:**
- Same day
- Higher fees
- Manual processing
- For urgent payments

**Check:**
- 5-7 business days
- Manual processing
- For nonprofits without bank accounts
- Requires mailing address

### Ledger Entries Created
**Fiscal Sponsor (InFocus Ministries):**
```
Debit:  Distributions Payable    $2,500.00
Credit: Cash - Operating Account  $2,500.00
```

**Nonprofit (e.g., Awakenings):**
```
Debit:  Cash - Operating Account  $2,500.00
Credit: Revenue - Distributions   $2,500.00
```

### Workflow Integration
1. **Reimbursement Request** → Submitted by nonprofit
2. **Approval** → Approved by fiscal sponsor
3. **Distribution** → Initiated via Distribution Manager
4. **Payment** → Processed via ACH
5. **Ledger Update** → Entries created
6. **Notification** → Nonprofit notified
7. **Reconciliation** → Bank statement reconciliation

### Security Considerations
- Two-person approval for amounts > $10,000 (future)
- IP address logging for all distributions
- Email confirmation required
- Bank account verification
- Fraud detection monitoring
- Daily distribution limits

### Reporting
- Monthly distribution reports
- By-nonprofit distribution summary
- Payment method breakdown
- Failed payment tracking
- Audit trail for compliance
