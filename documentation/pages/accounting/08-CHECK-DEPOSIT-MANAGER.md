# Check Deposit Manager

**Component File:** `src/components/CheckDepositManager.tsx`  
**Route:** `/accounting-hub` (with tool='check-deposit')  
**Access Level:** Admin, Manager, Staff

## Overview
The Check Deposit Manager streamlines the check deposit process with OCR (Optical Character Recognition) technology. Users can capture check images via camera or upload files, automatically extract check details, review and edit the information, and batch process multiple checks for deposit. This reduces manual data entry and speeds up the deposit workflow.

## UI Features

### Workflow Steps
1. **Capture Step:**
   - Camera capture button (mobile)
   - File upload button (desktop)
   - Multiple check capture
   - Image preview
2. **Review Step:**
   - List of captured checks
   - Edit check details
   - Remove checks
   - Add more checks
3. **Complete Step:**
   - Deposit summary
   - Total amount
   - Check count
   - Finalize deposit

### Check Capture Interface
- **Camera Capture:**
  - Live camera view (mobile)
  - Capture button
  - Auto-process with OCR
- **File Upload:**
  - Drag-and-drop area
  - File browser
  - Multiple file selection
  - Supported formats: JPG, PNG, PDF

### OCR Processing
- Automatic extraction of:
  - Payer name
  - Check number
  - Amount
  - Date
  - Bank name
  - Memo/notes
- Processing indicator
- Confidence score display
- Manual override capability

### Check Review Form
- Check image preview
- Payer Name (editable)
- Check Number (editable)
- Amount (editable)
- Date (editable)
- Category (dropdown: Donations, Grants, etc.)
- Memo (editable)
- Bank Name (editable)
- Entity/Organization selection
- Delete check button

### Deposit Summary
- Total deposit amount
- Number of checks
- Deposit date
- Bank account selection
- Deposit slip upload (optional)
- Notes field
- Finalize button

## Data Requirements

### Check Data (During Capture)
- **id** (uuid) - Temporary ID during capture
- **image** (data URL) - Check image
- **payer_name** (string) - Name on check
- **check_number** (string) - Check number
- **amount** (decimal) - Check amount
- **date** (date) - Check date
- **category** (string) - Income category
- **memo** (string) - Check memo/notes
- **bank_name** (string) - Bank name
- **entity_id** (uuid) - Organization

### Deposit Data (Final)
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **deposit_type** (string) - 'check', 'cash', 'mixed'
- **deposit_date** (date) - Date of deposit
- **bank_account_id** (uuid) - Account being deposited to
- **total_amount** (decimal) - Total deposit amount
- **check_count** (integer) - Number of checks
- **status** (string) - 'pending', 'deposited', 'cleared'
- **deposited_by_id** (uuid) - User who created deposit
- **deposit_slip_url** (string, nullable) - Uploaded deposit slip
- **notes** (text, nullable) - Additional notes
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Deposit Item Data
- **id** (uuid) - Unique identifier
- **deposit_id** (uuid) - Parent deposit
- **donation_id** (uuid, nullable) - Linked donation (if applicable)
- **item_type** (string) - 'check', 'cash'
- **amount** (decimal) - Item amount
- **check_number** (string, nullable) - Check number
- **payer_name** (string, nullable) - Payer name
- **check_image_url** (string, nullable) - Check image URL
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Deposit:** Create deposit with multiple items
- **Update Deposit:** Edit pending deposit
- **Delete Deposit:** Delete pending deposit
- **Finalize Deposit:** Mark as deposited
- **Upload Check Images:** Upload check images
- **Process OCR:** Extract check data from image

## API Endpoints Required

### POST /api/v1/deposits/ocr
```
Description: Process check image with OCR
Request Body: {
  organization_id: "uuid",
  image: "base64_encoded_image"
}

Response: {
  data: {
    payer_name: "John Smith",
    check_number: "1234",
    amount: 150.00,
    date: "2024-11-08",
    bank_name: "Chase Bank",
    memo: "Donation",
    confidence_score: 0.95
  },
  message: "Check processed successfully"
}

Note: OCR may use third-party service (e.g., Google Vision API, AWS Textract)
```

