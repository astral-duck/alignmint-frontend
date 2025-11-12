# Backend Integration Guide

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Integration Strategy](#integration-strategy)
3. [Mock Data Removal](#mock-data-removal)
4. [API Client Implementation](#api-client-implementation)
5. [Component Integration](#component-integration)
6. [Testing Integration](#testing-integration)
7. [Error Handling](#error-handling)
8. [Migration Checklist](#migration-checklist)

---

## Overview

This guide provides step-by-step instructions for integrating the React frontend with the backend API (Django or Rails).

### Current State
- ✅ Frontend: 100% complete with mock data
- ✅ Backend Specs: 100% documented
- ⏳ Integration: Pending

### Integration Goals
1. Remove all mock data dependencies
2. Create API client service layer
3. Connect components to real API
4. Implement proper error handling
5. Add loading states
6. Test all functionality

---

## Integration Strategy

### Phase 1: API Client Setup (Week 1)
- Create API client service
- Implement authentication
- Set up interceptors
- Configure error handling

### Phase 2: Core Modules (Weeks 2-3)
- Integrate authentication
- Integrate dashboard
- Integrate donors module
- Integrate donations module

### Phase 3: Secondary Modules (Weeks 4-5)
- Integrate accounting module
- Integrate personnel module
- Integrate marketing module
- Integrate reports module

### Phase 4: Testing & Polish (Week 6)
- Integration testing
- Bug fixes
- Performance optimization
- Documentation updates

---

## Mock Data Removal

### Files to Remove

```bash
# 🗑️ DELETE these files completely:
src/lib/mockData.ts              # 85KB - All mock data
src/lib/financialData.ts         # 12KB - Mock financial data
src/lib/legacyReportData.ts      # 14KB - Mock report generators
src/lib/legacyAccounts.ts        # 12KB - Mock chart of accounts (or move to backend)
```

### Files to Modify

```typescript
// ✏️ MODIFY these files to use API:
src/contexts/AppContext.tsx      // Remove mock data, add API client
src/components/*                 // Replace mock imports with API calls
```

### Step-by-Step Removal

#### Step 1: Identify Dependencies
```bash
# Find all files importing mock data
grep -r "from.*mockData" src/
grep -r "from.*financialData" src/
grep -r "from.*legacyReportData" src/
```

#### Step 2: Create API Equivalents
Before removing mock data, ensure API endpoints exist for:
- Dashboard metrics
- Donor list/details
- Donation list/details
- Accounting data
- Personnel data
- Reports data

#### Step 3: Remove Gradually
Remove mock data **module by module**, not all at once:
1. Authentication first
2. Dashboard second
3. Then each module one at a time

---

## API Client Implementation

### Step 1: Create API Client Structure

```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('ifm_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          try {
            await this.refreshToken();
            // Retry original request
            return this.client.request(error.config!);
          } catch {
            // Refresh failed, logout user
            this.logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    const refreshToken = localStorage.getItem('ifm_refresh_token');
    const response = await this.client.post('/auth/refresh', {
      refresh: refreshToken,
    });
    localStorage.setItem('ifm_auth_token', response.data.access);
    return response.data;
  }

  private logout() {
    localStorage.removeItem('ifm_auth_token');
    localStorage.removeItem('ifm_refresh_token');
  }

  // Generic request methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new APIClient();
```

### Step 2: Create Module-Specific API Services

```typescript
// src/api/auth.ts
import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Store tokens
    localStorage.setItem('ifm_auth_token', response.access);
    localStorage.setItem('ifm_refresh_token', response.refresh);
    return response;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('ifm_auth_token');
    localStorage.removeItem('ifm_refresh_token');
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },
};
```

```typescript
// src/api/donors.ts
import { apiClient } from './client';

export interface Donor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  donor_type: 'individual' | 'organization' | 'foundation';
  status: 'active' | 'inactive' | 'lapsed';
  total_donated: number;
  donation_count: number;
  last_donation_date?: string;
  created_at: string;
}

export interface DonorListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  donor_type?: string;
  total_donated_min?: number;
  total_donated_max?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const donorsAPI = {
  list: async (params?: DonorListParams): Promise<PaginatedResponse<Donor>> => {
    return apiClient.get('/donors', params);
  },

  get: async (id: string): Promise<Donor> => {
    return apiClient.get(`/donors/${id}`);
  },

  create: async (data: Partial<Donor>): Promise<Donor> => {
    return apiClient.post('/donors', data);
  },

  update: async (id: string, data: Partial<Donor>): Promise<Donor> => {
    return apiClient.patch(`/donors/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/donors/${id}`);
  },

  addNote: async (id: string, note: { note_type: string; content: string }) => {
    return apiClient.post(`/donors/${id}/add_note`, note);
  },

  getDonations: async (id: string) => {
    return apiClient.get(`/donors/${id}/donations`);
  },
};
```

```typescript
// src/api/donations.ts
import { apiClient } from './client';

export interface Donation {
  id: string;
  donor: string;
  amount: number;
  donation_date: string;
  payment_method: string;
  payment_status: string;
  notes?: string;
}

export const donationsAPI = {
  list: async (params?: any) => {
    return apiClient.get('/donations', params);
  },

  get: async (id: string) => {
    return apiClient.get(`/donations/${id}`);
  },

  create: async (data: Partial<Donation>) => {
    return apiClient.post('/donations', data);
  },

  sendReceipt: async (id: string) => {
    return apiClient.post(`/donations/${id}/send_receipt`);
  },
};
```

### Step 3: Create API Index

```typescript
// src/api/index.ts
export { apiClient } from './client';
export * from './auth';
export * from './donors';
export * from './donations';
export * from './accounting';
export * from './personnel';
export * from './marketing';
export * from './reports';
```

---

## Component Integration

### Example: Integrating DonorsCRM Component

#### Before (Mock Data)
```typescript
// src/components/DonorsCRM.tsx
import { getDonors } from '../lib/mockData';

export const DonorsCRM = () => {
  const [donors, setDonors] = useState(getDonors());
  
  // ... rest of component
};
```

#### After (API Integration)
```typescript
// src/components/DonorsCRM.tsx
import { donorsAPI, Donor } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const DonorsCRM = () => {
  const queryClient = useQueryClient();
  
  // Fetch donors
  const { data, isLoading, error } = useQuery({
    queryKey: ['donors'],
    queryFn: () => donorsAPI.list(),
  });

  // Create donor mutation
  const createMutation = useMutation({
    mutationFn: donorsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      toast.success('Donor created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create donor');
      console.error(error);
    },
  });

  // Update donor mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Donor> }) =>
      donorsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      toast.success('Donor updated successfully');
    },
  });

  // Delete donor mutation
  const deleteMutation = useMutation({
    mutationFn: donorsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      toast.success('Donor deleted successfully');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const donors = data?.results || [];

  // ... rest of component
};
```

### Step 4: Install React Query

```bash
npm install @tanstack/react-query
```

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## Testing Integration

### Manual Testing Checklist

For each module:
- [ ] List view loads
- [ ] Detail view loads
- [ ] Create works
- [ ] Update works
- [ ] Delete works
- [ ] Search works
- [ ] Filters work
- [ ] Pagination works
- [ ] Error handling works
- [ ] Loading states show

### Integration Tests

```typescript
// src/api/__tests__/donors.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { donorsAPI } from '../donors';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/v1/donors', (req, res, ctx) => {
    return res(
      ctx.json({
        count: 1,
        results: [
          {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
          },
        ],
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('donorsAPI', () => {
  it('fetches donors list', async () => {
    const response = await donorsAPI.list();
    expect(response.results).toHaveLength(1);
    expect(response.results[0].first_name).toBe('John');
  });
});
```

---

## Error Handling

### Standard Error Response Format

```typescript
// src/types/api.ts
export interface APIError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
```

### Error Handling Component

```typescript
// src/components/ErrorMessage.tsx
export const ErrorMessage = ({ error }: { error: any }) => {
  const message = error?.response?.data?.message || 'An error occurred';
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-800">{message}</p>
    </div>
  );
};
```

### Loading Component

```typescript
// src/components/LoadingSpinner.tsx
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};
```

---

## Migration Checklist

### Pre-Integration
- [ ] Backend API deployed and accessible
- [ ] API documentation reviewed
- [ ] Environment variables configured
- [ ] API client created
- [ ] React Query installed

### Module-by-Module Integration

#### Authentication
- [ ] Login API integrated
- [ ] Logout API integrated
- [ ] Token refresh working
- [ ] Protected routes working
- [ ] User profile loading

#### Dashboard
- [ ] Metrics API integrated
- [ ] Recent donations loading
- [ ] Top donors loading
- [ ] Charts rendering with real data

#### Donors Module
- [ ] Donor list loading
- [ ] Donor detail loading
- [ ] Create donor working
- [ ] Update donor working
- [ ] Delete donor working
- [ ] Search working
- [ ] Filters working
- [ ] Notes working

#### Donations Module
- [ ] Donation list loading
- [ ] Create donation working
- [ ] Receipt generation working
- [ ] Recurring donations working

#### Accounting Module
- [ ] Chart of accounts loading
- [ ] General ledger loading
- [ ] Journal entries working
- [ ] Expenses working
- [ ] Reconciliation working

#### Personnel Module
- [ ] Personnel list loading
- [ ] Volunteers list loading
- [ ] Hour tracking working

#### Marketing Module
- [ ] Campaigns loading
- [ ] Prospects loading

#### Reports Module
- [ ] Balance sheet generating
- [ ] Income statement generating
- [ ] P&L generating

### Post-Integration
- [ ] All mock data files removed
- [ ] All tests passing
- [ ] Error handling tested
- [ ] Loading states tested
- [ ] Performance acceptable
- [ ] Documentation updated

---

## Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Configure backend CORS settings
```python
# Django
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://yourdomain.com",
]
```

### Issue: 401 Unauthorized
**Solution:** Check token storage and refresh logic

### Issue: Slow API Responses
**Solution:** Implement pagination and caching

### Issue: Network Errors
**Solution:** Add retry logic and better error messages

---

## Related Documentation

- **API Requirements:** `02-API-REQUIREMENTS.md`
- **Python Backend:** `../python/PYTHON-API.md`
- **Rails Backend:** `../rails/TECHNICAL-SPEC.md`
- **Testing:** `../../testing/TESTING-STRATEGY.md`

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
