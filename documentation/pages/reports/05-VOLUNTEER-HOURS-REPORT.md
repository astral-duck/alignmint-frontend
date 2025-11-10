# Volunteer Hours Report

**Component File:** `src/components/VolunteerHoursReport.tsx`  
**Route:** `/reports` (with tool='volunteer-hours')  
**Access Level:** Admin, Manager

## Overview
The Volunteer Hours Report provides comprehensive analytics on volunteer contributions across the organization. It tracks total hours, active volunteers, average hours per volunteer, and estimated economic value of volunteer time. The report supports both individual nonprofit views and consolidated views for fiscal sponsors managing multiple entities.

## UI Features

### Main Features
- **Report Header:**
  - Organization name
  - Date range selector (start and end dates)
  - Export button (Excel, PDF) with multi-nonprofit support
  - Back to Reports Hub button
- **Summary Metrics Cards:**
  - Total Hours (aggregate across period)
  - Active Volunteers (count)
  - Average Hours per Volunteer
  - Estimated Value (based on $31.80/hour standard)
- **Detailed Breakdown Table:**
  - For Fiscal Sponsor: Hours by nonprofit
  - For Nonprofit: Hours by volunteer
  - Columns: Name/Nonprofit, Total Hours, Volunteers/Role, Top Activity, Monthly Average
- **Export Options:**
  - Single organization export
  - Multi-nonprofit export (fiscal sponsor only)
  - Excel or PDF format

### Summary Cards Layout
```
┌─────────────────────┐ ┌─────────────────────┐
│ ⏱️  Total Hours     │ │ 👥 Active Volunteers│
│ 3,245 hours         │ │ 127 volunteers      │
└─────────────────────┘ └─────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ 📊 Avg Hours/Vol    │ │ 💰 Estimated Value  │
│ 25.6 hours          │ │ $103,191            │
└─────────────────────┘ └─────────────────────┘
```

### Detailed Breakdown (Fiscal Sponsor View)
```
Volunteer Hours by Nonprofit

Nonprofit           | Total Hours | Volunteers | Top Activity      | Monthly Avg
--------------------|-------------|------------|-------------------|-------------
Awakenings          | 425         | 18         | Event Setup       | 42
Bloom Strong        | 380         | 15         | Outreach Program  | 38
Bonfire             | 520         | 22         | Teaching/Training | 52
Child & Youth Care  | 610         | 28         | Admin Support     | 61
...
```

### Detailed Breakdown (Nonprofit View)
```
Volunteer Activity Breakdown

Name           | Role                  | Total Hours | This Month | Last Activity | Status
---------------|----------------------|-------------|------------|---------------|--------
John Smith     | Event Coordinator    | 45          | 12         | 2025-10-15    | Active
Sarah Johnson  | Outreach Assistant   | 38          | 10         | 2025-10-18    | Active
Mike Davis     | Admin Support        | 52          | 15         | 2025-10-20    | Active
...
```

## Data Requirements

### Summary Metrics
- **total_hours** (integer) - Total volunteer hours in period
- **active_volunteers** (integer) - Number of active volunteers
- **avg_hours_per_volunteer** (decimal) - Average hours per volunteer
- **estimated_value** (decimal) - Economic value (hours × $31.80)

### Volunteer Data (by Nonprofit - Fiscal Sponsor View)
- **nonprofit_name** (string) - Nonprofit organization name
- **total_hours** (integer) - Total hours for this nonprofit
- **volunteers** (integer) - Number of volunteers
- **top_activity** (string) - Most common activity type
- **monthly_average** (decimal) - Average hours per month

### Volunteer Data (by Individual - Nonprofit View)
- **volunteer_id** (uuid)
- **name** (string) - Volunteer name
- **role** (string) - Primary volunteer role
- **total_hours** (integer) - Total hours in period
- **this_month** (integer) - Hours this month
- **last_activity** (date) - Date of last activity
- **status** (enum) - 'Active', 'Inactive'

### Hour Entry Detail
- **id** (uuid)
- **volunteer_id** (uuid)
- **date** (date)
- **hours** (decimal)
- **activity_type** (string)
- **description** (string)
- **status** (enum) - 'pending', 'approved', 'rejected'
- **approved_by** (uuid, nullable)
- **approved_at** (timestamp, nullable)

## API Endpoints Required

