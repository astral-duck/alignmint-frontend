# Leave Requests Table

**Component:** `LeaveRequestsTable.tsx`  
**Module:** Personnel  
**Access Level:** Managers and above  
**Status:** Complete

---

## Overview

The Leave Requests Table component displays and manages employee leave requests (vacation, sick leave, personal days, etc.). It provides managers with tools to review, approve, or deny leave requests while maintaining accurate leave balance tracking.

### Purpose

- Display all leave requests
- Approve/deny leave requests
- Track leave balances
- Manage leave policies
- Generate leave reports

---

## Features

### 1. Leave Request List
- View all leave requests
- Filter by status, employee, type
- Sort by date, employee, duration
- Search requests
- Pagination

### 2. Request Details
- Employee information
- Leave type
- Start and end dates
- Duration (days/hours)
- Reason/notes
- Current leave balance
- Approval status
- Approval history

### 3. Approval Workflow
- Approve requests
- Deny with reason
- Request more information
- Bulk approval
- Approval notifications

### 4. Leave Balance Tracking
- Current balance by type
- Accrued leave
- Used leave
- Pending requests
- Balance projections

### 5. Leave Calendar
- Visual calendar view
- Team availability
- Conflict detection
- Coverage planning

---

## Data Requirements

### Leave Request Model

```typescript
interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: 'vacation' | 'sick' | 'personal' | 'unpaid' | 'bereavement' | 'jury_duty';
  start_date: string;
  end_date: string;
  duration_days: number;
  duration_hours: number;
  reason?: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  requested_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

interface LeaveBalance {
  employee_id: string;
  leave_type: string;
  accrued: number;
  used: number;
  pending: number;
  available: number;
  carry_over: number;
}
```

---

## API Endpoints

### List Leave Requests
```
GET /api/v1/leave-requests
Query Parameters:
  - page: number
  - page_size: number
  - employee_id: string
  - status: string
  - leave_type: string
  - start_date: string
  - end_date: string
```

### Get Leave Request
```
GET /api/v1/leave-requests/:id
```

### Create Leave Request
```
POST /api/v1/leave-requests
Body: {
  employee_id: string,
  leave_type: string,
  start_date: string,
  end_date: string,
  reason?: string
}
```

### Update Leave Request
```
PATCH /api/v1/leave-requests/:id
Body: Partial<LeaveRequest>
```

### Approve Leave Request
```
POST /api/v1/leave-requests/:id/approve
Body: {
  notes?: string
}
```

### Deny Leave Request
```
POST /api/v1/leave-requests/:id/deny
Body: {
  reason: string
}
```

### Cancel Leave Request
```
POST /api/v1/leave-requests/:id/cancel
Body: {
  reason?: string
}
```

### Get Leave Balance
```
GET /api/v1/employees/:id/leave-balance
```

---

## Business Logic

### Leave Request Creation
1. Validate employee exists
2. Check leave type is valid
3. Validate date range
4. Calculate duration (business days)
5. Check if sufficient balance
6. Check for conflicts
7. Create request (status: pending)
8. Send notification to manager

### Approval Process
1. Verify manager has approval permission
2. Check leave balance still available
3. Update status to approved
4. Deduct from leave balance
5. Record approver and timestamp
6. Send notification to employee
7. Update team calendar

### Denial Process
1. Verify manager has approval permission
2. Update status to denied
3. Record reason
4. Send notification to employee
5. Return balance to available

### Balance Calculation
```typescript
const calculateBalance = (employee: Employee, leaveType: string) => {
  const accrued = calculateAccruedLeave(employee, leaveType);
  const used = getUsedLeave(employee, leaveType);
  const pending = getPendingLeave(employee, leaveType);
  const available = accrued - used - pending;
  
  return {
    accrued,
    used,
    pending,
    available
  };
};
```

### Business Days Calculation
```typescript
const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  let current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};
```

---

## User Interface

### Main Table View
```
┌─────────────────────────────────────────────────────────────────────┐
│  Leave Requests                        [+ New Request]  [Export]    │
├─────────────────────────────────────────────────────────────────────┤
│  Filters: [Status ▼] [Type ▼] [Employee ▼] [Date Range]  [🔍]     │
├─────────────────────────────────────────────────────────────────────┤
│  Employee      │ Type     │ Dates         │ Days │ Status  │ Action│
│  John Doe      │ Vacation │ 01/15-01/19   │ 5    │ Pending │ [>]  │
│  Jane Smith    │ Sick     │ 01/20-01/20   │ 1    │ Approved│ [>]  │
│  Bob Johnson   │ Personal │ 01/22-01/23   │ 2    │ Pending │ [>]  │
├─────────────────────────────────────────────────────────────────────┤
│  Showing 1-3 of 15                                   [< 1 2 3 4 >]  │
└─────────────────────────────────────────────────────────────────────┘
```

