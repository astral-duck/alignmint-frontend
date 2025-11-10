# Donor Payment Management

**Component File:** `src/components/DonorPaymentManagement.tsx`  
**Route:** `/donor-hub` (with tool='payment-management')  
**Access Level:** Admin, Manager

## Overview
The Donor Payment Management component provides comprehensive management of donor payment methods and recurring donation subscriptions. It displays all donors with saved payment methods, allows viewing and updating payment information, managing recurring donations (pause, resume, cancel), and tracking subscription status. This is essential for maintaining healthy recurring donation relationships and ensuring payment method currency.

## UI Features

### Main Features
- **Search & Filter:**
  - Search by name or email
  - Filter by status (all, active recurring, cancelled, one-time only, payment failed)
  - Entity filter (for fiscal sponsors)
- **Donors Table:**
  - Name, email, phone
  - Organization
  - Payment methods (cards/bank accounts)
  - Recurring status
  - Next billing date
  - Total donated
  - Actions dropdown
- **Payment Method Details:**
  - Card brand and last 4 digits
  - Expiry date
  - Bank name (for ACH)
  - Default payment method indicator
- **Recurring Subscription Management:**
  - Pause subscription
  - Resume subscription
  - Cancel subscription
  - Update payment method
  - Change amount/frequency
- **Actions Menu:**
  - View details
  - Update payment method
  - Pause/Resume recurring
  - Cancel subscription
  - Send receipt

### Table Layout
```
Donor Payment Management

[Search...]  [Filter: All ▼]  [Entity: All ▼]

Name            | Email              | Phone        | Org        | Payment Methods      | Recurring | Next Billing | Total    | Actions
----------------|--------------------|--------------|-----------|--------------------|-----------|--------------|----------|--------
Robert Thompson | robert@email.com   | (555) 123... | Awakenings | Visa •••• 4242     | Monthly   | 2025-11-15   | $1,200   | [⋮]
                |                    |              |            | Default            | $100      |              |          |
Susan Chen      | susan@email.com    | (555) 234... | Bloom      | MC •••• 5555       | None      | -            | $500     | [⋮]
                |                    |              |            |                    |           |              |          |
Michael Williams| michael@email.com  | (555) 345... | Bonfire    | Amex •••• 1234     | Quarterly | 2025-12-01   | $2,400   | [⋮]
                |                    |              |            | Chase Bank •••• 6789| $200      |              |          |
```

### Actions Dropdown
```
⋮
├─ View Details
├─ Update Payment Method
├─ Pause Recurring Donation
├─ Cancel Subscription
└─ Send Receipt
```

### Recurring Subscription Card
```
┌─────────────────────────────────────────┐
│ Recurring Donation Details              │
├─────────────────────────────────────────┤
│ Donor: Robert Thompson                  │
│ Email: robert@email.com                 │
│                                         │
│ Amount: $100                            │
│ Frequency: Monthly                      │
│ Next Billing: November 15, 2025         │
│ Status: ● Active                        │
│                                         │
│ Payment Method:                         │
│ Visa •••• 4242 (Exp: 12/26)            │
│                                         │
│ [Update Payment] [Pause] [Cancel]       │
└─────────────────────────────────────────┘
```

## Data Requirements

### Donor Payment
- **id** (uuid) - Donor identifier
- **name** (string) - Full name
- **email** (string) - Email address
- **phone** (string) - Phone number
- **entity_id** (uuid) - Organization
- **payment_methods** (array) - Saved payment methods
- **is_recurring** (boolean) - Has recurring donation
- **recurring_amount** (decimal, nullable) - Recurring amount
- **recurring_frequency** (enum, nullable) - Frequency
- **next_billing_date** (date, nullable) - Next charge date
- **subscription_status** (enum) - Status
- **total_donated** (decimal) - Lifetime total
- **last_donation_date** (date) - Most recent donation
- **start_date** (date) - First donation date

### Payment Method
- **id** (uuid) - Payment method ID
- **type** (enum) - 'card' or 'bank'
- **last4** (string) - Last 4 digits
- **brand** (string, nullable) - Card brand (Visa, MC, etc.)
- **bank_name** (string, nullable) - Bank name
- **expiry_month** (string, nullable) - MM
- **expiry_year** (string, nullable) - YYYY
- **is_default** (boolean) - Default payment method

## API Endpoints Required

### GET /api/v1/donor_payments
```
Description: Get all donors with payment information
Query Parameters:
  - organization_id (required, uuid)
  - search (optional, string)
  - status (optional, enum) - 'active-recurring', 'cancelled', 'one-time-only', 'payment-failed', 'all'
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      name: "Robert Thompson",
      email: "robert@email.com",
      phone: "(555) 123-4567",
      entity_id: "uuid",
      entity_name: "Awakenings",
      payment_methods: [
        {
          id: "pm_...",
          type: "card",
          last4: "4242",
          brand: "Visa",
          expiry_month: "12",
          expiry_year: "2026",
          is_default: true
        }
      ],
      is_recurring: true,
      recurring_amount: 100.00,
      recurring_frequency: "monthly",
      next_billing_date: "2025-11-15",
      subscription_status: "active",
      total_donated: 1200.00,
      last_donation_date: "2025-10-15"
    }
  ],
  meta: {
    total: 45,
    page: 1,
    per_page: 50
  }
}
```

