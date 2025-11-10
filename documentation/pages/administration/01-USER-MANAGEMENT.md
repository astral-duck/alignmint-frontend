# User Management

**Component File:** `src/components/UserManagement.tsx`  
**Route:** `/administration-hub` (with tool='users')  
**Access Level:** Admin only

## Overview
The User Management system allows administrators to create, edit, and manage user accounts across all organizations. It handles user authentication, role assignment, permissions management, password resets, and account status control. This is a critical administrative function that controls access to the entire system.

## UI Features

### Main Features
- **User List View:**
  - Searchable table
  - Filter by organization
  - Filter by role (Admin, Manager, Staff, Volunteer)
  - Filter by status (Active, Inactive)
  - Sort by name, email, last login
- **User Details:**
  - Personal information
  - Email address
  - Assigned organization(s)
  - Role and permissions
  - Account status
  - Last login date
  - Created date
- **Add User:**
  - Email (username)
  - Name
  - Organization assignment
  - Role selection
  - Send welcome email option
- **Edit User:**
  - Update name
  - Change organization
  - Change role
  - Update permissions
  - Activate/deactivate account
- **User Actions:**
  - Reset password
  - Resend welcome email
  - Deactivate account
  - Delete user (soft delete)

### User Table Columns
- Name
- Email
- Organization
- Role Badge (Admin, Manager, Staff, Volunteer)
- Status Badge (Active, Inactive)
- Last Login
- Actions dropdown

### Role Types
- **Admin:** Full system access, all organizations
- **Manager:** Full access to assigned organizations
- **Staff:** Standard access to assigned organizations
- **Volunteer:** Limited access, primarily hour tracking

### Status Types
- **Active:** Can log in and access system
- **Inactive:** Cannot log in, account disabled

## Data Requirements

### User Data
- **id** (uuid) - Unique identifier
- **email** (string) - Email address (username)
- **name** (string) - Full name
- **organization_ids** (array) - Assigned organizations
- **role** (string) - 'admin', 'manager', 'staff', 'volunteer'
- **status** (string) - 'active', 'inactive'
- **permissions** (json, nullable) - Granular permissions
- **last_login_at** (datetime, nullable) - Last login time
- **password_reset_required** (boolean) - Force password reset
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated
- **created_by_id** (uuid) - Who created the user

### Permission Data (granular)
- **donors:read** (boolean)
- **donors:write** (boolean)
- **donations:read** (boolean)
- **donations:write** (boolean)
- **accounting:read** (boolean)
- **accounting:write** (boolean)
- **reports:read** (boolean)
- **reports:export** (boolean)
- **users:manage** (boolean)
- **settings:manage** (boolean)
- ...and more

### Data Mutations
- **Create User:** Add new user account
- **Update User:** Edit user details
- **Delete User:** Remove user (soft delete)
- **Change Role:** Update user role
- **Update Permissions:** Modify granular permissions
- **Activate/Deactivate:** Change account status
- **Reset Password:** Send password reset email
- **Resend Welcome:** Resend welcome email

## API Endpoints Required

### GET /api/v1/users
```
Description: Fetch users
Query Parameters:
  - organization_id (optional, uuid) - Filter by organization
  - role (optional, string) - Filter by role
  - status (optional, string) - Filter by status
  - search (optional, string) - Search name or email
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - sort_by (optional, string, default: 'name_asc')

Response: {
  data: [
    {
      id: "uuid",
      email: "john@example.com",
      name: "John Doe",
      organization_ids: ["uuid1", "uuid2"],
      organizations: [
        { id: "uuid1", name: "Awakenings" },
        { id: "uuid2", name: "Bloom Strong" }
      ],
      role: "manager",
      status: "active",
      last_login_at: "2024-11-10T09:30:00Z",
      created_at: "2024-01-15T10:00:00Z",
      created_by: "Admin User"
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

### GET /api/v1/users/:id
```
Description: Get user details
Path Parameters:
  - id (required, uuid)

