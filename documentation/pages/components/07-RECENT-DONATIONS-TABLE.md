# Recent Donations Table Component

**Component File:** Part of Dashboard  
**Usage:** Display recent donations on dashboard  
**Access Level:** All authenticated users

## Overview
The Recent Donations Table component displays the most recent donation transactions on the dashboard. It shows donor name, amount, date, and status. Users can click on a donation to view more details or navigate to the full donations manager.

## UI Features

### Table Columns
- **Donor** - Donor name
- **Amount** - Donation amount (formatted as currency)
- **Date** - Transaction date
- **Status** - Payment status badge (Completed, Pending, Failed)

### Features
- Shows last 5-10 donations
- Click row to view details
- Status badges with color coding
- "View All" link to Donations Manager
- Empty state if no donations

## Data Requirements

### Recent Donation
```typescript
interface RecentDonation {
  id: string;
  donor_name: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}
```

## State Management

### Global State (AppContext)
- `selectedEntity` - Current organization
- Mock data from `getDonationsData()`

## API Endpoints Required

### GET /api/v1/donations/recent
```
Description: Get recent donations
Query Parameters:
  - organization_id (uuid)
  - limit (integer, default: 10)

Response: {
  data: [
    {
      id: "uuid",
      donor_name: "John Smith",
      amount: 500.00,
      date: "2025-10-20",
      status: "completed"
    }
  ]
}
```

## Related Documentation
- [../dashboard/01-MAIN-DASHBOARD.md](../dashboard/01-MAIN-DASHBOARD.md)
- [../donor-hub/02-DONATIONS-MANAGER.md](../donor-hub/02-DONATIONS-MANAGER.md)
- [08-TOP-DONORS-TABLE.md](./08-TOP-DONORS-TABLE.md)
