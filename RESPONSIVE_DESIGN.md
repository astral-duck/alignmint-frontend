# Responsive Design Guide - IFM MVP Dashboard

## Table of Contents
1. [Overview](#overview)
2. [Responsive vs Desktop-Only Components](#responsive-vs-desktop-only-components)
3. [Breakpoint Strategy](#breakpoint-strategy)
4. [Quick Reference Patterns](#quick-reference-patterns)
5. [Component Implementation](#component-implementation)
6. [Mobile-Specific Behaviors](#mobile-specific-behaviors)
7. [Performance Optimizations](#performance-optimizations)
8. [Testing Guide](#testing-guide)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This document provides comprehensive guidance on responsive design implementation for the IFM MVP Dashboard. The application uses **Tailwind CSS v4** with a utility-first approach for responsive design.

### Design Philosophy

- **Selective Responsiveness**: Not all features need mobile support - complex accounting tools are desktop-only
- **Mobile-First Where Appropriate**: Dashboard, donors, personnel, marketing, and reports are mobile-friendly
- **Touch-Friendly**: Minimum 44x44px touch targets on mobile devices
- **Performance-Optimized**: Reduced blur effects and optimized rendering on mobile
- **Progressive Enhancement**: Core functionality accessible on mobile, advanced features on desktop

---

## Responsive vs Desktop-Only Components

### ✅ Mobile-Responsive Components

These components should work well on mobile devices:

#### Core Navigation
- **Header** - Responsive with hamburger menu on mobile
- **AppSidebar** - Overlay drawer on mobile, permanent on desktop
- **Dashboard Home** - Responsive grid layouts (1 → 2 → 4 columns)

#### Donor Management
- **Donor Hub** - Responsive tile layout
- **Donors CRM** - Mobile-friendly list and profile views
- **Donations Manager** - Responsive tables and forms
- **Donor Portal** - Mobile-optimized for donor access
- **Donor Page Manager** - Responsive page builder

#### Personnel Management
- **Personnel Hub** - Responsive tile layout
- **Personnel CRM** - Mobile-friendly list views
- **Volunteers CRM** - Responsive volunteer management
- **Hour Tracking** - Mobile time entry support

#### Marketing
- **Marketing Hub** - Responsive tile layout
- **Marketing Campaigns** - Mobile-friendly campaign views
- **Video Bomb Manager** - Responsive video management
- **Prospects List** - Mobile-friendly prospect tracking

#### Reports
- **Reports Hub** - Responsive tile layout
- **Balance Sheet Report** - Mobile-optimized report viewing
- **Profit & Loss Report** - Responsive financial reports
- **Income Statement Report** - Mobile-friendly statements
- **Volunteer Hours Report** - Responsive hour reports

#### Deposits & Reimbursements
- **Deposit Hub** - Responsive tile layout
- **Check Deposit Manager** - Mobile check capture support
- **Regular Deposit Manager** - Mobile deposit entry
- **Reimbursements Manager** - Mobile reimbursement requests

### ❌ Desktop-Only Components

These components require desktop for complex data entry and analysis:

#### Accounting Tools
- **Accounting Hub** - Desktop-only (show message on mobile)
- **Reconciliation Manager** - Desktop-only (complex matching)
- **Expenses Manager** - Desktop-only (detailed categorization)
- **General Ledger** - Desktop-only (complex data tables)
- **Journal Entry Manager** - Desktop-only (accounting expertise required)
- **Chart of Accounts Manager** - Desktop-only (complex hierarchy)
- **Sponsor Fee Allocation** - Desktop-only (complex calculations)

#### Administration
- **Administration Hub** - Responsive tile layout
- **User Management** - Desktop-preferred (complex permissions)
- **Nonprofit Management** - Desktop-preferred (detailed configuration)
- **Settings** - Responsive but some features desktop-only

### 📝 Implementation Status

#### ✅ Currently Implemented
- Responsive sidebar with mobile overlay
- Hamburger menu on mobile
- Responsive grid layouts for metrics and hubs
- Mobile-friendly form layouts
- Responsive spacing and padding

#### 🔨 Needs Implementation
- Hide visibility toggle (eyeball icon) on mobile
- Auto-collapse sidebar on navigation selection (mobile only)
- Desktop-only warnings for accounting tools
- Touch target sizing enforcement (44x44px minimum)
- Responsive typography scale
- Performance-optimized blur effects
- Responsive border radius

---

## Breakpoint Strategy

### Tailwind CSS Breakpoints

The application uses Tailwind's default breakpoint system:

```
Base (mobile): 0px      // Mobile phones (default, no prefix)
sm: 640px               // Large phones / small tablets
md: 768px               // Tablets / small laptops
lg: 1024px              // Laptops / desktops
xl: 1280px              // Large desktops
2xl: 1536px             // Extra large displays
```

### Breakpoint Usage Strategy

| Breakpoint | Use Case | Example |
|------------|----------|----------|
| **Base (no prefix)** | Mobile-first default | `flex-col` |
| **sm:** | Tablet adjustments | `sm:flex-row` |
| **md:** | Primary desktop breakpoint | `md:hidden`, `md:block` |
| **lg:** | Enhanced desktop layouts | `lg:grid-cols-4` |
| **xl:** | Large screen optimizations | `xl:max-w-7xl` |

### Key Breakpoint: `md:` (768px)

This is the **primary breakpoint** for mobile vs desktop:
- Below 768px = Mobile experience
- Above 768px = Desktop experience

```tsx
// Show on mobile only
className="md:hidden"

// Show on desktop only  
className="hidden md:block"

// Responsive sidebar width
className="w-64 md:w-16 lg:w-64"
```

---

## Quick Reference Patterns

### 1. Hamburger Menu for Mobile Navigation
```tsx
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

<Button
  variant="ghost"
  size="icon"
  className="md:hidden min-h-[44px] min-w-[44px]"
  onClick={onMenuClick}
>
  <Menu className="h-5 w-5" />
</Button>
```

### 2. Responsive Card with Optimized Blur
```tsx
import { Card, CardContent } from './ui/card';

<Card className="
  backdrop-blur-[12px] md:backdrop-blur-[20px]
  rounded-xl md:rounded-2xl
  border border-border
">
  <CardContent className="p-4 md:p-6">
    {/* Your content */}
  </CardContent>
</Card>
```

### 3. Responsive Typography with Text Wrapping
```tsx
<h1 className="
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
  break-words
  leading-tight
">
  Title That Won't Cut Off
</h1>
```

### 4. Touch-Friendly Button
```tsx
import { Button } from './ui/button';

<Button className="
  min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto
  px-4 sm:px-6
  text-sm md:text-base
">
  Touch-Friendly Button
</Button>
```

### 5. Stacked Form Layout (Mobile)
```tsx
<div className="flex flex-col sm:flex-row gap-4 mb-6">
  <Input type="date" placeholder="Start Date" />
  <Input type="date" placeholder="End Date" />
</div>
```

### 6. Touch-Friendly Input Fields
```tsx
import { Input } from './ui/input';

<Input 
  className="
    min-h-[44px] md:min-h-auto
    text-base md:text-sm
  "
  placeholder="Enter value"
/>
```

### 7. Responsive Spacing
```tsx
<div className="
  p-4 sm:p-6 md:p-8
  pt-20 sm:pt-22 md:pt-20
  space-y-4 sm:space-y-6 md:space-y-8
">
  {/* Content */}
</div>
```

### 8. Header Layout with Conditional Elements
```tsx
<header className="flex items-center justify-between h-16 px-4 md:px-6">
  {/* Left: Hamburger (mobile only) */}
  <Button className="md:hidden" onClick={onMenuClick}>
    <Menu />
  </Button>
  
  {/* Center: Entity Selector */}
  <div className="flex-1 max-w-md mx-auto">
    <Select>{/* ... */}</Select>
  </div>
  
  {/* Right: Actions */}
  <div className="flex items-center gap-2">
    {/* Hide visibility toggle on mobile */}
    <Button className="hidden md:flex">
      <Eye />
    </Button>
    <Button><Moon /></Button>
    <Button><Bell /></Button>
  </div>
</header>
```

### 9. Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  <div>{/* Item */}</div>
  <div>{/* Item */}</div>
  <div>{/* Item */}</div>
  <div>{/* Item */}</div>
</div>
```

### 10. Desktop-Only Warning Message
```tsx
// For accounting tools that require desktop
const DesktopOnlyWarning = () => (
  <div className="md:hidden flex items-center justify-center min-h-[50vh] p-6">
    <Card className="max-w-md text-center">
      <CardContent className="p-6">
        <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Desktop Required</h2>
        <p className="text-muted-foreground">
          This accounting tool requires a desktop computer for complex data entry and analysis.
          Please access this feature from a larger screen.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Usage in component
export const GeneralLedger = () => {
  return (
    <>
      <DesktopOnlyWarning />
      <div className="hidden md:block">
        {/* Desktop content */}
      </div>
    </>
  );
};
```

---

## Component Implementation

### Header Component

**Current Implementation:**
```tsx
// src/components/Header.tsx
export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card dark:bg-card">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px]"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Entity Selector */}
        <div className="flex-1 max-w-md mx-auto">
          <Select>{/* ... */}</Select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* HIDE ON MOBILE: Visibility Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex min-h-[44px] min-w-[44px]"
            onClick={() => setVisibilityEditMode(!visibilityEditMode)}
          >
            {visibilityEditMode ? <EyeOff /> : <Eye />}
          </Button>

          {/* Theme Toggle */}
          <Button className="min-h-[44px] min-w-[44px]">
            {theme === 'light' ? <Moon /> : <Sun />}
          </Button>

          {/* Notifications */}
          <Button className="min-h-[44px] min-w-[44px]">
            <Bell />
          </Button>

          {/* User Menu */}
          <DropdownMenu>{/* ... */}</DropdownMenu>
        </div>
      </div>
    </header>
  );
};
```

**Key Changes Needed:**
- ✅ Already has hamburger menu on mobile
- 🔨 **TODO**: Hide visibility toggle (eyeball) on mobile with `hidden md:flex`
- ✅ Touch-friendly button sizes (44x44px)

### Sidebar Component

**Current Implementation:**
```tsx
// src/components/AppSidebar.tsx
export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-sidebar dark:bg-[#1a1f3a]
          border-r border-sidebar-border dark:border-[#2d3454]
          transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'}
          w-64
        `}
      >
        {/* Sidebar content */}
      </aside>
    </>
  );
};
```

**Key Changes Needed:**
- ✅ Mobile overlay drawer working
- ✅ Desktop permanent sidebar working
- 🔨 **TODO**: Auto-close sidebar on navigation selection (mobile only)

**Implementation for Auto-Close:**
```tsx
const handleNavigation = (page: string) => {
  setCurrentPage(page);
  
  // Auto-close sidebar on mobile after navigation
  if (window.innerWidth < 768) {
    onClose();
  }
};
```

### Desktop-Only Components

**Pattern for Accounting Tools:**
```tsx
// src/components/GeneralLedger.tsx
import { Monitor } from 'lucide-react';

export const GeneralLedger: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Mobile Warning */}
      <div className="md:hidden flex items-center justify-center min-h-[50vh] p-6">
        <Card className="max-w-md text-center">
          <CardContent className="p-6 space-y-4">
            <Monitor className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Desktop Required</h2>
              <p className="text-muted-foreground">
                The General Ledger requires a desktop computer for complex data entry,
                reconciliation, and analysis. Please access this feature from a larger screen.
              </p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block">
        {/* Full general ledger interface */}
      </div>
    </div>
  );
};
```

**Apply to these components:**
- `ReconciliationManager.tsx`
- `ExpensesManager.tsx`
- `GeneralLedger.tsx`
- `JournalEntryManager.tsx`
- `ChartOfAccountsManager.tsx`
- `SponsorFeeAllocation.tsx`

---

## Mobile-Specific Behaviors

### 1. Sidebar Auto-Close on Navigation

**Location**: `src/components/AppSidebar.tsx`

**Implementation:**
```tsx
const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage } = useApp();
  
  const handleNavigationClick = (page: string) => {
    if (!visibilityEditMode) {
      setCurrentPage(page);
      
      // Auto-close on mobile only
      if (window.innerWidth < 768) {
        onClose();
      }
    }
  };

  return (
    <aside>
      <nav>
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigationClick(item.page)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};
```

### 2. Hide Visibility Toggle on Mobile

**Location**: `src/components/Header.tsx`

**Implementation:**
```tsx
{/* Visibility Toggle - Hidden on Mobile */}
<Button
  variant={visibilityEditMode ? "default" : "ghost"}
  size="icon"
  onClick={() => setVisibilityEditMode(!visibilityEditMode)}
  className="hidden md:flex min-h-[44px] min-w-[44px]" // Add 'hidden md:flex'
  title={visibilityEditMode ? "Exit visibility mode" : "Customize visible items"}
>
  {visibilityEditMode ? <EyeOff /> : <Eye />}
</Button>
```

### 3. Touch Target Enforcement

**All interactive elements on mobile should be minimum 44x44px:**

```tsx
// Buttons
<Button className="min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto">

// Icon Buttons
<Button size="icon" className="min-h-[44px] min-w-[44px]">

// Input Fields
<Input className="min-h-[44px] md:min-h-auto">

// Select Dropdowns
<Select className="min-h-[44px] md:min-h-auto">
```

### 4. Responsive Table Handling

**For tables with many columns:**

```tsx
// Option 1: Horizontal scroll on mobile
<div className="overflow-x-auto">
  <Table className="min-w-[600px]">
    {/* Table content */}
  </Table>
</div>

// Option 2: Card layout on mobile, table on desktop
<div className="md:hidden space-y-4">
  {/* Card layout for mobile */}
  {items.map(item => (
    <Card key={item.id}>
      <CardContent>
        {/* Item details */}
      </CardContent>
    </Card>
  ))}
</div>

<div className="hidden md:block">
  <Table>
    {/* Full table for desktop */}
  </Table>
</div>
```

### 5. Responsive Dialog/Modal Sizing

```tsx
<Dialog>
  <DialogContent className="
    w-[95vw] max-w-[425px] sm:max-w-[600px] md:max-w-[700px]
    max-h-[90vh] overflow-y-auto
  ">
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

---

## Performance Optimizations

### 1. Responsive Blur Effects

**Update**: `src/styles/globals.css`

```css
/* Current - Static blur */
.bg-card {
  backdrop-filter: blur(20px) saturate(180%);
}

/* Optimized - Responsive blur */
.bg-card {
  backdrop-filter: blur(12px) saturate(150%);
}

@media (min-width: 768px) {
  .bg-card {
    backdrop-filter: blur(20px) saturate(180%);
  }
}
```

**Or use Tailwind utilities:**
```tsx
<Card className="backdrop-blur-[12px] md:backdrop-blur-[20px]">
```

### 2. Responsive Border Radius

```tsx
// Cards
<Card className="rounded-xl md:rounded-2xl">

// Buttons
<Button className="rounded-lg md:rounded-xl">

// Inputs
<Input className="rounded-md md:rounded-lg">
```

### 3. Conditional Component Loading

```tsx
// Don't render heavy components on mobile
const isDesktop = window.innerWidth >= 768;

{isDesktop && <ComplexChartComponent />}
{!isDesktop && <SimplifiedMobileView />}
```

### 4. Image Optimization

```tsx
// Responsive images
<img
  src={imageSrc}
  srcSet={`
    ${mobileImage} 640w,
    ${tabletImage} 768w,
    ${desktopImage} 1024w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
  alt="Description"
/>
```

### 5. Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

---

## Testing Guide

### Manual Testing Checklist

#### Layout & Navigation
- [ ] Hamburger menu opens/closes sidebar on mobile
- [ ] Sidebar auto-closes after navigation on mobile
- [ ] Sidebar stays open after navigation on desktop
- [ ] Visibility toggle (eyeball) hidden on mobile
- [ ] Header layout doesn't overlap or break on any screen size
- [ ] Entity selector works on all screen sizes

#### Desktop-Only Components
- [ ] Accounting Hub shows desktop warning on mobile
- [ ] Reconciliation Manager shows desktop warning on mobile
- [ ] Expenses Manager shows desktop warning on mobile
- [ ] General Ledger shows desktop warning on mobile
- [ ] Journal Entry shows desktop warning on mobile
- [ ] Chart of Accounts shows desktop warning on mobile
- [ ] All desktop-only components work normally on desktop

#### Responsive Components
- [ ] Dashboard metrics grid: 1 → 2 → 4 columns
- [ ] Donor Hub tiles responsive
- [ ] Donors CRM list and profile views work on mobile
- [ ] Reports display correctly on mobile
- [ ] Deposit managers work on mobile
- [ ] Reimbursement requests work on mobile

#### Touch Targets
- [ ] All buttons minimum 44x44px on mobile
- [ ] Icon buttons are touch-friendly
- [ ] Input fields are easy to tap
- [ ] Dropdown selects are easy to use
- [ ] Table rows are easy to select on mobile

#### Forms & Inputs
- [ ] Date pickers stack vertically on mobile
- [ ] Form fields are full-width on mobile
- [ ] Multi-column forms stack on mobile
- [ ] Input fields have proper height (44px minimum)
- [ ] Buttons are full-width where appropriate

#### Tables & Data
- [ ] Tables scroll horizontally on mobile if needed
- [ ] Card layouts work as alternative to tables
- [ ] Data is readable on small screens
- [ ] No horizontal page scrolling

#### Performance
- [ ] Pages load quickly on mobile
- [ ] No lag when opening sidebar
- [ ] Smooth transitions and animations
- [ ] Blur effects don't cause performance issues

### Device Testing Matrix

| Device Type | Screen Size | Test Focus |
|-------------|-------------|------------|
| **iPhone SE** | 375x667 | Minimum width, touch targets |
| **iPhone 12/13** | 390x844 | Standard mobile |
| **iPhone 14 Pro Max** | 430x932 | Large mobile |
| **iPad Mini** | 768x1024 | Tablet breakpoint |
| **iPad Pro** | 1024x1366 | Large tablet |
| **Laptop** | 1366x768 | Small desktop |
| **Desktop** | 1920x1080 | Standard desktop |
| **Large Display** | 2560x1440 | Large desktop |

### Browser Testing

- [ ] Chrome (mobile & desktop)
- [ ] Safari (iOS & macOS)
- [ ] Firefox (mobile & desktop)
- [ ] Edge (desktop)
- [ ] Samsung Internet (Android)

### Orientation Testing

- [ ] Portrait mode works on mobile/tablet
- [ ] Landscape mode works on mobile/tablet
- [ ] Rotation transitions are smooth
- [ ] No layout breaks on orientation change

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: Visibility toggle still showing on mobile
**Cause:** Missing `hidden md:flex` classes  
**Solution:**
```tsx
<Button className="hidden md:flex min-h-[44px] min-w-[44px]">
  <Eye />
</Button>
```

#### Issue: Sidebar not auto-closing on mobile navigation
**Cause:** Missing window width check  
**Solution:**
```tsx
const handleNavigation = (page: string) => {
  setCurrentPage(page);
  if (window.innerWidth < 768) {
    onClose();
  }
};
```

#### Issue: Desktop-only warning not showing
**Cause:** Missing `md:hidden` class  
**Solution:**
```tsx
<div className="md:hidden">
  <DesktopOnlyWarning />
</div>
<div className="hidden md:block">
  {/* Desktop content */}
</div>
```

#### Issue: Touch targets too small on mobile
**Cause:** No minimum size enforcement  
**Solution:**
```tsx
<Button className="min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto">
```

#### Issue: Table overflowing on mobile
**Cause:** No horizontal scroll container  
**Solution:**
```tsx
<div className="overflow-x-auto">
  <Table className="min-w-[600px]">
```

#### Issue: Form fields too narrow on mobile
**Cause:** Fixed width or missing full-width class  
**Solution:**
```tsx
<Input className="w-full" />
```

#### Issue: Blur effects causing lag on mobile
**Cause:** Too much blur on mobile devices  
**Solution:**
```tsx
<Card className="backdrop-blur-[12px] md:backdrop-blur-[20px]">
```

#### Issue: Text getting cut off
**Cause:** Missing text wrapping  
**Solution:**
```tsx
<h1 className="break-words">
```

#### Issue: Sidebar overlay not blocking clicks
**Cause:** Missing z-index or pointer events  
**Solution:**
```tsx
<div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
```

#### Issue: Responsive grid not working
**Cause:** Incorrect Tailwind syntax  
**Solution:**
```tsx
// Correct
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

// Incorrect
<div className="grid cols-1 sm:cols-2 lg:cols-4">
```

---

## Best Practices

### Do's ✅

1. **Use Mobile-First Approach**
   - Start with mobile styles, add desktop enhancements
   - Default (no prefix) = mobile, `md:` = desktop

2. **Enforce Touch Targets**
   - Minimum 44x44px on mobile for all interactive elements
   - Use `min-h-[44px] min-w-[44px]`

3. **Hide Complex Features on Mobile**
   - Show desktop-only warnings for accounting tools
   - Don't try to cram complex UIs into mobile

4. **Auto-Close Mobile Menus**
   - Sidebar should close after navigation on mobile
   - Improves UX and shows content immediately

5. **Test on Real Devices**
   - Emulators don't show performance issues
   - Touch interactions feel different on real devices

6. **Use Responsive Utilities**
   - `hidden md:block` for desktop-only
   - `md:hidden` for mobile-only
   - `flex-col sm:flex-row` for stacking

7. **Optimize Performance**
   - Reduce blur on mobile
   - Use smaller images on mobile
   - Lazy load heavy components

8. **Maintain Consistent Spacing**
   - `p-4 md:p-6 lg:p-8` for progressive spacing
   - `gap-4 md:gap-6` for consistent gaps

### Don'ts ❌

1. **Don't Make Everything Responsive**
   - Complex accounting tools should be desktop-only
   - Some features require large screens

2. **Don't Use Fixed Pixel Widths**
   - Use `w-full` or percentage-based widths
   - Let content flow naturally

3. **Don't Forget Touch Targets**
   - Small buttons are frustrating on mobile
   - Always test with your finger, not a mouse

4. **Don't Hide Important Features**
   - Visibility toggle can be hidden on mobile
   - But core features should be accessible

5. **Don't Use Heavy Blur on Mobile**
   - Causes performance issues
   - Use `backdrop-blur-[12px]` on mobile

6. **Don't Ignore Horizontal Scroll**
   - Page should never scroll horizontally
   - Tables can scroll, but not the page

7. **Don't Forget to Test**
   - Test on real devices, not just browser resize
   - Test both portrait and landscape

8. **Don't Break Desktop**
   - Mobile-first doesn't mean desktop-last
   - Ensure desktop experience remains excellent

---

## Implementation Checklist

### High Priority 🔴

- [ ] Hide visibility toggle (eyeball) on mobile in Header
- [ ] Add auto-close sidebar on navigation (mobile only)
- [ ] Add desktop-only warnings to accounting tools:
  - [ ] Reconciliation Manager
  - [ ] Expenses Manager
  - [ ] General Ledger
  - [ ] Journal Entry Manager
  - [ ] Chart of Accounts Manager
  - [ ] Sponsor Fee Allocation
- [ ] Enforce 44x44px touch targets on all buttons
- [ ] Test sidebar behavior on mobile devices

### Medium Priority 🟡

- [ ] Add responsive blur effects (12px mobile, 20px desktop)
- [ ] Add responsive border radius
- [ ] Implement responsive typography scale
- [ ] Optimize table layouts for mobile
- [ ] Add horizontal scroll to wide tables
- [ ] Test all forms on mobile devices

### Low Priority 🟢

- [ ] Add lazy loading for heavy components
- [ ] Optimize images for different screen sizes
- [ ] Add skeleton loaders for better perceived performance
- [ ] Implement swipe gestures for mobile navigation
- [ ] Add pull-to-refresh on mobile

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Maintained By:** IFM MVP Development Team

### Changelog

**v1.0.0 (January 2025)**
- Initial responsive design documentation
- Defined mobile-responsive vs desktop-only components
- Documented Tailwind CSS responsive patterns
- Added mobile-specific behaviors (auto-close sidebar, hide visibility toggle)
- Created desktop-only warning pattern for accounting tools
- Established touch target requirements (44x44px minimum)
- Added comprehensive testing checklist
| **Mobile** | xs (0-599px) | Stacked layout, overlay drawer, reduced blur (20px), touch targets (44px), hamburger menu |
| **Tablet** | sm (600-899px) | Two-column grids, drawer sidebar, moderate blur (30px), larger touch targets |
| **Small Desktop** | md (900-1199px) | Permanent sidebar, full blur effects (40px), multi-column layouts |
| **Desktop** | lg (1200-1535px) | Full features, expanded grids, optimal spacing |
| **Large Desktop** | xl (1536px+) | Maximum width containers, enhanced layouts |

### Common Responsive Values

#### Spacing
- Mobile: 2 (16px)
- Tablet: 3 (24px)
- Desktop: 4 (32px)

#### Border Radius
- Mobile: 12px
- Tablet: 16px
- Desktop: 20px

#### Blur Effects
- Mobile: 20px saturate(150%)
- Desktop: 40px saturate(180%)

#### Touch Targets
- Mobile: 44px minimum (WCAG 2.1 Level AA)
- Desktop: auto

#### Typography Scale
```typescript
h1: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
h2: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
h3: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
h4: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
body1: { xs: '0.875rem', md: '0.9375rem' }
body2: { xs: '0.8125rem', md: '0.875rem' }
```

---

## Component Implementation

### Top Bar Layout (DashboardLayout)

**Key Changes:**
- 3-column horizontal layout on all devices
- Hamburger menu (left) - mobile only
- Band selector (center) - with flex properties
- Theme toggle (right)
- Fixed 64px height
- No overlapping elements

```tsx
<AppBar
  position="fixed"
  sx={{
    zIndex: (theme) => theme.zIndex.drawer + 1,
    minHeight: { xs: 64, sm: 64 },
    backdropFilter: { xs: 'blur(20px)', md: 'blur(40px)' }
  }}
>
  <Toolbar sx={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: { xs: 64, sm: 64 }
  }}>
    {/* Left: Hamburger (mobile only) */}
    {isMobile && (
      <IconButton onClick={handleMenuClick} sx={{ minWidth: 44, minHeight: 44 }}>
        <MenuIcon />
      </IconButton>
    )}
    
    {/* Center: Band Selector */}
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <GlobalBandSelector />
    </Box>
    
    {/* Right: Theme Toggle */}
    <ThemeToggle />
  </Toolbar>
</AppBar>
```

### Sidebar (Smart Responsive Drawer)

**Key Features:**
- Defaults **open** on desktop, **closed** on mobile
- User can manually toggle on both mobile and desktop
- Automatically adjusts when switching between screen sizes
- Closes after navigation on mobile for better UX

**Implementation:**
```tsx
// Track screen size changes without interfering with manual toggles
const prevIsMobileRef = useRef<boolean | null>(null);

useEffect(() => {
  const prevIsMobile = prevIsMobileRef.current;
  
  // Only update on mount or screen size change (not on manual toggle)
  if (prevIsMobile === null || prevIsMobile !== isMobile) {
    if (isMobile) {
      dispatch(setSidebarOpen(false)); // Close on mobile
    } else {
      dispatch(setSidebarOpen(true));  // Open on desktop
    }
    prevIsMobileRef.current = isMobile;
  }
}, [isMobile, dispatch]);

// Drawer configuration
<Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open={isMobile ? open : true}
  onClose={handleToggle}
  ModalProps={{ keepMounted: true }}
  sx={{
    width: open ? 240 : 72,
    '& .MuiDrawer-paper': {
      width: isMobile ? 240 : (open ? 240 : 72),
      backdropFilter: { xs: 'blur(20px)', md: 'blur(40px)' }
    }
  }}
>
  {/* Sidebar content */}
</Drawer>
```

**State Management:**
- Uses Redux `navigationSlice` with `sidebarOpen` state
- Initial state: `true` (open for desktop by default)
- `useRef` prevents useEffect from running on every toggle
- Only responds to actual screen size changes (mobile ↔ desktop)

### MainContent (Fixed Padding)

```tsx
<Box
  component="main"
  sx={{
    flexGrow: 1,
    p: { xs: 2, sm: 3, md: 4 },
    pt: { xs: '80px', sm: '88px', md: '80px' },
    ml: { xs: 0, md: '240px' },
    minHeight: '100vh'
  }}
>
  {/* Content */}
</Box>
```

### BookNewTour (Responsive Wizard)

**Step 1-3 Cards:**
```tsx
<Card
  sx={{
    background: (theme) => theme.palette.mode === 'dark'
      ? 'rgba(20, 27, 43, 0.6)'
      : 'rgba(241, 245, 249, 0.6)',
    backdropFilter: { xs: 'blur(20px) saturate(150%)', md: 'blur(40px) saturate(180%)' },
    WebkitBackdropFilter: { xs: 'blur(20px) saturate(150%)', md: 'blur(40px) saturate(180%)' },
    borderRadius: { xs: '12px', sm: '16px', md: '20px' },
    boxShadow: (theme) => theme.palette.mode === 'dark'
      ? { xs: '0 4px 16px rgba(0, 0, 0, 0.3)', md: '0 8px 32px rgba(0, 0, 0, 0.4)' }
      : { xs: '0 4px 16px rgba(0, 0, 0, 0.06)', md: '0 8px 32px rgba(0, 0, 0, 0.08)' }
  }}
>
  <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
    <Typography 
      variant="h4"
      sx={{
        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        lineHeight: 1.3
      }}
    >
      Title
    </Typography>
  </CardContent>
</Card>
```

**Date Pickers (Stacked on Mobile):**
```tsx
<Box sx={{ 
  display: 'flex', 
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2, 
  mb: 3 
}}>
  <DatePicker
    label="Start Date"
    slotProps={{
      textField: {
        fullWidth: true,
        sx: {
          '& .MuiInputBase-root': {
            minHeight: { xs: 48, md: 'auto' }
          },
          '& input': {
            fontSize: { xs: '0.9375rem', md: '1rem' }
          }
        }
      }
    }}
  />
  <DatePicker label="End Date" /* same props */ />
</Box>
```

---

## Performance Optimizations

### Mobile-Specific Optimizations

#### 1. Reduced Blur Effects
```tsx
backdropFilter: { 
  xs: 'blur(20px) saturate(150%)',  // Mobile
  md: 'blur(40px) saturate(180%)'   // Desktop
}
```

**Why:** Blur effects are GPU-intensive. Reducing on mobile improves performance.

#### 2. Smaller Border Radius
```tsx
borderRadius: { xs: '12px', sm: '16px', md: '20px' }
```

**Why:** Smaller radius renders faster on mobile devices.

#### 3. Optimized Shadows
```tsx
boxShadow: {
  xs: '0 4px 16px rgba(0, 0, 0, 0.3)',  // Mobile
  md: '0 8px 32px rgba(0, 0, 0, 0.4)'   // Desktop
}
```

**Why:** Smaller blur radius reduces rendering overhead.

#### 4. Drawer Performance
```tsx
<Drawer
  ModalProps={{ keepMounted: true }}
  variant="temporary"
>
```

**Why:** `keepMounted` keeps drawer in DOM for faster open/close.

### Theme Component Overrides

```typescript
// src/theme/theme.ts
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        minHeight: '44px',
        '@media (min-width: 900px)': {
          minHeight: 'auto',
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        minWidth: '44px',
        minHeight: '44px',
        '@media (min-width: 900px)': {
          minWidth: 'auto',
          minHeight: 'auto',
        },
      },
    },
  },
}
```

---

## Testing Guide

### Manual Testing Checklist

#### Layout & Navigation
- [ ] Hamburger menu opens/closes sidebar on mobile
- [ ] Sidebar auto-closes after navigation on mobile
- [ ] Top bar maintains 3-column layout without overlapping
- [ ] Hamburger menu, band selector, and theme toggle are properly spaced
- [ ] No elements overlap on any screen size
- [ ] Content doesn't overlap with top bar (80px padding)

#### Typography & Content
- [ ] All titles display fully without cutoff
- [ ] Text wraps properly on all screen sizes
- [ ] Typography scales appropriately across breakpoints
- [ ] No horizontal scrolling on any page
- [ ] Content fits within viewport on all devices
- [ ] Font sizes are readable on mobile (minimum 14px)

#### Forms & Inputs
- [ ] Touch targets are minimum 44x44px on mobile
- [ ] Date pickers stack vertically on mobile
- [ ] All form inputs are easily tappable
- [ ] Input fields have proper height (48px minimum on mobile)
- [ ] Autocomplete dropdowns work on mobile
- [ ] Buttons are full-width on mobile where appropriate

#### Visual & Performance
- [ ] Cards maintain glassmorphic effect with reduced blur on mobile
- [ ] Spacing adjusts appropriately (2-3 spacing units)
- [ ] Calendar views work on mobile
- [ ] Dialogs fit within viewport
- [ ] Smooth animations and transitions
- [ ] No performance lag on mobile devices
- [ ] Blur effects don't cause jank

### Device Testing Matrix

| Device Type | Screen Size | Test Focus |
|-------------|-------------|------------|
| iPhone SE | 375x667 | Minimum width, touch targets |
| iPhone 12/13 | 390x844 | Standard mobile |
| iPhone 14 Pro Max | 430x932 | Large mobile |
| iPad Mini | 768x1024 | Small tablet |
| iPad Pro | 1024x1366 | Large tablet |
| Desktop | 1920x1080 | Standard desktop |
| Large Display | 2560x1440 | Large desktop |

### Browser Testing

- [ ] Chrome (mobile & desktop)
- [ ] Safari (iOS & macOS)
- [ ] Firefox (mobile & desktop)
- [ ] Edge (desktop)
- [ ] Samsung Internet (Android)

### Orientation Testing

- [ ] Portrait mode (mobile/tablet)
- [ ] Landscape mode (mobile/tablet)
- [ ] Rotation transitions smooth

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: Hamburger menu not visible on mobile
**Cause:** Breakpoint incorrectly set  
**Solution:** Verify `useMediaQuery(theme.breakpoints.down('md'))` is used

#### Issue: Top bar elements overlapping
**Cause:** Incorrect flex layout  
**Solution:** Ensure `justifyContent: 'space-between'` and proper spacing

```tsx
<Toolbar sx={{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
```

#### Issue: Text getting cut off
**Cause:** Missing text wrapping properties or excessive padding  
**Solution:** Add text wrapping and remove unnecessary padding

```tsx
<Typography sx={{
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  px: { xs: 0, sm: 0 }  // Remove horizontal padding
}}>
```

#### Issue: Date pickers not stacking on mobile
**Cause:** Missing flexDirection responsive value  
**Solution:** Add flexDirection with breakpoints

```tsx
<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2
}}>
```

#### Issue: Content overlapping with top bar
**Cause:** Incorrect top padding  
**Solution:** Set proper padding to match top bar height

```tsx
<Box sx={{
  pt: { xs: '80px', sm: '88px', md: '80px' }
}}>
```

#### Issue: Touch targets too small
**Cause:** No minimum height set for mobile  
**Solution:** Add responsive minHeight

```tsx
<Button sx={{
  minHeight: { xs: 48, md: 'auto' }
}}>
```

#### Issue: Sidebar not closing on mobile
**Cause:** Missing onClose handler or wrong variant  
**Solution:** Use temporary variant with proper handler

```tsx
<Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open={isMobile ? open : true}
  onClose={handleClose}
>
```

#### Issue: Performance lag on mobile
**Cause:** Too much blur effect  
**Solution:** Reduce blur on mobile devices

```tsx
backdropFilter: { 
  xs: 'blur(20px)',  // Reduced for mobile
  md: 'blur(40px)'   // Full effect on desktop
}
```

---

## Best Practices

### Do's ✅

1. **Mobile-First Approach**
   - Start with `xs` values, add larger breakpoints as needed
   - Test on mobile devices first

2. **Use Responsive Objects**
   ```tsx
   sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
   ```

3. **Touch-Friendly Targets**
   - Minimum 44x44px on mobile (WCAG 2.1 Level AA)
   - Increase spacing between interactive elements

4. **Optimize Performance**
   - Reduce blur effects on mobile (20px vs 40px)
   - Use smaller shadows on mobile
   - Implement `keepMounted` for drawers

5. **Text Wrapping**
   - Always add `wordWrap: 'break-word'`
   - Always add `overflowWrap: 'break-word'`
   - Set appropriate `lineHeight`

6. **Stack Forms on Mobile**
   ```tsx
   flexDirection: { xs: 'column', sm: 'row' }
   ```

7. **Test on Real Devices**
   - Emulators don't show performance issues
   - Test various screen sizes and orientations

8. **Maintain Fixed Top Bar Height**
   - Consistent 64px across all devices
   - Adjust content padding accordingly

9. **Use Hamburger Menu**
   - Visible only on mobile (below md breakpoint)
   - Touch-friendly 44x44px minimum

10. **Progressive Enhancement**
    - Core functionality on all devices
    - Enhanced features on larger screens

### Don'ts ❌

1. **Don't use fixed pixel values everywhere**
   - Use responsive objects with breakpoints

2. **Don't use same blur effects on all devices**
   - Reduce on mobile for performance

3. **Don't ignore touch target sizes**
   - Ensure 44x44px minimum on mobile

4. **Don't forget text wrapping**
   - Text cutoff is a common mobile issue

5. **Don't stack top bar elements**
   - Use 3-column horizontal layout

6. **Don't use excessive padding**
   - Can cause horizontal scrolling on mobile

7. **Don't forget hamburger menu**
   - Essential for mobile navigation

8. **Don't ignore orientation changes**
   - Test both portrait and landscape

9. **Don't skip real device testing**
   - Emulators miss performance issues

10. **Don't use same layout for all sizes**
    - Adapt layouts for different screen sizes

---

## Quick Tips

1. **Breakpoint Hook**: Use `useMediaQuery` for conditional rendering
2. **Responsive Values**: Use objects `{ xs: value1, md: value2 }`
3. **Touch Targets**: Minimum 44x44px on mobile
4. **Blur Optimization**: 20px mobile, 40px desktop
5. **Text Wrapping**: Always include `wordWrap` and `overflowWrap`
6. **Stacking**: Use `flexDirection: { xs: 'column', sm: 'row' }`
7. **Spacing**: 2 (mobile), 3 (tablet), 4 (desktop)
8. **Border Radius**: 12px (mobile), 16px (tablet), 20px (desktop)
9. **Typography**: Scale down on mobile for readability
10. **Testing**: Always test on real devices

---

## Accessibility

### WCAG 2.1 Level AA Compliance

- ✅ Touch targets minimum 44x44px
- ✅ Sufficient color contrast maintained
- ✅ Keyboard navigation preserved
- ✅ Screen reader friendly
- ✅ Responsive typography scales appropriately
- ✅ Focus indicators visible
- ✅ Semantic HTML structure

---

## Browser Support

- **Modern Browsers**: Full glassmorphic effects
- **Safari**: Includes `-webkit-` prefixes for backdrop-filter
- **Performance**: Optimized blur effects on mobile devices
- **Fallback**: Solid backgrounds for unsupported browsers

### Viewport Configuration

Ensure `index.html` has proper viewport settings:

```html
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
/>
```

---

## Future Enhancements

- [ ] Add swipe gestures for drawer on mobile
- [ ] Implement pull-to-refresh on mobile
- [ ] Add haptic feedback for mobile interactions
- [ ] Optimize images with responsive loading
- [ ] Add progressive web app (PWA) support
- [ ] Implement virtual scrolling for long lists
- [ ] Add skeleton screens for loading states

---

---

## Critical Components

### Sidebar Behavior 🔒

The sidebar component has **CRITICAL** behavior rules that must be maintained:

**See**: [SIDEBAR_BEHAVIOR.md](./SIDEBAR_BEHAVIOR.md) for complete documentation

**Quick Summary**:
- **Desktop (≥900px)**: Sidebar defaults **OPEN**, user can collapse/expand
- **Mobile (<900px)**: Sidebar defaults **CLOSED**, opens via hamburger menu
- **Hamburger Menu**: Only visible on mobile, located in top-left of top bar
- **Auto-Close**: Sidebar closes after navigation on mobile

**DO NOT MODIFY** sidebar behavior without:
1. Reading the complete SIDEBAR_BEHAVIOR.md documentation
2. Testing on both mobile and desktop
3. Updating the documentation

---

**Last Updated:** January 2025  
**Version:** 2.1.0  
**Maintained By:** Band Voyage Development Team

### Changelog

**v2.1.0 (January 2025)**
- Added Critical Components section
- Linked to SIDEBAR_BEHAVIOR.md documentation
- Emphasized importance of sidebar behavior preservation

**v2.0.0 (October 1, 2025)**
- Consolidated three separate responsive docs into one comprehensive guide
- Added complete quick reference patterns section
- Enhanced troubleshooting with solutions
- Added comprehensive testing checklist
- Included best practices and common mistakes
- Updated with latest BookNewTour responsive implementation
