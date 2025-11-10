# Donor Portal

**Component File:** `src/components/DonorPortal.tsx`  
**Route:** `/donor-hub` (with tool='donor-portal') or Public URL  
**Access Level:** Authenticated Donors (Public)

## Overview
The Donor Portal is a self-service interface where donors can view their donation history, download tax receipts, update payment methods, manage recurring donations, and generate annual contribution statements. This portal can be accessed both internally and via a public URL with donor authentication.

## UI Features

### Main Features
- **Donor Dashboard:**
  - Total donations (lifetime)
  - Total donations (current year)
  - Number of donations
  - Giving streak
  - Impact summary
- **Donation History:**
  - Filterable by year
  - Sortable table
  - Download individual receipts
  - View donation details
- **Tax Documents:**
  - Annual contribution statement
  - Download PDF
  - Email statement
  - Year selector
- **Payment Methods:**
  - Saved credit cards
  - Bank accounts
  - Add new payment method
  - Set default method
  - Remove payment method
- **Recurring Donations:**
  - Active subscriptions
  - Pause/resume subscription
  - Update amount
  - Update payment method
  - Cancel subscription
- **Profile Settings:**
  - Update contact information
  - Email preferences
  - Communication preferences
  - Password change

### Donation History Table
- Date
- Amount
- Payment Method
- Purpose/Fund
- Status
- Receipt download button

### Summary Cards
- **Lifetime Giving:** Total amount donated
- **This Year:** YTD donations
- **Donation Count:** Number of donations
- **Giving Streak:** Consecutive months

## Data Requirements

### Donor Profile Data
- **id** (uuid) - Donor ID
- **name** (string) - Full name
- **email** (string) - Email address
- **phone** (string, nullable) - Phone number
- **address** (json, nullable) - Mailing address
- **total_donated** (decimal) - Lifetime giving
- **ytd_donated** (decimal) - Year-to-date giving
- **donation_count** (integer) - Total donations
- **first_donation_date** (date) - First donation
- **last_donation_date** (date) - Most recent donation
- **giving_streak** (integer) - Consecutive months
- **communication_preferences** (json) - Email/mail preferences

### Donation History Data
- **id** (uuid) - Donation ID
- **date** (date) - Donation date
- **amount** (decimal) - Donation amount
- **payment_method** (string) - Payment method used
- **purpose** (string) - Donation purpose/fund
- **status** (string) - 'completed', 'pending', 'refunded'
- **receipt_url** (string, nullable) - Receipt PDF URL
- **is_recurring** (boolean) - Part of recurring donation
- **subscription_id** (uuid, nullable) - Recurring subscription ID

### Payment Method Data
- **id** (uuid) - Payment method ID
- **type** (string) - 'credit_card', 'bank_account'
- **last_four** (string) - Last 4 digits
- **brand** (string, nullable) - Card brand (Visa, MC, etc.)
- **expiry_month** (integer, nullable) - Card expiry month
- **expiry_year** (integer, nullable) - Card expiry year
- **is_default** (boolean) - Default payment method
- **created_at** (datetime) - When added

### Recurring Donation Data
- **id** (uuid) - Subscription ID
- **amount** (decimal) - Recurring amount
- **frequency** (string) - 'monthly', 'quarterly', 'annually'
- **payment_method_id** (uuid) - Payment method
- **purpose** (string) - Donation purpose/fund
- **status** (string) - 'active', 'paused', 'cancelled'
- **start_date** (date) - Subscription start
- **next_payment_date** (date, nullable) - Next charge date
- **total_donated** (decimal) - Total from this subscription
- **payment_count** (integer) - Number of payments

### Data Mutations
- **Update Profile:** Update contact info and preferences
- **Add Payment Method:** Add new card/bank account
- **Remove Payment Method:** Delete payment method
- **Set Default Payment:** Set default payment method
- **Update Recurring:** Modify recurring donation
- **Pause Recurring:** Pause subscription
- **Resume Recurring:** Resume subscription
- **Cancel Recurring:** Cancel subscription
- **Download Receipt:** Get individual receipt
- **Download Statement:** Get annual contribution statement

## API Endpoints Required

### GET /api/v1/donor_portal/profile
```
Description: Get authenticated donor's profile
Headers:
  - Authorization: Bearer {donor_token}

Response: {
  data: {
    id: "uuid",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1-555-0123",
    address: {
      street: "123 Main St",
      city: "Seattle",
      state: "WA",
      zip: "98101"
    },
    total_donated: 5420.00,
    ytd_donated: 1850.00,
    donation_count: 24,
    first_donation_date: "2022-03-15",
    last_donation_date: "2024-11-01",
    giving_streak: 8,
    communication_preferences: {
      email_receipts: true,
      email_updates: true,
      mail_statements: false
    }
  }
}
```

### PUT /api/v1/donor_portal/profile
```
Description: Update donor profile
Headers:
  - Authorization: Bearer {donor_token}
Request Body: {
  name: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+1-555-0123",
  address: {...},
  communication_preferences: {...}
}

Response: {
  data: {
    ...updated profile
  },
  message: "Profile updated successfully"
}
```

