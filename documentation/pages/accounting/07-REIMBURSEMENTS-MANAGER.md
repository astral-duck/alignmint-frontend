# Reimbursements Manager

**Component File:** `src/components/ReimbursementsManager.tsx`  
**Route:** `/accounting-hub` (with tool='reimbursements')  
**Access Level:** Admin, Manager, Staff (own reimbursements)

## Overview
The Reimbursements Manager allows staff and volunteers to submit expense reimbursement requests with receipt uploads. It includes an approval workflow where managers can approve or reject requests, and track payment status. Features mobile-friendly receipt capture via camera or file upload.

## UI Features

### Main Features
- **Reimbursement Tabs:**
  - My Requests (current user's requests)
  - All Requests (managers/admins only)
  - Pending Approval
  - Approved
  - Paid
  - Rejected
- **Receipt Capture:**
  - Camera capture (mobile)
  - File upload (desktop)
  - Image preview
  - Multiple receipts per request
- **Search:** Search by description or requester name
- **Date Range Filter:** Filter by expense date
- **Category Filter:** Filter by expense category
- **Actions:**
  - Submit new reimbursement
  - Edit pending request
  - Delete pending request
  - Approve request (managers)
  - Reject request (managers)
  - Mark as paid (managers)
  - View receipt images

### Reimbursement Table
- Date
- Requester Name
- Description
- Category (with code)
- Amount
- Receipt indicator
- Status Badge (Pending, Approved, Paid, Rejected)
- Actions dropdown

### Submit Reimbursement Form
- Expense Date
- Amount
- Category (searchable dropdown with codes)
- Description
- Receipt Upload/Capture
  - Camera button (mobile)
  - Upload button (desktop)
  - Image preview
  - Delete receipt option
- Notes
- Entity/Organization selection

### Approval Dialog
- Reimbursement details
- Receipt image viewer
- Approve/Reject buttons
- Rejection reason field
- Payment method selection (when approving)
- Notes field

## Data Requirements

### Reimbursement Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **user_id** (uuid) - Person requesting reimbursement
- **requester_name** (string) - Name of requester
- **amount** (decimal) - Reimbursement amount
- **expense_date** (date) - Date of expense
- **category** (string) - Expense category name
- **account_id** (uuid) - Expense account from chart of accounts
- **account_number** (string) - Account code
- **description** (text) - Expense description
- **receipt_url** (string, nullable) - Uploaded receipt file URL
- **receipt_urls** (array, nullable) - Multiple receipt URLs
- **status** (string) - 'pending', 'approved', 'paid', 'rejected'
- **notes** (text, nullable) - Additional notes
- **approved_by_id** (uuid, nullable) - User who approved
- **approved_at** (datetime, nullable) - When approved
- **rejection_reason** (text, nullable) - Reason for rejection
- **payment_method** (string, nullable) - How reimbursed (check, direct_deposit, etc.)
- **paid_at** (datetime, nullable) - When paid
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Reimbursement:** Submit new request
- **Update Reimbursement:** Edit pending request
- **Delete Reimbursement:** Delete pending request
- **Approve Reimbursement:** Approve pending request
- **Reject Reimbursement:** Reject pending request
- **Mark Paid:** Mark approved request as paid
- **Upload Receipt:** Upload receipt image(s)

## API Endpoints Required

### GET /api/v1/reimbursements
```
Description: Fetch reimbursements
Query Parameters:
  - organization_id (required, uuid)
  - user_id (optional, uuid) - Filter by specific user
  - status (optional, string) - 'pending', 'approved', 'paid', 'rejected', 'all'
  - start_date (optional, date)
  - end_date (optional, date)
  - category (optional, string)
  - search (optional, string)
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - sort_by (optional, string, default: 'date_desc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      user_id: "uuid",
      requester_name: "John Doe",
      amount: 45.50,
      expense_date: "2024-11-08",
      category: "Meals",
      account_id: "uuid",
      account_number: "5660",
      description: "Client lunch meeting",
      receipt_url: "https://...",
      receipt_urls: ["https://...", "https://..."],
      status: "pending",
      notes: null,
      approved_by: null,
      approved_at: null,
      rejection_reason: null,
      payment_method: null,
      paid_at: null,
      created_at: "2024-11-08T14:30:00Z",
      updated_at: "2024-11-08T14:30:00Z"
    }
  ],
  meta: {
    total: 87,
    page: 1,
    per_page: 50,
    total_pages: 2,
    total_amount: 3245.75,
    by_status: {
      pending: 12,
      approved: 8,
      paid: 65,
      rejected: 2
    }
  }
}
```

### GET /api/v1/reimbursements/:id
```
Description: Get single reimbursement details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all reimbursement fields,
    requester: {
      id: "uuid",
      name: "John Doe",
      email: "john@example.com"
    },
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

### POST /api/v1/reimbursements
```
Description: Create new reimbursement request
Request Body: {
  organization_id: "uuid",
  amount: 45.50,
  expense_date: "2024-11-08",
  category: "Meals",
  account_id: "uuid",
  description: "Client lunch meeting",
  notes: null,
  receipt_files: ["base64_encoded_file1", "base64_encoded_file2"] (optional)
}

Response: {
  data: {
    id: "uuid",
    ...all reimbursement fields
  },
  message: "Reimbursement request submitted successfully"
}
```

### PUT /api/v1/reimbursements/:id
```
Description: Update reimbursement (pending only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  amount: 50.00,
  description: "Updated description",
  ...other fields
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Reimbursement updated successfully"
}

Note: Can only update pending reimbursements
```

### DELETE /api/v1/reimbursements/:id
```
Description: Delete reimbursement (pending only)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Reimbursement deleted successfully"
}

