# Prospects List

**Component File:** `src/components/ProspectsList.tsx`  
**Route:** `/marketing` (with tool='prospects')  
**Access Level:** Admin, Manager, Marketing Staff

## Overview
The Prospects List component manages potential donors and leads for fundraising campaigns. It provides tools for adding prospects manually, importing from CSV files, exporting prospect data, sending bulk emails, and tracking prospect sources. This is a critical tool for donor cultivation and lead management before prospects become active donors.

## UI Features

### Main Features
- **Header Actions:**
  - Back to Marketing Hub button
  - Search prospects
  - Add Prospect button
  - Upload CSV button
  - Export CSV button
  - Send Email (bulk) button
- **Prospects Table:**
  - Checkbox for selection
  - Name
  - Email
  - Phone
  - Source (how they were added)
  - Added Date
  - Notes
  - Actions (Delete)
- **Add Prospect Dialog:**
  - Name input
  - Email input
  - Phone input
  - Source input
  - Notes textarea
  - Add button
- **CSV Upload Dialog:**
  - File upload input
  - Format instructions
  - Upload button
- **Bulk Actions:**
  - Select all checkbox
  - Delete selected
  - Send email to selected

### Prospects Table Layout
```
Prospects List
Track and manage potential donors

[Search...]  [+ Add Prospect]  [📤 Upload CSV]  [📥 Export]  [✉️ Send Email]

☐ | Name           | Email                    | Phone          | Source      | Added      | Notes
--|----------------|--------------------------|----------------|-------------|------------|-------
☐ | John Smith     | john@example.com         | (555) 123-4567 | Website     | 2025-10-15 | Met at event
☐ | Jane Doe       | jane@example.com         | (555) 234-5678 | Referral    | 2025-10-16 | Friend of donor
☐ | Bob Johnson    | bob@example.com          | (555) 345-6789 | CSV Import  | 2025-10-17 | -
```

### Add Prospect Dialog
```
┌─────────────────────────────────────────┐
│ Add New Prospect                        │
├─────────────────────────────────────────┤
│                                         │
│ Name *                                  │
│ [                                    ]  │
│                                         │
│ Email *                                 │
│ [                                    ]  │
│                                         │
│ Phone                                   │
│ [                                    ]  │
│                                         │
│ Source                                  │
│ [Manual                              ]  │
│                                         │
│ Notes                                   │
│ [                                    ]  │
│ [                                    ]  │
│                                         │
│ [Cancel]                    [Add Prospect] │
└─────────────────────────────────────────┘
```

### CSV Upload Dialog
```
┌─────────────────────────────────────────┐
│ Upload Prospects from CSV               │
├─────────────────────────────────────────┤
│                                         │
│ CSV Format Requirements:                │
│ • Must include "name" and "email" columns│
│ • Optional: phone, source, notes        │
│ • First row should be headers           │
│                                         │
│ Example:                                │
│ name,email,phone,source,notes           │
│ John Doe,john@...,555-1234,Web,Note     │
│                                         │
│ [Choose File]                           │
│                                         │
│ [Cancel]                       [Upload] │
└─────────────────────────────────────────┘
```

## Data Requirements

### Prospect
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization
- **name** (string) - Prospect name
- **email** (string) - Email address
- **phone** (string, nullable) - Phone number
- **source** (string) - How added (Manual, CSV Import, Website, Referral, Event, etc.)
- **added_date** (date) - When added
- **notes** (string, nullable) - Additional notes
- **status** (enum, nullable) - 'new', 'contacted', 'interested', 'converted', 'not_interested'
- **converted_to_donor_id** (uuid, nullable) - If converted to donor
- **last_contact_date** (date, nullable) - Last contact
- **created_by** (uuid) - User who added

## API Endpoints Required

### GET /api/v1/prospects
```
Description: Get all prospects
Query Parameters:
  - organization_id (required, uuid)
  - search (optional, string) - Search name or email
  - source (optional, string) - Filter by source
  - status (optional, enum) - Filter by status
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      source: "Website",
      added_date: "2025-10-15",
      notes: "Met at fundraising event",
      status: "new",
      created_by: "uuid"
    }
  ],
  meta: {
    total: 150,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/prospects
```
Description: Add a new prospect
Request Body: {
  organization_id: "uuid",
  name: "John Smith",
  email: "john@example.com",
  phone: "(555) 123-4567",
  source: "Manual",
  notes: "Met at fundraising event"
}

Response: {
  data: {
    id: "uuid",
    organization_id: "uuid",
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    source: "Manual",
    added_date: "2025-10-20",
    status: "new"
  },
  message: "Prospect added successfully"
}
```

### POST /api/v1/prospects/bulk_import
```
Description: Import prospects from CSV
Request Body: {
  organization_id: "uuid",
  prospects: [
    {
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      source: "CSV Import",
      notes: ""
    },
    ...
  ]
}

Response: {
  data: {
    imported: 45,
    duplicates: 3,
    errors: 2
  },
  message: "45 prospects imported successfully"
}
```

### DELETE /api/v1/prospects/:id
```
Description: Delete a prospect
Response: {
  message: "Prospect deleted successfully"
}
```

### POST /api/v1/prospects/bulk_delete
```
Description: Delete multiple prospects
Request Body: {
  prospect_ids: ["uuid1", "uuid2", "uuid3"]
}

Response: {
  data: {
    deleted: 3
  },
  message: "3 prospects deleted"
}
```

### GET /api/v1/prospects/export
```
Description: Export prospects to CSV
Query Parameters:
  - organization_id (required, uuid)
  - format (optional, enum) - 'csv', 'xlsx'

