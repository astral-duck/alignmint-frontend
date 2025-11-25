# Donor Reporting Module

## Overview

The Donor Reporting module is an administration tool that enables fiscal sponsors (parent organizations like InFocus Ministries) to generate and send end-of-year tax receipts to donors across all sponsored nonprofits.

## Access

- **Location**: Administration Hub → Donor Reporting
- **Availability**: Available for all entities
- **User Permissions**: Requires administrative access
- **Device**: Desktop only (mobile users see a warning to use desktop)

## Current Features

### 1. Donor Table View

A table view of all donors with year-to-date donations:

| Column | Description |
|--------|-------------|
| Checkbox | Select donors for batch operations |
| Donor | Name and email address |
| Nonprofit | The nonprofit organization the donor gave to |
| Year Total | Total tax-deductible donations for the selected year |
| Donations | Number of donations made in the selected year |
| Type | Donor type (one-time, recurring, or both) |
| Actions | Preview report button |

### 2. Search & Year Selection

- **Search**: Filter by donor name or email (wide search box)
- **Report Year**: Compact dropdown selector (2023, 2024, 2025)

Donors are automatically sorted alphabetically by name (A-Z).

### 3. Batch Selection

- **Select All**: Toggle to select/deselect all visible donors
- **Individual Selection**: Checkbox per donor row
- **Selection Counter**: Shows number of selected donors in the "Send Reports" button

### 4. Report Preview (UI Only)

Click "Preview" on any donor row to see a mock preview:
- Organization header (InFocus Ministries with address and EIN)
- Donor information (name, address, email)
- Year donation summary with total amount
- Itemized donation details table (date, amount, purpose)
- Legal tax receipt language

### 5. Export PDF

- **Export PDF**: Button to export donor list as PDF (currently shows toast only)

### 6. Statistics Dashboard

Four stat cards showing:
- Total Donors
- Selected count
- Year Total donations
- Report Year

## What Needs to Be Built

### Priority 1: Core Functionality

1. **PDF Report Generation**
   - Generate actual PDF tax receipts using jsPDF or similar
   - Include organization letterhead, donor info, donation details, legal language
   - Match the preview dialog layout

2. **Email Integration**
   - Connect to email service (SendGrid, AWS SES, etc.)
   - Send personalized emails with PDF attachments
   - Handle batch sending with rate limiting

3. **Export PDF Implementation**
   - Generate PDF of the donor list table
   - Include selected year, totals, and donor details

### Priority 2: Data & Backend

4. **Real Donor Data**
   - Replace mock data with actual database queries
   - Filter donors by entity/nonprofit
   - Calculate accurate YTD totals from transaction records

5. **Sent Report Tracking**
   - Track which reports have been sent to which donors
   - Store sent date, email status, and delivery confirmation
   - Show sent status in the table

### Priority 3: Enhanced Features

6. **Email Templates**
   - Customizable email subject and body text
   - Template variables for donor name, year, amount
   - Preview email before sending

7. **Delivery Tracking**
   - Track email open rates
   - Handle bounced emails
   - Resend failed deliveries

8. **Scheduled Sending**
   - Schedule batch sends for specific date/time
   - Queue management for large batches

## Technical Implementation

### Files

| File | Purpose |
|------|---------|
| `src/components/DonorReporting.tsx` | Main component |
| `src/components/AdministrationHub.tsx` | Hub that links to this module |
| `src/contexts/AppContext.tsx` | Contains `AdministrationTool` type |
| `src/App.tsx` | Routes to component |

### Current State

| State | Type | Purpose |
|-------|------|---------|
| `searchQuery` | `string` | Search filter text |
| `selectedDonors` | `Set<string>` | IDs of selected donors |
| `reportYear` | `string` | Selected report year |
| `previewOpen` | `boolean` | Preview dialog visibility |
| `sendConfirmOpen` | `boolean` | Send confirmation dialog visibility |
| `previewDonor` | `DonorWithSelection \| null` | Donor being previewed |

### Data Flow

```
AppContext (administrationTool state)
    ↓
AdministrationHub (tool selection)
    ↓
DonorReporting (main component)
    ↓
mockData.ts → getAllDonors() → DonorProfile[]
```

## Related Modules

- **Donor Hub → Donors**: Full donor CRM with profile management
- **Donor Hub → Donations**: Transaction-level donation management
- **Reports → Income Statement**: Financial reporting by donor category
