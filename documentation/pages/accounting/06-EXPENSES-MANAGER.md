# Expenses Manager

**Component File:** `src/components/ExpensesManager.tsx`  
**Route:** `/accounting-hub` (with tool='expenses')  
**Access Level:** Admin, Manager, Staff

## Overview
The Expenses Manager tracks and manages all organizational expenses. It provides expense entry, categorization, approval workflows, receipt uploads, and expense reporting. Users can create expenses, submit for approval, and track payment status.

## UI Features

### Main Features
- **Expense Tabs:**
  - All Expenses
  - Pending Approval
  - Approved
  - Paid
  - Rejected
- **Search:** Search by vendor, description, or reference
- **Date Range Filter:** Filter by expense date
- **Category Filter:** Filter by expense category
- **Amount Filter:** Filter by amount range
- **Actions:**
  - Add new expense
  - Edit expense (pending only)
  - Approve expense
  - Reject expense
  - Mark as paid
  - Upload receipt
  - Delete expense

### Expense Table
- Date
- Vendor
- Description
- Category (with code)
- Amount
- Payment Method
- Status Badge (Pending, Approved, Paid, Rejected)
- Receipt indicator
- Actions dropdown

### Add/Edit Expense Form
- Expense Date
- Vendor Name
- Amount
- Category (searchable dropdown with codes)
- Fund (optional)
- Payment Method (Check, Credit Card, ACH, Cash, Wire)
- Check Number (if applicable)
- Reference Number
- Description
- Receipt Upload
- Notes
- Entity/Organization selection

### Approval Dialog
- Expense details review
- Approve/Reject buttons
- Rejection reason field
- Notes field

## Data Requirements

### Expense Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **account_id** (uuid) - Expense account from chart of accounts
- **account_number** (string) - Account code (e.g., '5300')
- **account_name** (string) - Account name
- **fund_id** (uuid, nullable) - Fund allocation
- **fund_name** (string, nullable) - Fund name
- **vendor_name** (string) - Vendor/payee name
- **amount** (decimal) - Expense amount
- **expense_date** (date) - Date of expense
- **payment_method** (string) - 'check', 'credit_card', 'ach', 'cash', 'wire'
- **check_number** (string, nullable) - Check number if applicable
- **reference_number** (string, nullable) - Invoice/reference number
- **description** (text) - Expense description
- **category** (string) - Expense category name
- **receipt_url** (string, nullable) - Uploaded receipt file URL
- **status** (string) - 'pending', 'approved', 'paid', 'rejected'
- **notes** (text, nullable) - Additional notes
- **approved_by_id** (uuid, nullable) - User who approved
- **approved_at** (datetime, nullable) - When approved
- **rejection_reason** (text, nullable) - Reason for rejection
- **paid_at** (datetime, nullable) - When marked as paid
- **created_by_id** (uuid) - User who created
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Expense:** Add new expense
- **Update Expense:** Edit pending expense
- **Delete Expense:** Delete pending expense
- **Approve Expense:** Approve pending expense
- **Reject Expense:** Reject pending expense
- **Mark Paid:** Mark approved expense as paid
- **Upload Receipt:** Upload receipt file

## API Endpoints Required

### GET /api/v1/expenses
```
Description: Fetch expenses for organization
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, string) - 'pending', 'approved', 'paid', 'rejected', 'all'
  - start_date (optional, date)
  - end_date (optional, date)
  - category (optional, string) - Filter by category
  - account_id (optional, uuid) - Filter by account
  - fund_id (optional, uuid) - Filter by fund
  - min_amount (optional, decimal)
  - max_amount (optional, decimal)
  - search (optional, string) - Search vendor, description, reference
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - sort_by (optional, string, default: 'date_desc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      account_id: "uuid",
      account_number: "5300",
      account_name: "Office Supplies",
      fund_id: "uuid",
      fund_name: "General Fund",
      vendor_name: "Office Depot",
      amount: 245.50,
      expense_date: "2024-11-08",
      payment_method: "credit_card",
      check_number: null,
      reference_number: "INV-12345",
      description: "Office supplies for November",
      category: "Office Supplies",
      receipt_url: "https://...",
      status: "approved",
      notes: null,
      approved_by: "Jane Smith",
      approved_at: "2024-11-08T15:00:00Z",
      rejection_reason: null,
      paid_at: null,
      created_by: "John Doe",
      created_at: "2024-11-08T10:00:00Z",
      updated_at: "2024-11-08T15:00:00Z"
    }
  ],
  meta: {
    total: 342,
    page: 1,
    per_page: 50,
    total_pages: 7,
    total_amount: 45230.75,
    by_status: {
      pending: 12,
      approved: 45,
      paid: 280,
      rejected: 5
    }
  }
}
```

### GET /api/v1/expenses/:id
```
Description: Get single expense details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all expense fields,
    approval_history: [
      {
        action: "approved",
        user: "Jane Smith",
        timestamp: "2024-11-08T15:00:00Z",
        notes: "Approved for payment"
      }
    ]
  }
}
```

### POST /api/v1/expenses
```
Description: Create new expense
Request Body: {
  organization_id: "uuid",
  account_id: "uuid",
  fund_id: "uuid" (optional),
  vendor_name: "Office Depot",
  amount: 245.50,
  expense_date: "2024-11-08",
  payment_method: "credit_card",
  check_number: null,
  reference_number: "INV-12345",
  description: "Office supplies for November",
  notes: null,
  receipt_file: "base64_encoded_file" (optional)
}

Response: {
  data: {
    id: "uuid",
    ...all expense fields
  },
  message: "Expense created successfully"
}
```

