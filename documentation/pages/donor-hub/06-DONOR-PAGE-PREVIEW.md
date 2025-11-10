# Donor Page Preview

**Component File:** `src/components/DonorPagePreview.tsx`  
**Route:** Embedded in Donor Page Manager (preview mode)  
**Access Level:** Public (when published), Admin/Manager (preview mode)

## Overview
The Donor Page Preview component renders the public-facing donation landing page. It displays the customized page with hero image, headline, description, fundraising progress, preset donation amounts, custom amount input, recurring donation options, payment methods (credit card and cryptocurrency), and a thank you confirmation screen. This is what donors see when they visit a donation page URL.

## UI Features

### Main Features
- **Hero Section:**
  - Hero image
  - Organization logo
  - Page headline
  - Description text
- **Progress Indicator:**
  - Goal amount
  - Current amount raised
  - Progress bar
  - Donor count
- **Donation Amount Selection:**
  - Preset amount buttons
  - Custom amount input
  - Recurring donation toggle
  - Frequency selector (if recurring)
- **Payment Methods:**
  - Credit/Debit Card tab
  - Cryptocurrency tab (if enabled)
- **Credit Card Form:**
  - First name, last name
  - Email address
  - Card number, expiry, CVV
  - Donate button
- **Cryptocurrency Payment:**
  - Currency selector (Bitcoin, Ethereum, USDC)
  - Wallet address display
  - QR code
  - Copy address button
  - Instructions
- **Success Screen:**
  - Thank you message
  - Donation summary
  - Receipt confirmation
  - Social sharing buttons

### Page Layout
```
┌─────────────────────────────────────────┐
│ [Organization Logo]                     │
├─────────────────────────────────────────┤
│                                         │
│        [Hero Image]                     │
│                                         │
│   Support Our Mission                   │
│   Help us reach our goals this year     │
│                                         │
├─────────────────────────────────────────┤
│ Goal: $50,000                           │
│ Raised: $16,500 (33%)                   │
│ [████████░░░░░░░░░░░░]                  │
│ 45 donors                               │
├─────────────────────────────────────────┤
│ Select Amount:                          │
│ [$25] [$50] [$100] [$250] [$500]       │
│ Or enter custom: [$ _____]              │
│                                         │
│ ☐ Make this a monthly donation          │
│                                         │
├─────────────────────────────────────────┤
│ [💳 Credit Card] [₿ Cryptocurrency]     │
│                                         │
│ First Name: [____________]              │
│ Last Name:  [____________]              │
│ Email:      [____________]              │
│ Card:       [____________]              │
│ Expiry:     [____] CVV: [___]           │
│                                         │
│        [Donate $100]                    │
└─────────────────────────────────────────┘
```

### Cryptocurrency Payment
```
┌─────────────────────────────────────────┐
│ Pay with Cryptocurrency                 │
├─────────────────────────────────────────┤
│ Select Currency:                        │
│ [Bitcoin ▼]                             │
│                                         │
│ Send $100 worth of Bitcoin to:          │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │     [QR Code]                   │   │
│ └─────────────────────────────────┘   │
│                                         │
│ bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh│
│ [📋 Copy Address]                       │
│                                         │
│ After sending, your donation will be    │
│ confirmed within 10-30 minutes.         │
└─────────────────────────────────────────┘
```

### Success Screen
```
┌─────────────────────────────────────────┐
│           ✓                             │
│                                         │
│   Thank You for Your Donation!          │
│                                         │
│   Your generosity helps us continue     │
│   our important work.                   │
│                                         │
│   Donation Amount: $100                 │
│   Type: Monthly Recurring               │
│                                         │
│   A receipt has been sent to your email.│
│                                         │
│   [Share on Facebook] [Share on Twitter]│
└─────────────────────────────────────────┘
```

## Data Requirements

### Public Page Data
- **page_config** (DonorPageConfig) - Page configuration
- **organization_name** (string) - Organization name
- **organization_logo** (string) - Logo URL
- **current_amount** (decimal) - Amount raised
- **donor_count** (integer) - Number of donors
- **goal_amount** (decimal, nullable) - Fundraising goal

### Donation Form Data
- **amount** (decimal) - Donation amount
- **is_recurring** (boolean) - Recurring donation
- **frequency** (enum, nullable) - 'weekly', 'monthly', 'quarterly', 'annually'
- **payment_method** (enum) - 'card' or 'crypto'
- **first_name** (string) - Donor first name
- **last_name** (string) - Donor last name
- **email** (string) - Donor email
- **card_number** (string) - Credit card number
- **expiry** (string) - Card expiry
- **cvv** (string) - Card CVV
- **crypto_currency** (enum, nullable) - 'bitcoin', 'ethereum', 'usdc'
- **crypto_tx_hash** (string, nullable) - Transaction hash

## API Endpoints Required