### GET /api/v1/donor_portal/donations
```
Description: Get donation history
Headers:
  - Authorization: Bearer {donor_token}
Query Parameters:
  - year (optional, integer) - Filter by year
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)

Response: {
  data: [
    {
      id: "uuid",
      date: "2024-11-01",
      amount: 100.00,
      payment_method: "Visa ending in 4242",
      purpose: "General Fund",
      status: "completed",
      receipt_url: "https://...",
      is_recurring: true,
      subscription_id: "uuid"
    }
  ],
  meta: {
    total: 24,
    page: 1,
    per_page: 50,
    total_pages: 1,
    year_total: 1850.00
  }
}
```

### GET /api/v1/donor_portal/donations/:id/receipt
```
Description: Download donation receipt
Headers:
  - Authorization: Bearer {donor_token}
Path Parameters:
  - id (required, uuid)

Response: PDF file download
```

### GET /api/v1/donor_portal/contribution_statement
```
Description: Generate annual contribution statement
Headers:
  - Authorization: Bearer {donor_token}
Query Parameters:
  - year (required, integer)
  - format (optional, string) - 'pdf' or 'html', default: 'pdf'

Response: PDF file download or HTML content
```

### POST /api/v1/donor_portal/contribution_statement/email
```
Description: Email contribution statement
Headers:
  - Authorization: Bearer {donor_token}
Request Body: {
  year: 2024,
  email: "sarah@example.com" (optional, defaults to profile email)
}

Response: {
  message: "Contribution statement sent to sarah@example.com"
}
```

### GET /api/v1/donor_portal/payment_methods
```
Description: Get saved payment methods
Headers:
  - Authorization: Bearer {donor_token}

Response: {
  data: [
    {
      id: "uuid",
      type: "credit_card",
      last_four: "4242",
      brand: "Visa",
      expiry_month: 12,
      expiry_year: 2025,
      is_default: true,
      created_at: "2023-01-15T10:00:00Z"
    },
    {
      id: "uuid",
      type: "bank_account",
      last_four: "6789",
      brand: "Checking",
      is_default: false,
      created_at: "2023-06-20T14:30:00Z"
    }
  ]
}
```

### POST /api/v1/donor_portal/payment_methods
```
Description: Add new payment method
Headers:
  - Authorization: Bearer {donor_token}
Request Body: {
  type: "credit_card",
  token: "stripe_token_or_payment_method_id",
  set_as_default: false
}

Response: {
  data: {
    id: "uuid",
    ...payment method fields
  },
  message: "Payment method added successfully"
}

Note: Uses Stripe or similar payment processor tokens
```

### DELETE /api/v1/donor_portal/payment_methods/:id
```
Description: Remove payment method
Headers:
  - Authorization: Bearer {donor_token}
Path Parameters:
  - id (required, uuid)

Response: {
  message: "Payment method removed successfully"
}

Note: Cannot remove default if other methods exist
```

### PUT /api/v1/donor_portal/payment_methods/:id/set_default
```
Description: Set default payment method
Headers:
  - Authorization: Bearer {donor_token}
Path Parameters:
  - id (required, uuid)

Response: {
  data: {
    id: "uuid",
    is_default: true
  },
  message: "Default payment method updated"
}
```

### GET /api/v1/donor_portal/recurring_donations
```
Description: Get recurring donations
Headers:
  - Authorization: Bearer {donor_token}

Response: {
  data: [
    {
      id: "uuid",
      amount: 50.00,
      frequency: "monthly",
      payment_method_id: "uuid",
      payment_method: "Visa ending in 4242",
      purpose: "General Fund",
      status: "active",
      start_date: "2023-01-01",
      next_payment_date: "2024-12-01",
      total_donated: 1100.00,
      payment_count: 22
    }
  ]
}
```

### PUT /api/v1/donor_portal/recurring_donations/:id
```
Description: Update recurring donation
Headers:
  - Authorization: Bearer {donor_token}
Path Parameters:
  - id (required, uuid)
Request Body: {
  amount: 75.00,
  payment_method_id: "uuid",
  purpose: "Building Fund"
}

Response: {
  data: {
    ...updated subscription
  },
  message: "Recurring donation updated successfully"
}
```

### POST /api/v1/donor_portal/recurring_donations/:id/pause
```
Description: Pause recurring donation
Headers:
  - Authorization: Bearer {donor_token}
Path Parameters:
  - id (required, uuid)

Response: {
  data: {
    id: "uuid",
    status: "paused"
  },
  message: "Recurring donation paused"
}
```

### POST /api/v1/donor_portal/recurring_donations/:id/resume
```
Description: Resume recurring donation
Headers:
  - Authorization: Bearer {donor_token}
Path Parameters:
  - id (required, uuid)

Response: {
  data: {
    id: "uuid",
    status: "active",
    next_payment_date: "2024-12-01"
  },
  message: "Recurring donation resumed"
}
```

