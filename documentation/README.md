# IFM MVP Documentation

**Version:** 2.1  
**Last Updated:** November 26, 2025  
**Status:** Complete & Production Ready

---

## 📚 Documentation Structure

```
documentation/
├── README.md                      ← You are here
├── PROJECT-GUIDE.md              ← Start here for product overview
│
├── backend/                       ← Backend implementation guides
│   ├── rails/                    ← Ruby on Rails implementation
│   │   └── TECHNICAL-SPEC.md     ← Complete Rails specifications
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
├── deployment/                    ← Deployment guides
│   ├── DEPLOYMENT-GUIDE.md
│   └── ROLLOUT-PLAN.md
│
└── pages/                         ← Component-specific docs
    ├── accounting/               ← 11 accounting components
    ├── administration/           ← 4 admin components
    ├── components/               ← 10 shared UI components
    ├── dashboard/                ← Dashboard docs
    ├── donor-hub/                ← 8 donor components
    ├── marketing/                ← 4 marketing components
    ├── people/                   ← 4 personnel components
    ├── reports/                  ← 9 report components + planning docs
    └── tools/                    ← 3 tool components
```

---

## 🚀 Quick Start

### For Product Managers
1. **`PROJECT-GUIDE.md`** - Product vision, requirements, and roadmap
2. **`backend/shared/04-USER-ROLES-AND-PERMISSIONS.md`** - User roles and access control

### For Backend Developers (Ruby on Rails)
1. **`backend/rails/TECHNICAL-SPEC.md`** - Complete Rails specifications
2. **`backend/shared/01-DATA-SCHEMA.md`** - Database schema (28+ tables)
3. **`backend/shared/02-API-REQUIREMENTS.md`** - API endpoints (~180+)
4. **`backend/shared/03-COMPONENT-INTEGRATIONS.md`** - Integration workflows
5. **`database/DATABASE-SCHEMA.sql`** - PostgreSQL DDL

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
- **Backend API:** Ready for Rails implementation
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

### Backend (Ruby on Rails)
- **Framework:** Ruby on Rails 7+
- **Database:** PostgreSQL 14+
- **Authentication:** JWT or Devise
- **Background Jobs:** Sidekiq + Redis
- **File Storage:** AWS S3
- **Email:** SendGrid or Mailgun

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
| **Technical Spec** | Complete Rails specifications | `backend/rails/TECHNICAL-SPEC.md` |

### Backend (Rails)
| Document | Description | Location |
|----------|-------------|----------|
| **Technical Spec** | Complete Rails guide | `backend/rails/TECHNICAL-SPEC.md` |
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

### Deployment
| Document | Description | Location |
|----------|-------------|----------|
| **Deployment Guide** | Production deployment | `deployment/DEPLOYMENT-GUIDE.md` |
| **Rollout Plan** | Launch strategy | `deployment/ROLLOUT-PLAN.md` |

### Pages (Component Documentation)
| Folder | Components | Location |
|--------|------------|----------|
| **Accounting** | 11 components | `pages/accounting/` |
| **Administration** | 4 components | `pages/administration/` |
| **Donor Hub** | 8 components | `pages/donor-hub/` |
| **Marketing** | 4 components | `pages/marketing/` |
| **People** | 4 components | `pages/people/` |
| **Reports** | 9 components | `pages/reports/` |
| **Tools** | 3 components | `pages/tools/` |

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
3. Contact the development team

---

**Last Updated:** November 26, 2025  
**Documentation Version:** 2.1  
**Maintained By:** IFM MVP Development Team
