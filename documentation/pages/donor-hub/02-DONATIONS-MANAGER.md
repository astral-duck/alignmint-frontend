# Donations Manager

**Component File:** `src/components/DonationsManager.tsx`  
**Route:** `/donor-hub` (with tool='donations')  
**Access Level:** Admin, Manager, Staff

## Overview
The Donations Manager is a comprehensive donation tracking and management system. It displays all donations across the organization with advanced filtering, sorting, and search capabilities. Users can add new donations, assign unassigned donations to donors, process refunds, and send receipts.

## UI Features

### Main Features
- **Search:** Search by donor name, donation ID, or cause/campaign
- **Sort Options:**
  - Date (Newest, Oldest)
  - Amount (High to Low, Low to High)
  - Donor name (A-Z, Z-A)
- **Filters:**
  - Status (All, Completed, Pending, Failed, Refunded)
  - Type (All, One-time, Recurring, Event)
  - Assignment (All, Assigned to donor, Unassigned)
- **Actions:**
  - Add new donation
  - Assign donation to donor
  - Add new donor (from donation flow)
  - View donor profile (click donor name)
  - Send receipt
  - Process refund

### Donation Table Columns
- Status badge (Completed, Pending, Failed, Refunded)
- Donor name (clickable to view profile)
- Amount
- Date
- Type (One-time, Recurring, Event)
- Payment method
- Cause/Campaign
- Actions dropdown

### Add Donation Dialog
- Donor selection (searchable dropdown or "Add New Donor")
- Amount
- Date
- Type (One-time, Recurring)
- Payment method (Credit Card, Check, Cash, ACH, Wire)
- Cause/Campaign
- Notes
- Receipt sent checkbox
- Tax deductible checkbox
- Entity/Organization selection

### Assign Donor Dialog
- Search and select existing donor
- Or create new donor inline
- Automatically links donation to donor

## Data Requirements

### Donation List Data
- **id** (uuid) - Unique identifier
- **donor_id** (uuid, nullable) - Linked donor
- **donor_name** (string, nullable) - Donor name (if assigned)
- **amount** (decimal) - Donation amount
- **currency** (string) - Currency code (default: USD)
- **donation_date** (date) - Date of donation
- **donation_type** (string) - 'one-time', 'recurring', 'pledge'
- **payment_method** (string) - 'credit_card', 'check', 'cash', 'ach', 'wire'
- **payment_status** (string) - 'completed', 'pending', 'failed', 'refunded'
- **transaction_id** (string, nullable) - External payment processor ID
- **fund_id** (uuid, nullable) - Designated fund
- **fund_name** (string, nullable) - Fund name
- **campaign_id** (uuid, nullable) - Associated campaign
- **campaign_name** (string, nullable) - Campaign name
- **designation** (string, nullable) - Specific purpose/cause
- **is_anonymous** (boolean) - Anonymous donation flag
- **is_recurring** (boolean) - Recurring donation flag
- **recurring_frequency** (string, nullable) - 'weekly', 'monthly', 'quarterly', 'yearly'
- **check_number** (string, nullable) - Check number if applicable
- **deposited_at** (datetime, nullable) - When deposited
- **receipt_sent** (boolean) - Receipt sent flag
- **receipt_sent_at** (datetime, nullable) - When receipt was sent
- **notes** (text, nullable) - Internal notes
- **created_at** (datetime) - When record was created
- **updated_at** (datetime) - When record was updated

### Data Mutations
- **Create Donation:** Add new donation record
- **Update Donation:** Edit donation details
- **Delete Donation:** Remove donation (soft delete)
- **Assign Donor:** Link donation to existing or new donor
- **Send Receipt:** Email receipt to donor
- **Process Refund:** Refund a donation

## API Endpoints Required

### GET /api/v1/donations
```
Description: Fetch list of donations for an organization
Query Parameters:
  - organization_id (required, uuid)
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - search (optional, string) - Search by donor name, donation ID, cause
  - sort_by (optional, string) - 'date_newest', 'date_oldest', 'amount_high', 'amount_low', 'donor_asc', 'donor_desc'
  - status (optional, string) - 'completed', 'pending', 'failed', 'refunded', 'all'
  - type (optional, string) - 'one-time', 'recurring', 'event', 'all'
  - assignment (optional, string) - 'assigned', 'unassigned', 'all'
  - start_date (optional, date) - Filter by date range
  - end_date (optional, date) - Filter by date range
  - donor_id (optional, uuid) - Filter by specific donor
  - campaign_id (optional, uuid) - Filter by campaign
  - fund_id (optional, uuid) - Filter by fund

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      donor_id: "uuid",
      donor_name: "John Doe",
      amount: 100.00,
      currency: "USD",
      donation_date: "2024-11-01",
      donation_type: "one-time",
      payment_method: "credit_card",
      payment_status: "completed",
      transaction_id: "ch_abc123",
      fund_id: "uuid",
      fund_name: "General Fund",
      campaign_id: "uuid",
      campaign_name: "Fall Campaign",
      designation: "Youth Programs",
      is_anonymous: false,
      is_recurring: false,
      recurring_frequency: null,
      check_number: null,
      deposited_at: "2024-11-02T10:00:00Z",
      receipt_sent: true,
      receipt_sent_at: "2024-11-01T15:30:00Z",
      notes: "Online donation",
      created_at: "2024-11-01T14:20:00Z",
      updated_at: "2024-11-01T15:30:00Z"
    }
  ],
  meta: {
    total: 5420,
    page: 1,
    per_page: 50,
    total_pages: 109,
    total_amount: 542000.00,
    completed_amount: 540000.00,
    pending_amount: 2000.00
  }
}
```