### PUT /api/v1/expenses/:id
```
Description: Update expense (pending only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  vendor_name: "Updated Vendor",
  amount: 250.00,
  description: "Updated description",
  ...other fields
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Expense updated successfully"
}

Note: Can only update pending expenses
```

### DELETE /api/v1/expenses/:id
```
Description: Delete expense (pending only)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Expense deleted successfully"
}

Note: Can only delete pending expenses
```

### POST /api/v1/expenses/:id/approve
```
Description: Approve pending expense
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  notes: "Approved for payment" (optional)
}

Response: {
  data: {
    id: "uuid",
    status: "approved",
    approved_by: "Jane Smith",
    approved_at: "2024-11-08T15:00:00Z"
  },
  message: "Expense approved successfully"
}
```

### POST /api/v1/expenses/:id/reject
```
Description: Reject pending expense
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  rejection_reason: "Duplicate expense"
}

Response: {
  data: {
    id: "uuid",
    status: "rejected",
    rejection_reason: "Duplicate expense",
    rejected_by: "Jane Smith",
    rejected_at: "2024-11-08T15:00:00Z"
  },
  message: "Expense rejected"
}
```

### POST /api/v1/expenses/:id/mark_paid
```
Description: Mark approved expense as paid
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  payment_date: "2024-11-10",
  payment_method: "check",
  check_number: "1234" (optional)
}

Response: {
  data: {
    id: "uuid",
    status: "paid",
    paid_at: "2024-11-10T00:00:00Z"
  },
  message: "Expense marked as paid"
}
```

### POST /api/v1/expenses/:id/upload_receipt
```
Description: Upload receipt for expense
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  file: "multipart/form-data"
}

Response: {
  data: {
    id: "uuid",
    receipt_url: "https://..."
  },
  message: "Receipt uploaded successfully"
}
```

### GET /api/v1/expenses/categories
```
Description: Get list of expense categories
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: [
    {
      code: "5000",
      name: "Tithe"
    },
    {
      code: "5300",
      name: "Office Supplies"
    },
    ...
  ]
}
```

## Request/Response Schemas

### Expense Schema
```typescript
interface Expense {
  id: string;
  organization_id: string;
  account_id: string;
  account_number: string;
  account_name: string;
  fund_id?: string;
  fund_name?: string;
  vendor_name: string;
  amount: number;
  expense_date: string;
  payment_method: 'check' | 'credit_card' | 'ach' | 'cash' | 'wire';
  check_number?: string;
  reference_number?: string;
  description: string;
  category: string;
  receipt_url?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  paid_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ExpenseCategory {
  code: string;
  name: string;
}
```

## Authentication & Authorization

### Required Permissions
- `expenses:read` - View expenses
- `expenses:write` - Create and update expenses
- `expenses:delete` - Delete expenses
- `expenses:approve` - Approve expenses
- `expenses:reject` - Reject expenses
- `expenses:mark_paid` - Mark as paid

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can create, approve, reject, mark paid
- **Staff:** Can create and view; cannot approve or delete
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Amount must be greater than 0
- Vendor name required
- Expense date required
- Category/Account required
- Description required
- Payment method required
- Rejection reason required when rejecting

### Backend Validations (Rails)
- Amount must be positive decimal
- Valid expense date
- Account must exist and be expense type
- Fund must exist if specified
- Cannot edit/delete approved or paid expenses
- Cannot approve own expenses
- Cannot mark as paid unless approved
- Receipt file size limits (e.g., 10MB)
- Valid file types for receipts (PDF, JPG, PNG)

### Business Rules
- Expenses require approval workflow
- Approved expenses create journal entries automatically
- Paid expenses cannot be edited or deleted
- Receipt upload recommended but not required
- Expense categories map to chart of accounts
- Check number required if payment method is check
- Rejected expenses can be edited and resubmitted
- Expense totals roll up to fund and account balances

## State Management

### Local State
- `activeTab` - Current status tab
- `expenses` - List of expenses
- `selectedExpense` - Currently selected expense
- `addExpenseOpen` - Add dialog state
- `editExpenseOpen` - Edit dialog state
- `approvalDialogOpen` - Approval dialog state
- `expenseForm` - Form state
- `searchQuery` - Search input
- `dateRange` - Date filter
- `categoryFilter` - Category filter

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `EXPENSE_CATEGORIES` array
- UI components (Card, Button, Table, Tabs, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- File upload library

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load expenses", retry
2. **Validation Error:** Show inline field errors
3. **Cannot Edit:** Show error "Cannot edit approved/paid expenses"
4. **Approval Failed:** Show toast "Failed to approve expense"
5. **Upload Failed:** Show toast "Receipt upload failed"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Tab change:** Loading spinner
- **Form submission:** Disable button, show spinner
- **Approval:** Show confirmation with spinner
- **Receipt upload:** Progress bar

## Mock Data to Remove
- `ExpensesManager.tsx` - `EXPENSE_CATEGORIES` array (fetch from API)
- Move interfaces to `src/types/expense.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/expenses.ts`
2. Create `src/types/expense.ts`
3. Replace mock categories with API call
4. Implement expense list

### Phase 2: CRUD Operations
1. Implement create expense
2. Implement edit expense
3. Implement delete expense
4. Test validations

### Phase 3: Approval Workflow
1. Implement approve flow
2. Implement reject flow
3. Implement mark paid flow
4. Test permissions

### Phase 4: Receipt Upload
1. Implement file upload
2. Test file size/type validation
3. Implement receipt viewing

## Related Documentation
- [07-REIMBURSEMENTS-MANAGER.md](./07-REIMBURSEMENTS-MANAGER.md) - Related reimbursements
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Where expenses appear
- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Expense accounts
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Expense data model
