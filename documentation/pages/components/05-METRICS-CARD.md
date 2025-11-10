# Metrics Card Component

**Component File:** `src/components/MetricsCard.tsx`  
**Usage:** Display KPI metrics on dashboard  
**Access Level:** All authenticated users

## Overview
The Metrics Card component displays a single key performance indicator (KPI) with its value, change percentage, trend indicator, and icon. Multiple metrics cards are displayed on the dashboard to provide an at-a-glance overview of important statistics.

## UI Features

### Display Elements
- **Icon** - Visual indicator (dynamic Lucide icon)
- **Label** - Metric name (e.g., "Total Donations")
- **Value** - Current metric value (e.g., "$45,230")
- **Change** - Percentage change (e.g., "+12.5%")
- **Trend** - Up/down arrow indicator

### Styling
- Color-coded trend (green for up, red for down)
- Icon with background color
- Responsive card layout
- Hover effects

## Props Interface

```typescript
interface MetricsCardProps {
  label: string;           // Metric name
  value: string | number;  // Current value
  change: string;          // Percentage change (e.g., "+12.5%")
  trend: 'up' | 'down';    // Trend direction
  icon: LucideIcon;        // Icon component
}
```

## Usage Example

```tsx
<MetricsCard
  label="Total Donations"
  value="$45,230"
  change="+12.5%"
  trend="up"
  icon={DollarSign}
/>
```

## Common Metrics Displayed

### Dashboard Metrics
- **Total Donations** - Sum of all donations
- **Total Donors** - Count of unique donors
- **Avg Donation** - Average donation amount
- **Monthly Recurring** - MRR from recurring donations
- **Volunteer Hours** - Total hours logged
- **Active Volunteers** - Count of active volunteers

## Related Documentation
- [../dashboard/01-MAIN-DASHBOARD.md](../dashboard/01-MAIN-DASHBOARD.md)
- [06-REVENUE-CHART.md](./06-REVENUE-CHART.md)