### GET /api/v1/reports/volunteer_hours/summary
```
Description: Get volunteer hours summary metrics
Query Parameters:
  - organization_id (required, uuid)
  - start_date (required, date)
  - end_date (required, date)

Response: {
  data: {
    total_hours: 3245,
    active_volunteers: 127,
    avg_hours_per_volunteer: 25.6,
    estimated_value: 103191.00
  }
}
```

### GET /api/v1/reports/volunteer_hours/by_nonprofit
```
Description: Get volunteer hours by nonprofit (fiscal sponsor view)
Query Parameters:
  - organization_id (required, uuid) - Must be fiscal sponsor
  - start_date (required, date)
  - end_date (required, date)

Response: {
  data: [
    {
      nonprofit_id: "uuid",
      nonprofit_name: "Awakenings",
      total_hours: 425,
      volunteers: 18,
      top_activity: "Event Setup",
      monthly_average: 42.5
    },
    {
      nonprofit_id: "uuid",
      nonprofit_name: "Bloom Strong",
      total_hours: 380,
      volunteers: 15,
      top_activity: "Outreach Program",
      monthly_average: 38.0
    }
  ]
}
```

### GET /api/v1/reports/volunteer_hours/by_volunteer
```
Description: Get volunteer hours by individual (nonprofit view)
Query Parameters:
  - organization_id (required, uuid)
  - start_date (required, date)
  - end_date (required, date)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      volunteer_id: "uuid",
      name: "John Smith",
      role: "Event Coordinator",
      total_hours: 45,
      this_month: 12,
      last_activity: "2025-10-15",
      status: "Active"
    },
    {
      volunteer_id: "uuid",
      name: "Sarah Johnson",
      role: "Outreach Assistant",
      total_hours: 38,
      this_month: 10,
      last_activity: "2025-10-18",
      status: "Active"
    }
  ],
  meta: {
    total: 18,
    page: 1,
    per_page: 50
  }
}
```

### GET /api/v1/reports/volunteer_hours/entries
```
Description: Get detailed hour entries for a volunteer
Query Parameters:
  - volunteer_id (required, uuid)
  - start_date (required, date)
  - end_date (required, date)
  - status (optional, enum) - 'pending', 'approved', 'rejected'

Response: {
  data: [
    {
      id: "uuid",
      volunteer_id: "uuid",
      date: "2025-10-15",
      hours: 4.5,
      activity_type: "Event Setup",
      description: "Helped set up annual fundraiser event",
      status: "approved",
      approved_by: "uuid",
      approved_at: "2025-10-16T10:00:00Z"
    }
  ],
  meta: {
    total_hours: 45,
    approved_hours: 42,
    pending_hours: 3
  }
}
```

### POST /api/v1/reports/volunteer_hours/export
```
Description: Export volunteer hours report
Request Body: {
  organization_id: "uuid",
  start_date: "2025-01-01",
  end_date: "2025-10-20",
  format: "excel", // or "pdf"
  include_details: false // Include individual entries
}

Response: {
  data: {
    download_url: "https://...",
    filename: "VolunteerHours_Awakenings_2025-01-01_2025-10-20.xlsx",
    expires_at: "2025-10-20T18:00:00Z"
  },
  message: "Report exported successfully"
}
```

### POST /api/v1/reports/volunteer_hours/export_multi
```
Description: Export volunteer hours for multiple nonprofits (fiscal sponsor only)
Request Body: {
  organization_ids: ["uuid1", "uuid2", "uuid3"],
  start_date: "2025-01-01",
  end_date: "2025-10-20",
  format: "excel" // or "pdf"
}

Response: {
  data: {
    download_url: "https://...",
    filename: "VolunteerHours_MultiNonprofit_2025-01-01_2025-10-20.xlsx",
    expires_at: "2025-10-20T18:00:00Z"
  },
  message: "Multi-nonprofit report exported successfully"
}
```

## Request/Response Schemas

```typescript
interface VolunteerHoursSummary {
  total_hours: number;
  active_volunteers: number;
  avg_hours_per_volunteer: number;
  estimated_value: number;
}

interface VolunteerDataByNonprofit {
  nonprofit_id: string;
  nonprofit_name: string;
  total_hours: number;
  volunteers: number;
  top_activity: string;
  monthly_average: number;
}

interface VolunteerDataByIndividual {
  volunteer_id: string;
  name: string;
  role: string;
  total_hours: number;
  this_month: number;
  last_activity: string;
  status: 'Active' | 'Inactive';
}

interface HourEntry {
  id: string;
  volunteer_id: string;
  date: string;
  hours: number;
  activity_type: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
}
```

