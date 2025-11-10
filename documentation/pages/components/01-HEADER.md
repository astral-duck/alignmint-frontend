# Header Component

**Component File:** `src/components/Header.tsx`  
**Usage:** Global top navigation bar  
**Access Level:** All authenticated users

## Overview
The Header component provides the top navigation bar for the application. It displays the organization selector, theme toggle, notification bell, and user profile menu. The header is persistent across all pages and provides quick access to key global functions.

## UI Features

### Main Elements
- **Organization Selector** - Dropdown to switch between nonprofits (fiscal sponsor view)
- **Theme Toggle** - Switch between light/dark mode
- **Notification Bell** - Shows notification count badge
- **User Profile Menu** - Avatar with dropdown menu

### User Profile Menu Options
- View Profile
- Settings
- Sign Out

## Functionality

### Organization Switching
- Fiscal sponsors see all nonprofits in dropdown
- Individual nonprofits see only their organization
- Selection updates global `selectedEntity` state
- Triggers data refresh across application

### Theme Toggle
- Switches between light and dark mode
- Persists preference to localStorage
- Updates global theme state
- Applies immediately across all components

### Notifications
- Badge shows unread count
- Click opens notification panel
- Real-time updates (future)

## State Management

### Global State (AppContext)
- `selectedEntity` - Current organization
- `setSelectedEntity` - Change organization
- `theme` - Current theme ('light' or 'dark')
- `toggleTheme` - Toggle theme
- `notifications` - Notification array
- `entities` - Available organizations

## Related Documentation
- [02-APP-SIDEBAR.md](./02-APP-SIDEBAR.md)
- [03-NOTIFICATION-PANEL.md](./03-NOTIFICATION-PANEL.md)
- [../administration/03-SETTINGS.md](../administration/03-SETTINGS.md)