### PATCH /api/v1/donor_payments/:id/pause_subscription
```
Description: Pause recurring subscription
Response: {
  data: {
    subscription_status: "paused"
  },
  message: "Subscription paused successfully"
}
```

### PATCH /api/v1/donor_payments/:id/resume_subscription
```
Description: Resume paused subscription
Response: {
  data: {
    subscription_status: "active",
    next_billing_date: "2025-11-15"
  },
  message: "Subscription resumed successfully"
}
```

### DELETE /api/v1/donor_payments/:id/cancel_subscription
```
Description: Cancel recurring subscription
Response: {
  data: {
    subscription_status: "cancelled"
  },
  message: "Subscription cancelled successfully"
}
```

### POST /api/v1/donor_payments/:id/update_payment_method
```
Description: Update default payment method
Request Body: {
  payment_method_id: "pm_new..."
}

Response: {
  data: {
    payment_methods: [...]
  },
  message: "Payment method updated successfully"
}
```

### POST /api/v1/donor_payments/:id/send_receipt
```
Description: Resend receipt email
Request Body: {
  donation_id: "uuid"
}

Response: {
  message: "Receipt sent successfully"
}
```

## Request/Response Schemas

```typescript
interface DonorPayment {
  id: string;
  name: string;
  email: string;
  phone: string;
  entity_id: string;
  entity_name: string;
  payment_methods: PaymentMethod[];
  is_recurring: boolean;
  recurring_amount?: number;
  recurring_frequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';
  next_billing_date?: string;
  subscription_status: 'active' | 'cancelled' | 'paused' | 'none';
  total_donated: number;
  last_donation_date: string;
  start_date: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bank_name?: string;
  expiry_month?: string;
  expiry_year?: string;
  is_default: boolean;
}
```

## Authentication & Authorization

### Required Permissions
- `donor_payments:read` - View payment information
- `donor_payments:manage` - Manage subscriptions and payment methods

### Role-Based Access
- **Fiscal Sponsor:** View all donor payments across nonprofits
- **Nonprofit User:** View their organization's donor payments only
- **Staff:** View-only access
- **Donor/Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Search query minimum 2 characters
- Valid filter selections
- Confirmation required for cancellation

### Backend Validations (Rails)
- Valid organization access
- Valid subscription status
- Payment method belongs to donor
- Cannot resume cancelled subscription

### Business Rules
- Paused subscriptions can be resumed
- Cancelled subscriptions cannot be resumed
- Payment method updates apply to next billing
- Failed payments retry automatically (3 attempts)
- Email notifications for status changes
- Donors notified before billing
- Grace period for failed payments (7 days)

## State Management

### Local State
- `searchQuery` - Search filter
- `statusFilter` - Status filter
- `entityFilter` - Organization filter
- `selectedDonor` - Donor being managed
- `showDetailsDialog` - Dialog visibility

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `generateMockDonors()`
- UI components (Table, Dialog, Dropdown, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load donor payments"
2. **Pause Failed:** Show toast "Failed to pause subscription"
3. **Cancel Failed:** Show toast "Failed to cancel subscription"
4. **Update Failed:** Show toast "Failed to update payment method"
5. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Search:** Instant filtering
- **Actions:** Button loading states
- **Status updates:** Optimistic UI updates

## Mock Data to Remove
- `DonorPaymentManagement.tsx` - `generateMockDonors()` function
- Move interfaces to `src/types/donor-payments.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/donor-payments.ts`
2. Implement list endpoint
3. Test filtering and search
4. Add pagination

### Phase 2: Subscription Management
1. Implement pause/resume/cancel
2. Add payment method updates
3. Test subscription workflows
4. Add email notifications

### Phase 3: Payment Processing
1. Integrate with Stripe Billing
2. Implement retry logic
3. Add dunning management
4. Test failed payment scenarios

## Related Documentation
- [01-DONORS-CRM.md](./01-DONORS-CRM.md)
- [02-DONATIONS-MANAGER.md](./02-DONATIONS-MANAGER.md)
- [06-DONOR-PAGE-PREVIEW.md](./06-DONOR-PAGE-PREVIEW.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Subscription Statuses
- **Active:** Billing normally
- **Paused:** Temporarily stopped
- **Cancelled:** Permanently ended
- **Payment Failed:** Retry in progress
- **None:** No recurring donation

### Payment Method Management
- Donors can have multiple payment methods
- One marked as default
- Default used for recurring donations
- Can update without interrupting subscription
- Old methods retained for history

### Failed Payment Handling
1. **Attempt 1:** Immediate retry
2. **Attempt 2:** 3 days later
3. **Attempt 3:** 7 days later
4. **Final:** Subscription paused, donor notified

### Email Notifications
- Upcoming billing reminder (3 days before)
- Payment successful
- Payment failed
- Subscription paused
- Subscription cancelled
- Payment method expiring soon

### Compliance
- PCI DSS compliant (no card storage)
- GDPR compliant data handling
- Secure payment tokenization
- Audit trail for all changes