Note: Can only delete own pending reimbursements
```

### POST /api/v1/reimbursements/:id/approve
```
Description: Approve pending reimbursement
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  payment_method: "check",
  notes: "Approved for payment" (optional)
}

Response: {
  data: {
    id: "uuid",
    status: "approved",
    approved_by: "Jane Smith",
    approved_at: "2024-11-08T15:00:00Z",
    payment_method: "check"
  },
  message: "Reimbursement approved successfully"
}
```

### POST /api/v1/reimbursements/:id/reject
```
Description: Reject pending reimbursement
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  rejection_reason: "Missing receipt"
}

Response: {
  data: {
    id: "uuid",
    status: "rejected",
    rejection_reason: "Missing receipt",
    rejected_by: "Jane Smith",
    rejected_at: "2024-11-08T15:00:00Z"
  },
  message: "Reimbursement rejected"
}
```

### POST /api/v1/reimbursements/:id/mark_paid
```
Description: Mark approved reimbursement as paid
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  payment_date: "2024-11-10",
  check_number: "1234" (optional)
}

Response: {
  data: {
    id: "uuid",
    status: "paid",
    paid_at: "2024-11-10T00:00:00Z"
  },
  message: "Reimbursement marked as paid"
}
```

### POST /api/v1/reimbursements/:id/upload_receipt
```
Description: Upload receipt image(s)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  files: "multipart/form-data" (multiple files supported)
}