Response: {
  data: {
    id: "uuid",
    email: "john@example.com",
    name: "John Doe",
    organization_ids: ["uuid1", "uuid2"],
    organizations: [
      { id: "uuid1", name: "Awakenings" },
      { id: "uuid2", name: "Bloom Strong" }
    ],
    role: "manager",
    status: "active",
    permissions: {
      "donors:read": true,
      "donors:write": true,
      "donations:read": true,
      "donations:write": true,
      "accounting:read": true,
      "accounting:write": false,
      "reports:read": true,
      "reports:export": true,
      "users:manage": false,
      "settings:manage": false
    },
    last_login_at: "2024-11-10T09:30:00Z",
    password_reset_required: false,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-11-01T14:20:00Z",
    created_by: "Admin User"
  }
}
```

### POST /api/v1/users
```
Description: Create new user
Request Body: {
  email: "jane@example.com",
  name: "Jane Smith",
  organization_ids: ["uuid1"],
  role: "staff",
  send_welcome_email: true
}

Response: {
  data: {
    id: "uuid",
    email: "jane@example.com",
    name: "Jane Smith",
    ...all user fields,
    temporary_password: "temp123" // If not sending email
  },
  message: "User created successfully. Welcome email sent."
}
```

### PUT /api/v1/users/:id
```
Description: Update user
Path Parameters:
  - id (required, uuid)
Request Body: {
  name: "Jane Smith-Jones",
  organization_ids: ["uuid1", "uuid2"],
  role: "manager",
  status: "active"
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "User updated successfully"
}
```

### DELETE /api/v1/users/:id
```
Description: Delete user (soft delete)
Path Parameters:
  - id (required, uuid)

Response: {
  message: "User deleted successfully"
}

Note: Soft delete - marks as inactive, retains data
```

### PUT /api/v1/users/:id/permissions
```
Description: Update user permissions
Path Parameters:
  - id (required, uuid)
Request Body: {
  permissions: {
    "donors:read": true,
    "donors:write": true,
    "donations:read": true,
    "donations:write": false,
    ...
  }
}

Response: {
  data: {
    id: "uuid",
    permissions: {...updated permissions}
  },
  message: "Permissions updated successfully"
}
```

### POST /api/v1/users/:id/reset_password
```
Description: Send password reset email
Path Parameters:
  - id (required, uuid)

Response: {
  message: "Password reset email sent to jane@example.com"
}
```

### POST /api/v1/users/:id/resend_welcome
```
Description: Resend welcome email
Path Parameters:
  - id (required, uuid)

Response: {
  message: "Welcome email resent to jane@example.com"
}
```

### PUT /api/v1/users/:id/activate
```
Description: Activate user account
Path Parameters:
  - id (required, uuid)

Response: {
  data: {
    id: "uuid",
    status: "active"
  },
  message: "User account activated"
}
```

### PUT /api/v1/users/:id/deactivate
```
Description: Deactivate user account
Path Parameters:
  - id (required, uuid)

Response: {
  data: {
    id: "uuid",
    status: "inactive"
  },
  message: "User account deactivated"
}
```

### GET /api/v1/users/:id/activity_log
```
Description: Get user activity log
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      action: "login",
      timestamp: "2024-11-10T09:30:00Z",
      ip_address: "192.168.1.1",
      user_agent: "Mozilla/5.0..."
    },
    {
      id: "uuid",
      action: "updated_donor",
      timestamp: "2024-11-10T10:15:00Z",
      details: "Updated donor DON-12345"
    }
  ]
}
```

## Request/Response Schemas

### User Schema
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  organization_ids: string[];
  organizations: Array<{ id: string; name: string }>;
  role: 'admin' | 'manager' | 'staff' | 'volunteer';
  status: 'active' | 'inactive';
  permissions: Record<string, boolean>;
  last_login_at?: string;
  password_reset_required: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface Permission {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}
```

