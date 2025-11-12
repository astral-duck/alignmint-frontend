# Testing Strategy - IFM MVP

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Pyramid](#testing-pyramid)
3. [Frontend Testing](#frontend-testing)
4. [Backend Testing](#backend-testing)
5. [Integration Testing](#integration-testing)
6. [E2E Testing](#e2e-testing)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Test Data Management](#test-data-management)

---

## Overview

This document outlines the comprehensive testing strategy for the IFM MVP platform.

### Testing Goals

1. **Quality Assurance** - Catch bugs before production
2. **Regression Prevention** - Ensure new changes don't break existing features
3. **Documentation** - Tests serve as living documentation
4. **Confidence** - Deploy with confidence
5. **Maintainability** - Easy to update tests

### Testing Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Unit Test Coverage** | 80% | TBD |
| **Integration Test Coverage** | 70% | TBD |
| **E2E Test Coverage** | Critical paths | TBD |
| **Test Execution Time** | < 10 min | TBD |
| **Flaky Test Rate** | < 5% | TBD |

---

## Testing Pyramid

```
           ╱╲
          ╱  ╲
         ╱ E2E╲         10% - End-to-End Tests
        ╱──────╲        (Slow, Expensive, High Value)
       ╱        ╲
      ╱Integration╲     20% - Integration Tests
     ╱────────────╲    (Medium Speed, Medium Cost)
    ╱              ╲
   ╱  Unit Tests    ╲   70% - Unit Tests
  ╱──────────────────╲  (Fast, Cheap, High Volume)
```

### Test Distribution

- **70% Unit Tests** - Fast, isolated, test individual functions
- **20% Integration Tests** - Test component interactions
- **10% E2E Tests** - Test complete user workflows

---

## Frontend Testing

### Tech Stack

```json
{
  "testing-library/react": "^14.1.2",
  "vitest": "^1.0.4",
  "jsdom": "^23.0.1",
  "msw": "^2.0.11",
  "@testing-library/user-event": "^14.5.1"
}
```

### Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
});
```

```typescript
// src/test/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### Unit Tests

**Test Components:**
```typescript
// src/components/__tests__/DonorCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DonorCard } from '../DonorCard';

describe('DonorCard', () => {
  const mockDonor = {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    total_donated: 1000,
  };

  it('renders donor information', () => {
    render(<DonorCard donor={mockDonor} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    
    render(<DonorCard donor={mockDonor} onEdit={onEdit} />);
    
    await user.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(mockDonor);
  });
});
```

**Test Hooks:**
```typescript
// src/hooks/__tests__/usePermissions.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissions } from '../usePermissions';

describe('usePermissions', () => {
  it('returns correct permissions for fiscal sponsor', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: ({ children }) => (
        <AuthProvider user={{ role: 'fiscal_sponsor' }}>
          {children}
        </AuthProvider>
      ),
    });

    expect(result.current.isFiscalSponsor).toBe(true);
    expect(result.current.can('view:all_organizations')).toBe(true);
  });
});
```

**Test Utilities:**
```typescript
// src/test/utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '../contexts/AppContext';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = createTestQueryClient();

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          {children}
        </AppProvider>
      </QueryClientProvider>
    ),
    ...options,
  });
}
```

### API Mocking with MSW

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/donors', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 2,
        results: [
          { id: '1', first_name: 'John', last_name: 'Doe' },
          { id: '2', first_name: 'Jane', last_name: 'Smith' },
        ],
      })
    );
  }),

  rest.post('/api/v1/donors', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: '3', ...req.body })
    );
  }),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// src/test/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test DonorCard.test.tsx
```

---

## Backend Testing

### Django Testing

**Setup:**
```python
# pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
python_files = tests.py test_*.py *_tests.py
python_classes = Test*
python_functions = test_*
addopts = --cov=apps --cov-report=html --cov-report=term
```

**Model Tests:**
```python
# apps/donors/tests/test_models.py
import pytest
from apps.donors.models import Donor

