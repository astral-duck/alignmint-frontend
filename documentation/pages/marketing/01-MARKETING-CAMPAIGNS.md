# Marketing Campaigns

**Component File:** `src/components/MarketingCampaigns.tsx`  
**Route:** `/marketing` (with tool='campaigns')  
**Access Level:** Admin, Manager

## Overview
The Marketing Campaigns manager enables organizations to create, send, and track email marketing campaigns. It includes email template management, recipient list building, campaign scheduling, and analytics tracking (open rates, click rates). Users can segment audiences, personalize messages, and measure campaign effectiveness.

## UI Features

### Main Features
- **Campaign List View:**
  - Table of all campaigns
  - Filter by status (Draft, Scheduled, Sent)
  - Search by name or subject
  - Quick actions menu
- **Create Campaign:**
  - Campaign name
  - Email subject line
  - Recipient selection (segments)
  - Email template selection
  - Email composer (rich text)
  - Preview mode
  - Schedule or send immediately
- **Campaign Analytics:**
  - Open rate
  - Click rate
  - Bounce rate
  - Unsubscribe rate
  - Recipient list
  - Link click tracking
- **Email Templates:**
  - Pre-built templates
  - Custom templates
  - Template editor
  - Variable placeholders

### Campaign Table Columns
- Campaign Name
- Subject Line
- Recipients (count)
- Status Badge (Draft, Scheduled, Sent)
- Sent/Scheduled Date
- Open Rate (%)
- Click Rate (%)
- Actions dropdown

### Create Campaign Form
- **Campaign Details:**
  - Name (internal)
  - Subject line
  - Preview text
  - From name
  - Reply-to email
- **Recipients:**
  - All Donors
  - All Volunteers
  - Active Donors (donated in last 12 months)
  - Major Donors (>$1000 lifetime)
  - Custom segment
  - Individual selection
- **Email Content:**
  - Template selection
  - Rich text editor
  - Image upload
  - Personalization tokens ({{first_name}}, {{last_donation}}, etc.)
  - Preview button
- **Scheduling:**
  - Send now
  - Schedule for later (date/time picker)
  - Time zone selection

### Campaign Analytics View
- **Summary Cards:**
  - Total Sent
  - Opened (count and %)
  - Clicked (count and %)
  - Bounced (count and %)
- **Recipient Table:**
  - Name
  - Email
  - Status (Sent, Opened, Clicked, Bounced)
  - Open time
  - Click count
- **Link Performance:**
  - URL
  - Click count
  - Unique clicks

## Data Requirements

### Campaign Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **name** (string) - Campaign name (internal)
- **subject** (string) - Email subject line
- **preview_text** (string, nullable) - Preview text
- **from_name** (string) - Sender name
- **reply_to** (string) - Reply-to email
- **recipients_segment** (string) - Recipient segment type
- **recipient_count** (integer) - Number of recipients
- **email_template_id** (uuid, nullable) - Template used
- **email_content** (text) - Email HTML content
- **status** (string) - 'draft', 'scheduled', 'sending', 'sent'
- **scheduled_at** (datetime, nullable) - When scheduled to send
- **sent_at** (datetime, nullable) - When sent
- **total_sent** (integer) - Total emails sent
- **total_opened** (integer) - Total opens
- **total_clicked** (integer) - Total clicks
- **total_bounced** (integer) - Total bounces
- **total_unsubscribed** (integer) - Total unsubscribes
- **open_rate** (decimal) - Open rate percentage
- **click_rate** (decimal) - Click rate percentage
- **created_by_id** (uuid) - User who created
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Campaign Recipient Data
- **id** (uuid) - Unique identifier
- **campaign_id** (uuid) - Campaign reference
- **recipient_type** (string) - 'donor', 'volunteer', 'contact'
- **recipient_id** (uuid) - Donor/volunteer/contact ID
- **email** (string) - Email address
- **status** (string) - 'sent', 'opened', 'clicked', 'bounced', 'unsubscribed'
- **sent_at** (datetime) - When sent
- **opened_at** (datetime, nullable) - First open time
- **open_count** (integer) - Number of opens
- **click_count** (integer) - Number of clicks
- **bounced_at** (datetime, nullable) - When bounced
- **bounce_reason** (string, nullable) - Bounce reason

