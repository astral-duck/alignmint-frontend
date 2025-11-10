# Revenue Chart Component

**Component File:** `src/components/RevenueChart.tsx`  
**Usage:** Display donation trends on dashboard  
**Access Level:** All authenticated users

## Overview
The Revenue Chart component displays a line chart showing donation trends over time. It uses Recharts library to visualize donation data based on the selected time period (day, week, month, YTD). The chart updates dynamically when the user changes the organization or time period.

## UI Features

### Chart Display
- Line chart with gradient fill
- X-axis: Time labels (hours, days, weeks, months)
- Y-axis: Donation amounts (formatted as currency)
- Tooltip on hover showing exact values
- Responsive sizing

### Time Period Options
- **Day** - Hourly breakdown (12am, 4am, 8am, etc.)
- **Week** - Daily breakdown (Mon-Sun)
- **Month** - Weekly breakdown (Week 1-4)
- **YTD** - Monthly breakdown (Jan-Oct)

## Data Requirements

### Chart Data Point
```typescript
interface ChartDataPoint {
  month: string;      // Label (can be hour, day, week, or month)
  donations: number;  // Donation amount
}
```

## State Management

### Global State (AppContext)
- `selectedEntity` - Current organization
- `timePeriod` - Selected time period
- Mock data from `getDonationsData(entityId, timePeriod)`

## API Endpoints Required

### GET /api/v1/analytics/donations
```
Description: Get donation trends
Query Parameters:
  - organization_id (uuid)
  - period (enum) - 'day', 'week', 'month', 'ytd'
  - start_date (date, optional)
  - end_date (date, optional)

Response: {
  data: [
    {
      label: "Week 1",
      amount: 12500.00
    },
    {
      label: "Week 2",
      amount: 15300.00
    }
  ]
}
```

## Dependencies

### External Libraries
- `recharts` - Chart rendering library
- `lucide-react` - Icons

## Related Documentation
- [../dashboard/01-MAIN-DASHBOARD.md](../dashboard/01-MAIN-DASHBOARD.md)
- [05-METRICS-CARD.md](./05-METRICS-CARD.md)
- [07-RECENT-DONATIONS-TABLE.md](./07-RECENT-DONATIONS-TABLE.md)
