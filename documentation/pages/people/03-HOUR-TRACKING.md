# Hour Tracking

**Component File:** `src/components/HourTracking.tsx`  
**Route:** `/personnel-hub` (with tool='hours')  
**Access Level:** All authenticated users (Staff, Volunteers)

## Overview
The Hour Tracking system allows staff and volunteers to log their work hours, submit time entries for approval, and track their total hours contributed. Managers can approve or reject hour submissions, and the system integrates with personnel and volunteer records for comprehensive hour reporting.

## UI Features

### Main Features
- **Hour Entry Form:**
  - Date picker
  - Hours worked (decimal input)
  - Activity/task description
  - Organization/nonprofit selection
  - Notes field
  - Submit button
- **Hour Log Table:**
  - Date
  - Hours
  - Activity
  - Organization
  - Status Badge (Pending, Approved, Rejected)
  - Submitted date
  - Approved by (if approved)
  - Actions (Edit pending, Delete pending)
- **Summary Cards:**
  - Total Approved Hours
  - Pending Hours
  - This Month Hours
  - This Year Hours
- **Filter Options:**
  - Filter by status
  - Filter by date range
  - Filter by organization
  - Sort by date

### Hour Entry Form Fields
- **Date:** Date worked (date picker)
- **Hours:** Hours worked (0.25 increments)
- **Activity:** Activity type (dropdown or free text)
- **Organization:** Which nonprofit (if multi-org)
- **Description:** Detailed description of work
- **Submit:** Submit for approval

### Status Badges
- **Pending:** Yellow badge, awaiting approval
- **Approved:** Green badge with checkmark
- **Rejected:** Red badge with X

## Data Requirements

### Hour Entry Data
- **id** (uuid) - Unique identifier
- **user_id** (uuid) - User who logged hours
- **organization_id** (uuid) - Organization
- **personnel_id** (uuid, nullable) - If staff member
- **volunteer_id** (uuid, nullable) - If volunteer
- **date** (date) - Date worked
- **hours** (decimal) - Hours worked
- **activity** (string) - Activity/task name
- **description** (text, nullable) - Detailed description
- **status** (string) - 'pending', 'approved', 'rejected'
- **submitted_at** (datetime) - When submitted
- **approved_by_id** (uuid, nullable) - Who approved/rejected
- **approved_at** (datetime, nullable) - When approved/rejected
- **rejection_reason** (text, nullable) - Reason for rejection
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Entry:** Submit new hour entry
- **Update Entry:** Edit pending entry
- **Delete Entry:** Delete pending entry
- **Approve Entry:** Approve pending entry (managers)
- **Reject Entry:** Reject pending entry (managers)

## API Endpoints Required

### GET /api/v1/hour_entries
```
Description: Fetch hour entries
Query Parameters:
  - organization_id (required, uuid)
  - user_id (optional, uuid) - Filter by specific user (defaults to current user)
  - status (optional, string) - 'pending', 'approved', 'rejected', 'all'
  - start_date (optional, date)
  - end_date (optional, date)
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - sort_by (optional, string, default: 'date_desc')

Response: {
  data: [
    {
      id: "uuid",
      user_id: "uuid",
      user_name: "John Doe",
      organization_id: "uuid",
      organization_name: "Awakenings",
      personnel_id: "uuid",
      volunteer_id: null,
      date: "2024-11-08",
      hours: 4.0,
      activity: "Event Setup",
      description: "Helped set up chairs and tables for community event",
      status: "approved",
      submitted_at: "2024-11-08T14:30:00Z",
      approved_by: "Jane Smith",
      approved_at: "2024-11-09T09:15:00Z",
      rejection_reason: null,
      created_at: "2024-11-08T14:30:00Z",
      updated_at: "2024-11-09T09:15:00Z"
    }
  ],
  meta: {
    total: 87,
    page: 1,
    per_page: 50,
    total_pages: 2,
    total_hours: {
      all: 245.5,
      approved: 230.0,
      pending: 12.5,
      rejected: 3.0
    }
  }
}
```

### GET /api/v1/hour_entries/:id
```
Description: Get single hour entry
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all hour entry fields,
    approval_history: [
      {
        action: "approved",
        user: "Jane Smith",
        timestamp: "2024-11-09T09:15:00Z",
        notes: "Approved"
      }
    ]
  }
}
```

### POST /api/v1/hour_entries
```
Description: Create new hour entry
Request Body: {
  organization_id: "uuid",
  date: "2024-11-08",
  hours: 4.0,
  activity: "Event Setup",
  description: "Helped set up chairs and tables for community event",
  notes: null
}

Response: {
  data: {
    id: "uuid",
    ...all hour entry fields,
    status: "pending"
  },
  message: "Hour entry submitted successfully"
}

Note: User ID inferred from authentication
```

### PUT /api/v1/hour_entries/:id
```
Description: Update hour entry (pending only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  date: "2024-11-08",
  hours: 4.5,
  activity: "Event Setup",
  description: "Updated description"
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Hour entry updated successfully"
}

Note: Can only update own pending entries
```

### DELETE /api/v1/hour_entries/:id
```
Description: Delete hour entry (pending only)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Hour entry deleted successfully"
}

Note: Can only delete own pending entries
```

### POST /api/v1/hour_entries/:id/approve
```
Description: Approve hour entry (managers only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  notes: "Approved" (optional)
}

Response: {
  data: {
    id: "uuid",
    status: "approved",
    approved_by: "Jane Smith",
    approved_at: "2024-11-09T09:15:00Z"
  },
  message: "Hour entry approved successfully"
}
```

