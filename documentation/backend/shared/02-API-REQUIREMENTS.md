# API Requirements Summary

This document provides a high-level overview of all API endpoints needed for the Rails backend.

## Base URL Structure
```
Production: https://api.yourdomain.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication Endpoints

### POST /auth/login
Login user and return JWT token

### POST /auth/logout
Logout user and invalidate token

### POST /auth/refresh
Refresh expired JWT token

### POST /auth/register
Register new user account

### POST /auth/forgot-password
Send password reset email

### POST /auth/reset-password
Reset password with token

### GET /auth/me
Get current authenticated user info

## Organization Endpoints

### GET /organizations
List all organizations user has access to

### GET /organizations/:id
Get organization details

### POST /organizations
Create new organization (admin only)

### PUT /organizations/:id
Update organization settings

### DELETE /organizations/:id
Delete organization (admin only)

## User Management Endpoints

### GET /users
List users in organization

### GET /users/:id
Get user details

### POST /users
Create new user

### PUT /users/:id
Update user

### DELETE /users/:id
Delete user

### POST /users/:id/invite
Send invitation email

### PUT /users/:id/permissions
Update user permissions

## Donor Endpoints

### GET /donors
List donors with filtering, sorting, pagination

### GET /donors/:id
Get donor profile with donation history

### POST /donors
Create new donor

### PUT /donors/:id
Update donor information

### DELETE /donors/:id
Soft delete donor

### POST /donors/:id/notes
Add note to donor profile

### POST /donors/:id/send_message
Send email to donor

### GET /donors/:id/donations
Get donor's donation history

### GET /donors/:id/communications
Get donor's communication history

### POST /donors/import
Bulk import donors from CSV

### GET /donors/export
Export donors to CSV

## Donation Endpoints

### GET /donations
List donations with filtering, sorting, pagination

### GET /donations/:id
Get donation details

### POST /donations
Create new donation

### PUT /donations/:id
Update donation

### DELETE /donations/:id
Delete donation

### POST /donations/:id/refund
Process refund for donation

### POST /donations/:id/send_receipt
Send receipt email

### GET /donations/recurring
List recurring donations

### PUT /donations/:id/cancel_recurring
Cancel recurring donation

### POST /donations/import
Bulk import donations from CSV

### GET /donations/export
Export donations to CSV

## Accounting Endpoints

### GET /accounts
List chart of accounts

### GET /accounts/:id
Get account details

### POST /accounts
Create new account

### PUT /accounts/:id
Update account

### DELETE /accounts/:id
Delete account

### GET /accounts/:id/balance
Get account balance

### GET /accounts/:id/transactions
Get account transaction history

## Fund Endpoints

### GET /funds
List funds

### GET /funds/:id
Get fund details

### POST /funds
Create new fund

### PUT /funds/:id
Update fund

### DELETE /funds/:id
Delete fund

### GET /funds/:id/balance
Get fund balance

### GET /funds/:id/transactions
Get fund transactions

## Journal Entry Endpoints

### GET /journal_entries
List journal entries

### GET /journal_entries/:id
Get journal entry with lines

### POST /journal_entries
Create journal entry

### PUT /journal_entries/:id
Update journal entry

### DELETE /journal_entries/:id
Delete journal entry

### POST /journal_entries/:id/post
Post journal entry (finalize)

### POST /journal_entries/:id/void
Void journal entry

## Expense Endpoints

### GET /expenses
List expenses

### GET /expenses/:id
Get expense details

### POST /expenses
Create expense

### PUT /expenses/:id
Update expense

### DELETE /expenses/:id
Delete expense

### POST /expenses/:id/approve
Approve expense

### POST /expenses/:id/reject
Reject expense

### POST /expenses/:id/upload_receipt
Upload receipt image

## Reimbursement Endpoints

### GET /reimbursements
List reimbursements

### GET /reimbursements/:id
Get reimbursement details

### POST /reimbursements
Create reimbursement request

### PUT /reimbursements/:id
Update reimbursement

### DELETE /reimbursements/:id
Delete reimbursement

### POST /reimbursements/:id/approve
Approve reimbursement

### POST /reimbursements/:id/reject
Reject reimbursement

### POST /reimbursements/:id/mark_paid
Mark as paid

## Deposit Endpoints

### GET /deposits
List deposits

### GET /deposits/:id
Get deposit with items

### POST /deposits
Create deposit

### PUT /deposits/:id
Update deposit

### DELETE /deposits/:id
Delete deposit

### POST /deposits/:id/finalize
Finalize deposit

### POST /deposits/:id/upload_slip
Upload deposit slip

## Reconciliation Endpoints

### GET /reconciliations
List reconciliations

### GET /reconciliations/:id
Get reconciliation details

### POST /reconciliations
Create reconciliation

### PUT /reconciliations/:id
Update reconciliation

### DELETE /reconciliations/:id
Delete reconciliation

### POST /reconciliations/:id/complete
Mark reconciliation complete

### GET /reconciliations/:id/unmatched_transactions
Get unmatched transactions

## Distribution Endpoints

### GET /distributions
List distributions

### GET /distributions/:id
Get distribution details

### POST /distributions
Create distribution

### PUT /distributions/:id
Update distribution

### DELETE /distributions/:id
Delete distribution

### POST /distributions/:id/approve
Approve distribution

## Personnel Endpoints

### GET /personnel_members
List personnel/volunteers

### GET /personnel_members/:id
Get member details

### POST /personnel_members
Create member

### PUT /personnel_members/:id
Update member

### DELETE /personnel_members/:id
Delete member

### GET /personnel_groups
List groups

### POST /personnel_groups
Create group

### PUT /personnel_groups/:id
Update group

### DELETE /personnel_groups/:id
Delete group

## Hour Tracking Endpoints

### GET /hour_entries
List hour entries

### GET /hour_entries/:id
Get entry details

### POST /hour_entries
Create entry

### PUT /hour_entries/:id
Update entry

### DELETE /hour_entries/:id
Delete entry

### POST /hour_entries/:id/approve
Approve entry

## Leave Request Endpoints

### GET /leave_requests
List leave requests

### GET /leave_requests/:id
Get request details

### POST /leave_requests
Create request

### PUT /leave_requests/:id
Update request

### DELETE /leave_requests/:id
Delete request

### POST /leave_requests/:id/approve
Approve request

### POST /leave_requests/:id/reject
Reject request

## Campaign Endpoints

### GET /campaigns
List campaigns

### GET /campaigns/:id
Get campaign details

### POST /campaigns
Create campaign

### PUT /campaigns/:id
Update campaign

### DELETE /campaigns/:id
Delete campaign

### GET /campaigns/:id/donations
Get campaign donations

### GET /campaigns/:id/stats
Get campaign statistics

## Video Bomb Endpoints

### GET /video_bombs
List video bombs

### GET /video_bombs/:id
Get video details

### POST /video_bombs
Create video bomb

### PUT /video_bombs/:id
Update video bomb

### DELETE /video_bombs/:id
Delete video bomb

### POST /video_bombs/:id/track_view
Track video view

## Donor Page Endpoints

### GET /donor_pages
List donor pages

### GET /donor_pages/:id
Get page details

### GET /donor_pages/by_slug/:slug
Get page by slug (public)

### POST /donor_pages
Create donor page

### PUT /donor_pages/:id
Update donor page

### DELETE /donor_pages/:id
Delete donor page

### POST /donor_pages/:id/publish
Publish page

### POST /donor_pages/:id/unpublish
Unpublish page

## Prospect Endpoints

### GET /prospects
List prospects

### GET /prospects/:id
Get prospect details

### POST /prospects
Create prospect

### PUT /prospects/:id
Update prospect

### DELETE /prospects/:id
Delete prospect

### POST /prospects/:id/convert
Convert to donor

## Report Endpoints

### GET /reports/balance_sheet
Generate balance sheet report

### GET /reports/income_statement
Generate income statement

### GET /reports/income_statement_by_fund
Generate income statement by fund

### GET /reports/profit_loss
Generate profit & loss report

### GET /reports/cash_flow
Generate cash flow statement

### GET /reports/volunteer_hours
Generate volunteer hours report

### GET /reports/donor_summary
Generate donor summary report

### GET /reports/donation_summary
Generate donation summary report

### POST /reports/custom
Generate custom report

## Todo Endpoints

### GET /todos
List todos

### GET /todos/:id
Get todo details

### POST /todos
Create todo

### PUT /todos/:id
Update todo

### DELETE /todos/:id
Delete todo

### POST /todos/:id/complete
Mark todo complete

### POST /todos/:id/uncomplete
Mark todo incomplete

## Notification Endpoints

### GET /notifications
List notifications

### GET /notifications/:id
Get notification details

### PUT /notifications/:id/mark_read
Mark as read

### PUT /notifications/mark_all_read
Mark all as read

### DELETE /notifications/:id
Delete notification

## File Upload Endpoints

### POST /uploads
Upload file (receipts, documents, etc.)

### GET /uploads/:id
Get file details

### DELETE /uploads/:id
Delete file

## Export Endpoints

### POST /exports/donors
Export donors to CSV/Excel

### POST /exports/donations
Export donations to CSV/Excel

### POST /exports/expenses
Export expenses to CSV/Excel

### POST /exports/financial_data
Export financial data

### GET /exports/:id/download
Download exported file

## Audit Log Endpoints

### GET /audit_logs
List audit logs

### GET /audit_logs/:id
Get audit log details

## Dashboard/Metrics Endpoints

### GET /dashboard/metrics
Get dashboard metrics for organization

### GET /dashboard/recent_donations
Get recent donations

### GET /dashboard/top_donors
Get top donors

### GET /dashboard/donation_trends
Get donation trend data

## API Endpoint Count Summary

- **Authentication:** 7 endpoints
- **Organizations:** 5 endpoints
- **Users:** 7 endpoints
- **Donors:** 11 endpoints
- **Donations:** 11 endpoints
- **Accounting/Funds:** 18 endpoints
- **Journal Entries:** 7 endpoints
- **Expenses:** 8 endpoints
- **Reimbursements:** 8 endpoints
- **Deposits:** 7 endpoints
- **Reconciliations:** 6 endpoints
- **Distributions:** 6 endpoints
- **Personnel:** 10 endpoints
- **Hour Tracking:** 6 endpoints
- **Leave Requests:** 7 endpoints
- **Campaigns:** 7 endpoints
- **Video Bombs:** 6 endpoints
- **Donor Pages:** 8 endpoints
- **Prospects:** 6 endpoints
- **Reports:** 9 endpoints
- **Todos:** 7 endpoints
- **Notifications:** 6 endpoints
- **File Uploads:** 3 endpoints
- **Exports:** 5 endpoints
- **Audit Logs:** 2 endpoints
- **Dashboard:** 4 endpoints

**Total: ~180+ API endpoints**

## Common Query Parameters

Most list endpoints support:
- `organization_id` (required) - Filter by organization
- `page` (optional) - Page number for pagination
- `per_page` (optional) - Items per page (default: 25, max: 100)
- `sort_by` (optional) - Field to sort by
- `sort_order` (optional) - 'asc' or 'desc'
- `search` (optional) - Search query
- `filters` (optional) - Additional filters as JSON

## Common Response Format

### Success Response
```json
{
  "data": { ... } or [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 25,
    "total_pages": 4
  },
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["is invalid"],
      "amount": ["must be greater than 0"]
    }
  }
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Business logic error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Rate Limiting

- **Standard endpoints:** 100 requests per minute per user
- **Report endpoints:** 10 requests per minute per user
- **Export endpoints:** 5 requests per minute per user
- **Upload endpoints:** 20 requests per minute per user

## Next Steps for Backend Team

1. Review this API requirements summary
2. Review detailed data schema in `01-DATA-SCHEMA.md`
3. Review page-specific documentation as it's completed
4. Set up Rails project structure
5. Create database migrations
6. Implement authentication
7. Build API endpoints incrementally
8. Write API tests
9. Generate API documentation (Swagger/OpenAPI)
10. Set up staging environment for frontend integration testing
