# Settings

**Component File:** `src/components/Settings.tsx`  
**Route:** `/settings` or `/administration` (with tool='settings')  
**Access Level:** All authenticated users

## Overview
The Settings component provides a comprehensive user settings interface with five tabs: Profile, Notifications, Security, Preferences, and Organization. Users can manage their personal information, notification preferences, security settings, application preferences, and organization details (if authorized). The interface adapts based on user role and permissions.

## UI Features

### Main Features
- **5-Tab Interface:**
  - Profile
  - Notifications
  - Security
  - Preferences
  - Organization
- **Back Button:** Returns to Administration Hub (if accessed from there)
- **Responsive Design:** Mobile-friendly tab layout

### Tab 1: Profile
- **Avatar Section:**
  - Current profile picture (initials fallback)
  - Change Photo button
  - File upload (JPG, PNG, GIF, max 5MB)
- **Personal Information:**
  - First Name
  - Last Name
  - Email Address
  - Phone Number
  - Job Title
  - Role (dropdown)
- **Save Changes button**

### Tab 2: Notifications
- **Email Notifications:**
  - Toggle for email notifications
  - Donation alerts toggle
  - Weekly reports toggle
  - Monthly reports toggle
- **Push Notifications:**
  - Toggle for push notifications
  - Browser notification permissions
- **Notification Preferences:**
  - Frequency settings
  - Type filters
- **Save Preferences button**

### Tab 3: Security
- **Password Management:**
  - Current password field
  - New password field
  - Confirm password field
  - Password strength indicator
  - Change Password button
- **Two-Factor Authentication:**
  - Enable/disable 2FA
  - QR code for setup
  - Backup codes
- **Active Sessions:**
  - List of active sessions
  - Device information
  - Sign out options
- **Security Log:**
  - Recent security events
  - Login history

