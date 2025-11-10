# Donor Hub

**Component File:** `src/components/DonorHub.tsx`  
**Route:** `/donor-hub`  
**Access Level:** Admin, Manager, Marketing Staff

## Overview
The Donor Hub is a navigation landing page that provides access to all donor-related tools. It displays a grid of tool cards for managing donors, donations, custom donation pages, and the donor portal.

## UI Features

### Tool Cards (4 tools)
1. **Donors** - Manage donor relationships and contact information
2. **Donations** - Track and manage all donation transactions
3. **Donor Page** - Create custom donation landing pages
4. **Donor Portal** - View donation history and generate tax reports

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
| `donors` | Donor Hub → Donors | DonorsCRM |
| `donations` | Donor Hub → Donations | DonationsManager |
| `donor-page` | Donor Hub → Donor Page | DonorPageManager |
| `donor-portal` | Donor Hub → Portal | DonorPortal |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `visibilityEditMode` - Edit mode for showing/hiding tools
- `isTileVisible(pageId, toolId)` - Check tool visibility
- `toggleTileVisibility(pageId, toolId)` - Toggle tool visibility

## Related Documentation
- [../donor-hub/01-DONORS-CRM.md](../donor-hub/01-DONORS-CRM.md)
- [../donor-hub/02-DONATIONS-MANAGER.md](../donor-hub/02-DONATIONS-MANAGER.md)
- [../donor-hub/03-DONOR-PAGE-BUILDER.md](../donor-hub/03-DONOR-PAGE-BUILDER.md)
- [../donor-hub/04-DONOR-PORTAL.md](../donor-hub/04-DONOR-PORTAL.md)
- [../donor-hub/05-DONOR-PAGE-MANAGER.md](../donor-hub/05-DONOR-PAGE-MANAGER.md)
- [../donor-hub/06-DONOR-PAGE-PREVIEW.md](../donor-hub/06-DONOR-PAGE-PREVIEW.md)
- [../donor-hub/07-DONOR-PAYMENT-MANAGEMENT.md](../donor-hub/07-DONOR-PAYMENT-MANAGEMENT.md)
