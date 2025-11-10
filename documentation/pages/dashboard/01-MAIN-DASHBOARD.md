# Main Dashboard

**Component File:** `src/App.tsx` (Dashboard section)  
**Route:** `/` or `/dashboard`  
**Access Level:** All authenticated users

## Overview
The Main Dashboard is the landing page of the application, providing an at-a-glance view of key metrics, donation trends, recent activity, and tasks. It features a customizable layout with drag-and-drop components, time period filtering, and organization selection. The dashboard aggregates data from across the system to give users a comprehensive overview of their nonprofit's performance.

## UI Features

### Main Features
- **Metrics Cards (4 cards):**
  - Total Donations (with trend)
  - Active Donors (with trend)
  - Volunteer Hours (with trend)
  - Upcoming Events (with trend)
- **Time Period Selector:**
  - Day
  - Week
  - Month
  - Year to Date (YTD)
- **Organization Selector:**
  - Dropdown to switch between nonprofits
  - "All Organizations" option for consolidated view
- **Customizable Layout:**
  - Drag-and-drop component reordering
  - "Change Layout" button to enter edit mode
  - "Done" and "Reset" buttons in edit mode
- **Dashboard Components:**
  - Donation Trends Chart (line chart)
  - Recent Donations Table
  - Top Donors Table
  - Todo List

### Metrics Cards
Each metric card displays:
- **Label:** Metric name
- **Value:** Current value (formatted)
- **Trend Badge:** Percentage change with up/down/neutral indicator
- **Icon:** Visual identifier

### Donation Trends Chart
- Line chart showing donation amounts over time
- X-axis: Time periods (days, weeks, months)
- Y-axis: Donation amounts (formatted as $Xk)
- Responsive design
- Dark mode support
- Tooltip on hover

### Recent Donations Table
- Date
- Donor Name
- Amount
- Payment Method
- Status Badge
- Quick actions (View, Receipt)
- Pagination
- Sortable columns

### Top Donors Table
- Rank
- Donor Name
- Total Donated (lifetime)
- Last Donation Date
- Donation Count
- Quick actions (View Profile)

### Todo List
- Task description
- Due date
- Priority badge
- Checkbox to mark complete
- Add new task button
- Filter by status (All, Active, Completed)

## Data Requirements

### Dashboard Metrics Data
- **total_donations** (decimal) - Total donations for period
- **total_donations_change** (decimal) - Percentage change vs previous period
- **active_donors** (integer) - Number of active donors
- **active_donors_change** (decimal) - Percentage change
- **volunteer_hours** (decimal) - Total volunteer hours
- **volunteer_hours_change** (decimal) - Percentage change
- **upcoming_events** (integer) - Number of upcoming events
- **upcoming_events_change** (decimal) - Percentage change

### Donation Trends Data
- **period** (string) - Time period label
- **amount** (decimal) - Donation amount for period
- Array of data points based on selected time period

### Recent Donations Data
- **id** (uuid) - Donation ID
- **date** (date) - Donation date
- **donor_name** (string) - Donor name
- **amount** (decimal) - Donation amount
- **payment_method** (string) - Payment method
- **status** (string) - 'completed', 'pending', 'failed'

### Top Donors Data
- **donor_id** (uuid) - Donor ID
- **donor_name** (string) - Donor name
- **total_donated** (decimal) - Lifetime donations
- **last_donation_date** (date) - Most recent donation
- **donation_count** (integer) - Number of donations

### Todo Data
- **id** (uuid) - Todo ID
- **description** (string) - Task description
- **due_date** (date, nullable) - Due date
- **priority** (string) - 'high', 'medium', 'low'
- **status** (string) - 'pending', 'completed'
- **created_by_id** (uuid) - User who created
- **assigned_to_id** (uuid, nullable) - User assigned to

### Data Mutations
- **Update Layout:** Save dashboard component order
- **Create Todo:** Add new task
- **Update Todo:** Edit task or mark complete
- **Delete Todo:** Remove task

## API Endpoints Required

### GET /api/v1/dashboard/metrics
```
Description: Get dashboard metrics
Query Parameters:
  - organization_id (required, uuid) - Use 'all' for consolidated view
  - time_period (required, string) - 'day', 'week', 'month', 'ytd'

Response: {
  data: {
    total_donations: {
      value: 45230.50,
      change: 12.5,
      trend: "up"
    },
    active_donors: {
      value: 245,
      change: 8.3,
      trend: "up"
    },
    volunteer_hours: {
      value: 1850.5,
      change: -3.2,
      trend: "down"
    },
    upcoming_events: {
      value: 7,
      change: 0,
      trend: "neutral"
    }
  }
}
```

