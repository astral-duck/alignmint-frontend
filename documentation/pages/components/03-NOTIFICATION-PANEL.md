# Notification Panel Component

**Component File:** `src/components/NotificationPanel.tsx` (if exists) or embedded in Header  
**Usage:** Display system notifications  
**Access Level:** All authenticated users

## Overview
The Notification Panel displays system notifications, alerts, and updates to users. It shows donation alerts, approval requests, system messages, and activity updates. Users can mark notifications as read or dismiss them.

## UI Features

### Notification Types
- **Donation Alerts** - New donations received
- **Approval Requests** - Pending approvals (expenses, reimbursements, hours)
- **System Messages** - Important system updates
- **Activity Updates** - Team activity notifications

### Features
- Unread count badge
- Mark as read
- Dismiss notification
- Notification grouping
- Timestamp display
- Click to navigate to related item

## Notification Structure

### Notification Object
- **id** (uuid) - Unique identifier
- **type** (enum) - 'donation', 'approval', 'system', 'activity'
- **title** (string) - Notification title
- **message** (string) - Notification message
- **read** (boolean) - Read status
- **timestamp** (datetime) - When created
- **link** (string, nullable) - Navigation link
- **action** (string, nullable) - Action button text

## State Management

### Global State (AppContext)
- `notifications` - Array of notifications
- `markNotificationRead(id)` - Mark as read
- `dismissNotification(id)` - Remove notification

## Related Documentation
- [01-HEADER.md](./01-HEADER.md)
- [04-TODO-LIST.md](./04-TODO-LIST.md)
