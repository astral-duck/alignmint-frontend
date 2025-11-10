# Leave Requests

**Component File:** `src/components/LeaveRequestsTable.tsx`  
**Route:** Embedded in Personnel CRM page  
**Access Level:** Admin, Manager, Staff

## Overview
The Leave Requests component provides a table view for managing employee leave/time-off requests. It displays all leave requests with their status, allows sorting by various fields, and provides a quick overview of pending, approved, and rejected requests. This component is typically embedded within the Personnel CRM page to provide integrated leave management alongside employee profiles.

## UI Features

### Main Features
- **Leave Requests Table:**
  - Request ID
  - Employee name
  - Leave type
  - Start date
  - End date
  - Number of days
  - Status badge (Pending/Approved/Rejected)
- **Sortable Columns:**
  - Sort by ID
  - Sort by employee name
  - Sort by number of days
  - Ascending/descending toggle
- **Status Badges:**
  - Pending (yellow)
  - Approved (green)
  - Rejected (red)
- **Empty State:** Hidden when no requests exist

### Table Layout
```
Leave Requests
Manage employee leave requests

ID ↕    | Employee ↕      | Type        | Start Date | End Date   | Days ↕ | Status
--------|-----------------|-------------|------------|------------|--------|----------
LR-001  | John Doe        | Vacation    | 2025-11-15 | 2025-11-20 | 5      | Pending
LR-002  | Jane Smith      | Sick Leave  | 2025-11-10 | 2025-11-12 | 2      | Approved
LR-003  | Mike Johnson    | Personal    | 2025-12-01 | 2025-12-01 | 1      | Approved
LR-004  | Sarah Williams  | Vacation    | 2025-12-20 | 2026-01-03 | 10     | Pending
```

### Status Badge Colors
- **Pending:** Yellow background, yellow border
- **Approved:** Green background, green border
- **Rejected:** Red background, red border

## Data Requirements

### Leave Request
- **id** (string) - Request ID (e.g., "LR-001")
- **employee_id** (uuid) - Employee identifier
- **employee** (string) - Employee name
- **type** (enum) - Leave type
  - 'Vacation'
  - 'Sick Leave'
  - 'Personal'
  - 'Bereavement'
  - 'Jury Duty'
  - 'Unpaid'
- **start_date** (date) - Leave start date
- **end_date** (date) - Leave end date
- **days** (integer) - Number of days
- **status** (enum) - Request status
  - 'pending'
  - 'approved'
  - 'rejected'
- **reason** (string, nullable) - Leave reason/notes
- **submitted_date** (date) - When request was submitted
- **reviewed_by** (uuid, nullable) - Who approved/rejected
- **reviewed_date** (date, nullable) - When reviewed

## API Endpoints Required

### GET /api/v1/leave_requests
```
Description: Get all leave requests
Query Parameters:
  - organization_id (required, uuid)
  - employee_id (optional, uuid) - Filter by employee
  - status (optional, enum) - 'pending', 'approved', 'rejected', 'all'
  - start_date (optional, date) - Filter by date range
  - end_date (optional, date)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "LR-001",
      employee_id: "uuid",
      employee: "John Doe",
      type: "Vacation",
      start_date: "2025-11-15",
      end_date: "2025-11-20",
      days: 5,
      status: "pending",
      reason: "Family vacation",
      submitted_date: "2025-10-20",
      reviewed_by: null,
      reviewed_date: null
    }
  ],
  meta: {
    total: 15,
    pending: 5,
    approved: 8,
    rejected: 2,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/leave_requests
```
Description: Submit a new leave request
Request Body: {
  employee_id: "uuid",
  type: "Vacation",
  start_date: "2025-11-15",
  end_date: "2025-11-20",
  reason: "Family vacation"
}

Response: {
  data: {
    id: "LR-001",
    employee_id: "uuid",
    employee: "John Doe",
    type: "Vacation",
    start_date: "2025-11-15",
    end_date: "2025-11-20",
    days: 5,
    status: "pending",
    submitted_date: "2025-10-20"
  },
  message: "Leave request submitted successfully"
}
```

### PATCH /api/v1/leave_requests/:id/approve
```
Description: Approve a leave request
Request Body: {
  notes: "Approved for vacation"
}

Response: {
  data: {
    id: "LR-001",
    status: "approved",
    reviewed_by: "uuid",
    reviewed_date: "2025-10-21"
  },
  message: "Leave request approved"
}
```

### PATCH /api/v1/leave_requests/:id/reject
```
Description: Reject a leave request
Request Body: {
  reason: "Insufficient coverage during requested dates"
}

