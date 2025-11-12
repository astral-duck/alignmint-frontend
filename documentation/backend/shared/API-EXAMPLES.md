# API Request/Response Examples

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Base URL:** `https://api.yourdomain.com/api/v1`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Donors](#donors)
3. [Donations](#donations)
4. [Accounting](#accounting)
5. [Personnel](#personnel)
6. [Reports](#reports)
7. [Error Responses](#error-responses)

---

## Authentication

### POST /auth/login

**Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "nonprofit_user",
    "organization": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Awakenings",
      "slug": "awakenings"
    },
    "permissions": [
      "read:donors",
      "write:donors",
      "read:donations",
      "write:donations"
    ]
  }
}
```

**Error Response (401):**
```json
{
  "error": "invalid_credentials",
  "message": "Invalid email or password"
}
```

### POST /auth/refresh

**Request:**
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Donors

### GET /donors

**Request:**
```http
GET /api/v1/donors?page=1&page_size=25&status=active&search=john
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "count": 150,
  "next": "https://api.yourdomain.com/api/v1/donors?page=2",
  "previous": null,
  "page_size": 25,
  "total_pages": 6,
  "results": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-123-4567",
      "donor_type": "individual",
      "status": "active",
      "total_donated": 5000.00,
      "donation_count": 12,
      "last_donation_date": "2025-01-10",
      "first_donation_date": "2024-01-15",
      "tags": ["major-donor", "monthly-sustainer"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2025-01-10T14:20:00Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1-555-987-6543",
      "donor_type": "individual",
      "status": "active",
      "total_donated": 2500.00,
      "donation_count": 6,
      "last_donation_date": "2025-01-08",
      "first_donation_date": "2024-06-01",
      "tags": ["event-donor"],
      "created_at": "2024-06-01T09:15:00Z",
      "updated_at": "2025-01-08T11:45:00Z"
    }
  ]
}
```

### GET /donors/:id

**Request:**
```http
GET /api/v1/donors/770e8400-e29b-41d4-a716-446655440000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "donor_type": "individual",
  "status": "active",
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "city": "Seattle",
  "state": "WA",
  "zip_code": "98101",
  "country": "USA",
  "total_donated": 5000.00,
  "donation_count": 12,
  "last_donation_date": "2025-01-10",
  "first_donation_date": "2024-01-15",
  "tags": ["major-donor", "monthly-sustainer"],
  "notes": "Prefers email communication. Interested in youth programs.",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2025-01-10T14:20:00Z",
  "recent_donations": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "amount": 500.00,
      "donation_date": "2025-01-10",
      "payment_method": "credit_card",
      "payment_status": "completed"
    }
  ],
  "recent_notes": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440000",
      "note_type": "call",
      "content": "Discussed upcoming campaign",
      "created_by": "John Admin",
      "created_at": "2025-01-05T15:30:00Z"
    }
  ]
}
```

### POST /donors

**Request:**
```http
POST /api/v1/donors
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-111-2222",
  "donor_type": "individual",
  "address_line1": "456 Oak Avenue",
  "city": "Portland",
  "state": "OR",
  "zip_code": "97201",
  "country": "USA",
  "tags": ["new-donor"]
}
```

**Success Response (201):**
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440000",
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-111-2222",
  "donor_type": "individual",
  "status": "active",
  "address_line1": "456 Oak Avenue",
  "city": "Portland",
  "state": "OR",
  "zip_code": "97201",
  "country": "USA",
  "total_donated": 0.00,
  "donation_count": 0,
  "last_donation_date": null,
  "first_donation_date": null,
  "tags": ["new-donor"],
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "validation_error",
  "message": "Invalid request data",
  "errors": {
    "email": ["Donor with this email already exists"],
    "phone": ["Invalid phone number format"]
  }
}
```

### PATCH /donors/:id

**Request:**
```http
PATCH /api/v1/donors/770e8400-e29b-41d4-a716-446655440000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "phone": "+1-555-999-8888",
  "tags": ["major-donor", "monthly-sustainer", "board-member"]
}
```