### GET /api/v1/deposits
```
Description: Fetch deposits
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, string) - 'pending', 'deposited', 'cleared', 'all'
  - start_date (optional, date)
  - end_date (optional, date)
  - bank_account_id (optional, uuid)
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 50)
  - sort_by (optional, string, default: 'date_desc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      deposit_type: "check",
      deposit_date: "2024-11-08",
      bank_account_id: "uuid",
      bank_account_name: "Operating Checking",
      total_amount: 1250.00,
      check_count: 8,
      status: "deposited",
      deposited_by: "Jane Smith",
      deposit_slip_url: "https://...",
      notes: null,
      created_at: "2024-11-08T10:00:00Z",
      updated_at: "2024-11-08T15:00:00Z"
    }
  ],
  meta: {
    total: 45,
    page: 1,
    per_page: 50,
    total_pages: 1,
    total_amount: 56250.00,
    by_status: {
      pending: 2,
      deposited: 40,
      cleared: 3
    }
  }
}
```

### GET /api/v1/deposits/:id
```
Description: Get deposit with items
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    organization_id: "uuid",
    deposit_type: "check",
    deposit_date: "2024-11-08",
    bank_account_id: "uuid",
    bank_account_name: "Operating Checking",
    total_amount: 1250.00,
    check_count: 8,
    status: "deposited",
    items: [
      {
        id: "uuid",
        item_type: "check",
        amount: 150.00,
        check_number: "1234",
        payer_name: "John Smith",
        check_image_url: "https://...",
        donation_id: "uuid"
      },
      {
        id: "uuid",
        item_type: "check",
        amount: 200.00,
        check_number: "5678",
        payer_name: "Mary Johnson",
        check_image_url: "https://...",
        donation_id: "uuid"
      }
    ],
    deposited_by: "Jane Smith",
    deposit_slip_url: "https://...",
    notes: null,
    created_at: "2024-11-08T10:00:00Z",
    updated_at: "2024-11-08T15:00:00Z"
  }
}
```

### POST /api/v1/deposits
```
Description: Create new deposit
Request Body: {
  organization_id: "uuid",
  deposit_type: "check",
  deposit_date: "2024-11-08",
  bank_account_id: "uuid",
  items: [
    {
      item_type: "check",
      amount: 150.00,
      check_number: "1234",
      payer_name: "John Smith",
      check_image: "base64_encoded_image",
      donation_id: "uuid" (optional, if linked to existing donation)
    },
    {
      item_type: "check",
      amount: 200.00,
      check_number: "5678",
      payer_name: "Mary Johnson",
      check_image: "base64_encoded_image"
    }
  ],
  notes: null,
  deposit_slip_image: "base64_encoded_image" (optional)
}

Response: {
  data: {
    id: "uuid",
    ...all deposit fields with items
  },
  message: "Deposit created successfully"
}

Note: Creates donation records for each check if not linked
```

### PUT /api/v1/deposits/:id
```
Description: Update deposit (pending only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  deposit_date: "2024-11-08",
  bank_account_id: "uuid",
  items: [...updated items],
  notes: "Updated notes"
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Deposit updated successfully"
}

Note: Can only update pending deposits
```

### DELETE /api/v1/deposits/:id
```
Description: Delete deposit (pending only)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Deposit deleted successfully"
}

Note: Can only delete pending deposits
```

### POST /api/v1/deposits/:id/finalize
```
Description: Finalize deposit (mark as deposited)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  deposit_date: "2024-11-08"
}

Response: {
  data: {
    id: "uuid",
    status: "deposited",
    updated_at: "2024-11-08T15:00:00Z"
  },
  message: "Deposit finalized successfully"
}

Note: Creates journal entries and updates donation records
```

### GET /api/v1/deposits/income_categories
```
Description: Get list of income categories
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: [
    {
      code: "4000",
      name: "Donations"
    },
    {
      code: "4300",
      name: "Grants"
    },
    ...
  ]
}
```

## Request/Response Schemas