### Request Detail Dialog
```
┌─────────────────────────────────────────┐
│  Leave Request Details              [×] │
├─────────────────────────────────────────┤
│  Employee: John Doe                     │
│  Type:     Vacation                     │
│  Dates:    Jan 15 - Jan 19, 2025       │
│  Duration: 5 business days              │
│  Reason:   Family vacation              │
│                                          │
│  Leave Balance:                          │
│  Accrued:   15 days                     │
│  Used:      5 days                      │
│  Pending:   5 days (this request)       │
│  Available: 5 days                      │
│                                          │
│  Status: Pending                         │
│  Requested: Jan 10, 2025                │
│                                          │
│  Manager Notes:                          │
│  [_____________________________]        │
│                                          │
│  [Deny]  [Request Info]  [Approve]     │
└─────────────────────────────────────────┘
```

### Leave Calendar View
```
┌─────────────────────────────────────────────────────────┐
│  Team Leave Calendar                    [Month ▼] 2025  │
├─────────────────────────────────────────────────────────┤
│         Mon    Tue    Wed    Thu    Fri    Sat    Sun   │
│  Week 1  13     14     15     16     17     18     19   │
│          ─      ─      [JD]   [JD]   [JD]   ─      ─   │
│                        [JS]                              │
│  Week 2  20     21     22     23     24     25     26   │
│          [JS]   ─      [BJ]   [BJ]   ─      ─      ─   │
├─────────────────────────────────────────────────────────┤
│  Legend: [JD] John Doe  [JS] Jane Smith  [BJ] Bob J.   │
└─────────────────────────────────────────────────────────┘
```

---

## Leave Types

### Vacation
- Accrues monthly
- Can be carried over (policy dependent)
- Requires advance notice
- Subject to blackout dates

### Sick Leave
- Accrues monthly
- Limited carry over
- Can be used immediately
- May require documentation

### Personal Days
- Fixed annual allocation
- Use it or lose it
- Requires advance notice

### Unpaid Leave
- No balance required
- Requires approval
- Affects benefits

### Bereavement
- Fixed allocation per incident
- Immediate use
- May require documentation

### Jury Duty
- No balance required
- Requires documentation
- Paid by organization

---

## Validation Rules

### Date Range
- Start date cannot be in the past
- End date must be after start date
- Maximum duration: 30 days (configurable)
- Minimum advance notice: 2 weeks (vacation)

### Leave Balance
- Must have sufficient balance
- Cannot exceed annual maximum
- Pending requests count against balance

### Conflicts
- Cannot overlap with existing approved leave
- Check team coverage requirements
- Respect blackout dates

---

## Notifications

### On Request Submission
- **To:** Manager
- **Subject:** New Leave Request from [Employee]
- **Content:** [Employee] has requested [X] days of [Type] leave

### On Approval
- **To:** Employee
- **Subject:** Leave Request Approved
- **Content:** Your leave request for [Dates] has been approved

### On Denial
- **To:** Employee
- **Subject:** Leave Request Denied
- **Content:** Your leave request has been denied. Reason: [Reason]

### Reminder (Upcoming Leave)
- **To:** Employee, Manager
- **Subject:** Upcoming Leave Reminder
- **Content:** [Employee] will be on leave starting [Date]

---

## Reports

### Leave Summary Report
- Total leave taken by employee
- Leave by type
- Average leave duration
- Peak leave periods

### Balance Report
- Current balances by employee
- Projected year-end balances
- Negative balances
- Expiring leave

### Approval Report
- Pending approvals
- Approval turnaround time
- Denial reasons
- Approval rate by manager

---

## Permissions

### Employee
- ✅ Submit leave requests
- ✅ View own requests
- ✅ View own balance
- ✅ Cancel own pending requests
- ❌ Approve requests

### Manager
- ✅ All employee permissions
- ✅ View team requests
- ✅ Approve/deny requests
- ✅ View team balances
- ✅ Generate reports

### Admin
- ✅ All permissions
- ✅ Manage leave policies
- ✅ Adjust balances
- ✅ Override approvals

---

## Integration Points

### With Personnel CRM
- Links to employee records
- Uses employee data
- Updates employee status

### With Payroll
- Tracks unpaid leave
- Affects pay calculations
- Provides leave data

### With Calendar
- Blocks employee calendar
- Shows team availability
- Integrates with scheduling

---

## Testing Scenarios

1. **Submit Leave Request**
   - Employee submits vacation request
   - Verify balance check
   - Check manager notification

2. **Approve Request**
   - Manager approves request
   - Verify balance deduction
   - Check employee notification

3. **Deny Request**
   - Manager denies request
   - Verify balance restored
   - Check notification sent

4. **Balance Calculation**
   - Verify accrual calculation
   - Test balance deduction
   - Check pending requests

5. **Conflict Detection**
   - Submit overlapping requests
   - Verify conflict warning
   - Test team coverage check

---

## Related Components

- **Personnel CRM** - Employee management
- **Hour Tracking** - Time tracking
- **Calendar** - Schedule integration

---

## Notes for Backend Team

### Critical Business Rules
1. Leave balance must be checked before approval
2. Business days calculation excludes weekends/holidays
3. Pending requests count against available balance
4. Approved leave cannot be modified (must cancel and resubmit)
5. Complete audit trail required

### Performance Considerations
- Index on employee_id and status
- Cache leave balances
- Optimize date range queries
- Pre-calculate business days

### Security Considerations
- Employees can only view own requests
- Managers can only approve for their team
- Audit all approval actions
- Protect sensitive leave reasons

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