**Success Response (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-999-8888",
  "tags": ["major-donor", "monthly-sustainer", "board-member"],
  "updated_at": "2025-01-15T11:30:00Z"
}
```

---

## Donations

### GET /donations

**Request:**
```http
GET /api/v1/donations?page=1&page_size=25&donor_id=770e8400-e29b-41d4-a716-446655440000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "count": 50,
  "next": "https://api.yourdomain.com/api/v1/donations?page=2",
  "previous": null,
  "results": [
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440000",
      "donor": {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe"
      },
      "amount": 500.00,
      "donation_date": "2025-01-10",
      "donation_type": "one-time",
      "payment_method": "credit_card",
      "payment_status": "completed",
      "transaction_id": "ch_3MtwBwLkdIwHu7ix28a3tqPa",
      "receipt_sent": true,
      "receipt_sent_at": "2025-01-10T15:00:00Z",
      "notes": "Monthly sustainer donation",
      "created_at": "2025-01-10T14:30:00Z"
    }
  ]
}
```

### POST /donations

**Request:**
```http
POST /api/v1/donations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "donor_id": "770e8400-e29b-41d4-a716-446655440000",
  "amount": 1000.00,
  "donation_date": "2025-01-15",
  "donation_type": "one-time",
  "payment_method": "credit_card",
  "stripe_token": "tok_visa",
  "notes": "Campaign donation"
}
```

**Success Response (201):**
```json
{
  "id": "dd0e8400-e29b-41d4-a716-446655440000",
  "donor": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe"
  },
  "amount": 1000.00,
  "donation_date": "2025-01-15",
  "donation_type": "one-time",
  "payment_method": "credit_card",
  "payment_status": "completed",
  "transaction_id": "ch_3MtwBwLkdIwHu7ix28a3tqPb",
  "receipt_sent": false,
  "notes": "Campaign donation",
  "journal_entry_id": "ee0e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

## Accounting

### GET /accounts

**Request:**
```http
GET /api/v1/accounts?account_type=asset
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "count": 25,
  "results": [
    {
      "id": "ff0e8400-e29b-41d4-a716-446655440000",
      "account_number": "1000",
      "account_name": "Checking Account",
      "account_type": "asset",
      "normal_balance": "debit",
      "current_balance": 50000.00,
      "is_active": true,
      "parent_account": null,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "000e8400-e29b-41d4-a716-446655440001",
      "account_number": "1100",
      "account_name": "Accounts Receivable",
      "account_type": "asset",
      "normal_balance": "debit",
      "current_balance": 5000.00,
      "is_active": true,
      "parent_account": null,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /journal-entries

**Request:**
```http
POST /api/v1/journal-entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "entry_date": "2025-01-15",
  "description": "Office supplies purchase",
  "lines": [
    {
      "account_id": "110e8400-e29b-41d4-a716-446655440000",
      "debit_amount": 150.00,
      "credit_amount": 0.00,
      "description": "Office supplies expense"
    },
    {
      "account_id": "ff0e8400-e29b-41d4-a716-446655440000",
      "debit_amount": 0.00,
      "credit_amount": 150.00,
      "description": "Payment from checking"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "id": "120e8400-e29b-41d4-a716-446655440000",
  "entry_number": "JE-2025-00042",
  "entry_date": "2025-01-15",
  "description": "Office supplies purchase",
  "status": "draft",
  "lines": [
    {
      "id": "130e8400-e29b-41d4-a716-446655440000",
      "account": {
        "id": "110e8400-e29b-41d4-a716-446655440000",
        "account_number": "5100",
        "account_name": "Office Supplies"
      },
      "debit_amount": 150.00,
      "credit_amount": 0.00,
      "description": "Office supplies expense"
    },
    {
      "id": "140e8400-e29b-41d4-a716-446655440000",
      "account": {
        "id": "ff0e8400-e29b-41d4-a716-446655440000",
        "account_number": "1000",
        "account_name": "Checking Account"
      },
      "debit_amount": 0.00,
      "credit_amount": 150.00,
      "description": "Payment from checking"
    }
  ],
  "created_by": "John Admin",
  "created_at": "2025-01-15T10:45:00Z"
}
```

---

## Personnel

### GET /employees

**Request:**
```http
GET /api/v1/employees?status=active
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "count": 15,
  "results": [
    {
      "id": "150e8400-e29b-41d4-a716-446655440000",
      "first_name": "Sarah",
      "last_name": "Williams",
      "email": "sarah.williams@example.com",
      "phone": "+1-555-222-3333",
      "position": "Program Director",
      "department": "Programs",
      "employment_type": "full-time",
      "status": "active",
      "hire_date": "2023-03-15",
      "created_at": "2023-03-15T09:00:00Z"
    }
  ]
}
```

---

## Reports

### POST /reports/generate

**Request:**
```http
POST /api/v1/reports/generate
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "report_type": "balance_sheet",
  "parameters": {
    "as_of_date": "2025-01-15",
    "fund_id": "all",
    "include_zero_balances": false
  },
  "format": "pdf"
}
```

**Success Response (202):**
```json
{
  "report_id": "160e8400-e29b-41d4-a716-446655440000",
  "status": "generating",
  "estimated_time": 30,
  "status_url": "/api/v1/reports/160e8400-e29b-41d4-a716-446655440000/status"
}
```

### GET /reports/:id/status

**Request:**
```http
GET /api/v1/reports/160e8400-e29b-41d4-a716-446655440000/status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200) - Generating:**
```json
{
  "report_id": "160e8400-e29b-41d4-a716-446655440000",
  "status": "generating",
  "progress": 65,
  "message": "Calculating account balances..."
}
```

