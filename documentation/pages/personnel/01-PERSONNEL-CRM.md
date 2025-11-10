# Personnel CRM

**Component File:** `src/components/PersonnelCRM.tsx`  
**Route:** `/personnel-hub` (with tool='personnel')  
**Access Level:** Admin, Manager

## Overview
The Personnel CRM manages all staff and employee information including contact details, employment status, compensation, benefits, and user account management. It provides comprehensive employee profiles, role management, and integration with payroll and hour tracking systems.

## UI Features

### Main Features
- **Personnel List View:**
  - Searchable and sortable table
  - Filter by employment type (Full-time, Part-time, Contractor, Volunteer)
  - Filter by status (Active, On Leave, Inactive)
  - Quick actions menu
- **Personnel Profile View:**
  - Personal information
  - Employment details
  - Compensation and benefits
  - User account management
  - Hour tracking summary
  - Leave requests
  - Document uploads
- **Add/Edit Personnel:**
  - Multi-step form
  - Personal info
  - Employment details
  - Compensation
  - User account creation (optional)
- **User Management:**
  - Role assignment (Admin, Manager, Staff, Volunteer)
  - Account status (Active, Inactive)
  - Password reset
  - Permissions management

### Personnel Table Columns
- Name (with avatar)
- Role/Title
- Employment Type Badge
- Status Badge
- Email
- Phone
- Start Date
- Actions dropdown

### Profile Tabs
- **Overview:** Summary cards and key info
- **Personal:** Contact details, emergency contact
- **Employment:** Role, department, supervisor, start date
- **Compensation:** Salary, pay rate, benefits
- **User Account:** Login credentials, role, permissions
- **Documents:** W-4, I-9, contracts, certifications
- **Activity:** Hour logs, leave requests, performance reviews

### Summary Cards (Profile)
- **Employment Status:** Active/Inactive with start date
- **Total Hours:** YTD hours worked
- **Leave Balance:** Available PTO days
- **Upcoming Leave:** Next scheduled time off

## Data Requirements

### Personnel Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **first_name** (string) - First name
- **last_name** (string) - Last name
- **email** (string) - Email address
- **phone** (string, nullable) - Phone number
- **address** (json, nullable) - Mailing address
- **date_of_birth** (date, nullable) - Date of birth
- **ssn_last_four** (string, nullable) - Last 4 of SSN (encrypted)
- **emergency_contact** (json, nullable) - Emergency contact info
- **role_title** (string) - Job title
- **department** (string, nullable) - Department
- **employment_type** (string) - 'full_time', 'part_time', 'contractor', 'volunteer'
- **employment_status** (string) - 'active', 'on_leave', 'inactive'
- **start_date** (date) - Employment start date
- **end_date** (date, nullable) - Employment end date
- **supervisor_id** (uuid, nullable) - Reports to
- **compensation_type** (string, nullable) - 'salary', 'hourly', 'stipend', 'volunteer'
- **compensation_amount** (decimal, nullable) - Salary or hourly rate
- **pay_frequency** (string, nullable) - 'weekly', 'biweekly', 'monthly'
- **benefits** (json, nullable) - Benefits package details
- **pto_balance** (decimal, nullable) - PTO days available
- **user_id** (uuid, nullable) - Linked user account
- **notes** (text, nullable) - Internal notes
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### User Account Data (if linked)
- **id** (uuid) - User ID
- **email** (string) - Login email
- **role** (string) - 'admin', 'manager', 'staff', 'volunteer'
- **status** (string) - 'active', 'inactive'
- **last_login** (datetime, nullable) - Last login time
- **permissions** (json) - Granular permissions

### Document Data
- **id** (uuid) - Document ID
- **personnel_id** (uuid) - Personnel reference
- **document_type** (string) - 'w4', 'i9', 'contract', 'certification', 'other'
- **file_name** (string) - Original file name
- **file_url** (string) - Secure file URL
- **uploaded_by_id** (uuid) - Who uploaded
- **uploaded_at** (datetime) - When uploaded

### Data Mutations
- **Create Personnel:** Add new employee
- **Update Personnel:** Edit employee details
- **Delete Personnel:** Remove employee (soft delete)
- **Create User Account:** Create login for employee
- **Update User Role:** Change user permissions
- **Reset Password:** Send password reset email
- **Deactivate User:** Disable login access
- **Upload Document:** Add employee document
- **Delete Document:** Remove document