## Authentication & Authorization

### Required Permissions
- `users:read` - View users (Admin only)
- `users:write` - Create and edit users (Admin only)
- `users:delete` - Delete users (Admin only)
- `users:manage_permissions` - Manage permissions (Admin only)

### Role-Based Access
- **Admin:** Full access to user management
- **Manager:** Cannot access user management
- **Staff:** Cannot access user management
- **Volunteer:** Cannot access user management

## Business Logic & Validations

### Frontend Validations
- Email format validation
- Email uniqueness
- Name required
- At least one organization required
- Role required
- Cannot deactivate own account
- Cannot delete own account

### Backend Validations (Rails)
- Email uniqueness across system
- Valid email format
- At least one organization assigned
- Valid role value
- Cannot change own role (prevent privilege escalation)
- Cannot deactivate last admin
- Password complexity requirements
- Permission keys must be valid

### Business Rules
- New users receive welcome email with temp password
- Users can be assigned to multiple organizations
- Admins have access to all organizations
- Inactive users cannot log in
- Password reset required on first login (optional)
- Activity log tracks all user actions
- Soft delete preserves audit trail
- Role changes take effect immediately
- Permission changes take effect on next login

## State Management

### Local State
- `users` - List of users
- `selectedUser` - Currently viewing/editing
- `addUserOpen` - Add dialog state
- `editUserOpen` - Edit dialog state
- `deleteConfirmOpen` - Delete confirmation dialog
- `searchQuery` - Search input
- `filters` - Role and status filters
- `sortBy` - Sort option

### Global State
- Current admin user info

## Dependencies

### Internal Dependencies
- Mock data - **TO BE REMOVED** - `generateMockUsers()`
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load users", retry
2. **Validation Error:** Show inline field errors
3. **Email Taken:** Show error "Email already in use"
4. **Cannot Delete Self:** Show error "Cannot delete your own account"
5. **Cannot Deactivate Last Admin:** Show error "Cannot deactivate last admin"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **User actions:** Disable buttons, show spinner
- **Password reset:** Show confirmation with spinner
- **Delete:** Show confirmation dialog with loading state

## Mock Data to Remove
- `UserManagement.tsx` - `generateMockUsers()` function
- Move interfaces to `src/types/user.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/users.ts`
2. Create `src/types/user.ts`
3. Implement user list
4. Implement create/edit user

### Phase 2: Authentication
1. Integrate with authentication system
2. Implement password reset flow
3. Implement welcome email
4. Test login with new users

### Phase 3: Permissions
1. Implement granular permissions
2. Implement permission editor UI
3. Test permission enforcement
4. Document all permission keys

### Phase 4: Activity Logging
1. Implement activity log endpoint
2. Implement activity log UI
3. Test activity tracking
4. Add audit trail reports

## Related Documentation
- [02-NONPROFIT-MANAGEMENT.md](./02-NONPROFIT-MANAGEMENT.md) - Organization management
- [03-SETTINGS.md](./03-SETTINGS.md) - System settings
- [../personnel/01-PERSONNEL-CRM.md](../personnel/01-PERSONNEL-CRM.md) - Personnel records
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - User data model

## Additional Notes

### Role Hierarchy
```
Admin > Manager > Staff > Volunteer
```

### Default Permissions by Role

**Admin:**
- All permissions enabled

**Manager:**
- All read permissions
- Most write permissions
- Cannot manage users or system settings

**Staff:**
- Most read permissions
- Limited write permissions
- Cannot manage users, settings, or accounting

**Volunteer:**
- Limited read permissions
- Can only manage own hour entries
- Cannot access admin features

### Security Considerations
- Passwords hashed with bcrypt
- Password complexity requirements enforced
- Account lockout after failed login attempts
- Session timeout after inactivity
- Two-factor authentication (future)
- IP address logging
- Activity audit trail
