# IFM MVP Documentation

**Version:** 2.0  
**Last Updated:** November 12, 2025  
**Status:** Complete & Production Ready

---

## 📚 Documentation Structure

```
documentation/
├── README.md                      ← You are here
├── PROJECT-GUIDE.md              ← Start here for product overview
│
├── backend/                       ← Backend implementation guides
│   ├── BACKEND-COMPARISON.md     ← Rails vs Django comparison
│   ├── python/                   ← Python/Django implementation
│   │   ├── PYTHON-BACKEND-OVERVIEW.md
│   │   ├── PYTHON-MODELS.md
│   │   ├── PYTHON-API.md
│   │   └── PYTHON-BUSINESS-LOGIC.md
│   ├── rails/                    ← Ruby on Rails implementation
│   │   └── TECHNICAL-SPEC.md
│   └── shared/                   ← Framework-agnostic specs
│       ├── 01-DATA-SCHEMA.md
│       ├── 02-API-REQUIREMENTS.md
│       ├── 03-COMPONENT-INTEGRATIONS.md
│       └── 04-USER-ROLES-AND-PERMISSIONS.md
│
├── frontend/                      ← Frontend documentation
│   ├── RESPONSIVE_DESIGN.md      ← Mobile responsive guide
│   └── STYLING-GUIDE.md          ← UI/UX styling system
│
├── database/                      ← Database documentation
│   ├── DATABASE-SCHEMA.sql       ← PostgreSQL schema
│   └── GL-INTEGRATION.md         ← General Ledger integration
│
├── reports/                       ← Financial reports docs
│   ├── REPORTS-IMPLEMENTATION-PLAN.md
│   └── REPORTS-TASK-BREAKDOWN.md
│
├── implementation/                ← Implementation notes
│   ├── IMPLEMENTATION-COMPLETE.md
│   └── COMMIT-SUMMARY.md
│
└── pages/                         ← Component-specific docs
    ├── accounting/
    ├── administration/
    ├── dashboard/
    ├── donor-hub/
    ├── marketing/
    ├── personnel/
    └── reports/
```

---

## 🚀 Quick Start

### For Product Managers
1. **`PROJECT-GUIDE.md`** - Product vision, requirements, and roadmap
2. **`backend/shared/04-USER-ROLES-AND-PERMISSIONS.md`** - User roles and access control

### For Backend Developers

#### Choosing a Framework
1. **`backend/BACKEND-COMPARISON.md`** - Compare Rails vs Django

#### Python/Django Path
1. **`backend/python/PYTHON-BACKEND-OVERVIEW.md`** - Setup and configuration
2. **`backend/python/PYTHON-MODELS.md`** - Database models
3. **`backend/python/PYTHON-API.md`** - REST API implementation
4. **`backend/python/PYTHON-BUSINESS-LOGIC.md`** - Business logic services

#### Ruby on Rails Path
1. **`backend/rails/TECHNICAL-SPEC.md`** - Complete Rails specifications

#### Shared Resources (Both Frameworks)
- **`backend/shared/01-DATA-SCHEMA.md`** - Database schema (28+ tables)
- **`backend/shared/02-API-REQUIREMENTS.md`** - API endpoints (~180+)
- **`backend/shared/03-COMPONENT-INTEGRATIONS.md`** - Integration workflows
- **`database/DATABASE-SCHEMA.sql`** - PostgreSQL DDL

### For Frontend Developers
1. **`frontend/RESPONSIVE_DESIGN.md`** - Mobile responsive implementation
2. **`frontend/STYLING-GUIDE.md`** - UI/UX styling system
3. **`pages/`** - Component-specific documentation

### For Database Administrators
1. **`database/DATABASE-SCHEMA.sql`** - Complete PostgreSQL schema
2. **`database/GL-INTEGRATION.md`** - General Ledger integration
3. **`backend/shared/01-DATA-SCHEMA.md`** - Schema documentation

---

## 📊 Project Status

### ✅ Complete
- **Frontend:** 100% complete (React 18 + TypeScript + Tailwind CSS)
- **Mobile Responsive:** 100% complete (all components except accounting tools)
- **Documentation:** 100% complete (20+ comprehensive documents)
- **Database Schema:** 100% complete (28+ tables, SQL ready)
- **API Specification:** 100% complete (~180+ endpoints documented)
- **UI/UX Design:** 100% complete (glassmorphic design system)

### 🔄 In Progress
- **Backend API:** Ready for implementation (choose Python or Rails)
- **Authentication:** Specifications complete, implementation pending
- **Payment Processing:** Stripe integration documented

### 📋 Pending
- **Production Deployment:** Pending backend completion
- **User Testing:** Pending backend integration
- **Performance Optimization:** Post-integration

---

## 🎯 Key Features

### Multi-Tenant Architecture
- Support for multiple nonprofit organizations
- Complete data isolation between entities
- 4-tier role-based access control (RBAC)