### Deposit Schema
```typescript
interface Deposit {
  id: string;
  organization_id: string;
  deposit_type: 'check' | 'cash' | 'mixed';
  deposit_date: string;
  bank_account_id: string;
  bank_account_name: string;
  total_amount: number;
  check_count: number;
  status: 'pending' | 'deposited' | 'cleared';
  items?: DepositItem[];
  deposited_by: string;
  deposit_slip_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface DepositItem {
  id: string;
  deposit_id: string;
  donation_id?: string;
  item_type: 'check' | 'cash';
  amount: number;
  check_number?: string;
  payer_name?: string;
  check_image_url?: string;
  created_at: string;
  updated_at: string;
}

interface OCRResult {
  payer_name: string;
  check_number: string;
  amount: number;
  date: string;
  bank_name: string;
  memo: string;
  confidence_score: number;
}
```

## Authentication & Authorization

### Required Permissions
- `deposits:read` - View deposits
- `deposits:write` - Create and update deposits
- `deposits:delete` - Delete deposits
- `deposits:finalize` - Finalize deposits

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can create, finalize, view all
- **Staff:** Can create and view own
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- At least one check required
- Amount must be greater than 0 for each check
- Check number required
- Payer name required
- Deposit date required
- Bank account selection required
- Image required for each check

### Backend Validations (Rails)
- All amounts must be positive decimals
- Valid deposit date
- Bank account must exist
- Cannot edit/delete finalized deposits
- Check images must be valid format (JPG, PNG, PDF)
- Image file size limits (e.g., 10MB per check)
- OCR confidence threshold (warn if < 0.8)

### Business Rules
- Each check creates a donation record (if not linked)
- Finalized deposits create journal entries automatically
- Deposits update bank account balance
- Check images stored securely
- OCR results are suggestions, manual review required
- Deposit slip upload optional but recommended
- Multiple checks can be batched in single deposit
- Cleared status updated via bank reconciliation

## State Management

### Local State
- `step` - Current workflow step ('capture', 'review', 'complete')
- `checks` - Array of captured checks
- `currentCheck` - Check being edited
- `isProcessing` - OCR processing state
- `selectedBankAccount` - Selected bank account
- `depositDate` - Deposit date
- `depositNotes` - Deposit notes
- `viewCheckOpen` - Check image viewer state

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `INCOME_CATEGORIES`, OCR simulation
- UI components (Card, Button, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Camera/file upload library
- OCR service (Google Vision API, AWS Textract, or similar)

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to process deposit", retry
2. **OCR Failed:** Show error "Failed to read check. Please enter manually."
3. **Camera Access Denied:** Show error "Camera permission denied"
4. **Invalid Image:** Show error "Invalid image format"
5. **Upload Failed:** Show toast "Image upload failed"
6. **Cannot Edit:** Show error "Cannot edit finalized deposits"
7. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **OCR Processing:** Show spinner with "Processing check..." message
- **Image Upload:** Progress bar
- **Finalize Deposit:** Show confirmation with spinner
- **Camera Capture:** Processing indicator

## Mock Data to Remove
- `CheckDepositManager.tsx` - `INCOME_CATEGORIES` array (fetch from API)
- `CheckDepositManager.tsx` - `processCheckOCR()` mock function (replace with real OCR API)
- Move interfaces to `src/types/deposit.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/deposits.ts`
2. Create `src/types/deposit.ts`
3. Replace mock categories with API call
4. Implement deposit list

### Phase 2: OCR Integration
1. Choose OCR provider (Google Vision, AWS Textract, etc.)
2. Implement OCR API call
3. Handle OCR errors and low confidence scores
4. Test with various check formats

### Phase 3: Check Capture
1. Implement camera capture (mobile)
2. Implement file upload (desktop)
3. Test image quality requirements
4. Implement image preview

### Phase 4: Deposit Workflow
1. Implement multi-check batching
2. Implement review and edit
3. Implement finalize deposit
4. Test journal entry creation

## Related Documentation
- [02-DONATIONS-MANAGER.md](./02-DONATIONS-MANAGER.md) - Creates donation records
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Where deposits appear
- [09-RECONCILIATION-MANAGER.md](./09-RECONCILIATION-MANAGER.md) - Bank reconciliation
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Deposit data model