### POST /api/v1/donations/process
```
Description: Process donation payment
Request Body: {
  donor_page_id: "uuid",
  amount: 100.00,
  is_recurring: true,
  frequency: "monthly",
  payment_method: "card",
  donor_info: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com"
  },
  payment_details: {
    card_token: "tok_...",  // Stripe/payment processor token
    billing_address: {...}
  }
}

Response: {
  data: {
    donation_id: "uuid",
    receipt_number: "REC-2025-001",
    status: "completed",
    receipt_url: "https://..."
  },
  message: "Donation processed successfully"
}
```

### POST /api/v1/donations/crypto
```
Description: Record cryptocurrency donation
Request Body: {
  donor_page_id: "uuid",
  amount: 100.00,
  crypto_currency: "bitcoin",
  wallet_address: "bc1q...",
  tx_hash: "abc123...",
  donor_info: {
    email: "john@example.com"
  }
}

Response: {
  data: {
    donation_id: "uuid",
    status: "pending_confirmation"
  },
  message: "Crypto donation recorded, awaiting blockchain confirmation"
}
```

### GET /api/v1/donor_pages/:slug/stats
```
Description: Get real-time page statistics
Response: {
  data: {
    current_amount: 16500.00,
    donor_count: 45,
    goal_amount: 50000.00,
    progress_percentage: 33
  }
}
```

## Request/Response Schemas

```typescript
interface DonationFormData {
  amount: number;
  is_recurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  payment_method: 'card' | 'crypto';
  first_name: string;
  last_name: string;
  email: string;
  card_number?: string;
  expiry?: string;
  cvv?: string;
  crypto_currency?: 'bitcoin' | 'ethereum' | 'usdc';
}
```

## Authentication & Authorization

### Required Permissions
- **Public Access:** Anyone can view published pages
- **Preview Mode:** Requires authentication (admin/manager)

### Role-Based Access
- **Public:** Can donate, no login required
- **Admin/Manager:** Can preview unpublished pages

## Business Logic & Validations

### Frontend Validations
- Amount required and > 0
- Email format validation
- Card number validation (Luhn algorithm)
- Expiry date validation
- CVV format validation
- Required fields for card payment

### Backend Validations (Rails)
- Valid donor page
- Payment processing validation
- Fraud detection
- Duplicate donation prevention
- Email verification

### Business Rules
- Minimum donation: $1
- Recurring donations create subscription
- Crypto donations pending until confirmed
- Receipt emailed immediately
- Thank you page shown after success
- Failed payments show error message
- Progress bar updates in real-time

## State Management

### Local State
- `selectedAmount` - Selected preset amount
- `customAmount` - Custom amount input
- `isRecurring` - Recurring toggle
- `paymentMethod` - 'card' or 'crypto'
- `cryptoCurrency` - Selected crypto
- `showSuccess` - Success screen visibility
- `donorInfo` - Form data

## Dependencies

### Internal Dependencies
- UI components (Card, Button, Input, Progress, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Payment processor SDK (Stripe, etc.)
- QR code generator

## Error Handling

### Error Scenarios
1. **Invalid Amount:** Show error "Please enter a valid amount"
2. **Missing Fields:** Show error "Please fill in all required fields"
3. **Payment Failed:** Show toast "Payment failed, please try again"
4. **Network Error:** Show toast "Connection error, please try again"
5. **Card Declined:** Show error "Card declined, please use another card"

## Loading States
- **Page load:** Skeleton layout
- **Donate button:** Loading spinner
- **Payment processing:** Processing indicator
- **Success:** Fade transition to thank you

## Migration Notes

### Phase 1: Payment Integration
1. Integrate Stripe/payment processor
2. Implement card tokenization
3. Test payment flows
4. Add error handling

### Phase 2: Cryptocurrency
1. Generate wallet addresses
2. Implement QR codes
3. Add blockchain monitoring
4. Test crypto payments

### Phase 3: Optimization
1. Add page caching
2. Optimize images
3. Implement lazy loading
4. Add analytics tracking

## Related Documentation
- [05-DONOR-PAGE-MANAGER.md](./05-DONOR-PAGE-MANAGER.md)
- [03-DONOR-PAGE-BUILDER.md](./03-DONOR-PAGE-BUILDER.md)
- [02-DONATIONS-MANAGER.md](./02-DONATIONS-MANAGER.md)

## Additional Notes

### Payment Processing
- Uses Stripe for card payments
- PCI compliance via tokenization
- 3D Secure for fraud prevention
- Recurring via Stripe Subscriptions

### Cryptocurrency Support
- Bitcoin (BTC)
- Ethereum (ETH)
- USD Coin (USDC)
- Wallet addresses per organization
- Blockchain confirmation tracking

### SEO & Social Sharing
- Open Graph tags
- Twitter Card tags
- Schema.org markup
- Social sharing buttons
- Preview images optimized

### Analytics Tracked
- Page views
- Donation conversions
- Average donation amount
- Payment method distribution
- Recurring vs one-time
- Traffic sources
