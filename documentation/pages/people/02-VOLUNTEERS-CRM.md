# Volunteers CRM

**Component File:** `src/components/VolunteersCRM.tsx`  
**Route:** `/personnel-hub` (with tool='volunteers')  
**Access Level:** Admin, Manager, Staff

## Overview
The Volunteers CRM manages volunteer information, tracks volunteer hours, coordinates volunteer activities, and maintains volunteer engagement. It provides volunteer profiles, hour tracking integration, activity assignments, and recognition/rewards management.

## UI Features

### Main Features
- **Volunteer List View:**
  - Searchable and sortable table
  - Filter by volunteer type (Regular, Occasional, Event-based)
  - Filter by status (Active, Inactive)
  - Quick actions menu
- **Volunteer Profile View:**
  - Personal information
  - Volunteer history
  - Total hours contributed
  - Skills and interests
  - Availability schedule
  - Activity assignments
  - Recognition/awards
- **Add/Edit Volunteer:**
  - Personal information form
  - Skills and interests
  - Availability preferences
  - Emergency contact
  - Background check status
- **Hour Tracking Integration:**
  - View volunteer's hour logs
  - Approve/reject hour submissions
  - Generate hour reports

### Volunteer Table Columns
- Name (with avatar)
- Volunteer Type Badge
- Status Badge
- Email
- Phone
- Total Hours
- Last Activity Date
- Actions dropdown

### Profile Tabs
- **Overview:** Summary cards and recent activity
- **Personal:** Contact details, emergency contact
- **Hours:** Hour tracking history and summary
- **Activities:** Assigned and completed activities
- **Skills:** Skills, interests, certifications
- **Recognition:** Awards, milestones, thank you notes

### Summary Cards (Profile)
- **Total Hours:** Lifetime volunteer hours
- **This Year:** YTD hours
- **Activities:** Number of activities participated
- **Member Since:** Volunteer start date

## Data Requirements

### Volunteer Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **first_name** (string) - First name
- **last_name** (string) - Last name
- **email** (string) - Email address
- **phone** (string, nullable) - Phone number
- **address** (json, nullable) - Mailing address
- **date_of_birth** (date, nullable) - Date of birth
- **emergency_contact** (json, nullable) - Emergency contact info
- **volunteer_type** (string) - 'regular', 'occasional', 'event_based'
- **status** (string) - 'active', 'inactive'
- **start_date** (date) - Volunteer start date
- **skills** (array, nullable) - Skills and certifications
- **interests** (array, nullable) - Areas of interest
- **availability** (json, nullable) - Availability schedule
- **background_check_status** (string, nullable) - 'pending', 'approved', 'expired'
- **background_check_date** (date, nullable) - When completed
- **total_hours** (decimal) - Lifetime hours
- **ytd_hours** (decimal) - Year-to-date hours
- **last_activity_date** (date, nullable) - Most recent activity
- **notes** (text, nullable) - Internal notes
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Activity Assignment Data
- **id** (uuid) - Assignment ID
- **volunteer_id** (uuid) - Volunteer reference
- **activity_name** (string) - Activity name
- **activity_type** (string) - Type of activity
- **scheduled_date** (date) - When scheduled
- **hours_expected** (decimal, nullable) - Expected hours
- **hours_actual** (decimal, nullable) - Actual hours worked
- **status** (string) - 'scheduled', 'completed', 'cancelled'
- **notes** (text, nullable) - Activity notes

### Recognition Data
- **id** (uuid) - Recognition ID
- **volunteer_id** (uuid) - Volunteer reference
- **recognition_type** (string) - 'milestone', 'award', 'thank_you'
- **title** (string) - Recognition title
- **description** (text, nullable) - Description
- **date** (date) - Recognition date
- **given_by_id** (uuid) - Who gave recognition

### Data Mutations
- **Create Volunteer:** Add new volunteer
- **Update Volunteer:** Edit volunteer details
- **Delete Volunteer:** Remove volunteer (soft delete)
- **Assign Activity:** Assign volunteer to activity
- **Complete Activity:** Mark activity as completed
- **Add Recognition:** Give award or recognition
- **Update Background Check:** Update background check status

## API Endpoints Required