@pytest.mark.django_db
class TestDonorModel:
    def test_create_donor(self):
        donor = Donor.objects.create(
            organization_id=organization.id,
            first_name='John',
            last_name='Doe',
            email='john@example.com',
            donor_type='individual'
        )
        
        assert donor.full_name == 'John Doe'
        assert donor.status == 'active'
        assert donor.total_donated == 0
    
    def test_email_uniqueness_within_organization(self):
        Donor.objects.create(
            organization=organization,
            email='test@example.com'
        )
        
        with pytest.raises(IntegrityError):
            Donor.objects.create(
                organization=organization,
                email='test@example.com'
            )
```

**API Tests:**
```python
# apps/donors/tests/test_views.py
import pytest
from rest_framework.test import APIClient
from apps.core.models import User, Organization
from apps.donors.models import Donor

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
class TestDonorAPI:
    def test_list_donors(self, authenticated_client, organization):
        # Create test donors
        Donor.objects.create(
            organization=organization,
            first_name='John',
            last_name='Doe',
            email='john@example.com'
        )
        
        response = authenticated_client.get('/api/v1/donors/')
        
        assert response.status_code == 200
        assert response.data['count'] == 1
        assert response.data['results'][0]['first_name'] == 'John'
    
    def test_create_donor(self, authenticated_client):
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@example.com',
            'donor_type': 'individual'
        }
        
        response = authenticated_client.post('/api/v1/donors/', data)
        
        assert response.status_code == 201
        assert Donor.objects.filter(email='jane@example.com').exists()
    
    def test_unauthorized_access(self, api_client):
        response = api_client.get('/api/v1/donors/')
        assert response.status_code == 401
```

**Service Tests:**
```python
# apps/accounting/tests/test_services.py
import pytest
from decimal import Decimal
from apps.accounting.services.journal_entry import JournalEntryService

@pytest.mark.django_db
class TestJournalEntryService:
    def test_create_entry_validates_double_entry(self):
        lines = [
            {'account_id': cash_account.id, 'debit_amount': 100, 'credit_amount': 0},
            {'account_id': revenue_account.id, 'debit_amount': 0, 'credit_amount': 50},  # Wrong!
        ]
        
        with pytest.raises(ValueError, match='Debits.*must equal credits'):
            JournalEntryService.create_entry(
                organization=organization,
                entry_date=date.today(),
                description='Test',
                lines=lines
            )
    
    def test_post_entry_creates_ledger_entries(self):
        journal_entry = create_test_journal_entry()
        
        JournalEntryService.post_entry(journal_entry)
        
        assert journal_entry.status == 'posted'
        assert LedgerEntry.objects.filter(journal_entry=journal_entry).count() == 2
```

### Running Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps --cov-report=html

# Run specific test
pytest apps/donors/tests/test_views.py::TestDonorAPI::test_list_donors

# Run in parallel
pytest -n auto
```

---

## Integration Testing

### Critical Integration Flows

#### 1. Donation → Journal Entry → Ledger → Reports
```python
@pytest.mark.django_db
class TestDonationFlow:
    def test_complete_donation_flow(self):
        # 1. Create donation
        donation = Donation.objects.create(
            organization=org,
            donor=donor,
            amount=Decimal('100.00'),
            payment_method='credit_card',
            payment_status='completed'
        )
        
        # 2. Verify journal entry created
        assert donation.journal_entry is not None
        assert donation.journal_entry.status == 'posted'
        
        # 3. Verify ledger entries created
        ledger_entries = LedgerEntry.objects.filter(
            journal_entry=donation.journal_entry
        )
        assert ledger_entries.count() == 2
        
        # 4. Verify balances updated
        cash_balance = LedgerService.get_account_balance(cash_account)
        assert cash_balance == Decimal('100.00')
        
        # 5. Verify appears in reports
        balance_sheet = BalanceSheetService.generate(org)
        assert balance_sheet['total_assets'] == Decimal('100.00')
```

