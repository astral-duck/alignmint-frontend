# Donors CRM

**Component File:** `src/components/DonorsCRM.tsx`  
**Route:** `/donor-hub` (with tool='donors')  
**Access Level:** Admin, Manager, Staff

## Overview
The Donors CRM is a comprehensive donor management system that allows users to view, search, filter, and manage donor information. It provides both a list view of all donors and detailed individual donor profiles with complete donation history.

## UI Features

### List View
- **Search:** Search donors by name or email
- **Sort Options:**
  - Name (A-Z, Z-A)
  - Total donations (High to Low, Low to High)
  - Last donation date (Newest, Oldest)
- **Filters:**
  - Donation type (All, One-time, Recurring, Both, Event Attended)
- **Actions:**
  - Add new donor
  - View donor profile
  - Edit donor (from profile)
  - Send message to donor

### Profile View
- **Donor Information Card:**
  - Name, email, phone, address
  - Avatar with initials
  - Edit button
- **Donation Summary:**
  - Total lifetime donations
  - Number of donations
  - Average donation amount
  - First donation date
  - Last donation date
  - Donation type (One-time, Recurring, Both)
- **Donation History Table:**
  - Date, amount, type, cause, payment method
  - Status badges (Completed, Pending, Failed, Refunded)
  - Refund functionality
- **Donor Insights:**
  - Donation frequency
  - Preferred payment method
  - Preferred causes/campaigns
- **Communication History:
  - Emails sent
  - Thank you notes
  - Receipts

## Data Requirements

### Donor List Data
- **id** (uuid) - Unique identifier
- **first_name** (string) - Donor first name
- **last_name** (string) - Donor last name
- **email** (string) - Email address
- **phone** (string, nullable) - Phone number
- **address** (object, nullable) - Full address
- **donor_type** (string) - 'individual', 'organization', 'foundation'
- **status** (string) - 'active', 'inactive', 'lapsed'
- **total_donated** (decimal) - Lifetime donation total
- **donation_count** (integer) - Number of donations
- **first_donation_date** (date) - Date of first donation
- **last_donation_date** (date) - Date of last donation
- **donation_type** (string) - 'one-time', 'recurring', 'both'
- **tags** (array) - Donor tags/categories
- **created_at** (datetime) - When donor was added

### Donor Profile Data
All of the above, plus:
- **donation_history** (array) - Complete donation records
- **communication_history** (array) - Email/message history
- **notes** (text) - Internal notes about donor
- **preferred_payment_method** (string) - Most used payment method
- **preferred_causes** (array) - Most donated to causes

### Data Mutations
- **Create Donor:** Add new donor to system
- **Update Donor:** Edit donor information
- **Delete Donor:** Soft delete (mark as inactive)
- **Add Note:** Add internal note to donor profile
- **Send Message:** Send email to donor
- **Process Refund:** Refund a donation

## API Endpoints Required

### GET /api/v1/donors
```
Description: Fetch list of donors for an organization
Query Parameters:
  - organization_id (required, uuid)
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 25)
  - search (optional, string) - Search by name or email
  - sort_by (optional, string) - 'name_asc', 'name_desc', 'amount_high', 'amount_low', 'date_newest', 'date_oldest'
  - donation_type (optional, string) - 'one-time', 'recurring', 'both', 'all'
  - status (optional, string) - 'active', 'inactive', 'lapsed', 'all'
  - tags (optional, array) - Filter by tags

Response: {
  data: [
    {
      id: "uuid",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: {
        line1: "123 Main St",
        line2: "Apt 4",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        country: "US"
      },
      donor_type: "individual",
      status: "active",
      total_donated: 5000.00,
      donation_count: 15,
      first_donation_date: "2023-01-15",
      last_donation_date: "2024-11-01",
      donation_type: "both",
      tags: ["major_donor", "monthly_supporter"],
      created_at: "2023-01-15T10:30:00Z",
      updated_at: "2024-11-01T14:20:00Z"
    }
  ],
  meta: {
    total: 2847,
    page: 1,
    per_page: 25,
    total_pages: 114
  }
}
```

