# Administration Hub

**Component File:** `src/components/AdministrationHub.tsx`  
**Route:** `/administration`  
**Access Level:** Admin Only (Fiscal Sponsor for full access)

## Overview
The Administration Hub is a navigation landing page that provides access to all administrative tools. It displays a grid of tool cards for user management, donor management, nonprofit management, and chart of accounts. Some tools are restricted to fiscal sponsor administrators only.

## UI Features

### Tool Cards (4 tools)
1. **User Management** - Manage user accounts and permissions (InFocus Ministries only)
2. **Donor Management** - Manage donor records and relationships
3. **Nonprofit Management** - Add, remove, and control nonprofit visibility
4. **Chart of Accounts** - Manage account categories and bank accounts

### Features
- Grid layout (responsive: 1/2/3 columns)
- Icon-based tool cards
- Hover effects
- Conditional tool display (User Management only for fiscal sponsor)
- Tool descriptions
- Click to navigate

## Navigation Mapping

| Tool ID | Routes To | Component | Access |
|---------|-----------|-----------|--------|
| `users` | Administration → Users | UserManagement | Fiscal Sponsor Only |
| `donor-management` | Administration → Donors | DonorsCRM | All Admins |
| `nonprofit-management` | Administration → Nonprofits | NonprofitManagement | All Admins |
| `chart-of-accounts` | Administration → Chart | ChartOfAccountsManager | All Admins |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `selectedEntity` - Filters tools (User Management only if 'infocus-ministries')

## Related Documentation
- [../administration/01-USER-MANAGEMENT.md](../administration/01-USER-MANAGEMENT.md)
- [../administration/02-NONPROFIT-MANAGEMENT.md](../administration/02-NONPROFIT-MANAGEMENT.md)
- [../administration/03-SETTINGS.md](../administration/03-SETTINGS.md)