### GET /api/v1/donations/:id
```
Description: Fetch single donation details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all donation fields,
    donor: {
      id: "uuid",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com"
    }
  }
}
```

### POST /api/v1/donations
```
Description: Create new donation
Request Body: {
  organization_id: "uuid",
  donor_id: "uuid" (optional),
  amount: 100.00,
  currency: "USD",
  donation_date: "2024-11-08",
  donation_type: "one-time",
  payment_method: "credit_card",
  payment_status: "completed",
  transaction_id: "ch_abc123" (optional),
  fund_id: "uuid" (optional),
  campaign_id: "uuid" (optional),
  designation: "Youth Programs" (optional),
  is_anonymous: false,
  is_recurring: false,
  recurring_frequency: null,
  recurring_day: null,
  recurring_end_date: null,
  check_number: null,
  notes: "Online donation",
  send_receipt: true
}

Response: {
  data: {
    id: "uuid",
    ...all donation fields
  },
  message: "Donation created successfully"
}
```

### PUT /api/v1/donations/:id
```
Description: Update existing donation
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  donor_id: "uuid" (optional),
  amount: 100.00,
  donation_date: "2024-11-08",
  donation_type: "one-time",
  payment_method: "credit_card",
  payment_status: "completed",
  fund_id: "uuid" (optional),
  campaign_id: "uuid" (optional),
  designation: "Youth Programs" (optional),
  notes: "Updated notes"
}

Response: {
  data: {
    id: "uuid",
    ...updated donation fields
  },
  message: "Donation updated successfully"
}
```

### DELETE /api/v1/donations/:id
```
Description: Delete donation (soft delete)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Donation deleted successfully"
}
```

### POST /api/v1/donations/:id/assign_donor
```
Description: Assign donation to a donor
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  donor_id: "uuid"
}

Response: {
  data: {
    id: "uuid",
    donor_id: "uuid",
    donor_name: "John Doe",
    ...other donation fields
  },
  message: "Donation assigned to donor successfully"
}
```

### POST /api/v1/donations/:id/send_receipt
```
Description: Send receipt email to donor
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  email: "john@example.com" (optional, uses donor's email if not provided),
  template_id: "uuid" (optional)
}

Response: {
  data: {
    receipt_sent: true,
    receipt_sent_at: "2024-11-08T10:30:00Z"
  },
  message: "Receipt sent successfully"
}
```

### POST /api/v1/donations/:id/refund
```
Description: Process refund for a donation
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  amount: 100.00 (optional, defaults to full amount),
  reason: "Donor requested refund",
  notify_donor: true
}

Response: {
  data: {
    id: "uuid",
    payment_status: "refunded",
    refund_amount: 100.00,
    refund_reason: "Donor requested refund",
    refunded_at: "2024-11-08T10:30:00Z"
  },
  message: "Refund processed successfully"
}
```

### GET /api/v1/donations/recurring
```
Description: List all recurring donations
Query Parameters:
  - organization_id (required, uuid)
  - status (optional) - 'active', 'cancelled', 'all'
  - donor_id (optional, uuid)

Response: {
  data: [
    {
      id: "uuid",
      donor_id: "uuid",
      donor_name: "John Doe",
      amount: 50.00,
      recurring_frequency: "monthly",
      recurring_day: 1,
      next_charge_date: "2024-12-01",
      recurring_end_date: null,
      status: "active",
      created_at: "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PUT /api/v1/donations/:id/cancel_recurring
```
Description: Cancel recurring donation
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  reason: "Donor requested cancellation" (optional)
}

Response: {
  data: {
    id: "uuid",
    is_recurring: false,
    cancelled_at: "2024-11-08T10:30:00Z"
  },
  message: "Recurring donation cancelled successfully"
}
```

## Request/Response Schemas

### Donation Schema
```typescript
interface Donation {
  id: string;
  organization_id: string;
  donor_id?: string;
  donor_name?: string;
  amount: number;
  currency: string;
  donation_date: string;
  donation_type: 'one-time' | 'recurring' | 'pledge';
  payment_method: 'credit_card' | 'check' | 'cash' | 'ach' | 'wire';
  payment_status: 'completed' | 'pending' | 'failed' | 'refunded';
  transaction_id?: string;
  fund_id?: string;
  fund_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  designation?: string;
  is_anonymous: boolean;
  is_recurring: boolean;
  recurring_frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  recurring_day?: number;
  recurring_end_date?: string;
  check_number?: string;
  deposited_at?: string;
  receipt_sent: boolean;
  receipt_sent_at?: string;
  notes?: string;
  refund_amount?: number;
  refund_reason?: string;
  refunded_at?: string;
  created_at: string;
  updated_at: string;
}