### Tab 4: Preferences
- **Language & Region:**
  - Language selector (English, Spanish, etc.)
  - Timezone selector
  - Date format selector (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
  - Currency format
- **Display Preferences:**
  - Theme toggle (Light/Dark) - syncs with global theme
  - Compact mode
  - Default view settings
- **Save Preferences button**

### Tab 5: Organization
- **Organization Information:**
  - Organization Name
  - EIN (Tax ID)
  - Address
  - Phone
- **Billing & Subscription:**
  - Current plan (Professional Plan)
  - Monthly cost ($199/month)
  - Nonprofit count (Up to 50 nonprofits)
  - Status badge (Active)
  - Next billing date
  - Change Plan button
  - Update Payment Method button
- **API Access:**
  - API Key (masked)
  - Regenerate button
- **Save Changes button**

### Settings Layout
```
┌─────────────────────────────────────────────────┐
│ [Profile] [Notifications] [Security] [Preferences] [Organization] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Profile Information                            │
│  ┌─────────────────────────────────────┐       │
│  │ [Avatar]  Change Photo              │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  First Name: [John        ]                    │
│  Last Name:  [Doe         ]                    │
│  Email:      [john@...    ]                    │
│  Phone:      [+1 555...   ]                    │
│                                                 │
│  [Save Changes]                                 │
└─────────────────────────────────────────────────┘
```

## Data Requirements

### User Profile
- **user_id** (uuid)
- **first_name** (string)
- **last_name** (string)
- **email** (string)
- **phone** (string, nullable)
- **job_title** (string, nullable)
- **role** (enum) - 'admin', 'manager', 'staff', 'donor', 'volunteer'
- **avatar_url** (string, nullable)

### Notification Preferences
- **email_notifications** (boolean)
- **push_notifications** (boolean)
- **donation_alerts** (boolean)
- **weekly_reports** (boolean)
- **monthly_reports** (boolean)

### Security Settings
- **two_factor_enabled** (boolean)
- **backup_codes** (array of strings)
- **active_sessions** (array) - Device, location, last active
- **security_log** (array) - Event type, timestamp, IP

### User Preferences
- **language** (string) - 'en', 'es', 'fr', etc.
- **timezone** (string) - IANA timezone
- **date_format** (string) - 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'
- **theme** (enum) - 'light', 'dark', 'system'

### Organization Settings (if authorized)
- **organization_id** (uuid)
- **organization_name** (string)
- **ein** (string)
- **address** (string)
- **phone** (string)
- **subscription_plan** (string)
- **subscription_cost** (decimal)
- **subscription_status** (enum) - 'active', 'past_due', 'canceled'
- **next_billing_date** (date)
- **api_key** (string, masked)

## API Endpoints Required

### GET /api/v1/users/:id/profile
```
Description: Get user profile information
Response: {
  data: {
    user_id: "uuid",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@infocusministries.org",
    phone: "+1 (555) 123-4567",
    job_title: "Financial Administrator",
    role: "admin",
    avatar_url: "https://..."
  }
}
```

### PUT /api/v1/users/:id/profile
```
Description: Update user profile
Request Body: {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@infocusministries.org",
  phone: "+1 (555) 123-4567",
  job_title: "Financial Administrator"
}

Response: {
  data: { ...updated profile },
  message: "Profile updated successfully"
}
```

### POST /api/v1/users/:id/avatar
```
Description: Upload profile picture
Request: multipart/form-data with image file

Response: {
  data: {
    avatar_url: "https://..."
  },
  message: "Avatar uploaded successfully"
}
```

### GET /api/v1/users/:id/notification_preferences
```
Description: Get notification preferences
Response: {
  data: {
    email_notifications: true,
    push_notifications: true,
    donation_alerts: true,
    weekly_reports: true,
    monthly_reports: true
  }
}
```

### PUT /api/v1/users/:id/notification_preferences
```
Description: Update notification preferences
Request Body: {
  email_notifications: true,
  push_notifications: false,
  donation_alerts: true,
  weekly_reports: true,
  monthly_reports: false
}

Response: {
  data: { ...updated preferences },
  message: "Preferences saved successfully"
}
```

### POST /api/v1/users/:id/change_password
```
Description: Change user password
Request Body: {
  current_password: "oldpassword",
  new_password: "newpassword",
  confirm_password: "newpassword"
}

Response: {
  message: "Password changed successfully"
}
```

### POST /api/v1/users/:id/enable_2fa
```
Description: Enable two-factor authentication
Response: {
  data: {
    qr_code: "data:image/png;base64,...",
    backup_codes: ["code1", "code2", ...],
    secret: "SECRET_KEY"
  }
}
```

### GET /api/v1/users/:id/preferences
```
Description: Get user preferences
Response: {
  data: {
    language: "en",
    timezone: "America/Los_Angeles",
    date_format: "MM/DD/YYYY",
    theme: "dark"
  }
}
```

### PUT /api/v1/users/:id/preferences
```
Description: Update user preferences
Request Body: {
  language: "en",
  timezone: "America/Los_Angeles",
  date_format: "MM/DD/YYYY"
}

Response: {
  data: { ...updated preferences },
  message: "Preferences saved successfully"
}
```

### GET /api/v1/organizations/:id
```
Description: Get organization settings (authorized users only)
Response: {
  data: {
    organization_id: "uuid",
    organization_name: "InFocus Ministries",
    ein: "XX-XXXXXXX",
    address: "123 Main St, Seattle, WA 98101",
    phone: "+1 (555) 987-6543",
    subscription: {
      plan: "Professional Plan",
      cost: 199.00,
      status: "active",
      next_billing_date: "2025-11-20"
    },
    api_key: "sk_live_••••••••••••••••••••1234"
  }
}
```

### PUT /api/v1/organizations/:id
```
Description: Update organization settings
Request Body: {
  organization_name: "InFocus Ministries",
  ein: "XX-XXXXXXX",
  address: "123 Main St, Seattle, WA 98101",
  phone: "+1 (555) 987-6543"
}

Response: {
  data: { ...updated organization },
  message: "Organization settings saved"
}
```

### POST /api/v1/organizations/:id/regenerate_api_key
```
Description: Regenerate API key
Response: {
  data: {
    api_key: "sk_live_new_key_here"
  },
  message: "API key regenerated successfully"
}
```

## Request/Response Schemas

```typescript
interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  role: 'admin' | 'manager' | 'staff' | 'donor' | 'volunteer';
  avatar_url?: string;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  donation_alerts: boolean;
  weekly_reports: boolean;
  monthly_reports: boolean;
}

interface UserPreferences {
  language: string;
  timezone: string;
  date_format: string;
  theme: 'light' | 'dark' | 'system';
}

interface OrganizationSettings {
  organization_id: string;
  organization_name: string;
  ein: string;
  address: string;
  phone: string;
  subscription: {
    plan: string;
    cost: number;
    status: 'active' | 'past_due' | 'canceled';
    next_billing_date: string;
  };
  api_key: string;
}
```

## Authentication & Authorization

### Required Permissions
- `profile:read` - View own profile
- `profile:update` - Update own profile
- `organization:read` - View organization settings (admin only)
- `organization:update` - Update organization settings (admin only)

### Role-Based Access
- **All Users:** Can access Profile, Notifications, Security, Preferences tabs
- **Fiscal Sponsor/Admin:** Can access Organization tab
- **Nonprofit User:** Can access Organization tab (limited to their org)
- **Staff/Donor/Volunteer:** No Organization tab access

## Business Logic & Validations

### Frontend Validations
- Email format validation
- Phone format validation
- Password strength requirements (min 8 chars, uppercase, lowercase, number, special char)
- Password confirmation match
- File size limit for avatar (5MB)
- Accepted file types (JPG, PNG, GIF)

### Backend Validations (Rails)
- Unique email check
- Valid timezone
- Valid language code
- Valid date format
- Password complexity requirements
- Current password verification for password change
- Organization access authorization

### Business Rules
- Theme preference syncs with global theme state
- Notification preferences affect email/push delivery
- 2FA required for admin users (future)
- API key regeneration invalidates old key
- Organization settings only visible to authorized users
- Profile changes logged in audit trail

## State Management

### Local State
- `emailNotifications` - Email toggle
- `pushNotifications` - Push toggle
- `donationAlerts` - Donation alerts toggle
- `weeklyReports` - Weekly reports toggle
- `monthlyReports` - Monthly reports toggle
- `language` - Selected language
- `timezone` - Selected timezone
- `dateFormat` - Selected date format

### Global State (AppContext)
- `theme` - Global theme setting
- `toggleTheme` - Theme toggle function
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- UI components (Card, Button, Input, Switch, Tabs, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to save settings"
2. **Invalid Email:** Show error "Invalid email format"
3. **Weak Password:** Show error "Password too weak"
4. **Password Mismatch:** Show error "Passwords don't match"
5. **Wrong Current Password:** Show toast "Current password incorrect"
6. **File Too Large:** Show error "File exceeds 5MB limit"
7. **Unauthorized:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton form fields
- **Save actions:** Button loading state
- **Avatar upload:** Progress indicator
- **Tab switching:** Instant (no loading)

## Mock Data to Remove
- `Settings.tsx` - All default values (load from API)
- Move interfaces to `src/types/settings.ts`

## Migration Notes

### Phase 1: Profile API
1. Create `src/api/users.ts`
2. Implement profile endpoints
3. Test CRUD operations
4. Add avatar upload

### Phase 2: Preferences
1. Implement notification preferences
2. Implement user preferences
3. Test theme synchronization
4. Add validation

### Phase 3: Security
1. Implement password change
2. Add 2FA setup
3. Add session management
4. Implement security log

### Phase 4: Organization
1. Implement organization settings
2. Add billing integration
3. Implement API key management
4. Add usage analytics

## Related Documentation
- [01-USER-MANAGEMENT.md](./01-USER-MANAGEMENT.md)
- [02-NONPROFIT-MANAGEMENT.md](./02-NONPROFIT-MANAGEMENT.md)
- [../../../04-USER-ROLES-AND-PERMISSIONS.md](../../04-USER-ROLES-AND-PERMISSIONS.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Theme Synchronization
The theme toggle in Settings syncs with the global theme state in AppContext. Changes apply immediately across the entire application.

### Notification Delivery
- Email notifications sent via configured email service
- Push notifications require browser permission
- Preferences stored per user
- Can be overridden by organization-level settings

### Security Best Practices
- Passwords hashed with bcrypt
- 2FA using TOTP (Time-based One-Time Password)
- Session tokens with expiration
- Security events logged
- Failed login attempts tracked

### Organization Tab Visibility
Only shown to users with organization management permissions:
- Fiscal sponsor administrators
- Nonprofit administrators (for their org only)
- Hidden for staff, donors, volunteers

### API Key Usage
- Used for programmatic API access
- Should be kept secret
- Regeneration invalidates old key
- Rate limited per key
- Logged for audit purposes