Response: {
  data: {
    id: "uuid",
    receipt_urls: ["https://...", "https://..."]
  },
  message: "Receipt(s) uploaded successfully"
}
```

### GET /api/v1/reimbursements/my_requests
```
Description: Get current user's reimbursement requests
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, string)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [...reimbursements],
  meta: {...}
}
```

## Request/Response Schemas

### Reimbursement Schema
```typescript
interface Reimbursement {
  id: string;
  organization_id: string;
  user_id: string;
  requester_name: string;
  amount: number;
  expense_date: string;
  category: string;
  account_id: string;
  account_number: string;
  description: string;
  receipt_url?: string;
  receipt_urls?: string[];
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  payment_method?: 'check' | 'direct_deposit' | 'cash' | 'wire';
  paid_at?: string;
  created_at: string;
  updated_at: string;
}
```

## Authentication & Authorization

### Required Permissions
- `reimbursements:read` - View reimbursements
- `reimbursements:write` - Create and update own requests
- `reimbursements:delete` - Delete own pending requests
- `reimbursements:approve` - Approve requests (managers)
- `reimbursements:reject` - Reject requests (managers)
- `reimbursements:mark_paid` - Mark as paid (managers)

### Role-Based Access
- **Admin:** Full access to all reimbursements
- **Manager:** Can view all, approve, reject, mark paid
- **Staff:** Can create, view own, edit own pending
- **Volunteer:** Can create, view own, edit own pending

## Business Logic & Validations

### Frontend Validations
- Amount must be greater than 0
- Expense date required and cannot be in future
- Category required
- Description required
- Receipt upload recommended (warning if missing)
- Rejection reason required when rejecting

### Backend Validations (Rails)
- Amount must be positive decimal
- Valid expense date
- Account must exist and be expense type
- Cannot edit/delete approved or paid requests
- Cannot approve own reimbursements
- Cannot mark as paid unless approved
- Receipt file size limits (e.g., 10MB per file)
- Valid file types (PDF, JPG, PNG)
- Maximum 5 receipts per request

### Business Rules
- Users can only view/edit their own pending requests
- Managers can view all requests
- Approved reimbursements create expense journal entries
- Paid reimbursements cannot be edited or deleted
- Receipt upload via camera on mobile devices
- Email notification sent when status changes
- Rejected requests can be edited and resubmitted
- Payment method selected during approval

## State Management

### Local State
- `activeTab` - Current status tab
- `reimbursements` - List of reimbursements
- `selectedReimbursement` - Currently selected request
- `submitRequestOpen` - Submit dialog state
- `approvalDialogOpen` - Approval dialog state
- `receiptImages` - Captured/uploaded receipt images
- `isProcessing` - Processing state for OCR/upload
- `viewReceiptOpen` - Receipt viewer dialog state

### Global State (AppContext)
- `selectedEntity` - Current organization
- Current user info for "My Requests" filter

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `EXPENSE_CATEGORIES`
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Camera/file upload library

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load reimbursements", retry
2. **Validation Error:** Show inline field errors
3. **Cannot Edit:** Show error "Cannot edit approved/paid reimbursements"
4. **Approval Failed:** Show toast "Failed to approve reimbursement"
5. **Upload Failed:** Show toast "Receipt upload failed"
6. **Camera Access Denied:** Show error "Camera permission denied"
7. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Tab change:** Loading spinner
- **Form submission:** Disable button, show spinner
- **Receipt upload:** Progress bar
- **Camera capture:** Processing indicator
- **Approval:** Show confirmation with spinner

## Mock Data to Remove
- `ReimbursementsManager.tsx` - `EXPENSE_CATEGORIES` array (fetch from API)
- Move interfaces to `src/types/reimbursement.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/reimbursements.ts`
2. Create `src/types/reimbursement.ts`
3. Replace mock categories with API call
4. Implement reimbursement list

### Phase 2: CRUD Operations
1. Implement create reimbursement
2. Implement edit reimbursement
3. Implement delete reimbursement
4. Test validations

### Phase 3: Approval Workflow
1. Implement approve flow
2. Implement reject flow
3. Implement mark paid flow
4. Test permissions (users can't approve own)

### Phase 4: Receipt Upload
1. Implement camera capture
2. Implement file upload
3. Test mobile camera access
4. Implement receipt viewer

## Related Documentation
- [06-EXPENSES-MANAGER.md](./06-EXPENSES-MANAGER.md) - Related expenses
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Where reimbursements appear
- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Expense accounts
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Reimbursement data model