### Donor Management
- Complete donor CRM with contact management
- Donation tracking and processing
- Recurring donation subscriptions
- Custom donation landing pages
- Donor self-service portal

### Financial Management
- Double-entry bookkeeping
- Chart of accounts management (79 accounts)
- General ledger with full audit trail
- Bank reconciliation
- Multi-fund accounting
- Financial reports (Balance Sheet, P&L, Income Statement)

### Personnel & Volunteers
- Staff and employee management
- Volunteer coordination
- Hour tracking and approval workflows

### Marketing
- Email campaign management
- Prospect tracking
- Video donation pages (VideoBomb)

### Reports
- Balance Sheet with 38 fund balances
- Income Statement by Fund (multi-column)
- Profit & Loss reports
- Volunteer Hours reports
- Tax receipts and contribution statements

---

## 🏗️ Technical Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS v4.1.17
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** React Context API
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend Options

#### Python/Django (Recommended)
- **Framework:** Django 5.0+ with Django REST Framework
- **Database:** PostgreSQL 14+
- **Authentication:** JWT (Simple JWT)
- **Background Jobs:** Celery + Redis
- **Advantages:** Built-in admin, best REST framework, type safety

#### Ruby on Rails (Alternative)
- **Framework:** Ruby on Rails 7+
- **Database:** PostgreSQL 14+
- **Authentication:** JWT or Devise
- **Background Jobs:** Sidekiq + Redis
- **Advantages:** Convention over configuration, rapid development

### Database
- **Primary:** PostgreSQL 14+
- **Tables:** 28+ core tables
- **Features:** Row-level security, JSONB fields, full-text search

---

## 📖 Documentation Index

### Core Documentation
| Document | Description | Location |
|----------|-------------|----------|
| **Project Guide** | Product overview and roadmap | `PROJECT-GUIDE.md` |
| **Backend Comparison** | Rails vs Django guide | `backend/BACKEND-COMPARISON.md` |

### Backend - Python/Django
| Document | Description | Location |
|----------|-------------|----------|
| **Overview** | Setup and configuration | `backend/python/PYTHON-BACKEND-OVERVIEW.md` |
| **Models** | Django ORM models | `backend/python/PYTHON-MODELS.md` |
| **API** | DRF ViewSets and serializers | `backend/python/PYTHON-API.md` |
| **Business Logic** | Services layer | `backend/python/PYTHON-BUSINESS-LOGIC.md` |

### Backend - Ruby on Rails
| Document | Description | Location |
|----------|-------------|----------|
| **Technical Spec** | Complete Rails guide | `backend/rails/TECHNICAL-SPEC.md` |

### Backend - Shared
| Document | Description | Location |
|----------|-------------|----------|
| **Data Schema** | Database schema (28+ tables) | `backend/shared/01-DATA-SCHEMA.md` |
| **API Requirements** | API endpoints (~180+) | `backend/shared/02-API-REQUIREMENTS.md` |
| **Integrations** | Component workflows | `backend/shared/03-COMPONENT-INTEGRATIONS.md` |
| **Permissions** | RBAC system | `backend/shared/04-USER-ROLES-AND-PERMISSIONS.md` |

### Frontend
| Document | Description | Location |
|----------|-------------|----------|
| **Responsive Design** | Mobile implementation | `frontend/RESPONSIVE_DESIGN.md` |
| **Styling Guide** | UI/UX system | `frontend/STYLING-GUIDE.md` |

### Database
| Document | Description | Location |
|----------|-------------|----------|
| **SQL Schema** | PostgreSQL DDL | `database/DATABASE-SCHEMA.sql` |
| **GL Integration** | Ledger integration | `database/GL-INTEGRATION.md` |

### Reports
| Document | Description | Location |
|----------|-------------|----------|
| **Implementation Plan** | Reports strategy | `reports/REPORTS-IMPLEMENTATION-PLAN.md` |
| **Task Breakdown** | Detailed tasks | `reports/REPORTS-TASK-BREAKDOWN.md` |

### Implementation Notes
| Document | Description | Location |
|----------|-------------|----------|
| **Implementation Complete** | Reports completion | `implementation/IMPLEMENTATION-COMPLETE.md` |
| **Commit Summary** | Development history | `implementation/COMMIT-SUMMARY.md` |

---

## 🔗 Related Resources

- **GitHub Repository:** [astral-duck/Ifmmvpfrontend](https://github.com/astral-duck/Ifmmvpfrontend)
- **Frontend README:** `../README.md`
- **Package Info:** `../package.json`

---

## 📞 Support

For questions or issues:
1. Review relevant documentation above
2. Check component-specific docs in `pages/`
3. Review implementation notes in `implementation/`
4. Contact the development team

---

**Last Updated:** November 12, 2025  
**Documentation Version:** 2.0  
**Maintained By:** IFM MVP Development Team