### Email Template Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **name** (string) - Template name
- **description** (text, nullable) - Template description
- **html_content** (text) - HTML template
- **thumbnail_url** (string, nullable) - Preview image
- **is_system** (boolean) - System template vs custom
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Campaign:** Create new campaign
- **Update Campaign:** Edit draft campaign
- **Delete Campaign:** Delete draft campaign
- **Send Campaign:** Send campaign immediately
- **Schedule Campaign:** Schedule campaign for later
- **Cancel Scheduled:** Cancel scheduled campaign
- **Create Template:** Create email template
- **Update Template:** Edit email template
- **Delete Template:** Delete custom template

## API Endpoints Required

### GET /api/v1/campaigns
```
Description: Fetch campaigns
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, string) - 'draft', 'scheduled', 'sent', 'all'
  - search (optional, string) - Search name or subject
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 25)
  - sort_by (optional, string, default: 'created_desc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      name: "Year-End Appeal 2024",
      subject: "Make a Difference This Year",
      recipients_segment: "all_donors",
      recipient_count: 245,
      status: "sent",
      sent_at: "2024-11-01T10:00:00Z",
      total_sent: 245,
      total_opened: 167,
      total_clicked: 59,
      open_rate: 68.16,
      click_rate: 24.08,
      created_by: "Jane Smith",
      created_at: "2024-10-25T14:30:00Z"
    }
  ],
  meta: {
    total: 24,
    page: 1,
    per_page: 25,
    total_pages: 1
  }
}
```

### GET /api/v1/campaigns/:id
```
Description: Get campaign details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all campaign fields,
    email_content: "<html>...</html>",
    recipients: [
      {
        id: "uuid",
        email: "john@example.com",
        status: "opened",
        opened_at: "2024-11-01T11:30:00Z",
        open_count: 2,
        click_count: 1
      }
    ],
    link_performance: [
      {
        url: "https://donate.example.com",
        click_count: 45,
        unique_clicks: 38
      }
    ]
  }
}
```

### POST /api/v1/campaigns
```
Description: Create new campaign
Request Body: {
  organization_id: "uuid",
  name: "Year-End Appeal 2024",
  subject: "Make a Difference This Year",
  preview_text: "Your support changes lives",
  from_name: "Awakenings Team",
  reply_to: "info@awakenings.org",
  recipients_segment: "all_donors",
  email_template_id: "uuid",
  email_content: "<html>...</html>",
  status: "draft"
}

Response: {
  data: {
    id: "uuid",
    ...all campaign fields,
    recipient_count: 245
  },
  message: "Campaign created successfully"
}
```

### PUT /api/v1/campaigns/:id
```
Description: Update campaign (draft only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  name: "Updated Name",
  subject: "Updated Subject",
  ...other fields
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Campaign updated successfully"
}

Note: Can only update draft campaigns
```

### DELETE /api/v1/campaigns/:id
```
Description: Delete campaign (draft only)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Campaign deleted successfully"
}
```

### POST /api/v1/campaigns/:id/send
```
Description: Send campaign immediately
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid"
}

Response: {
  data: {
    id: "uuid",
    status: "sending",
    sent_at: "2024-11-08T15:00:00Z",
    total_sent: 245
  },
  message: "Campaign is being sent"
}

Note: Async processing, status updates to 'sent' when complete
```

### POST /api/v1/campaigns/:id/schedule
```
Description: Schedule campaign for later
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  scheduled_at: "2024-11-15T10:00:00Z",
  timezone: "America/Los_Angeles"
}

Response: {
  data: {
    id: "uuid",
    status: "scheduled",
    scheduled_at: "2024-11-15T10:00:00Z"
  },
  message: "Campaign scheduled successfully"
}
```

### POST /api/v1/campaigns/:id/cancel_schedule
```
Description: Cancel scheduled campaign
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid"
}

Response: {
  data: {
    id: "uuid",
    status: "draft",
    scheduled_at: null
  },
  message: "Campaign schedule cancelled"
}
```

### POST /api/v1/campaigns/:id/test_send
```
Description: Send test email
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  test_emails: ["test@example.com", "admin@example.com"]
}

Response: {
  message: "Test email sent to 2 recipients"
}
```

### GET /api/v1/campaigns/recipient_count
```
Description: Get recipient count for segment
Query Parameters:
  - organization_id (required, uuid)
  - segment (required, string) - Segment type

Response: {
  data: {
    segment: "all_donors",
    count: 245,
    preview: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" }
    ]
  }
}
```