## Authentication & Authorization

### Required Permissions
- `reports:read` - View reports
- `reports:export` - Export reports
- `volunteer_hours:read` - View volunteer hours

### Role-Based Access
- **Fiscal Sponsor:** Full access to all nonprofit volunteer data
- **Nonprofit User:** Access to their organization's volunteer data only
- **Staff:** View-only access
- **Volunteer:** Can view only their own hours (via Hour Tracking, not this report)
- **Donor:** No access

## Business Logic & Validations

### Frontend Validations
- Start date required
- End date required
- End date must be after start date
- Date range cannot exceed 2 years

### Backend Validations (Rails)
- Valid organization access
- Valid date format
- Date range reasonable
- Export format must be 'excel' or 'pdf'
- Multi-export only for fiscal sponsor

### Business Rules
- Only approved hours counted in totals
- Estimated value = Total Hours × $31.80 (Independent Sector standard)
- Active volunteer = logged hours in last 90 days
- Monthly average = Total Hours ÷ Number of Months in period
- Top activity = Most frequent activity type

## State Management

### Local State
- `dateRange` - Start and end dates
- `exportDialogOpen` - Export dialog visibility
- `selectedVolunteer` - Volunteer for detail view (future)

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `generateVolunteerData()` function
- UI components (Card, Button, Table, etc.)
- Export utilities
- `MultiNonprofitExportDialog` - Multi-org export

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Excel export library (xlsx, exceljs)
- PDF export library (jsPDF, pdfmake)

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load report"
2. **No Data:** Show empty state "No volunteer hours recorded"
3. **Invalid Date Range:** Show error "Invalid date range"
4. **Export Failed:** Show toast "Failed to export report"
5. **Permission Error:** Show toast "No permission to view"

## Loading States
- **Initial load:** Skeleton cards and table
- **Date change:** Loading overlay
- **Export:** Progress indicator
- **Multi-export:** Progress with nonprofit count

## Mock Data to Remove
- `VolunteerHoursReport.tsx` - `generateVolunteerData()` function
- `mockData.ts` - Mock volunteer hours data
- Move interfaces to `src/types/reports.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/reports.ts`
2. Create `src/types/reports.ts`
3. Implement summary endpoint
4. Test calculations

### Phase 2: Data Views
1. Implement by-nonprofit view (fiscal sponsor)
2. Implement by-volunteer view (nonprofit)
3. Test data aggregation
4. Add pagination

### Phase 3: Integration
1. Link to Volunteers CRM
2. Link to Hour Tracking
3. Test navigation flows
4. Implement "View Volunteer" links

### Phase 4: Export
1. Implement single-org Excel export
2. Implement single-org PDF export
3. Implement multi-org export (fiscal sponsor)
4. Test formatting and layout

## Related Documentation
- [../personnel/02-VOLUNTEERS-CRM.md](../personnel/02-VOLUNTEERS-CRM.md)
- [../personnel/03-HOUR-TRACKING.md](../personnel/03-HOUR-TRACKING.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Volunteer Value Calculation
The estimated value uses the Independent Sector's standard volunteer hour value:
- **$31.80 per hour** (2023 rate)
- Updated annually by Independent Sector
- Based on average hourly earnings + benefits
- Used for grant reporting and impact statements

### Activity Types
Common volunteer activities tracked:
- Event Setup/Coordination
- Outreach Programs
- Teaching/Training
- Administrative Support
- Fundraising
- Mentoring
- Facility Maintenance
- Food Service
- Transportation
- Other (custom)

### Report Use Cases
1. **Grant Applications:** Demonstrate volunteer engagement
2. **Impact Reports:** Show community contribution value
3. **Volunteer Recognition:** Identify top contributors
4. **Program Planning:** Understand volunteer capacity
5. **Fiscal Sponsor Reporting:** Aggregate across nonprofits

### Multi-Nonprofit Export
Fiscal sponsors can export consolidated reports:
- Select multiple nonprofits
- Single Excel file with multiple sheets
- Or single PDF with sections per nonprofit
- Summary page with totals across all selected

### Integration with Hour Tracking
- Hours must be approved to appear in report
- Pending hours not counted in totals
- Rejected hours excluded
- Links to Hour Tracking for detail view
- Can drill down to individual volunteer's entries