### GET /api/v1/dashboard/donation_trends
```
Description: Get donation trend data for chart
Query Parameters:
  - organization_id (required, uuid)
  - time_period (required, string) - 'day', 'week', 'month', 'ytd'

Response: {
  data: [
    { period: "Week 1", amount: 3500.00 },
    { period: "Week 2", amount: 4200.00 },
    { period: "Week 3", amount: 3800.00 },
    { period: "Week 4", amount: 5100.00 }
  ]
}
```

### GET /api/v1/dashboard/recent_donations
```
Description: Get recent donations
Query Parameters:
  - organization_id (required, uuid)
  - limit (optional, integer, default: 10)

Response: {
  data: [
    {
      id: "uuid",
      date: "2024-11-10",
      donor_name: "John Doe",
      amount: 250.00,
      payment_method: "Credit Card",
      status: "completed"
    }
  ]
}
```

### GET /api/v1/dashboard/top_donors
```
Description: Get top donors by total donated
Query Parameters:
  - organization_id (required, uuid)
  - limit (optional, integer, default: 10)
  - time_period (optional, string) - Filter by period or lifetime

Response: {
  data: [
    {
      donor_id: "uuid",
      donor_name: "Sarah Johnson",
      total_donated: 15420.00,
      last_donation_date: "2024-11-05",
      donation_count: 24
    }
  ]
}
```

### GET /api/v1/todos
```
Description: Get todos for current user
Query Parameters:
  - organization_id (optional, uuid)
  - status (optional, string) - 'pending', 'completed', 'all'
  - limit (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      description: "Review pending expense reports",
      due_date: "2024-11-15",
      priority: "high",
      status: "pending",
      created_by: "Jane Smith",
      assigned_to: "Current User",
      created_at: "2024-11-08T10:00:00Z"
    }
  ]
}
```

### POST /api/v1/todos
```
Description: Create new todo
Request Body: {
  organization_id: "uuid",
  description: "Review pending expense reports",
  due_date: "2024-11-15",
  priority: "high",
  assigned_to_id: "uuid" (optional)
}

Response: {
  data: {
    id: "uuid",
    ...todo fields
  },
  message: "Todo created successfully"
}
```

### PUT /api/v1/todos/:id
```
Description: Update todo
Path Parameters:
  - id (required, uuid)
Request Body: {
  description: "Updated description",
  due_date: "2024-11-16",
  priority: "medium",
  status: "completed"
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Todo updated successfully"
}
```

### DELETE /api/v1/todos/:id
```
Description: Delete todo
Path Parameters:
  - id (required, uuid)

Response: {
  message: "Todo deleted successfully"
}
```

### GET /api/v1/dashboard/layout
```
Description: Get user's dashboard layout preferences
Query Parameters:
  - organization_id (optional, uuid)

Response: {
  data: {
    component_order: ["donations-chart", "recent-donations", "todo-list", "top-donors"]
  }
}
```

### PUT /api/v1/dashboard/layout
```
Description: Save dashboard layout preferences
Request Body: {
  organization_id: "uuid",
  component_order: ["donations-chart", "recent-donations", "todo-list", "top-donors"]
}

Response: {
  data: {
    component_order: ["donations-chart", "recent-donations", "todo-list", "top-donors"]
  },
  message: "Dashboard layout saved successfully"
}
```

## Request/Response Schemas

### DashboardMetrics Schema
```typescript
interface DashboardMetrics {
  total_donations: MetricValue;
  active_donors: MetricValue;
  volunteer_hours: MetricValue;
  upcoming_events: MetricValue;
}

interface MetricValue {
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface DonationTrend {
  period: string;
  amount: number;
}

interface Todo {
  id: string;
  description: string;
  due_date?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  created_by: string;
  assigned_to?: string;
  created_at: string;
}
```

## Authentication & Authorization

### Required Permissions
- `dashboard:read` - View dashboard (all users)
- `todos:read` - View todos
- `todos:write` - Create and edit todos
- `todos:delete` - Delete todos

### Role-Based Access
- **Admin:** Full access, sees all organizations
- **Manager:** Full access to assigned organizations
- **Staff:** Full access to assigned organizations
- **Volunteer:** Limited view, own todos only

