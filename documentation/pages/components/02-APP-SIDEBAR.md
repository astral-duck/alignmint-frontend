# App Sidebar Component

**Component File:** `src/components/AppSidebar.tsx`  
**Usage:** Main navigation sidebar  
**Access Level:** All authenticated users (content varies by role)

## Overview
The App Sidebar provides the main navigation structure for the application. It displays navigation items for Dashboard, Donor Hub, People, Marketing, Accounting, Reports, and Administration. The sidebar adapts based on user role and permissions, showing only accessible sections.

## UI Features

### Navigation Items
1. **Dashboard** - Home page with metrics
2. **Donor Hub** - Donor and donation management
3. **People** - Personnel and volunteers
4. **Marketing** - Campaigns and prospects
5. **Accounting** - Financial management
6. **Reports** - Financial reports
7. **Administration** - System administration

### Features
- Icon-based navigation
- Active page highlighting
- Collapsible on mobile
- Role-based visibility
- Hover tooltips

## Role-Based Navigation

### Fiscal Sponsor (Full Access)
- All navigation items visible
- Can switch between all nonprofits
- Access to Administration section

### Nonprofit User
- Dashboard, Donor Hub, People, Marketing, Accounting, Reports
- No Administration section
- Limited to own organization data

### Donor
- Only Donor Portal visible
- All other items hidden

### Volunteer
- Only Hour Tracking (in People) visible
- All other items hidden

## State Management

### Global State (AppContext)
- `currentPage` - Active page
- `setCurrentPage` - Navigate to page
- `userRole` - Current user's role (determines visibility)

## Related Documentation
- [01-HEADER.md](./01-HEADER.md)
- [../../04-USER-ROLES-AND-PERMISSIONS.md](../../04-USER-ROLES-AND-PERMISSIONS.md)
