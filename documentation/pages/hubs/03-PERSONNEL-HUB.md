# Personnel Hub (People)

**Component File:** `src/components/PersonnelHub.tsx`  
**Route:** `/people`  
**Access Level:** Admin, Manager, HR Staff

## Overview
The Personnel Hub (labeled "People" in the UI) is a navigation landing page that provides access to all personnel-related tools. It displays a grid of tool cards for managing staff, volunteers, and hour tracking.

## UI Features

### Tool Cards (3 tools)
1. **Groups & Teams** - Manage staff, leadership, and organizational teams
2. **Volunteers** - Coordinate and track volunteer activities
3. **Hour Tracking** - Submit and manage volunteer hours

### Features
- Grid layout (responsive: 1/2/3 columns)
- Icon-based tool cards
- Hover effects
- Visibility toggle (edit mode)
- Tool descriptions
- Click to navigate

## Navigation Mapping

| Tool ID | Routes To | Component |
|---------|-----------|-----------|
| `groups` | Personnel → Groups | PersonnelCRM |
| `volunteers` | Personnel → Volunteers | VolunteersCRM |
| `hour-tracking` | Personnel → Hours | HourTracking |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `visibilityEditMode` - Edit mode for showing/hiding tools
- `isTileVisible(pageId, toolId)` - Check tool visibility
- `toggleTileVisibility(pageId, toolId)` - Toggle tool visibility

## Related Documentation
- [../personnel/01-PERSONNEL-CRM.md](../personnel/01-PERSONNEL-CRM.md)
- [../personnel/02-VOLUNTEERS-CRM.md](../personnel/02-VOLUNTEERS-CRM.md)
- [../personnel/03-HOUR-TRACKING.md](../personnel/03-HOUR-TRACKING.md)
- [../personnel/04-LEAVE-REQUESTS.md](../personnel/04-LEAVE-REQUESTS.md)