### GET /api/v1/donors/:id
```
Description: Fetch detailed donor profile
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)
  - include_donations (optional, boolean, default: true)
  - include_communications (optional, boolean, default: true)

Response: {
  data: {
    id: "uuid",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: {...},
    donor_type: "individual",
    status: "active",
    total_donated: 5000.00,
    donation_count: 15,
    average_donation: 333.33,
    first_donation_date: "2023-01-15",
    last_donation_date: "2024-11-01",
    donation_type: "both",
    tags: ["major_donor", "monthly_supporter"],
    notes: "Prefers email communication",
    preferred_payment_method: "credit_card",
    preferred_causes: ["Education", "Youth Programs"],
    donation_history: [
      {
        id: "uuid",
        amount: 100.00,
        donation_date: "2024-11-01",
        donation_type: "recurring",
        payment_method: "credit_card",
        payment_status: "completed",
        fund_name: "General Fund",
        campaign_name: "Fall Campaign",
        designation: "Youth Programs",
        transaction_id: "ch_abc123"
      }
    ],
    communication_history: [
      {
        id: "uuid",
        type: "email",
        subject: "Thank you for your donation",
        sent_at: "2024-11-01T15:30:00Z",
        status: "delivered"
      }
    ],
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2024-11-01T14:20:00Z"
  }
}
```

### POST /api/v1/donors
```
Description: Create new donor
Request Body: {
  organization_id: "uuid",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address: {
    line1: "123 Main St",
    line2: "Apt 4",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    country: "US"
  },
  donor_type: "individual",
  tags: ["new_donor"],
  notes: "Met at fundraising event"
}

Response: {
  data: {
    id: "uuid",
    ...all donor fields
  },
  message: "Donor created successfully"
}
```

### PUT /api/v1/donors/:id
```
Description: Update existing donor
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address: {...},
  tags: ["major_donor", "monthly_supporter"],
  notes: "Updated notes",
  status: "active"
}

Response: {
  data: {
    id: "uuid",
    ...updated donor fields
  },
  message: "Donor updated successfully"
}
```

### DELETE /api/v1/donors/:id
```
Description: Soft delete donor (mark as inactive)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Donor deleted successfully"
}
```

### POST /api/v1/donors/:id/notes
```
Description: Add note to donor profile
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  note: "Called donor to thank them for recent donation"
}

Response: {
  data: {
    id: "uuid",
    note: "...",
    created_by: "User Name",
    created_at: "2024-11-08T10:30:00Z"
  }
}
```

### POST /api/v1/donors/:id/send_message
```
Description: Send email to donor
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  subject: "Thank you for your support",
  message: "Dear John, ...",
  template_id: "uuid" (optional)
}

Response: {
  message: "Email sent successfully",
  data: {
    id: "uuid",
    status: "sent"
  }
}
```

### POST /api/v1/donations/:id/refund
```
Description: Process refund for a donation
Path Parameters:
  - id (required, uuid) - Donation ID
Request Body: {
  organization_id: "uuid",
  reason: "Donor requested refund",
  amount: 100.00 (optional, defaults to full amount),
  notify_donor: true
}

Response: {
  data: {
    id: "uuid",
    refund_id: "uuid",
    amount: 100.00,
    status: "refunded",
    refunded_at: "2024-11-08T10:30:00Z"
  },
  message: "Refund processed successfully"
}
```

## Request/Response Schemas

### Donor Schema
```typescript
interface Donor {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  donor_type: 'individual' | 'organization' | 'foundation';
  status: 'active' | 'inactive' | 'lapsed';
  total_donated: number;
  donation_count: number;
  average_donation?: number;
  first_donation_date?: string;
  last_donation_date?: string;
  donation_type: 'one-time' | 'recurring' | 'both';
  tags: string[];
  notes?: string;
  preferred_payment_method?: string;
  preferred_causes?: string[];
  created_at: string;
  updated_at: string;
}

interface DonationHistoryItem {
  id: string;
  amount: number;
  donation_date: string;
  donation_type: 'one-time' | 'recurring' | 'pledge';
  payment_method: string;
  payment_status: 'completed' | 'pending' | 'failed' | 'refunded';
  fund_name?: string;
  campaign_name?: string;
  designation?: string;
  transaction_id?: string;
  refunded_at?: string;
  refund_reason?: string;
}

interface CommunicationHistoryItem {
  id: string;
  type: 'email' | 'phone' | 'mail' | 'in_person';
  subject?: string;
  message?: string;
  sent_at: string;
  status: 'sent' | 'delivered' | 'opened' | 'failed';
}
```