interface RecurringDonation {
  id: string;
  donor_id: string;
  donor_name: string;
  amount: number;
  recurring_frequency: string;
  recurring_day: number;
  next_charge_date: string;
  recurring_end_date?: string;
  status: 'active' | 'cancelled';
  created_at: string;
}
```

## Authentication & Authorization

### Required Permissions
- `donations:read` - View donations
- `donations:write` - Create and update donations
- `donations:delete` - Delete donations
- `donations:refund` - Process refunds
- `donations:send_receipt` - Send receipts

### Role-Based Access
- **Admin:** Full access to all donation operations
- **Manager:** Can view, create, update, refund, send receipts
- **Staff:** Can view, create, update; cannot delete or refund
- **Volunteer:** No access to donations manager

## Business Logic & Validations

### Frontend Validations
- Amount must be greater than 0
- Date cannot be in the future
- Donor required (either existing or new)
- Payment method required
- Organization must be selected
- Refund amount cannot exceed original donation amount
- Email required for sending receipt

### Backend Validations (Rails)
- Amount must be positive decimal
- Valid donation date
- Valid payment method
- Valid payment status
- Valid donation type
- Organization exists and user has access
- Donor exists (if donor_id provided)
- Fund exists (if fund_id provided)
- Campaign exists (if campaign_id provided)
- Cannot refund already refunded donation
- Cannot refund more than original amount

### Business Rules
- Donations are organization-specific (multi-tenant)
- Unassigned donations can be assigned to donors later
- Refunds create negative entries or update status to 'refunded'
- Recurring donations automatically create new donation records
- Receipt emails use organization's email templates
- Anonymous donations hide donor information in public reports
- Deposited donations cannot be deleted (only voided)
- Total donated amount on donor profile updates automatically

## State Management

### Local State
- `searchQuery` - Search input
- `sortBy` - Current sort option
- `statusFilter` - Status filter
- `typeFilter` - Type filter
- `assignmentFilter` - Assignment filter
- `addDonationOpen` - Add dialog state
- `assignDonorOpen` - Assign dialog state
- `addNewDonorOpen` - New donor dialog state
- `selectedDonationId` - Selected donation for actions
- `newDonation` - Form state for new donation
- `newDonor` - Form state for new donor

### Global State (AppContext)
- `selectedEntity` - Current organization
- `setSelectedDonor` - Navigate to donor profile
- `setDonorTool` - Switch to donors view

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- `mockData.ts` - **TO BE REMOVED** - `getAllDonationRecords()`, `getAllDonors()`
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load donations. Please try again.", retry button
2. **Validation Error:** Show inline field errors
3. **Permission Error:** Show toast "You don't have permission to perform this action"
4. **Not Found:** Show "Donation not found" message
5. **Refund Failed:** Show toast "Refund failed: [reason from API]"
6. **Receipt Send Failed:** Show toast "Failed to send receipt. Please try again."
7. **Assign Donor Failed:** Show toast "Failed to assign donor"

## Loading States
- **Initial load:** Skeleton table with 10 rows
- **Pagination:** Loading spinner overlay on table
- **Form submission:** Disable submit button, show spinner
- **Refund processing:** Disable button, show spinner
- **Receipt sending:** Disable button, show spinner

## Mock Data to Remove
- `mockData.ts` - `getAllDonationRecords()` function
- `mockData.ts` - `getAllDonors()` function (for donor selection)
- `mockData.ts` - `DonationRecord` interface (move to types)

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/donations.ts` with all donation endpoints
2. Create `src/types/donation.ts` with TypeScript interfaces
3. Replace `getAllDonationRecords()` with API call
4. Add loading and error states

### Phase 2: CRUD Operations
1. Implement create donation flow
2. Implement update donation flow
3. Implement delete donation flow
4. Test all operations

### Phase 3: Advanced Features
1. Implement assign donor flow
2. Implement send receipt flow
3. Implement refund flow
4. Implement recurring donation management

### Phase 4: Integration with Donors
1. Ensure clicking donor name navigates to donor profile
2. Ensure donor selection dropdown loads from API
3. Test create new donor from donation flow

## Related Documentation
- [01-DONORS-CRM.md](./01-DONORS-CRM.md) - Related donor management
- [03-DONOR-PORTAL.md](./03-DONOR-PORTAL.md) - Public donation portal
- [04-CHECK-DEPOSIT-MANAGER.md](./04-CHECK-DEPOSIT-MANAGER.md) - Deposit processing
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Donation data model