### GET /api/v1/email_templates
```
Description: Get email templates
Query Parameters:
  - organization_id (required, uuid)
  - include_system (optional, boolean, default: true)

Response: {
  data: [
    {
      id: "uuid",
      name: "Donation Appeal",
      description: "Standard donation appeal template",
      thumbnail_url: "https://...",
      is_system: true
    },
    {
      id: "uuid",
      name: "Custom Newsletter",
      description: "Monthly newsletter",
      thumbnail_url: "https://...",
      is_system: false
    }
  ]
}
```

### POST /api/v1/email_templates
```
Description: Create email template
Request Body: {
  organization_id: "uuid",
  name: "Custom Template",
  description: "My custom template",
  html_content: "<html>...</html>"
}

Response: {
  data: {
    id: "uuid",
    ...template fields
  },
  message: "Template created successfully"
}
```

## Request/Response Schemas

### Campaign Schema
```typescript
interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  subject: string;
  preview_text?: string;
  from_name: string;
  reply_to: string;
  recipients_segment: string;
  recipient_count: number;
  email_template_id?: string;
  email_content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduled_at?: string;
  sent_at?: string;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  total_unsubscribed: number;
  open_rate: number;
  click_rate: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

## Authentication & Authorization

### Required Permissions
- `campaigns:read` - View campaigns
- `campaigns:write` - Create and edit campaigns
- `campaigns:delete` - Delete campaigns
- `campaigns:send` - Send campaigns

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can create, edit, send campaigns
- **Staff:** Can view campaigns only
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Campaign name required
- Subject line required (max 150 chars)
- From name required
- Reply-to email required and valid format
- At least one recipient required
- Email content required
- Scheduled date must be in future

### Backend Validations (Rails)
- Valid email addresses
- Recipient segment must exist
- Cannot edit/delete sent campaigns
- Cannot send campaign with no recipients
- Scheduled time must be at least 15 minutes in future
- Email content must be valid HTML
- Rate limiting on sends

### Business Rules
- Draft campaigns can be edited
- Sent campaigns are immutable
- Scheduled campaigns can be cancelled
- Email tracking via pixel and link wrapping
- Unsubscribe link required in all emails
- Bounce handling and list cleaning
- Personalization tokens replaced at send time
- Analytics updated in real-time
- Failed sends retried automatically

## State Management

### Local State
- `campaigns` - List of campaigns
- `selectedCampaign` - Currently viewing/editing
- `createCampaignOpen` - Create dialog state
- `emailContent` - Email editor content
- `selectedTemplate` - Selected email template
- `recipientSegment` - Selected recipient segment
- `recipientCount` - Calculated recipient count

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `mockCampaigns`, `emailTemplates`
- UI components (Card, Button, Table, Dialog, etc.)
- Rich text editor component

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Rich text editor (TipTap, Quill, etc.)
- Email service provider SDK (SendGrid, Mailgun, etc.)

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load campaigns", retry
2. **Validation Error:** Show inline field errors
3. **Send Failed:** Show error "Failed to send campaign"
4. **No Recipients:** Show error "No recipients match this segment"
5. **Cannot Edit:** Show error "Cannot edit sent campaigns"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Campaign creation:** Loading spinner
- **Sending:** Progress indicator with "Sending to 245 recipients..."
- **Analytics:** Loading spinner while fetching stats

## Mock Data to Remove
- `MarketingCampaigns.tsx` - `mockCampaigns` array
- `emailTemplates.ts` - Mock email templates
- Move interfaces to `src/types/campaign.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/campaigns.ts`
2. Create `src/types/campaign.ts`
3. Implement campaign list
4. Implement create/edit campaign

### Phase 2: Email Service
1. Choose email service provider (SendGrid, Mailgun, etc.)
2. Integrate email sending API
3. Implement email tracking
4. Test deliverability

### Phase 3: Templates
1. Implement template management
2. Create default templates
3. Implement template editor
4. Test personalization tokens

### Phase 4: Analytics
1. Implement open tracking
2. Implement click tracking
3. Implement bounce handling
4. Create analytics dashboard

## Related Documentation
- [02-PROSPECTS-LIST.md](./02-PROSPECTS-LIST.md) - Prospect management
- [../donor-hub/01-DONORS-CRM.md](../donor-hub/01-DONORS-CRM.md) - Donor segments
- [../personnel/02-VOLUNTEERS-CRM.md](../personnel/02-VOLUNTEERS-CRM.md) - Volunteer segments
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Campaign data model