#### 2. User Authentication → API Access
```typescript
// src/test/integration/auth.test.ts
describe('Authentication Flow', () => {
  it('completes full auth flow', async () => {
    // 1. Login
    const loginResponse = await authAPI.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(loginResponse.access).toBeDefined();
    expect(localStorage.getItem('ifm_auth_token')).toBe(loginResponse.access);
    
    // 2. Access protected resource
    const donorsResponse = await donorsAPI.list();
    expect(donorsResponse.results).toBeInstanceOf(Array);
    
    // 3. Token refresh
    // Wait for token to expire (or mock it)
    const refreshedResponse = await apiClient.get('/donors');
    expect(refreshedResponse).toBeDefined();
    
    // 4. Logout
    await authAPI.logout();
    expect(localStorage.getItem('ifm_auth_token')).toBeNull();
  });
});
```

---

## E2E Testing

### Tech Stack

```json
{
  "@playwright/test": "^1.40.1"
}
```

### Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/donor-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Donor Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('create new donor', async ({ page }) => {
    // Navigate to donors
    await page.click('text=Donor Hub');
    await page.click('text=Donors CRM');
    
    // Open create dialog
    await page.click('button:has-text("Add Donor")');
    
    // Fill form
    await page.fill('[name="first_name"]', 'John');
    await page.fill('[name="last_name"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.selectOption('[name="donor_type"]', 'individual');
    
    // Submit
    await page.click('button:has-text("Create Donor")');
    
    // Verify success
    await expect(page.locator('text=Donor created successfully')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('search donors', async ({ page }) => {
    await page.goto('/donors');
    
    // Search
    await page.fill('[placeholder="Search donors..."]', 'John');
    
    // Verify results
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  });
});
```

### Critical User Journeys

1. **User Registration & Login**
2. **Create Donor → Create Donation → View Receipt**
3. **Create Expense → Approve → View in Ledger**
4. **Generate Financial Report → Export PDF**
5. **Donor Portal Login → View History → Download Tax Report**

---

## Performance Testing

### Load Testing with k6

```javascript
// load-tests/api-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% errors
  },
};

export default function () {
  const token = 'your-test-token';
  
  const response = http.get('https://api.example.com/api/v1/donors', {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

### Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | < 2s | Lighthouse |
| **API Response Time** | < 500ms | k6 |
| **Time to Interactive** | < 3s | Lighthouse |
| **Largest Contentful Paint** | < 2.5s | Lighthouse |
| **Cumulative Layout Shift** | < 0.1 | Lighthouse |

---

## Security Testing

### Automated Security Scans

```bash
# Frontend dependency scanning
npm audit

# Backend dependency scanning
pip-audit

# SAST (Static Application Security Testing)
# Use: Snyk, SonarQube, or Semgrep
```

### Manual Security Testing

- [ ] SQL Injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] Authentication bypass attempts
- [ ] Authorization bypass attempts
- [ ] Rate limiting verification
- [ ] Input validation testing
- [ ] File upload security
- [ ] API security testing

---

## Test Data Management

### Test Fixtures

```python
# conftest.py
import pytest
from apps.core.models import Organization, User
from apps.donors.models import Donor

@pytest.fixture
def organization():
    return Organization.objects.create(
        name='Test Org',
        slug='test-org',
        type='nonprofit',
        status='active'
    )

@pytest.fixture
def user(organization):
    return User.objects.create_user(
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User',
        role='admin'
    )

@pytest.fixture
def donor(organization):
    return Donor.objects.create(
        organization=organization,
        first_name='John',
        last_name='Doe',
        email='john@example.com',
        donor_type='individual'
    )
```

### Factory Pattern

```python
# tests/factories.py
import factory
from apps.donors.models import Donor

class DonorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Donor
    
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.Faker('email')
    donor_type = 'individual'
    status = 'active'

# Usage:
donor = DonorFactory()
donors = DonorFactory.create_batch(10)
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements/test.txt
      - run: pytest --cov
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## Related Documentation

- **Backend Integration:** `../backend/shared/BACKEND-INTEGRATION-GUIDE.md`
- **Security:** `../security/SECURITY-GUIDE.md`
- **Deployment:** `../deployment/DEPLOYMENT-GUIDE.md`

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