## Authentication & Authorization

### Required Permissions
- `donors:read` - View donor list and profiles
- `donors:write` - Create and update donors
- `donors:delete` - Delete donors
- `donations:refund` - Process refunds

### Role-Based Access
- **Admin:** Full access to all donor data and actions
- **Manager:** Can view, create, update donors; can process refunds
- **Staff:** Can view and update donors; cannot delete or refund
- **Volunteer:** No access to donor CRM

## Business Logic & Validations

### Frontend Validations
- Email must be valid format
- Phone must be valid format (if provided)
- At least one of email or phone required
- First name and last name required
- Organization must be selected (if user has access to multiple)
- Refund amount cannot exceed original donation amount

### Backend Validations (Rails)
- Email uniqueness within organization
- Valid email format
- Valid phone format
- Donor type must be one of allowed values
- Status must be one of allowed values
- Total donated must be non-negative
- Donation count must be non-negative
- Tags must be array of strings

### Business Rules
- Donors are organization-specific (multi-tenant isolation)
- Deleting a donor is soft delete (status = 'inactive')
- Donor's total_donated and donation_count are calculated fields, updated via database triggers or background jobs
- Refunds create negative donation entries
- Lapsed donors: No donation in past 12 months
- Major donors: Total donated > $10,000 (configurable)

## State Management

### Local State
- `view` - 'list' or 'profile'
- `searchQuery` - Search input value
- `sortBy` - Current sort option
- `donationTypeFilter` - Current filter
- `addDonorOpen` - Dialog state
- `refundDialogOpen` - Refund dialog state
- `selectedDonationForRefund` - Selected donation ID
- `refundReason` - Refund reason text
- `newDonor` - Form state for adding donor

### Global State (AppContext)
- `selectedEntity` - Current organization
- `selectedDonor` - Currently selected donor (for profile view)
- `setSelectedDonor` - Function to set selected donor

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- `mockData.ts` - **TO BE REMOVED** - Currently provides donor data
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show error toast "Unable to load donors. Please check your connection.", allow retry
2. **Validation Error:** Show field-level errors inline
3. **Permission Error:** Show toast "You don't have permission to perform this action"
4. **Not Found:** Show "Donor not found" message
5. **Refund Failed:** Show toast "Refund failed: [reason]"
6. **Email Send Failed:** Show toast "Failed to send email to donor"

## Loading States
- **Initial load:** Show skeleton table with 10 rows
- **Pagination:** Show loading spinner in table
- **Profile load:** Show skeleton cards
- **Form submission:** Disable submit button, show spinner
- **Refund processing:** Disable refund button, show spinner

## Mock Data to Remove
- `mockData.ts` - `getDonorProfile()` function
- `mockData.ts` - `getAllDonors()` function
- `mockData.ts` - `DonorProfile` interface (move to types file)

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/donors.ts` with all donor API calls
2. Create `src/types/donor.ts` with TypeScript interfaces
3. Replace `getAllDonors()` with API call in useEffect
4. Add loading and error states

### Phase 2: Profile Integration
1. Replace `getDonorProfile()` with API call
2. Fetch donation history from API
3. Fetch communication history from API

### Phase 3: Mutations
1. Implement create donor API call
2. Implement update donor API call
3. Implement delete donor API call
4. Implement refund API call
5. Implement send message API call

### Phase 4: Real-time Updates
1. Consider WebSocket for real-time donation updates
2. Or implement polling for new donations
3. Update donor totals when new donations come in

## Related Documentation
- [02-DONATIONS-MANAGER.md](./02-DONATIONS-MANAGER.md) - Related donation management
- [03-DONOR-PORTAL.md](./03-DONOR-PORTAL.md) - Public-facing donor portal
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Donor data model