### POST /api/v1/hour_entries/:id/reject
```
Description: Reject hour entry (managers only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  rejection_reason: "Date incorrect, please resubmit"
}

Response: {
  data: {
    id: "uuid",
    status: "rejected",
    rejection_reason: "Date incorrect, please resubmit",
    approved_by: "Jane Smith",
    approved_at: "2024-11-09T09:15:00Z"
  },
  message: "Hour entry rejected"
}
```

### GET /api/v1/hour_entries/summary
```
Description: Get hour summary for user
Query Parameters:
  - organization_id (required, uuid)
  - user_id (optional, uuid) - Defaults to current user
  - year (optional, integer) - Defaults to current year

Response: {
  data: {
    total_hours: 245.5,
    approved_hours: 230.0,
    pending_hours: 12.5,
    rejected_hours: 3.0,
    ytd_hours: 245.5,
    current_month_hours: 32.0,
    by_month: [
      { month: "January", hours: 20.0 },
      { month: "February", hours: 24.0 },
      ...
    ],
    by_activity: [
      { activity: "Event Setup", hours: 45.0 },
      { activity: "Administrative", hours: 60.0 },
      ...
    ]
  }
}
```

### GET /api/v1/hour_entries/pending_approvals
```
Description: Get pending hour entries for approval (managers only)
Query Parameters:
  - organization_id (required, uuid)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      user_name: "John Doe",
      date: "2024-11-08",
      hours: 4.0,
      activity: "Event Setup",
      submitted_at: "2024-11-08T14:30:00Z"
    }
  ],
  meta: {
    total: 15,
    total_hours: 52.5
  }
}
```

### POST /api/v1/hour_entries/bulk_approve
```
Description: Approve multiple hour entries (managers only)
Request Body: {
  organization_id: "uuid",
  entry_ids: ["uuid1", "uuid2", "uuid3"]
}

Response: {
  data: {
    approved_count: 3,
    failed_count: 0
  },
  message: "3 hour entries approved successfully"
}
```

## Request/Response Schemas

### HourEntry Schema
```typescript
interface HourEntry {
  id: string;
  user_id: string;
  user_name: string;
  organization_id: string;
  organization_name: string;
  personnel_id?: string;
  volunteer_id?: string;
  date: string;
  hours: number;
  activity: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

interface HourSummary {
  total_hours: number;
  approved_hours: number;
  pending_hours: number;
  rejected_hours: number;
  ytd_hours: number;
  current_month_hours: number;
  by_month: Array<{ month: string; hours: number }>;
  by_activity: Array<{ activity: string; hours: number }>;
}
```

## Authentication & Authorization

### Required Permissions
- `hour_entries:read` - View own hour entries
- `hour_entries:write` - Create and edit own entries
- `hour_entries:delete` - Delete own pending entries
- `hour_entries:approve` - Approve/reject entries (managers)
- `hour_entries:read_all` - View all entries (managers)

### Role-Based Access
- **Admin:** Full access, can approve all entries
- **Manager:** Can view all, approve/reject entries
- **Staff:** Can create, view own, edit own pending
- **Volunteer:** Can create, view own, edit own pending

## Business Logic & Validations

### Frontend Validations
- Date required and cannot be in future
- Hours must be greater than 0
- Hours typically in 0.25 increments (15 min)
- Activity required
- Description recommended

### Backend Validations (Rails)
- Date cannot be more than 90 days in past (configurable)
- Hours must be between 0.25 and 24.0
- Cannot edit/delete approved or rejected entries
- Cannot approve own entries
- Rejection reason required when rejecting
- User must be active personnel or volunteer

### Business Rules
- Users can only view/edit their own entries
- Managers can view and approve all entries
- Approved entries cannot be modified
- Rejected entries can be deleted and resubmitted
- Hour totals roll up to personnel/volunteer records
- Email notification sent when status changes
- Bulk approval for efficiency
- Activity types can be predefined or free text

## State Management

### Local State
- `entries` - List of hour entries
- `showForm` - Form visibility toggle
- `formData` - Form input state
- `selectedEntry` - Currently viewing/editing
- `statusFilter` - Filter by status
- `dateRange` - Date range filter

### Global State (AppContext)
- `selectedEntity` - Current organization
- Current user info

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - Mock entries array
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Date picker library

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load hour entries", retry
2. **Validation Error:** Show inline field errors
3. **Cannot Edit:** Show error "Cannot edit approved/rejected entries"
4. **Cannot Approve Own:** Show error "Cannot approve your own entries"
5. **Approval Failed:** Show toast "Failed to approve entry"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Form submission:** Disable button, show spinner
- **Approval:** Show confirmation with spinner
- **Bulk approval:** Progress indicator

## Mock Data to Remove
- `HourTracking.tsx` - `entries` mock array
- Move interfaces to `src/types/hour-entry.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/hour-entries.ts`
2. Create `src/types/hour-entry.ts`
3. Implement hour entry list
4. Implement create/edit entry

### Phase 2: Approval Workflow
1. Implement approve flow
2. Implement reject flow
3. Implement bulk approval
4. Test permissions (can't approve own)

### Phase 3: Reporting
1. Implement hour summary
2. Implement activity breakdown
3. Integrate with personnel/volunteer records
4. Test hour totals rollup

### Phase 4: Notifications
1. Implement email notifications
2. Implement in-app notifications
3. Test notification triggers
4. Implement notification preferences

## Related Documentation
- [01-PERSONNEL-CRM.md](./01-PERSONNEL-CRM.md) - Staff management
- [02-VOLUNTEERS-CRM.md](./02-VOLUNTEERS-CRM.md) - Volunteer management
- [../reports/06-VOLUNTEER-HOURS-REPORT.md](../reports/06-VOLUNTEER-HOURS-REPORT.md) - Hour reports
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Hour entry data model