### GET /api/v1/volunteers
```
Description: Fetch volunteers
Query Parameters:
  - organization_id (required, uuid)
  - volunteer_type (optional, string)
  - status (optional, string)
  - search (optional, string) - Search name, email
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - sort_by (optional, string, default: 'name_asc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      first_name: "Emily",
      last_name: "Chen",
      email: "emily@example.com",
      phone: "+1-555-0123",
      volunteer_type: "regular",
      status: "active",
      start_date: "2023-03-15",
      total_hours: 245.5,
      ytd_hours: 68.0,
      last_activity_date: "2024-11-01",
      created_at: "2023-03-10T10:00:00Z"
    }
  ],
  meta: {
    total: 87,
    page: 1,
    per_page: 50,
    total_pages: 2
  }
}
```

### GET /api/v1/volunteers/:id
```
Description: Get volunteer details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all volunteer fields,
    emergency_contact: {
      name: "Robert Chen",
      relationship: "Spouse",
      phone: "+1-555-0124"
    },
    skills: ["Event Planning", "Social Media", "Photography"],
    interests: ["Youth Programs", "Community Outreach"],
    availability: {
      monday: ["morning", "afternoon"],
      wednesday: ["evening"],
      saturday: ["all_day"]
    },
    activities: [
      {
        id: "uuid",
        activity_name: "Food Drive",
        scheduled_date: "2024-11-15",
        status: "scheduled"
      }
    ],
    recognition: [
      {
        id: "uuid",
        recognition_type: "milestone",
        title: "100 Hours Milestone",
        date: "2024-06-15"
      }
    ],
    hour_summary: {
      total_hours: 245.5,
      ytd_hours: 68.0,
      by_month: [...]
    }
  }
}
```

### POST /api/v1/volunteers
```
Description: Create new volunteer
Request Body: {
  organization_id: "uuid",
  first_name: "Emily",
  last_name: "Chen",
  email: "emily@example.com",
  phone: "+1-555-0123",
  address: {...},
  volunteer_type: "regular",
  status: "active",
  start_date: "2024-11-15",
  skills: ["Event Planning"],
  interests: ["Youth Programs"],
  availability: {...},
  emergency_contact: {...},
  notes: null
}

Response: {
  data: {
    id: "uuid",
    ...all volunteer fields
  },
  message: "Volunteer created successfully"
}
```

### PUT /api/v1/volunteers/:id
```
Description: Update volunteer
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  ...fields to update
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Volunteer updated successfully"
}
```

### DELETE /api/v1/volunteers/:id
```
Description: Delete volunteer (soft delete)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Volunteer deleted successfully"
}
```

### POST /api/v1/volunteers/:id/activities
```
Description: Assign activity to volunteer
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  activity_name: "Food Drive",
  activity_type: "event",
  scheduled_date: "2024-11-15",
  hours_expected: 4.0,
  notes: "Help with setup and distribution"
}

Response: {
  data: {
    id: "uuid",
    ...activity assignment fields
  },
  message: "Activity assigned successfully"
}
```

### PUT /api/v1/volunteers/:id/activities/:activity_id/complete
```
Description: Mark activity as completed
Path Parameters:
  - id (required, uuid)
  - activity_id (required, uuid)
Request Body: {
  organization_id: "uuid",
  hours_actual: 4.5,
  notes: "Great job!"
}

Response: {
  data: {
    id: "uuid",
    status: "completed",
    hours_actual: 4.5
  },
  message: "Activity marked as completed"
}
```

### POST /api/v1/volunteers/:id/recognition
```
Description: Add recognition/award
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  recognition_type: "milestone",
  title: "100 Hours Milestone",
  description: "Congratulations on reaching 100 volunteer hours!",
  date: "2024-11-08"
}

Response: {
  data: {
    id: "uuid",
    ...recognition fields
  },
  message: "Recognition added successfully"
}
```

### PUT /api/v1/volunteers/:id/background_check
```
Description: Update background check status
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  background_check_status: "approved",
  background_check_date: "2024-11-08"
}

Response: {
  data: {
    id: "uuid",
    background_check_status: "approved",
    background_check_date: "2024-11-08"
  },
  message: "Background check status updated"
}
```

