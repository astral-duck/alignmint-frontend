# People Hub

**Component File:** `src/components/PersonnelHub.tsx`  
**Route:** `/people`  
**Access Level:** Admin, Manager, HR Staff

## Overview
The People Hub is a navigation landing page that provides access to all people-related tools. It displays a grid of tool cards for managing staff, volunteers, and hour tracking.

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
| `groups` | People → Groups | PersonnelCRM |
| `volunteers` | People → Volunteers | VolunteersCRM |
| `hour-tracking` | People → Hours | HourTracking |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `visibilityEditMode` - Edit mode for showing/hiding tools
- `isTileVisible(pageId, toolId)` - Check tool visibility
- `toggleTileVisibility(pageId, toolId)` - Toggle tool visibility

## Related Documentation
- [../people/01-PEOPLE-CRM.md](../people/01-PEOPLE-CRM.md)
- [../people/02-VOLUNTEERS-CRM.md](../people/02-VOLUNTEERS-CRM.md)
- [../people/03-HOUR-TRACKING.md](../people/03-HOUR-TRACKING.md)
