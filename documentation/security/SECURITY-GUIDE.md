# Security Guide - IFM MVP

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Classification:** Internal Use Only

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [Frontend Security](#frontend-security)
6. [Database Security](#database-security)
7. [Infrastructure Security](#infrastructure-security)
8. [Security Checklist](#security-checklist)
9. [Incident Response](#incident-response)

---

## Overview

This document outlines security best practices and requirements for the IFM MVP platform.

### Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimum necessary access
3. **Secure by Default** - Security enabled out of the box
4. **Fail Securely** - Errors don't expose sensitive data
5. **Audit Everything** - Complete activity logging

### Compliance Requirements

- **GDPR** - Data privacy for EU users
- **CCPA** - California Consumer Privacy Act
- **PCI DSS** - Payment card data security (via Stripe)
- **SOC 2** - Security controls for service organizations

---

## Authentication & Authorization

### Authentication Flow

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │ 1. POST /auth/login
       │    {email, password}
       ▼
┌─────────────┐
│   Backend   │
│     API     │
└──────┬──────┘
       │ 2. Validate credentials
       │ 3. Generate JWT tokens
       │
       ▼
┌─────────────┐
│  Response   │
│  {access,   │
│   refresh}  │
└──────┬──────┘
       │ 4. Store tokens
       │    (localStorage)
       ▼
┌─────────────┐
│  Frontend   │
│  (Stored)   │
└─────────────┘
       │ 5. Include in requests
       │    Authorization: Bearer {token}
       ▼
┌─────────────┐
│   Backend   │
│  (Validates)│
└─────────────┘
```

### JWT Token Structure

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "nonprofit_user",
  "organization_id": "uuid",
  "permissions": ["read:donors", "write:donations"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Password Requirements

**Minimum Requirements:**
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not in common password list
- Not similar to username/email

**Implementation (Django):**
```python
# settings.py
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

### Token Management

**Access Token:**
- Lifetime: 1 hour
- Stored in: localStorage
- Used for: API requests

**Refresh Token:**
- Lifetime: 7 days
- Stored in: localStorage
- Used for: Getting new access tokens
- Rotation: New refresh token on each use

**Token Refresh Flow:**
```typescript
// src/api/client.ts
async refreshToken() {
  const refreshToken = localStorage.getItem('ifm_refresh_token');
  
  try {
    const response = await axios.post('/auth/refresh', {
      refresh: refreshToken
    });
    
    // Store new tokens
    localStorage.setItem('ifm_auth_token', response.data.access);
    localStorage.setItem('ifm_refresh_token', response.data.refresh);
    
    return response.data.access;
  } catch (error) {
    // Refresh failed, logout user
    this.logout();
    throw error;
  }
}
```

### Role-Based Access Control (RBAC)

**Roles:**
1. **Fiscal Sponsor** - Full access to all organizations
2. **Nonprofit User** - Full access to their organization
3. **Donor** - Access to donor portal only
4. **Volunteer** - Access to hour tracking only

**Permission Enforcement:**

**Backend (Django):**
```python
# apps/core/permissions.py
from rest_framework import permissions

class IsOrganizationMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'organization'):
            return obj.organization == request.user.organization
        return False

class IsFiscalSponsor(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'fiscal_sponsor'
        )
```

**Frontend:**
```typescript
// src/hooks/usePermissions.ts
export const usePermissions = () => {
  const { user } = useAuth();
  
  const can = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };
  
  const isFiscalSponsor = user?.role === 'fiscal_sponsor';
  const isNonprofitUser = user?.role === 'nonprofit_user';
  
  return { can, isFiscalSponsor, isNonprofitUser };
};
```

---

## Data Protection

### Data Encryption

**In Transit:**
- ✅ HTTPS/TLS 1.3 for all connections
- ✅ Certificate pinning (optional)
- ✅ HSTS headers enabled

**At Rest:**
- ✅ Database encryption (AWS RDS, Heroku Postgres)
- ✅ S3 bucket encryption
- ✅ Encrypted backups

**Sensitive Fields:**
```python
# Django - Encrypt sensitive fields
from django_cryptography.fields import encrypt

class Donor(models.Model):
    # ... other fields
    ssn = encrypt(models.CharField(max_length=11, null=True, blank=True))
    bank_account = encrypt(models.CharField(max_length=50, null=True, blank=True))
```

### Personal Identifiable Information (PII)

**PII Fields:**
- Name
- Email
- Phone
- Address
- SSN/Tax ID
- Bank account info
- Payment card info (handled by Stripe, never stored)

**PII Protection:**
1. **Encryption** - Encrypt sensitive fields
2. **Access Control** - Limit who can view PII
3. **Audit Logging** - Log all PII access
4. **Data Minimization** - Only collect necessary data
5. **Retention Policies** - Delete after retention period

### Data Retention

| Data Type | Retention Period | Action After |
|-----------|------------------|--------------|
| Donor Records | 7 years | Archive |
| Donation Records | 7 years (tax law) | Archive |
| Financial Records | 7 years | Archive |
| User Activity Logs | 1 year | Delete |
| Error Logs | 90 days | Delete |
| Backup Files | 30 days | Delete |

### GDPR Compliance

**User Rights:**
1. **Right to Access** - Users can request their data
2. **Right to Rectification** - Users can correct their data
3. **Right to Erasure** - Users can request deletion
4. **Right to Data Portability** - Users can export their data
5. **Right to Object** - Users can opt-out of processing

**Implementation:**
```python
# apps/core/views.py
class GDPRDataExportView(APIView):
    """Export all user data in JSON format"""
    
    def get(self, request):
        user = request.user
        
        data = {
            'user': UserSerializer(user).data,
            'donations': DonationSerializer(
                user.donation_set.all(), many=True
            ).data,
            # ... other data
        }
        
        return Response(data)

class GDPRDataDeletionView(APIView):
    """Delete all user data"""
    
    def post(self, request):
        user = request.user
        
        # Anonymize instead of delete (for audit trail)
        user.email = f"deleted_{user.id}@example.com"
        user.first_name = "Deleted"
        user.last_name = "User"
        user.is_active = False
        user.save()
        
        return Response({'status': 'deleted'})
```

---

## API Security

### Input Validation

**Always Validate:**
- Data types
- Required fields
- Field lengths
- Format (email, phone, etc.)
- Allowed values (enums)
- Business rules

**Django Example:**
```python
# apps/donors/serializers.py
class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ['id', 'first_name', 'last_name', 'email', 'phone']
    
    def validate_email(self, value):
        # Custom validation
        if not value.endswith('@example.com'):
            raise serializers.ValidationError("Invalid email domain")
        return value
    
    def validate(self, data):
        # Cross-field validation
        if data.get('donor_type') == 'organization' and not data.get('organization_name'):
            raise serializers.ValidationError("Organization name required")
        return data
```

### SQL Injection Prevention

**✅ Use ORM (Django/Rails):**
```python
# SAFE - Uses parameterized queries
Donor.objects.filter(email=user_input)

# UNSAFE - Never do this
Donor.objects.raw(f"SELECT * FROM donors WHERE email = '{user_input}'")
```

### XSS Prevention

**Backend:**
- Escape all output
- Use Content Security Policy (CSP)
- Sanitize HTML input

**Frontend:**
```typescript
// React automatically escapes by default
<div>{userInput}</div>  // Safe

// Dangerous - only use with trusted content
<div dangerouslySetInnerHTML={{__html: userInput}} />  // Unsafe
```

**CSP Headers:**
```python
# Django settings.py
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
}
```

### CSRF Protection

**Django (enabled by default):**
```python
# settings.py
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
```

**Frontend:**
```typescript
// Include CSRF token in requests
const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('csrftoken='))
  ?.split('=')[1];

axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
```

### Rate Limiting

**Protect Against:**
- Brute force attacks
- DDoS attacks
- API abuse

**Implementation (Django):**
```python
# Install: pip install django-ratelimit

from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='5/m', method='POST')
def login_view(request):
    # Login logic
    pass
```

**Nginx Rate Limiting:**
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
}
```

---

## Frontend Security

### Secure Storage

**❌ Never Store in Frontend:**
- Passwords
- API keys
- Secrets
- Sensitive PII

**✅ OK to Store:**
- JWT tokens (short-lived)
- User preferences
- Non-sensitive cache data

**Storage Options:**
```typescript
// localStorage - Persists across sessions
localStorage.setItem('ifm_auth_token', token);

// sessionStorage - Cleared on tab close (more secure)
sessionStorage.setItem('ifm_auth_token', token);

// Cookies - Can be httpOnly (most secure for sensitive data)
// Set by backend, not accessible to JavaScript
```

### Secure Headers

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    },
  },
});
```

### Dependency Security

```bash
# Audit dependencies regularly
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

---

## Database Security

### Row-Level Security (PostgreSQL)

```sql
-- Enable RLS on tables
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their organization's donors
CREATE POLICY donor_isolation ON donors
  FOR ALL
  TO authenticated_user
  USING (organization_id = current_setting('app.current_organization_id')::uuid);
```

### Database Credentials

**✅ Best Practices:**
- Use environment variables
- Rotate credentials regularly
- Use IAM authentication (AWS RDS)
- Limit database user permissions
- Use SSL/TLS connections

**Connection String:**
```bash
# ✅ Good - Uses SSL
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# ❌ Bad - No SSL
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Backup Security

- ✅ Encrypt backups
- ✅ Store in separate location
- ✅ Test restore procedures
- ✅ Limit backup access
- ✅ Retain for compliance period

---

## Infrastructure Security

### Environment Variables

**Never Commit:**
```bash
# .gitignore
.env
.env.local
.env.production
*.pem
*.key
```

**Use Secrets Management:**
- AWS Secrets Manager
- HashiCorp Vault
- Heroku Config Vars
- Environment variables in CI/CD

### Network Security

**Firewall Rules:**
- Only allow necessary ports
- Whitelist IP addresses
- Use VPC/private networks
- Enable DDoS protection

**Example (AWS Security Group):**
```
Inbound Rules:
- Port 443 (HTTPS): 0.0.0.0/0
- Port 80 (HTTP): 0.0.0.0/0 (redirect to 443)
- Port 22 (SSH): Your IP only
- Port 5432 (PostgreSQL): Backend servers only
```

---

## Security Checklist

### Development
- [ ] No secrets in code
- [ ] Input validation on all endpoints
- [ ] Output encoding/escaping
- [ ] Parameterized queries (no SQL injection)
- [ ] CSRF protection enabled
- [ ] XSS protection enabled
- [ ] Dependencies up to date
- [ ] Security linting enabled

### Deployment
- [ ] HTTPS/TLS enabled
- [ ] Secure headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Database encryption enabled
- [ ] Backup encryption enabled
- [ ] Monitoring enabled
- [ ] Logging enabled
- [ ] Error tracking configured

### Ongoing
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Credential rotation
- [ ] Access review
- [ ] Log monitoring
- [ ] Incident response plan
- [ ] Security training

---

## Incident Response

### Security Incident Types

1. **Data Breach** - Unauthorized access to data
2. **Account Compromise** - User account hacked
3. **DDoS Attack** - Service unavailable
4. **Malware** - Malicious code detected
5. **Insider Threat** - Malicious employee

### Incident Response Plan

#### Phase 1: Detection
- Monitor logs for suspicious activity
- Set up alerts for anomalies
- User reports

#### Phase 2: Containment
- Isolate affected systems
- Revoke compromised credentials
- Block malicious IPs
- Preserve evidence

#### Phase 3: Eradication
- Remove malware
- Patch vulnerabilities
- Reset compromised accounts
- Update security rules

#### Phase 4: Recovery
- Restore from clean backups
- Verify system integrity
- Monitor for reinfection
- Gradual service restoration

#### Phase 5: Post-Incident
- Document incident
- Identify root cause
- Update security measures
- Train staff
- Notify affected users (if required)

### Contact Information

**Security Team:**
- Email: security@infocusministries.org
- Phone: [Emergency Contact]
- On-Call: [PagerDuty/etc]

**External Resources:**
- FBI Cyber Division: https://www.fbi.gov/investigate/cyber
- CISA: https://www.cisa.gov/report

---

## Related Documentation

- **Authentication Flow:** `AUTHENTICATION-FLOW.md`
- **Data Protection:** `DATA-PROTECTION.md`
- **Deployment:** `../deployment/DEPLOYMENT-GUIDE.md`
- **Backend Integration:** `../backend/shared/BACKEND-INTEGRATION-GUIDE.md`

---

**Last Updated:** November 12, 2025  
**Classification:** Internal Use Only  
**Maintained By:** IFM MVP Security Team