**Success Response (200) - Completed:**
```json
{
  "report_id": "160e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "progress": 100,
  "file_url": "https://s3.amazonaws.com/ifm-reports/balance-sheet-2025-01-15.pdf",
  "expires_at": "2025-01-22T10:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "validation_error",
  "message": "Invalid request data",
  "errors": {
    "email": ["This field is required"],
    "amount": ["Must be greater than 0"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "authentication_required",
  "message": "Authentication credentials were not provided"
}
```

### 403 Forbidden
```json
{
  "error": "permission_denied",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Donor with id '770e8400-e29b-41d4-a716-446655440000' not found"
}
```

### 409 Conflict
```json
{
  "error": "conflict",
  "message": "A donor with this email already exists",
  "existing_id": "770e8400-e29b-41d4-a716-446655440000"
}
```

### 422 Unprocessable Entity
```json
{
  "error": "business_rule_violation",
  "message": "Debits must equal credits in journal entry",
  "details": {
    "total_debits": 150.00,
    "total_credits": 100.00,
    "difference": 50.00
  }
}
```

### 429 Too Many Requests
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_server_error",
  "message": "An unexpected error occurred. Please try again later.",
  "error_id": "err_170e8400-e29b-41d4-a716-446655440000"
}
```

---

## Pagination

All list endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `page_size`: Results per page (default: 25, max: 100)

**Response includes:**
```json
{
  "count": 150,
  "next": "https://api.yourdomain.com/api/v1/donors?page=2",
  "previous": null,
  "page_size": 25,
  "total_pages": 6,
  "results": [...]
}
```

---

## Filtering & Sorting

### Common Query Parameters

- `search`: Full-text search
- `ordering`: Sort field (prefix with `-` for descending)
- `status`: Filter by status
- `created_after`: Filter by creation date
- `created_before`: Filter by creation date

**Example:**
```http
GET /api/v1/donors?search=john&ordering=-total_donated&status=active
```

---

## Rate Limiting

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642089600
```

**Limits:**
- Authenticated users: 1000 requests/hour
- Unauthenticated: 100 requests/hour

---

## Related Documentation

- **API Requirements:** `02-API-REQUIREMENTS.md`
- **Backend Integration:** `BACKEND-INTEGRATION-GUIDE.md`
- **Python API:** `../python/PYTHON-API.md`
- **Rails API:** `../rails/TECHNICAL-SPEC.md`

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