Response: {
  data: {
    download_url: "https://...",
    filename: "prospects-2025-10-20.csv",
    expires_at: "2025-10-20T18:00:00Z"
  }
}
```

### POST /api/v1/prospects/send_email
```
Description: Send bulk email to selected prospects
Request Body: {
  prospect_ids: ["uuid1", "uuid2", "uuid3"],
  subject: "Join Our Mission",
  message: "Dear [Name], We'd love to have you...",
  from_name: "Development Team",
  from_email: "development@nonprofit.org"
}

Response: {
  data: {
    sent: 3,
    failed: 0
  },
  message: "Email sent to 3 prospects"
}
```

### PATCH /api/v1/prospects/:id/convert_to_donor
```
Description: Convert prospect to donor
Response: {
  data: {
    donor_id: "uuid",
    prospect_id: "uuid"
  },
  message: "Prospect converted to donor"
}
```

## Request/Response Schemas

```typescript
interface Prospect {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  added_date: string;
  notes?: string;
  status?: 'new' | 'contacted' | 'interested' | 'converted' | 'not_interested';
  converted_to_donor_id?: string;
  last_contact_date?: string;
  created_by: string;
}

interface ProspectFormData {
  name: string;
  email: string;
  phone?: string;
  source?: string;
  notes?: string;
}
```

## Authentication & Authorization

### Required Permissions
- `prospects:read` - View prospects
- `prospects:create` - Add prospects
- `prospects:update` - Edit prospects
- `prospects:delete` - Delete prospects
- `prospects:email` - Send emails to prospects

### Role-Based Access
- **Fiscal Sponsor:** View prospects across all nonprofits
- **Nonprofit User:** View and manage their nonprofit's prospects
- **Marketing Staff:** Full access to prospects
- **Donor/Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Name required
- Email required and valid format
- Phone format validation (optional)
- Email uniqueness check
- CSV format validation
- File size limit (5MB)

### Backend Validations (Rails)
- Valid organization access
- Email format validation
- Duplicate email check (within organization)
- CSV parsing validation
- Bulk operation limits (max 1000 at once)
- Email sending rate limits

### Business Rules
- Prospects are organization-specific
- Email must be unique within organization
- CSV import skips duplicates
- Deleted prospects cannot be recovered
- Converting to donor creates donor record
- Email templates support merge fields ([Name], [Email])
- Source tracked for analytics
- Bulk operations have confirmation

## State Management

### Local State
- `selectedProspects` - Array of selected IDs
- `searchQuery` - Search filter text
- `showAddDialog` - Add dialog visibility
- `showUploadDialog` - Upload dialog visibility
- `newProspect` - Form data for new prospect

### Global State (AppContext)
- `prospects` - Array of prospects
- `addProspect` - Function to add prospect
- `deleteProspect` - Function to delete prospect

## Dependencies

### Internal Dependencies
- `AppContext` - Global state and prospects management
- UI components (Card, Button, Table, Dialog, Input, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load prospects"
2. **Invalid Email:** Show error "Invalid email format"
3. **Duplicate Email:** Show toast "Prospect with this email already exists"
4. **CSV Error:** Show toast "Invalid CSV format"
5. **Upload Failed:** Show toast "Failed to import prospects"
6. **Email Failed:** Show toast "Failed to send emails"
7. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Search:** Instant filtering (client-side)
- **Add:** Button loading state
- **Upload:** Progress indicator
- **Export:** Download preparation
- **Email:** Sending progress

## Mock Data to Remove
- `AppContext.tsx` - `prospects` array (move to API)
- `ProspectsList.tsx` - Local prospect management (use API)
- Move interfaces to `src/types/prospects.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/prospects.ts`
2. Create `src/types/prospects.ts`
3. Implement CRUD endpoints
4. Test import/export

### Phase 2: Email Integration
1. Integrate with email service (SendGrid, Mailgun)
2. Implement email templates
3. Add merge field support
4. Test bulk sending

### Phase 3: Conversion Tracking
1. Implement prospect-to-donor conversion
2. Track conversion rates
3. Add conversion analytics
4. Link to Donor CRM

### Phase 4: Advanced Features
1. Add status tracking workflow
2. Implement contact history
3. Add tags/categories
4. Implement automated follow-ups

## Related Documentation
- [01-MARKETING-CAMPAIGNS.md](./01-MARKETING-CAMPAIGNS.md)
- [../donor-hub/01-DONORS-CRM.md](../donor-hub/01-DONORS-CRM.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### CSV Import Format
**Required columns:**
- name
- email

**Optional columns:**
- phone
- source
- notes

**Example CSV:**
```csv
name,email,phone,source,notes
John Smith,john@example.com,(555) 123-4567,Website,Met at event
Jane Doe,jane@example.com,(555) 234-5678,Referral,Friend of donor
```

### Prospect Sources
Common sources tracked:
- Manual (added by staff)
- CSV Import
- Website Form
- Referral
- Event
- Social Media
- Direct Mail
- Phone Call
- Other

### Email Merge Fields
Supported merge fields in email templates:
- `[Name]` - Prospect name
- `[Email]` - Prospect email
- `[Phone]` - Prospect phone
- `[Organization]` - Nonprofit name
- `[Date]` - Current date

### Conversion Workflow
1. **Prospect Added:** New lead entered
2. **Contact:** Initial outreach
3. **Interested:** Positive response
4. **Convert:** Makes first donation
5. **Donor Created:** Moved to Donor CRM

### Integration Points
- **Donor CRM:** Converted prospects become donors
- **Marketing Campaigns:** Prospects can be campaign targets
- **Email System:** Bulk email capabilities
- **Analytics:** Track conversion rates and sources

### Best Practices
- Regular cleanup of old prospects
- Track source for ROI analysis
- Follow up within 48 hours
- Personalize outreach
- Respect opt-out requests
- Maintain data privacy
- Regular exports for backup