## Business Logic & Validations

### Frontend Validations
- Time period selection required
- Organization selection required
- Todo description required
- Due date must be in future (for new todos)

### Backend Validations (Rails)
- Valid organization access
- Valid time period values
- Todo description max length (500 chars)
- User can only update own todos (unless admin/manager)
- Dashboard layout component IDs must be valid

### Business Rules
- Metrics calculated based on selected time period
- Comparison period is previous equivalent period
- "All Organizations" shows consolidated data
- Dashboard layout saved per user per organization
- Todos can be assigned to other users
- Completed todos remain visible
- Chart data aggregated by selected time period
- Recent donations limited to last 30 days
- Top donors ranked by lifetime giving

## State Management

### Local State
- `sidebarOpen` - Mobile sidebar visibility
- `isLayoutEditing` - Layout edit mode

### Global State (AppContext)
- `selectedEntity` - Current organization
- `timePeriod` - Selected time period
- `dashboardLayout` - Component order array
- `currentPage` - Current page ('dashboard')
- `theme` - Light/dark mode
- `todos` - Todo list

## Dependencies

### Internal Dependencies
- `AppContext` - Global state management
- Mock data - **TO BE REMOVED** - `getMetrics()`, `getDonationsData()`
- UI components (Card, Button, Select, etc.)
- Chart library (Recharts)
- Drag-and-drop library (react-dnd)

### External Libraries
- `lucide-react` - Icons
- `recharts` - Charts
- `react-dnd` - Drag and drop
- `react-dnd-html5-backend` - HTML5 drag backend

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load dashboard", retry
2. **No Data:** Show empty state "No data available for this period"
3. **Invalid Period:** Default to 'month'
4. **Layout Save Failed:** Show toast "Failed to save layout"
5. **Todo Create Failed:** Show error message
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton cards and charts
- **Metrics refresh:** Shimmer effect on cards
- **Chart loading:** Loading spinner overlay
- **Todo actions:** Disable buttons, show spinner
- **Layout save:** Brief loading indicator

## Mock Data to Remove
- `App.tsx` - `getMetrics()` call
- `RevenueChart.tsx` - `getDonationsData()` call
- `RecentDonationsTable.tsx` - Mock donations array
- `TopDonorsTable.tsx` - Mock donors array
- `TodoList.tsx` - Mock todos array
- `AppContext.tsx` - Mock entities array
- Move interfaces to `src/types/dashboard.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/dashboard.ts`
2. Create `src/types/dashboard.ts`
3. Implement metrics endpoint
4. Implement donation trends endpoint
5. Test time period filtering

### Phase 2: Dashboard Components
1. Implement recent donations endpoint
2. Implement top donors endpoint
3. Implement todos CRUD
4. Test all components with real data

### Phase 3: Customization
1. Implement layout save/load
2. Test drag-and-drop persistence
3. Implement user preferences
4. Test multi-organization switching

### Phase 4: Performance
1. Implement caching for metrics
2. Optimize chart rendering
3. Implement real-time updates (optional)
4. Add refresh button/auto-refresh

## Related Documentation
- [../donor-hub/02-DONATIONS-MANAGER.md](../donor-hub/02-DONATIONS-MANAGER.md) - Donation data source
- [../donor-hub/01-DONORS-CRM.md](../donor-hub/01-DONORS-CRM.md) - Donor data source
- [../personnel/03-HOUR-TRACKING.md](../personnel/03-HOUR-TRACKING.md) - Volunteer hours source
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Data models
- [02-API-REQUIREMENTS.md](../../02-API-REQUIREMENTS.md) - API overview

## Additional Notes

### Dashboard Component Types
The dashboard supports these draggable components:
- `donations-chart` - Donation trends line chart
- `recent-donations` - Recent donations table
- `todo-list` - Todo list widget
- `top-donors` - Top donors table

### Time Period Calculations
- **Day:** Last 24 hours, hourly breakdown
- **Week:** Last 7 days, daily breakdown
- **Month:** Last 4 weeks, weekly breakdown
- **YTD:** January 1 to today, monthly breakdown

### Metrics Comparison Logic
- Compare current period to previous equivalent period
- Example: This month vs last month
- Trend calculated as: ((current - previous) / previous) * 100

### Multi-Organization View
When "All Organizations" is selected:
- Metrics aggregated across all accessible organizations
- Charts show combined data
- Tables include organization column
- Todos from all organizations shown