### DELETE /api/v1/donor_portal/recurring_donations/:id
```
Description: Cancel recurring donation
Headers:
  - Authorization: Bearer {donor_token}
Path Parameters:
  - id (required, uuid)

Response: {
  message: "Recurring donation cancelled successfully"
}
```

### POST /api/v1/donor_portal/auth/login
```
Description: Donor authentication (public endpoint)
Request Body: {
  email: "sarah@example.com",
  password: "password"
}

Response: {
  data: {
    token: "jwt_token",
    donor: {
      id: "uuid",
      name: "Sarah Johnson",
      email: "sarah@example.com"
    }
  },
  message: "Login successful"
}
```

### POST /api/v1/donor_portal/auth/forgot_password
```
Description: Request password reset (public endpoint)
Request Body: {
  email: "sarah@example.com"
}

Response: {
  message: "Password reset instructions sent to your email"
}
```

### POST /api/v1/donor_portal/auth/reset_password
```
Description: Reset password (public endpoint)
Request Body: {
  token: "reset_token",
  password: "new_password",
  password_confirmation: "new_password"
}

Response: {
  message: "Password reset successfully"
}
```

## Request/Response Schemas

### DonorProfile Schema
```typescript
interface DonorProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  total_donated: number;
  ytd_donated: number;
  donation_count: number;
  first_donation_date: string;
  last_donation_date: string;
  giving_streak: number;
  communication_preferences: CommunicationPreferences;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

interface CommunicationPreferences {
  email_receipts: boolean;
  email_updates: boolean;
  mail_statements: boolean;
}
```

## Authentication & Authorization

### Required Permissions
- Donor authentication via JWT token
- Each donor can only access their own data
- No role-based access (all authenticated donors have same permissions)

### Security Considerations
- Secure password requirements
- Password reset via email
- Session timeout
- HTTPS required
- Rate limiting on login attempts

## Business Logic & Validations

### Frontend Validations
- Email format validation
- Phone format validation
- Password strength requirements
- Cannot remove last payment method
- Cannot remove default payment method if others exist

### Backend Validations (Rails)
- Donor can only access own data
- Valid payment method tokens
- Cannot cancel recurring donation with pending payment
- Receipt generation requires completed donation
- Statement generation requires valid year

### Business Rules
- Receipts generated automatically for completed donations
- Annual statements available after year-end
- Recurring donations process automatically
- Failed payments trigger email notifications
- Donors can update profile anytime
- Payment methods stored securely (PCI compliant)
- Contribution statements show tax-deductible amounts only

## State Management

### Local State
- `donorProfile` - Donor profile data
- `donations` - Donation history
- `selectedYear` - Year filter for history/statement
- `paymentMethods` - Saved payment methods
- `recurringDonations` - Active subscriptions
- `isAuthenticated` - Authentication status

### Global State
- Authentication token (secure storage)
- Donor session data

## Dependencies

### Internal Dependencies
- Mock data - **TO BE REMOVED** - `getDonorProfile()`
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Payment processor SDK (Stripe, etc.)
- PDF generation library

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load data", retry
2. **Authentication Failed:** Redirect to login
3. **Session Expired:** Show modal "Session expired, please login again"
4. **Payment Failed:** Show error with details
5. **Receipt Not Found:** Show error "Receipt unavailable"
6. **Cannot Remove Payment:** Show error "Cannot remove default payment method"

## Loading States
- **Initial load:** Skeleton cards and table
- **Donation history:** Loading spinner
- **Receipt download:** Download progress
- **Statement generation:** "Generating statement..." message
- **Payment method actions:** Disable buttons, show spinner

## Mock Data to Remove
- `DonorPortal.tsx` - `MOCK_DONOR_EMAIL`, `MOCK_DONOR_NAME`
- `DonorPortal.tsx` - `getDonorProfile()` call
- Move interfaces to `src/types/donor-portal.ts`

## Migration Notes

### Phase 1: Authentication
1. Implement donor authentication system
2. Create JWT token management
3. Implement login/logout flows
4. Implement password reset

### Phase 2: Profile & History
1. Create `src/api/donor-portal.ts`
2. Implement profile viewing/editing
3. Implement donation history
4. Test data isolation (donors see only their data)

### Phase 3: Documents
1. Implement receipt downloads
2. Implement contribution statement generation
3. Test PDF generation
4. Implement email delivery

### Phase 4: Payment Management
1. Integrate payment processor (Stripe)
2. Implement payment method CRUD
3. Implement recurring donation management
4. Test PCI compliance

## Related Documentation
- [01-DONORS-CRM.md](./01-DONORS-CRM.md) - Internal donor management
- [02-DONATIONS-MANAGER.md](./02-DONATIONS-MANAGER.md) - Donation tracking
- [03-DONOR-PAGE-BUILDER.md](./03-DONOR-PAGE-BUILDER.md) - Custom donation pages
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Donor and donation data models
