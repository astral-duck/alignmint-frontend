# Marketing Hub

**Component File:** `src/components/MarketingHub.tsx`  
**Route:** `/marketing`  
**Access Level:** Admin, Manager, Marketing Staff

## Overview
The Marketing Hub is a navigation landing page that provides access to all marketing-related tools. It displays a grid of tool cards for email campaigns, video donation pages, and prospect management.

## UI Features

### Tool Cards (3 tools)
1. **Email Blast** - Create and send email campaigns to your donor base
2. **Video Bomb** - Create video donation pages with personalized messages
3. **Prospects** - Manage and reach out to potential new donors

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
| `email-blast` | Marketing → Email | MarketingCampaigns |
| `video-bomb` | Marketing → VideoBomb | VideoBombManager |
| `prospects` | Marketing → Prospects | ProspectsList |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `visibilityEditMode` - Edit mode for showing/hiding tools
- `isTileVisible(pageId, toolId)` - Check tool visibility
- `toggleTileVisibility(pageId, toolId)` - Toggle tool visibility

## Related Documentation
- [../marketing/01-MARKETING-CAMPAIGNS.md](../marketing/01-MARKETING-CAMPAIGNS.md)
- [../marketing/02-PROSPECTS-LIST.md](../marketing/02-PROSPECTS-LIST.md)
- [../marketing/03-VIDEOBOMB-MANAGER.md](../marketing/03-VIDEOBOMB-MANAGER.md)