Response: {
  data: {
    id: "LR-001",
    status: "rejected",
    reviewed_by: "uuid",
    reviewed_date: "2025-10-21",
    rejection_reason: "Insufficient coverage during requested dates"
  },
  message: "Leave request rejected"
}
```

### DELETE /api/v1/leave_requests/:id
```
Description: Cancel/delete a leave request (only if pending)
Response: {
  message: "Leave request cancelled"
}
```

## Request/Response Schemas

```typescript
interface LeaveRequest {
  id: string;
  employee_id: string;
  employee: string;
  type: 'Vacation' | 'Sick Leave' | 'Personal' | 'Bereavement' | 'Jury Duty' | 'Unpaid';
  start_date: string;
  end_date: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  submitted_date: string;
  reviewed_by?: string;
  reviewed_date?: string;
  rejection_reason?: string;
}
```

## Authentication & Authorization

### Required Permissions
- `leave_requests:read` - View leave requests
- `leave_requests:create` - Submit leave requests
- `leave_requests:approve` - Approve/reject requests (manager/admin only)
- `leave_requests:delete` - Cancel own pending requests

### Role-Based Access
- **Fiscal Sponsor/Admin:** View all requests across all nonprofits, approve/reject
- **Nonprofit User/Manager:** View and approve requests for their nonprofit
- **Staff:** View own requests, submit new requests
- **Donor/Volunteer:** No access

### Special Rules
- Employees can only submit requests for themselves
- Managers can approve requests for their team
- Admins can approve any request
- Only pending requests can be cancelled
- Approved requests require admin to cancel

## Business Logic & Validations

### Frontend Validations
- End date must be after or equal to start date
- Start date cannot be in the past
- Leave type required
- Days calculated automatically from date range
- Cannot submit overlapping requests

### Backend Validations (Rails)
- Valid employee ID
- Valid date range
- No overlapping approved requests for same employee
- Sufficient leave balance (if tracked)
- Valid leave type
- Cannot approve own request

### Business Rules
- Days calculated as business days (excluding weekends)
- Holidays excluded from day count (if configured)
- Leave balance decremented on approval
- Email notifications sent on status change
- Pending requests can be edited
- Approved/rejected requests are read-only
- Managers notified of new requests
- Employees notified of status changes

## State Management

### Local State
- `sortKey` - Current sort column
- `sortOrder` - 'asc' or 'desc'
- `data` - Leave requests array

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `getLeaveRequests()` from mockData
- UI components (Card, Table, Badge, Button, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load leave requests"
2. **Invalid Date Range:** Show error "End date must be after start date"
3. **Overlapping Request:** Show error "You have an existing request for these dates"
4. **Approval Failed:** Show toast "Failed to approve request"
5. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Sorting:** Instant (client-side)
- **Approval action:** Button loading state

## Mock Data to Remove
- `LeaveRequestsTable.tsx` - `getLeaveRequests()` from mockData
- `mockData.ts` - Mock leave request data
- Move interfaces to `src/types/leave-requests.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/leave-requests.ts`
2. Create `src/types/leave-requests.ts`
3. Implement list endpoint
4. Test CRUD operations

### Phase 2: Approval Workflow
1. Implement approve/reject endpoints
2. Add approval dialog
3. Test notification system
4. Add email notifications

### Phase 3: Leave Balance
1. Track leave balances per employee
2. Validate against balance
3. Display remaining balance
4. Add balance history

### Phase 4: Calendar Integration
1. Add calendar view
2. Show team availability
3. Highlight holidays
4. Add conflict detection

## Related Documentation
- [01-PERSONNEL-CRM.md](./01-PERSONNEL-CRM.md)
- [03-HOUR-TRACKING.md](./03-HOUR-TRACKING.md)
- [../administration/01-USER-MANAGEMENT.md](../administration/01-USER-MANAGEMENT.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Leave Types
**Vacation:**
- Planned time off
- Requires advance notice
- Deducted from vacation balance

**Sick Leave:**
- Unplanned illness
- May require documentation
- Separate sick leave balance

**Personal:**
- Personal matters
- Limited days per year
- Manager approval required

**Bereavement:**
- Family member death
- Typically 3-5 days
- May require documentation

**Jury Duty:**
- Legal obligation
- Paid leave
- Requires jury summons

**Unpaid:**
- No pay during leave
- For extended absences
- Requires approval

### Workflow
1. **Submission:** Employee submits request
2. **Notification:** Manager notified via email
3. **Review:** Manager reviews and approves/rejects
4. **Notification:** Employee notified of decision
5. **Calendar:** Approved leave added to calendar
6. **Balance:** Leave balance updated

### Integration Points
- **Personnel CRM:** Embedded in employee profile
- **Calendar:** Shows team availability
- **Payroll:** Affects pay calculations
- **Reports:** Leave usage reports

### Future Enhancements
- Calendar view of team availability
- Leave balance tracking
- Automatic approval rules
- Recurring leave patterns
- Mobile app for submissions
- Integration with external HR systems
