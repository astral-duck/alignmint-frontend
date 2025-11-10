# Draggable Component

**Component File:** Dashboard layout system  
**Usage:** Enable drag-and-drop dashboard customization  
**Access Level:** All authenticated users

## Overview
The Draggable Component system allows users to customize their dashboard layout by dragging and dropping widgets. Users can rearrange metrics cards, charts, and tables to create their preferred dashboard view. Layout preferences are saved per user.

## UI Features

### Draggable Widgets
- Metrics Cards
- Revenue Chart
- Recent Donations Table
- Top Donors Table
- Todo List
- Custom widgets (future)

### Features
- Drag handle indicator
- Drop zone highlighting
- Smooth animations
- Layout persistence
- Reset to default option

## Dashboard Layout

### Grid System
- Responsive grid layout
- Configurable columns (1-4)
- Widget sizing options (1x1, 2x1, 1x2, 2x2)
- Automatic reflow on mobile

## State Management

### Global State (AppContext)
- `dashboardLayout` - Array of widget configurations
- `updateDashboardLayout(layout)` - Save new layout

### Layout Configuration
```typescript
interface DashboardWidget {
  id: string;
  type: 'metrics' | 'chart' | 'table' | 'todo';
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}
```

## API Endpoints Required

### GET /api/v1/users/:id/dashboard_layout
```
Description: Get user's dashboard layout
Response: {
  data: {
    layout: [
      {
        id: "metrics-1",
        type: "metrics",
        position: { x: 0, y: 0 },
        size: { width: 1, height: 1 },
        visible: true
      }
    ]
  }
}
```

### PUT /api/v1/users/:id/dashboard_layout
```
Description: Save dashboard layout
Request Body: {
  layout: [...]
}
```

## Dependencies

### External Libraries
- `react-grid-layout` or `dnd-kit` - Drag and drop functionality

## Related Documentation
- [../dashboard/01-MAIN-DASHBOARD.md](../dashboard/01-MAIN-DASHBOARD.md)
- [05-METRICS-CARD.md](./05-METRICS-CARD.md)