## API Endpoints Required

### GET /api/v1/personnel
```
Description: Fetch personnel records
Query Parameters:
  - organization_id (required, uuid)
  - employment_type (optional, string)
  - employment_status (optional, string)
  - search (optional, string) - Search name, email
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - sort_by (optional, string, default: 'name_asc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "+1-555-0123",
      role_title: "Program Director",
      department: "Operations",
      employment_type: "full_time",
      employment_status: "active",
      start_date: "2022-01-15",
      user_id: "uuid",
      user_role: "manager",
      user_status: "active",
      created_at: "2022-01-10T10:00:00Z"
    }
  ],
  meta: {
    total: 45,
    page: 1,
    per_page: 50,
    total_pages: 1
  }
}
```

### GET /api/v1/personnel/:id
```
Description: Get personnel details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all personnel fields,
    supervisor: {
      id: "uuid",
      name: "Jane Smith"
    },
    user_account: {
      id: "uuid",
      email: "john@example.com",
      role: "manager",
      status: "active",
      last_login: "2024-11-08T09:00:00Z",
      permissions: {...}
    },
    documents: [
      {
        id: "uuid",
        document_type: "w4",
        file_name: "W4_JohnDoe.pdf",
        file_url: "https://...",
        uploaded_at: "2022-01-15T10:00:00Z"
      }
    ],
    hour_summary: {
      ytd_hours: 1850.5,
      current_month_hours: 160.0
    },
    leave_balance: {
      pto_available: 15.5,
      pto_used: 8.5,
      pto_total: 24.0
    }
  }
}
```

### POST /api/v1/personnel
```
Description: Create new personnel record
Request Body: {
  organization_id: "uuid",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "+1-555-0123",
  address: {...},
  role_title: "Program Director",
  department: "Operations",
  employment_type: "full_time",
  employment_status: "active",
  start_date: "2024-11-15",
  supervisor_id: "uuid",
  compensation_type: "salary",
  compensation_amount: 65000.00,
  pay_frequency: "biweekly",
  pto_balance: 24.0,
  create_user_account: true, // Optional
  user_role: "manager", // If creating user account
  notes: null
}

Response: {
  data: {
    id: "uuid",
    ...all personnel fields,
    user_id: "uuid" // If user account created
  },
  message: "Personnel record created successfully"
}
```

### PUT /api/v1/personnel/:id
```
Description: Update personnel record
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
  message: "Personnel record updated successfully"
}
```

### DELETE /api/v1/personnel/:id
```
Description: Delete personnel record (soft delete)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Personnel record deleted successfully"
}

Note: Soft delete - marks as inactive, retains data
```

### POST /api/v1/personnel/:id/create_user
```
Description: Create user account for personnel
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  email: "john@example.com",
  role: "manager",
  send_welcome_email: true
}

Response: {
  data: {
    user_id: "uuid",
    email: "john@example.com",
    role: "manager",
    temporary_password: "temp123" // If not sending email
  },
  message: "User account created successfully"
}
```

### PUT /api/v1/personnel/:id/user_role
```
Description: Update user role/permissions
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  role: "admin",
  permissions: {...} // Optional granular permissions
}

Response: {
  data: {
    user_id: "uuid",
    role: "admin",
    permissions: {...}
  },
  message: "User role updated successfully"
}
```

### POST /api/v1/personnel/:id/reset_password
```
Description: Send password reset email
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid"
}

Response: {
  message: "Password reset email sent to john@example.com"
}
```

### PUT /api/v1/personnel/:id/user_status
```
Description: Activate/deactivate user account
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  status: "inactive"
}

Response: {
  data: {
    user_id: "uuid",
    status: "inactive"
  },
  message: "User account deactivated"
}
```

### POST /api/v1/personnel/:id/documents
```
Description: Upload personnel document
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  document_type: "w4",
  file: "multipart/form-data"
}

Response: {
  data: {
    id: "uuid",
    document_type: "w4",
    file_name: "W4_JohnDoe.pdf",
    file_url: "https://...",
    uploaded_at: "2024-11-08T10:00:00Z"
  },
  message: "Document uploaded successfully"
}
```

### DELETE /api/v1/personnel/:id/documents/:document_id
```
Description: Delete personnel document
Path Parameters:
  - id (required, uuid)
  - document_id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Document deleted successfully"
}
```

