# Top Donors Table Component

**Component File:** Part of Dashboard  
**Usage:** Display top donors on dashboard  
**Access Level:** All authenticated users

## Overview
The Top Donors Table component displays the highest contributing donors for the selected time period. It shows donor name, total donated amount, and number of donations. This helps identify major supporters and track donor engagement.

## UI Features

### Table Columns
- **Rank** - Position (1, 2, 3, etc.)
- **Donor** - Donor name
- **Total Donated** - Sum of donations (formatted as currency)
- **Donations** - Number of donations

### Features
- Shows top 5-10 donors
- Ranked by total amount
- Click row to view donor profile
- "View All" link to Donors CRM
- Empty state if no donors

## Data Requirements

### Top Donor
```typescript
interface TopDonor {
  id: string;
  name: string;
  total_donated: number;
  donation_count: number;
  rank: number;
}
```

## State Management

### Global State (AppContext)
- `selectedEntity` - Current organization
- `timePeriod` - Selected time period
- Mock data from `getTopDonors()`

## API Endpoints Required

### GET /api/v1/analytics/top_donors
```
Description: Get top donors
Query Parameters:
  - organization_id (uuid)
  - period (enum) - 'day', 'week', 'month', 'ytd', 'all'
  - limit (integer, default: 10)

Response: {
  data: [
    {
      id: "uuid",
      name: "John Smith",
      total_donated: 15000.00,
      donation_count: 12,
      rank: 1
    }
  ]
}
```

## Related Documentation
- [../dashboard/01-MAIN-DASHBOARD.md](../dashboard/01-MAIN-DASHBOARD.md)
- [../donor-hub/01-DONORS-CRM.md](../donor-hub/01-DONORS-CRM.md)
- [07-RECENT-DONATIONS-TABLE.md](./07-RECENT-DONATIONS-TABLE.md)