### GET /api/v1/volunteers/:id/hours
```
Description: Get volunteer hour logs
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)
  - year (optional, integer)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      date: "2024-11-01",
      hours: 4.0,
      activity: "Food Drive",
      status: "approved",
      approved_by: "Jane Smith",
      approved_at: "2024-11-02T10:00:00Z"
    }
  ],
  meta: {
    total: 45,
    total_hours: 245.5
  }
}
```

## Request/Response Schemas

### Volunteer Schema
```typescript
interface Volunteer {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: Address;
  date_of_birth?: string;
  emergency_contact?: EmergencyContact;
  volunteer_type: 'regular' | 'occasional' | 'event_based';
  status: 'active' | 'inactive';
  start_date: string;
  skills?: string[];
  interests?: string[];
  availability?: Availability;
  background_check_status?: 'pending' | 'approved' | 'expired';
  background_check_date?: string;
  total_hours: number;
  ytd_hours: number;
  last_activity_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Availability {
  [day: string]: string[]; // e.g., { "monday": ["morning", "afternoon"] }
}
```

## Authentication & Authorization

### Required Permissions
- `volunteers:read` - View volunteers
- `volunteers:write` - Create and edit volunteers
- `volunteers:delete` - Delete volunteers
- `volunteers:assign_activities` - Assign activities
- `volunteers:manage_recognition` - Add recognition

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can view all, edit, assign activities
- **Staff:** Can view all, limited editing
- **Volunteer:** Can view own profile only

## Business Logic & Validations

### Frontend Validations
- Email format validation
- Phone format validation
- Start date cannot be in future
- Skills and interests from predefined lists
- Background check required for certain activities

### Backend Validations (Rails)
- Email uniqueness per organization
- Valid volunteer type and status
- Background check expiration (annual renewal)
- Activity assignment requires active volunteer
- Recognition requires completed activities

### Business Rules
- Regular volunteers expected to contribute monthly
- Occasional volunteers contribute sporadically
- Event-based volunteers for specific events only
- Background checks expire annually
- Hour tracking integrated with hour logs
- Recognition triggers at milestones (50, 100, 250, 500 hours)
- Inactive volunteers cannot be assigned activities

## State Management

### Local State
- `volunteers` - List of volunteers
- `selectedVolunteer` - Currently viewing/editing
- `view` - 'list' or 'profile'
- `addVolunteerOpen` - Add dialog state
- `searchQuery` - Search input
- `filters` - Type and status filters
- `sortBy` - Sort option

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `getAllVolunteers()`, `getVolunteerProfile()`
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load volunteers", retry
2. **Validation Error:** Show inline field errors
3. **Email Taken:** Show error "Email already in use"
4. **Cannot Assign:** Show error "Cannot assign activity to inactive volunteer"
5. **Background Check Expired:** Show warning "Background check expired"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Profile load:** Loading spinner
- **Form submission:** Disable buttons, show spinner
- **Activity assignment:** Show confirmation with spinner

## Mock Data to Remove
- `VolunteersCRM.tsx` - `getAllVolunteers()`, `getVolunteerProfile()` calls
- Move interfaces to `src/types/volunteer.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/volunteers.ts`
2. Create `src/types/volunteer.ts`
3. Implement volunteer list
4. Implement create/edit volunteer

### Phase 2: Activity Management
1. Implement activity assignment
2. Implement activity completion
3. Test hour tracking integration
4. Implement activity calendar view

### Phase 3: Recognition System
1. Implement recognition/awards
2. Implement milestone tracking
3. Implement thank you notes
4. Test notification system

### Phase 4: Reporting
1. Implement volunteer hour reports
2. Implement volunteer activity reports
3. Implement retention analytics
4. Export volunteer data

## Related Documentation
- [01-PERSONNEL-CRM.md](./01-PERSONNEL-CRM.md) - Staff management
- [03-HOUR-TRACKING.md](./03-HOUR-TRACKING.md) - Hour logging
- [../reports/06-VOLUNTEER-HOURS-REPORT.md](../reports/06-VOLUNTEER-HOURS-REPORT.md) - Hour reports
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Volunteer data model
