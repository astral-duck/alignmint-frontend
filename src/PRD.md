# Product Requirements Document (PRD)
## Unified Fiscal Sponsor Dashboard

**Version:** 1.0  
**Date:** October 20, 2025  
**Document Owner:** Product Team  
**Status:** Implementation Complete (85% Mobile Responsive)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Personas & Roles](#user-personas--roles)
4. [Functional Requirements](#functional-requirements)
5. [Technical Requirements](#technical-requirements)
6. [User Interface Requirements](#user-interface-requirements)
7. [Security & Permissions](#security--permissions)
8. [Performance Requirements](#performance-requirements)
9. [Success Metrics](#success-metrics)
10. [Implementation Status](#implementation-status)
11. [Future Roadmap](#future-roadmap)

---

## Executive Summary

The Unified Fiscal Sponsor Dashboard is a comprehensive nonprofit management platform designed specifically for fiscal sponsor organizations managing multiple nonprofit entities. Built for InFocus Ministries and their 34 subsidiary nonprofits, this platform provides centralized management capabilities while maintaining strict data isolation and role-based access controls.

### Key Value Propositions
- **Centralized Management**: Single platform for managing all fiscal sponsor operations
- **Role-Based Access**: Granular permissions ensuring data privacy between entities
- **Mobile-First Design**: Fully responsive interface optimized for mobile devices
- **Comprehensive Feature Set**: Complete nonprofit management from donations to reporting
- **Scalable Architecture**: Designed to handle growth in both entities and users

---

## Product Overview

### Primary Objectives
1. **Streamline Operations**: Centralize all nonprofit management activities into a single platform
2. **Ensure Compliance**: Maintain proper financial segregation and reporting for fiscal sponsor requirements
3. **Improve Efficiency**: Reduce administrative overhead through automation and integrated workflows
4. **Enhance Transparency**: Provide clear visibility into operations while respecting privacy boundaries
5. **Support Growth**: Enable easy onboarding of new nonprofits and scaling of operations

### Core Modules
1. **Dashboard**: Real-time metrics and customizable widgets
2. **Donor Management**: CRM, donation tracking, and donor portal creation
3. **Personnel Management**: Staff, volunteers, and user management
4. **Marketing Tools**: Campaign management, video landing pages, and prospect tracking
5. **Accounting Suite**: Financial management, reconciliation, and expense tracking
6. **Reporting Engine**: Comprehensive financial and operational reports
7. **Administration**: Settings, user management, and system configuration

---

## User Personas & Roles

### Primary Personas

#### 1. Fiscal Sponsor Administrator (InFocus Ministries)
- **Role**: Super admin with full system access
- **Responsibilities**: Oversee all 34 nonprofits, manage distributions, compliance reporting
- **Access Level**: Full visibility across all entities and data
- **Key Features**: Entity management, consolidated reporting, user administration

#### 2. Nonprofit Executive Director
- **Role**: Entity-level administrator
- **Responsibilities**: Manage their specific nonprofit's operations
- **Access Level**: Full access to their entity's data only
- **Key Features**: Fundraising management, staff oversight, financial tracking

#### 3. Nonprofit Development Officer
- **Role**: Fundraising and donor relations specialist
- **Responsibilities**: Donor cultivation, campaign management, grant writing
- **Access Level**: Donor and marketing modules for their entity
- **Key Features**: CRM, donation tracking, campaign tools, prospect management

#### 4. Nonprofit Finance Manager
- **Role**: Financial operations specialist
- **Responsibilities**: Bookkeeping, expense management, budget tracking
- **Access Level**: Accounting and reporting modules for their entity
- **Key Features**: Expense tracking, reconciliation, financial reports

#### 5. Volunteer Coordinator
- **Role**: Personnel management specialist
- **Responsibilities**: Volunteer recruitment, scheduling, hour tracking
- **Access Level**: Personnel modules for their entity
- **Key Features**: Volunteer CRM, hour tracking, event management

---

## Functional Requirements

### 1. Dashboard Module

#### 1.1 Metrics Display
- **Requirement**: Display key performance indicators with configurable time periods
- **Features**:
  - Revenue metrics (donations, grants, total income)
  - Donor metrics (new donors, retention rate, average gift)
  - Activity metrics (volunteer hours, events, campaigns)
  - Financial health indicators
- **Time Periods**: Day, Week, Month, Year-to-Date
- **Visualization**: Cards with trend indicators and percentage changes

#### 1.2 Customizable Layout
- **Requirement**: Allow users to personalize their dashboard layout
- **Features**:
  - Drag-and-drop component reordering
  - Component visibility toggles
  - Layout persistence per user
  - Reset to default option
- **Components**: Revenue chart, recent donations, todo list, top donors

#### 1.3 Entity Filtering
- **Requirement**: Filter all data by selected nonprofit entity
- **Features**:
  - Dropdown selector with all 34 nonprofits
  - "All Entities" option for fiscal sponsor administrators
  - Persistent selection across sessions
  - Quick entity switching

### 2. Donor Management Hub

#### 2.1 Donor CRM
- **Requirement**: Comprehensive donor relationship management
- **Features**:
  - Contact information management
  - Donation history tracking
  - Communication log
  - Donor segmentation and tagging
  - Custom fields and notes
  - Relationship mapping
- **Mobile Optimization**: Card-based view for mobile devices

#### 2.2 Donations Manager
- **Requirement**: Complete donation lifecycle management
- **Features**:
  - Donation entry and editing
  - Recurring donation setup
  - Payment method tracking
  - Receipt generation
  - Batch processing
  - Import/export capabilities
- **Integration**: Payment processor connectivity

#### 2.3 Donor Page Builder
- **Requirement**: Create custom donation landing pages
- **Features**:
  - Drag-and-drop page builder
  - Template library
  - Custom branding options
  - Form customization
  - Goal tracking and progress bars
  - Social sharing integration

#### 2.4 Donor Portal
- **Requirement**: Self-service portal for donors
- **Features**:
  - Donation history access
  - Receipt downloads
  - Recurring donation management
  - Profile updates
  - Tax statement generation
  - Communication preferences

### 3. Personnel Management Hub

#### 3.1 Personnel CRM
- **Requirement**: Staff and contractor management
- **Features**:
  - Employee profiles and contact information
  - Role and permission management
  - Performance tracking
  - Document storage
  - Onboarding workflows
  - Offboarding checklists

#### 3.2 Volunteer Management
- **Requirement**: Comprehensive volunteer coordination
- **Features**:
  - Volunteer registration and profiles
  - Skill and interest tracking
  - Opportunity matching
  - Scheduling and calendar integration
  - Communication tools
  - Recognition and appreciation tracking

#### 3.3 Hour Tracking
- **Requirement**: Time tracking for staff and volunteers
- **Features**:
  - Clock in/out functionality
  - Project and task categorization
  - Approval workflows
  - Reporting and analytics
  - Integration with payroll systems
  - Mobile time entry

#### 3.4 User Management
- **Requirement**: System user administration
- **Features**:
  - User account creation and management
  - Role assignment and permissions
  - Access level configuration
  - Password policy enforcement
  - Session management
  - Audit logging

### 4. Marketing Tools

#### 4.1 Email Campaigns
- **Requirement**: Email marketing and communication
- **Features**:
  - Campaign creation and scheduling
  - Template library
  - Recipient segmentation
  - A/B testing capabilities
  - Performance analytics
  - Unsubscribe management
- **Compliance**: CAN-SPAM compliance features

#### 4.2 Video Landing Pages (Video Bomb)
- **Requirement**: Video-centric donation pages
- **Features**:
  - Video upload and hosting
  - Customizable landing page templates
  - Donation form integration
  - Social sharing tools
  - Analytics and conversion tracking
  - Mobile optimization

#### 4.3 Prospect Management
- **Requirement**: Lead tracking and cultivation
- **Features**:
  - Prospect database management
  - Lead scoring and prioritization
  - Pipeline management
  - Activity tracking
  - Follow-up reminders
  - Conversion analytics

#### 4.4 Event Management
- **Requirement**: Event planning and execution
- **Features**:
  - Event creation and management
  - Registration and ticketing
  - Attendee communication
  - Check-in capabilities
  - Post-event follow-up
  - Revenue tracking

### 5. Accounting Suite

#### 5.1 Reconciliation Manager
- **Requirement**: Bank and account reconciliation
- **Features**:
  - Transaction import and matching
  - Discrepancy identification
  - Adjustment entry
  - Approval workflows
  - Audit trails
  - Multi-account support

#### 5.2 Expense Management
- **Requirement**: Expense tracking and approval
- **Features**:
  - Expense entry and categorization
  - Receipt capture and storage
  - Approval workflows
  - Budget monitoring
  - Vendor management
  - Integration with accounting systems

#### 5.3 Reimbursement Processing
- **Requirement**: Employee and volunteer reimbursements
- **Features**:
  - Reimbursement request submission
  - Documentation requirements
  - Approval workflows
  - Payment processing
  - Tax compliance
  - Reporting and analytics

#### 5.4 Distribution Management
- **Requirement**: Fiscal sponsor fund distribution
- **Features**:
  - Distribution calculation and processing
  - Fee management
  - Compliance reporting
  - Approval workflows
  - Audit trails
  - Integration with banking systems

### 6. Reporting Engine

#### 6.1 Financial Reports
- **Requirement**: Comprehensive financial reporting
- **Reports**:
  - Balance Sheet
  - Profit & Loss Statement
  - Income Statement
  - Cash Flow Statement
  - Budget vs. Actual
  - Grant Tracking Report
- **Features**: Customizable date ranges, entity filtering, export capabilities

#### 6.2 Operational Reports
- **Requirement**: Nonprofit-specific operational reports
- **Reports**:
  - Volunteer Hours Report
  - Donor Retention Analysis
  - Campaign Performance Report
  - Event ROI Analysis
  - Prospect Pipeline Report
- **Features**: Visual charts, trend analysis, comparative reporting

### 7. Settings and Administration

#### 7.1 System Configuration
- **Requirement**: System-wide settings management
- **Features**:
  - Organization profile management
  - Branding customization
  - Notification preferences
  - Integration configurations
  - Data retention policies

#### 7.2 User Preferences
- **Requirement**: Individual user customization
- **Features**:
  - Theme selection (light/dark mode)
  - Dashboard layout preferences
  - Notification settings
  - Language preferences
  - Time zone configuration

---

## Technical Requirements

### 1. Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4.0 with custom design tokens
- **State Management**: React Context API with custom hooks
- **Component Library**: Shadcn/ui with custom components
- **Drag & Drop**: React DnD for dashboard customization
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icon library

### 2. Backend Requirements
- **Database**: Supabase PostgreSQL with row-level security
- **Authentication**: Supabase Auth with role-based access control
- **API**: RESTful API with real-time subscriptions
- **File Storage**: Supabase Storage for documents and media
- **Email Service**: Integration with email service providers

### 3. Infrastructure
- **Hosting**: Modern web hosting with CDN support
- **SSL**: HTTPS encryption for all communications
- **Backup**: Automated database backups with point-in-time recovery
- **Monitoring**: Application performance monitoring and error tracking
- **Scaling**: Horizontal scaling capabilities for growth

### 4. Security
- **Data Encryption**: At-rest and in-transit encryption
- **Access Control**: Multi-factor authentication support
- **Audit Logging**: Comprehensive activity logging
- **Compliance**: SOC 2 Type II compliance preparation
- **Data Privacy**: GDPR and CCPA compliance features

---

## User Interface Requirements

### 1. Design System
- **Visual Design**: Clean, modern interface inspired by Aplos nonprofit tools
- **Color Scheme**: Professional color palette with light/dark mode support
- **Typography**: Clear, accessible font hierarchy
- **Spacing**: Consistent spacing system using design tokens
- **Components**: Reusable UI components with consistent behavior

### 2. Responsive Design
- **Mobile-First**: Optimized for mobile devices with 320px minimum width
- **Breakpoints**: Responsive design with sm (640px), md (768px), lg (1024px) breakpoints
- **Touch Interface**: Touch-friendly controls and gestures
- **Performance**: Optimized loading and smooth animations

### 3. Layout Standards
- **Hub Pages**: Consistent 3-tile card layout for all hub pages
- **Navigation**: Back buttons on all subpages to return to hub
- **Sidebar**: Collapsible sidebar with responsive behavior
- **Content Areas**: Maximum width containers with proper spacing

### 4. Accessibility
- **WCAG 2.1**: Level AA compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Clear focus indicators and logical tab order

---

## Security & Permissions

### 1. Role-Based Access Control (RBAC)

#### Permission Levels
1. **Fiscal Sponsor Administrator**
   - Full system access
   - User management across all entities
   - Financial oversight and distribution management
   - System configuration and settings

2. **Entity Administrator**
   - Full access to their specific nonprofit's data
   - User management within their entity
   - All modules and features for their organization
   - Cannot access other entities' data

3. **Department Manager**
   - Access to specific modules (e.g., fundraising, finance, volunteers)
   - Limited user management within their department
   - Read/write access to relevant data areas

4. **Staff User**
   - Basic access to assigned modules
   - Data entry and updating capabilities
   - Limited reporting access
   - No administrative functions

5. **Read-Only User**
   - View-only access to assigned modules
   - Report generation capabilities
   - No data modification permissions

### 2. Data Isolation
- **Entity Segregation**: Complete data separation between nonprofits
- **Row-Level Security**: Database-level access controls
- **API Filtering**: Backend filtering based on user permissions
- **Audit Trails**: Complete logging of all data access and modifications

### 3. Authentication & Security
- **Multi-Factor Authentication**: Required for admin users
- **Session Management**: Secure session handling with timeout
- **Password Policies**: Strong password requirements
- **API Security**: Token-based authentication with expiration
- **Data Encryption**: End-to-end encryption for sensitive data

---

## Performance Requirements

### 1. Response Time
- **Page Load**: Initial page load under 2 seconds
- **Navigation**: Page transitions under 500ms
- **API Calls**: Backend responses under 1 second
- **Search**: Search results displayed under 500ms
- **Reports**: Report generation under 10 seconds

### 2. Scalability
- **Concurrent Users**: Support for 500+ concurrent users
- **Data Volume**: Handle 1M+ donor records per entity
- **Transaction Load**: Process 10,000+ donations per day
- **Storage**: Unlimited document and media storage
- **Geographic Distribution**: Multi-region deployment capability

### 3. Availability
- **Uptime**: 99.9% availability SLA
- **Backup**: Real-time data replication
- **Recovery**: Maximum 1-hour recovery time objective
- **Maintenance**: Scheduled maintenance with minimal downtime
- **Monitoring**: 24/7 system monitoring and alerting

---

## Success Metrics

### 1. User Adoption
- **Active Users**: 90% of intended users active monthly
- **Feature Usage**: 80% utilization of core features
- **Mobile Usage**: 60% of sessions from mobile devices
- **User Satisfaction**: 4.5+ star rating in feedback

### 2. Operational Efficiency
- **Time Savings**: 50% reduction in administrative tasks
- **Error Reduction**: 75% fewer data entry errors
- **Process Automation**: 80% of routine tasks automated
- **Reporting Speed**: 90% faster report generation

### 3. Financial Impact
- **Cost Reduction**: 30% reduction in operational costs
- **Revenue Growth**: 25% increase in donation processing efficiency
- **Compliance**: 100% regulatory compliance maintained
- **ROI**: Positive return on investment within 12 months

### 4. Technical Performance
- **Page Load Speed**: 95% of pages load under 2 seconds
- **Mobile Performance**: 90+ Lighthouse mobile score
- **Error Rate**: Less than 0.1% error rate
- **Security**: Zero data breaches or security incidents

---

## Implementation Status

### Completed Features (85% Complete)
✅ **Core Framework**
- React/TypeScript foundation
- Tailwind CSS design system
- Responsive mobile optimization
- Component architecture

✅ **Dashboard Module**
- Metrics cards with KPIs
- Customizable layout with drag-and-drop
- Time period filtering
- Revenue chart visualization

✅ **Donor Management**
- Donor CRM with mobile cards
- Donations manager
- Donor page builder
- Donor portal functionality

✅ **Personnel Management**
- Personnel CRM
- Volunteer management
- Hour tracking system
- User management

✅ **Marketing Tools**
- Email campaign management
- Video landing page creator
- Prospect tracking
- Event management

✅ **Accounting Suite**
- Expense management
- Reconciliation tools
- Reimbursement processing
- Distribution management

✅ **Reporting Engine**
- Financial reports (Balance Sheet, P&L, Income Statement)
- Volunteer hours reporting
- Export capabilities

✅ **Mobile Responsiveness**
- 11 major table components converted to mobile cards
- Responsive chart components
- Mobile-optimized navigation
- Touch-friendly interfaces

### In Progress (15% Remaining)
🔄 **Financial Reports Optimization**
- Advanced chart responsiveness
- Enhanced mobile report viewing
- Print-friendly layouts

🔄 **Administrative Components**
- Settings page optimization
- User management enhancements
- System configuration tools

### Technical Debt Items
- Legacy component refactoring
- Performance optimization
- Accessibility improvements
- Documentation completion

---

## Future Roadmap

### Phase 2: Advanced Features (Q1 2026)
- **AI-Powered Insights**: Predictive analytics for fundraising
- **Advanced Reporting**: Custom report builder
- **Integration Hub**: Third-party service integrations
- **Mobile App**: Native mobile application

### Phase 3: Enterprise Features (Q2 2026)
- **Advanced Security**: Enterprise SSO and compliance
- **Multi-Language**: Internationalization support
- **Advanced Workflows**: Custom business process automation
- **API Gateway**: Public API for third-party integrations

### Phase 4: Innovation Features (Q3-Q4 2026)
- **Machine Learning**: Donor behavior prediction
- **Blockchain**: Transparent donation tracking
- **Voice Interface**: Voice-controlled data entry
- **AR/VR**: Immersive donor engagement tools

---

## Risk Assessment

### High Risk
- **Data Security**: Potential for data breaches affecting multiple nonprofits
- **Compliance**: Regulatory changes affecting fiscal sponsor requirements
- **Scalability**: Performance degradation with rapid growth

### Medium Risk
- **User Adoption**: Resistance to change from current systems
- **Integration**: Complexity of third-party service integrations
- **Mobile Performance**: Maintaining performance across all devices

### Low Risk
- **Technology Changes**: Framework updates and dependencies
- **Design Evolution**: User interface improvements and updates
- **Feature Requests**: Scope creep from additional feature demands

### Mitigation Strategies
- Regular security audits and penetration testing
- Compliance monitoring and legal review processes
- Performance testing and capacity planning
- User training and change management programs
- Modular architecture for easy updates and maintenance

---

## Conclusion

The Unified Fiscal Sponsor Dashboard represents a comprehensive solution for nonprofit management within a fiscal sponsor framework. With 85% completion and mobile responsiveness achieved, the platform is well-positioned to serve InFocus Ministries and their 34 nonprofit entities effectively.

The remaining 15% of development focuses on optimization and enhancement of existing features rather than core functionality, indicating a mature and stable platform ready for production deployment.

**Next Steps:**
1. Complete remaining mobile optimizations
2. Conduct comprehensive user acceptance testing
3. Implement production deployment strategy
4. Develop user training and onboarding materials
5. Plan Phase 2 feature development

---

*This PRD serves as a living document and will be updated as the product evolves and new requirements emerge.*