### GET /api/v1/personnel/:id/hour_summary
```
Description: Get hour tracking summary
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)
  - year (optional, integer, default: current year)

Response: {
  data: {
    ytd_hours: 1850.5,
    current_month_hours: 160.0,
    by_month: [
      { month: "January", hours: 168.0 },
      { month: "February", hours: 160.0 }
    ]
  }
}
```

## Request/Response Schemas

### Personnel Schema
```typescript
interface Personnel {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: Address;
  date_of_birth?: string;
  emergency_contact?: EmergencyContact;
  role_title: string;
  department?: string;
  employment_type: 'full_time' | 'part_time' | 'contractor' | 'volunteer';
  employment_status: 'active' | 'on_leave' | 'inactive';
  start_date: string;
  end_date?: string;
  supervisor_id?: string;
  compensation_type?: 'salary' | 'hourly' | 'stipend' | 'volunteer';
  compensation_amount?: number;
  pay_frequency?: 'weekly' | 'biweekly' | 'monthly';
  benefits?: Benefits;
  pto_balance?: number;
  user_id?: string;
  user_account?: UserAccount;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface UserAccount {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'volunteer';
  status: 'active' | 'inactive';
  last_login?: string;
  permissions: Record<string, boolean>;
}
```

## Authentication & Authorization

### Required Permissions
- `personnel:read` - View personnel records
- `personnel:write` - Create and edit personnel
- `personnel:delete` - Delete personnel
- `users:manage` - Manage user accounts and roles

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can view all, edit most, cannot delete
- **Staff:** Can view own profile only
- **Volunteer:** Can view own profile only

## Business Logic & Validations

### Frontend Validations
- Email format validation
- Phone format validation
- Start date cannot be in future
- End date must be after start date
- Compensation amount must be positive
- PTO balance cannot be negative

### Backend Validations (Rails)
- Email uniqueness per organization
- Valid employment type and status
- Supervisor must be active personnel
- Cannot delete personnel with active user account
- User role must match employment type
- Document file size limits (e.g., 10MB)
- Valid document types

### Business Rules
- Personnel can have optional user account
- User accounts inherit email from personnel record
- Inactive personnel cannot have active user accounts
- Contractors and volunteers typically don't have compensation
- PTO balance tracked for full-time/part-time only
- Documents stored securely with access controls
- Supervisor hierarchy prevents circular references

## State Management

### Local State
- `personnel` - List of personnel
- `selectedPerson` - Currently viewing/editing
- `view` - 'list' or 'profile'
- `addPersonOpen` - Add dialog state
- `editMode` - Edit mode toggle
- `searchQuery` - Search input
- `filters` - Employment type and status filters
- `sortBy` - Sort option

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `getAllPersonnel()`, `getPersonnelProfile()`
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- File upload library

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load personnel", retry
2. **Validation Error:** Show inline field errors
3. **Email Taken:** Show error "Email already in use"
4. **Cannot Delete:** Show error "Cannot delete personnel with active user account"
5. **Upload Failed:** Show toast "Document upload failed"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Profile load:** Loading spinner
- **Form submission:** Disable buttons, show spinner
- **Document upload:** Progress bar
- **Password reset:** Show confirmation with spinner

## Mock Data to Remove
- `PersonnelCRM.tsx` - `getAllPersonnel()`, `getPersonnelProfile()` calls
- Move interfaces to `src/types/personnel.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/personnel.ts`
2. Create `src/types/personnel.ts`
3. Implement personnel list
4. Implement create/edit personnel

### Phase 2: User Management
1. Implement user account creation
2. Implement role management
3. Implement password reset
4. Test permission system

### Phase 3: Documents
1. Implement document upload
2. Implement secure document storage
3. Test access controls
4. Implement document viewer

### Phase 4: Integration
1. Link with hour tracking
2. Link with leave requests
3. Link with payroll (future)
4. Test supervisor hierarchy

## Related Documentation
- [02-VOLUNTEERS-CRM.md](./02-VOLUNTEERS-CRM.md) - Volunteer management
- [03-HOUR-TRACKING.md](./03-HOUR-TRACKING.md) - Hour logging
- [04-LEAVE-REQUESTS.md](./04-LEAVE-REQUESTS.md) - PTO management
- [../administration/01-USER-MANAGEMENT.md](../administration/01-USER-MANAGEMENT.md) - User accounts
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Personnel data model
