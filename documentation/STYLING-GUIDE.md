# Styling Guide - IFM MVP Frontend

## Overview

This document outlines the comprehensive styling system for the IFM MVP Frontend application, including our **completely bifurcated** light/dark mode implementation, color system, component styling patterns, and best practices.

## Table of Contents

1. [Color System](#color-system)
2. [Light Mode Implementation](#light-mode-implementation)
3. [Dark Mode Implementation](#dark-mode-implementation)
4. [Sidebar Styling](#sidebar-styling)
5. [Component Styling Patterns](#component-styling-patterns)
6. [CSS Architecture](#css-architecture)
7. [Best Practices](#best-practices)

---

## Color System

### Design Philosophy

**CRITICAL: Light and Dark modes are COMPLETELY SEPARATE**

- **Light Mode**: Uses **ONLY neutral warm grays/beiges** - NO blue accents
- **Dark Mode**: Uses **blue/indigo accents** for highlights and interactive elements
- **No Shared Hover Colors**: Each mode has its own distinct hover states

### CSS Variables

All colors are defined as CSS variables in `src/styles/globals.css`. The system uses two completely different color palettes.

### Light Mode Colors

```css
:root {
  --font-size: 16px;
  --background: #f0ede9;              /* Warm light beige */
  --foreground: #2a2826;              /* Dark brown text */
  --card: #faf9f7;                    /* Off-white cards */
  --card-foreground: #2a2826;
  --primary: #030213;                 /* Near-black primary */
  --primary-foreground: #ffffff;
  --secondary: #e8e4df;               /* Light warm gray */
  --secondary-foreground: #2a2826;
  --muted: #ddd9d4;                   /* Muted beige */
  --muted-foreground: #6e6b68;        /* Medium gray text */
  --accent: #d4cfc9;                  /* Accent beige */
  --accent-foreground: #2a2826;
  --destructive: #d4183d;             /* Red for errors */
  --destructive-foreground: #ffffff;
  --border: rgba(195, 190, 185, 0.4); /* Subtle borders */
  --input-background: #e8e4df;
  --sidebar: #e8e4df;                 /* Sidebar background */
  --sidebar-accent: #ddd9d4;
}
```

**Key Characteristics:**
- Warm, neutral palette (beige/tan/brown tones)
- NO blue colors in light mode
- Subtle, low-contrast borders
- Soft shadows

### Dark Mode Colors

```css
.dark {
  /* Modern Navy Blue Dark Mode */
  --background: #0a0e27;              /* Deep navy background */
  --foreground: #e8edf4;              /* Light blue-white text */
  --card: #1a1f3a;                    /* Elevated navy cards */
  --card-foreground: #e8edf4;
  --primary: #6366f1;                 /* Vibrant indigo */
  --primary-foreground: #ffffff;
  --secondary: #252b47;               /* Muted navy */
  --muted: #1e2337;                   /* Subtle navy backgrounds */
  --muted-foreground: #94a3b8;        /* Blue-gray text */
  --accent: #2d3454;                  /* Navy accent */
  --accent-foreground: #e8edf4;
  --destructive: #f43f5e;             /* Rose red */
  --border: #2d3454;                  /* Navy borders */
  --input-background: #151a2e;
  --sidebar: #0d1128;                 /* Darker sidebar */
  --sidebar-accent: #1e2337;
}
```

**Key Characteristics:**
- Cool, blue-tinted palette
- Glowing indigo accents (#6366f1)
- High contrast for readability
- Blue glow effects on hover

### Chart Colors

Vibrant, accessible colors for data visualization:

```css
--chart-1: #6366f1;  /* Indigo */
--chart-2: #22d3ee;  /* Cyan */
--chart-3: #fbbf24;  /* Amber */
--chart-4: #a78bfa;  /* Purple */
--chart-5: #fb7185;  /* Rose */
```

---

## Light Mode Implementation

### Core Principles

1. **Neutral Palette Only**: NO blue colors - only warm grays, beiges, and tans
2. **Glassmorphism**: Semi-transparent cards with backdrop blur
3. **Soft Shadows**: Subtle, low-opacity shadows for depth
4. **Warm Tones**: Beige/tan color scheme for comfortable viewing
5. **High Readability**: Dark text on light backgrounds with excellent contrast

### Background System

```css
html:not(.dark) body {
  background-color: #f0ede9 !important;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.02) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.015) 0px, transparent 50%);
  background-attachment: fixed;
}
```

**Features:**
- Warm beige base (#f0ede9)
- Extremely subtle radial gradients (almost invisible)
- Fixed attachment for depth

### Card Styling

```css
html:not(.dark) .bg-card {
  background: linear-gradient(135deg, rgba(250, 249, 247, 0.98) 0%, rgba(245, 243, 240, 0.95) 100%) !important;
  border: 1px solid rgba(195, 190, 185, 0.45) !important;
  box-shadow: 
    0 4px 6px -1px rgba(42, 40, 38, 0.08),
    0 2px 4px -1px rgba(42, 40, 38, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(20px) saturate(180%);
}
```

**Features:**
- Diagonal gradient (off-white to light beige)
- Neutral tan borders
- Soft, subtle shadows
- Backdrop blur for glassmorphism
- Inner white highlight

**Hover State (Cards ONLY, not header):**
```css
html:not(.dark) .bg-card:hover:not(header) {
  border-color: rgba(110, 107, 104, 0.45) !important;
  box-shadow: 
    0 8px 16px -4px rgba(42, 40, 38, 0.12),
    0 4px 8px -2px rgba(42, 40, 38, 0.08),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
    0 0 24px rgba(74, 71, 68, 0.06) !important;
}
```

### Header Styling

```css
html:not(.dark) header {
  background: linear-gradient(135deg, rgba(250, 249, 247, 0.98) 0%, rgba(245, 243, 240, 0.95) 100%) !important;
  border-bottom: 1px solid rgba(195, 190, 185, 0.45) !important;
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 4px 6px -1px rgba(42, 40, 38, 0.08),
    0 2px 4px -1px rgba(42, 40, 38, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.5) !important;
}
```

**Features:**
- Same gradient as cards for visual consistency
- NO hover effect (header is not interactive)
- Matches card styling exactly

### Input Fields

```css
html:not(.dark) input:not([type="checkbox"]):not([type="radio"]),
html:not(.dark) textarea,
html:not(.dark) select {
  background: rgba(232, 228, 223, 0.85) !important;
  border: 1px solid rgba(195, 190, 185, 0.5) !important;
  backdrop-filter: blur(10px);
}
```

**Focus State:**
```css
html:not(.dark) input:focus {
  background: rgba(250, 249, 247, 0.98) !important;
  border-color: rgba(99, 102, 241, 0.5) !important;
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.12),
    0 1px 3px 0 rgba(42, 40, 38, 0.12) !important;
}
```

**Note:** Focus states CAN use blue for accessibility

### Icon Color Overrides

**CRITICAL:** Light mode must override ALL blue icon colors:

```css
html:not(.dark) .text-blue-600,
html:not(.dark) .text-blue-500,
html:not(.dark) .text-blue-400 {
  color: #6e6b68 !important; /* Neutral gray */
}

html:not(.dark) .bg-blue-50,
html:not(.dark) .bg-blue-100 {
  background-color: rgba(110, 107, 104, 0.08) !important;
}
```

---

## Dark Mode Implementation

### Core Principles

1. **Navy Blue Base**: Uses deep navy (#0f1629) instead of pure black for reduced eye strain
2. **Gradient Enhancements**: Cards and buttons use subtle gradients for depth
3. **Glowing Accents**: Indigo borders and shadows create a modern, premium feel
4. **Glassmorphism**: Backdrop blur effects on cards and inputs
5. **Proper Contrast**: All text meets WCAG AAA standards for readability

### Background System

```css
.dark body {
  background-color: #0f1629 !important;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.12) 0px, transparent 50%);
  background-attachment: fixed;
}
```

**Features:**
- Deep navy base color
- Subtle radial gradients in corners with indigo/blue tints
- Fixed attachment for parallax effect
- Creates depth and visual interest

### Card Styling

```css
.dark .bg-card {
  background: linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(21, 26, 46, 0.95) 100%) !important;
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.4),
    0 2px 4px -1px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(12px);
}
```

**Features:**
- Diagonal gradient from lighter to darker navy
- Glowing indigo border
- Multi-layer shadows for depth
- Backdrop blur for glassmorphism
- Inner highlight for 3D effect

**Hover State:**
```css
.dark .bg-card:hover {
  border-color: rgba(99, 102, 241, 0.35) !important;
  box-shadow: 
    0 8px 16px -4px rgba(0, 0, 0, 0.5),
    0 4px 8px -2px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    0 0 20px rgba(99, 102, 241, 0.15) !important;
}
```

### Primary Buttons

```css
.dark .bg-primary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%) !important;
  box-shadow: 
    0 4px 14px 0 rgba(99, 102, 241, 0.5),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2) !important;
}
```

**Features:**
- Triple-color gradient (indigo → purple → deep purple)
- Glowing shadow effect
- Inner white gradient for shine
- Enhanced glow on hover

### Sidebar Styling

```css
.dark [data-sidebar="sidebar"] {
  background: linear-gradient(180deg, #0d1128 0%, #0a0e27 100%) !important;
  border-right: 1px solid rgba(99, 102, 241, 0.2) !important;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
}
```

**Features:**
- Vertical gradient (darker at top)
- Glowing indigo border
- Deep shadow for separation
- Darker than main background for hierarchy

### Sidebar Navigation - Selected State

**Dark Mode:**
```css
.dark [data-sidebar="sidebar"] button[class*="bg-[#f5f3f0]"] {
  background: rgba(99, 102, 241, 0.25) !important;
  border-left: 3px solid #6366f1 !important;
  box-shadow: inset 0 0 12px rgba(99, 102, 241, 0.15) !important;
}
```

**Features:**
- Blue background (25% opacity)
- 3px indigo left border
- Inner blue glow
- White/blue text

**Light Mode:**
```css
html:not(.dark) [data-sidebar="sidebar"] button[class*="bg-[#f5f3f0]"] {
  background-color: #f5f3f0 !important; /* Light cream */
}
```

**Features:**
- Solid light cream background (#f5f3f0)
- Darker than sidebar background for visibility
- NO blue colors
- Neutral gray left border

### Sidebar Navigation - Hover State

**Dark Mode:**
```css
.dark [data-sidebar="sidebar"] button:hover {
  background: rgba(99, 102, 241, 0.1) !important;
}
```

**Light Mode:**
```css
/* Component handles hover with inline class: hover:bg-[#ddd9d4] */
/* CSS only applies if NO inline class present */
html:not(.dark) [data-sidebar="sidebar"] button:not([class*="bg-["]):hover {
  background: rgba(74, 71, 68, 0.08) !important;
}
```

**Key Difference:**
- Dark mode: Blue tint hover
- Light mode: Neutral gray hover (#ddd9d4)

### Header Styling

```css
.dark header {
  background: rgba(26, 31, 58, 0.8) !important;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
```

**Features:**
- Semi-transparent background
- Backdrop blur for glassmorphism
- Glowing bottom border
- Subtle shadow

### Input Fields

```css
.dark input:not([type="checkbox"]):not([type="radio"]),
.dark textarea,
.dark select {
  background: rgba(21, 26, 46, 0.6) !important;
  border: 1px solid rgba(99, 102, 241, 0.25) !important;
  backdrop-filter: blur(8px);
}
```

**Focus State:**
```css
.dark input:focus {
  background: rgba(21, 26, 46, 0.8) !important;
  border-color: rgba(99, 102, 241, 0.5) !important;
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.15),
    0 1px 3px 0 rgba(0, 0, 0, 0.4) !important;
}
```

---

## Component Styling Patterns

### Using CSS Variables

Always use CSS variables for colors to ensure theme compatibility:

```tsx
// ✅ Good - Uses CSS variables
<div className="bg-card text-card-foreground border-border">

// ❌ Bad - Hard-coded colors
<div className="bg-[#1a1f3a] text-[#e8edf4] border-[#2d3454]">
```

### Tailwind Utility Classes

Use Tailwind's utility classes that reference our CSS variables:

```tsx
// Background colors
className="bg-background"      // Main background
className="bg-card"            // Card surfaces
className="bg-primary"         // Primary buttons
className="bg-secondary"       // Secondary elements
className="bg-muted"           // Muted backgrounds
className="bg-accent"          // Accent/highlight

// Text colors
className="text-foreground"    // Main text
className="text-muted-foreground" // Muted text
className="text-primary"       // Primary colored text

// Borders
className="border-border"      // Standard borders
className="border-input"       // Input borders
```

### Component Structure

```tsx
// Standard card component
<div className="bg-card text-card-foreground border border-border rounded-lg p-4">
  <h3 className="text-lg font-medium">Card Title</h3>
  <p className="text-muted-foreground">Card description</p>
</div>

// Primary button
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
  Click Me
</button>

// Input field
<input 
  className="bg-input-background border-input text-foreground rounded-lg px-3 py-2"
  placeholder="Enter text..."
/>
```

---

## CSS Architecture

### File Structure

```
src/
├── index.css              # Main CSS file (Tailwind + custom styles)
└── styles/
    └── globals.css        # Global styles (imported by index.css)
```

### Layer Organization

```css
/* 1. Imports */
@import "./styles/globals.css";

/* 2. Tailwind Base */
/*! tailwindcss v4.1.3 */
@layer properties { ... }
@layer theme { ... }
@layer base { ... }
@layer utilities { ... }

/* 3. CSS Variables */
:root { ... }
.dark { ... }

/* 4. Custom Dark Mode Styles */
.dark body { ... }
.dark .bg-card { ... }
/* etc. */

/* 5. Utility Styles */
* { scrollbar-width: none; }
```

### Important Flags

Use `!important` sparingly, only for dark mode overrides:

```css
/* ✅ Good - Overriding default styles in dark mode */
.dark .bg-card {
  background: linear-gradient(...) !important;
}

/* ❌ Bad - Unnecessary important */
.my-component {
  padding: 1rem !important;
}
```

---

## Best Practices

### 1. Always Use CSS Variables

```tsx
// ✅ Good
<div className="bg-card border-border">

// ❌ Bad
<div className="bg-[#1a1f3a] border-[#2d3454]">
```

### 2. Maintain Contrast Ratios

Ensure text has sufficient contrast:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Our foreground on background: ~12:1 (exceeds AAA)

### 3. Use Semantic Color Names

```tsx
// ✅ Good - Semantic
<button className="bg-destructive text-destructive-foreground">Delete</button>

// ❌ Bad - Color-specific
<button className="bg-red-500 text-white">Delete</button>
```

### 4. Consistent Spacing

Use Tailwind's spacing scale:
- `p-2` (0.5rem / 8px)
- `p-4` (1rem / 16px)
- `p-6` (1.5rem / 24px)
- `p-8` (2rem / 32px)

### 5. Border Radius

Use consistent border radius:
- `rounded-sm` - Small elements
- `rounded-lg` - Cards, buttons
- `rounded-xl` - Large containers
- `rounded-full` - Circular elements

### 6. Shadows

Use our predefined shadow system:
- Cards: Multi-layer shadows with inset highlights
- Buttons: Glowing shadows
- Dropdowns: Deep shadows for elevation

---

## Common Patterns

### Metric Cards

```tsx
<div className="bg-card border border-border rounded-lg p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Total Donations</p>
      <p className="text-2xl font-semibold">$52,835.18</p>
    </div>
    <div className="p-3 bg-primary/10 rounded-lg">
      <DollarSign className="h-6 w-6 text-primary" />
    </div>
  </div>
</div>
```

### Navigation Items

```tsx
<a 
  href="/dashboard"
  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent"
>
  <Dashboard className="h-5 w-5" />
  <span>Dashboard</span>
</a>
```

### Form Inputs

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <input
    type="email"
    className="w-full bg-input-background border-input text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring"
    placeholder="Enter your email"
  />
</div>
```

### Buttons

```tsx
// Primary
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
  Save Changes
</button>

// Secondary
<button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:opacity-90">
  Cancel
</button>

// Destructive
<button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90">
  Delete
</button>
```

### Modals/Dialogs

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
    <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
    <p className="text-muted-foreground mb-6">Modal content goes here.</p>
    <div className="flex gap-3 justify-end">
      <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">
        Cancel
      </button>
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## Implementation Details

### Glassmorphism Effects

Glassmorphism is achieved through a combination of:

1. **Semi-transparent backgrounds**: `rgba()` values with alpha < 1
2. **Backdrop blur**: `backdrop-filter: blur(8px-12px)`
3. **Subtle borders**: Light borders with low opacity
4. **Layered shadows**: Multiple box-shadows for depth
5. **Gradient overlays**: Linear gradients for shine effects

**Example Implementation:**
```css
.dark .bg-card {
  /* Semi-transparent gradient background */
  background: linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(21, 26, 46, 0.95) 100%) !important;
  
  /* Glowing border */
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  
  /* Multi-layer shadows */
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.4),        /* Main shadow */
    0 2px 4px -1px rgba(0, 0, 0, 0.3),        /* Secondary shadow */
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05) /* Inner highlight */
    !important;
  
  /* Glassmorphism blur */
  backdrop-filter: blur(12px);
}
```

### Gradient Implementation

**Linear Gradients:**
```css
/* Diagonal gradient (135deg is standard) */
background: linear-gradient(135deg, color1 0%, color2 100%);

/* Horizontal gradient */
background: linear-gradient(90deg, color1 0%, color2 100%);

/* Vertical gradient */
background: linear-gradient(180deg, color1 0%, color2 100%);
```

**Multi-stop Gradients:**
```css
/* Three-color gradient for buttons */
background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%);
```

**Gradient with Transparency:**
```css
/* Fade from color to transparent */
background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%);
```

### Shadow System

**Shadow Layers:**
```css
/* Standard card shadow */
box-shadow: 
  0 4px 6px -1px rgba(0, 0, 0, 0.4),    /* Y-offset 4px, blur 6px */
  0 2px 4px -1px rgba(0, 0, 0, 0.3);    /* Y-offset 2px, blur 4px */

/* Elevated card shadow (hover) */
box-shadow: 
  0 8px 16px -4px rgba(0, 0, 0, 0.5),   /* Larger offset and blur */
  0 4px 8px -2px rgba(0, 0, 0, 0.4);

/* Glow effect */
box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);

/* Combined shadow + glow */
box-shadow: 
  0 8px 16px -4px rgba(0, 0, 0, 0.5),
  0 4px 8px -2px rgba(0, 0, 0, 0.4),
  0 0 20px rgba(99, 102, 241, 0.15);
```

**Inset Shadows (Inner Highlights):**
```css
/* Top inner highlight for 3D effect */
box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);

/* Combined outer + inner shadows */
box-shadow: 
  0 4px 6px -1px rgba(0, 0, 0, 0.4),
  inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
```

### Border Techniques

**Glowing Borders:**
```css
/* Standard glowing border */
border: 1px solid rgba(99, 102, 241, 0.2);

/* Brighter on hover */
border: 1px solid rgba(99, 102, 241, 0.35);

/* Accent border (left side) */
border-left: 3px solid #6366f1;
```

**Gradient Borders (Advanced):**
```css
/* Using pseudo-element for gradient border */
.element {
  position: relative;
  background: var(--card);
}

.element::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

### Backdrop Blur

**Usage:**
```css
/* Light blur for subtle effect */
backdrop-filter: blur(8px);

/* Medium blur for glassmorphism */
backdrop-filter: blur(12px);

/* Heavy blur for strong effect */
backdrop-filter: blur(16px);
```

**Browser Support:**
- Modern browsers: Full support
- Safari: Requires `-webkit-` prefix (handled by autoprefixer)
- Fallback: Semi-transparent background still visible

### Color Opacity Techniques

**RGBA:**
```css
/* Black with 50% opacity */
background: rgba(0, 0, 0, 0.5);

/* Indigo with 20% opacity */
background: rgba(99, 102, 241, 0.2);
```

**Hex with Alpha:**
```css
/* Black with 50% opacity */
background: #00000080;

/* Indigo with 20% opacity */
background: #6366f133;
```

**Tailwind Opacity Modifier:**
```tsx
className="bg-primary/20"  // 20% opacity
className="bg-black/50"    // 50% opacity
```

### Radial Gradients

**Background Overlays:**
```css
/* Corner gradients for depth */
background-image: 
  radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%),
  radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.12) 0px, transparent 50%);
```

**Parameters:**
- `at X% Y%`: Position of gradient center
- `color 0px`: Color at center
- `transparent 50%`: Fade to transparent at 50% radius

## Troubleshooting

### Dark Mode Not Applying

1. Check that `.dark` class is on `<html>` or `<body>`
2. Verify CSS variables are defined in `src/index.css`
3. Ensure `!important` flags are present for overrides
4. Clear browser cache and hard reload

### Colors Look Wrong

1. Use CSS variables instead of hard-coded colors
2. Check that you're using the correct variable names
3. Verify the component is using Tailwind classes correctly
4. Ensure opacity values are appropriate (0.05-0.95 range)

### Glassmorphism Not Working

1. Check `backdrop-filter` browser support
2. Ensure parent has a background (blur needs something to blur)
3. Verify semi-transparent background is set
4. Check z-index stacking context

### Gradients Not Showing

1. Use `!important` if overriding default styles
2. Check gradient syntax (commas, percentages)
3. Verify color values are valid
4. Ensure element has dimensions (width/height)

### Inconsistent Styling

1. Always use the design system variables
2. Follow the component patterns in this guide
3. Use semantic color names
4. Maintain consistent spacing and sizing
5. Test in both light and dark modes

---

## Adapting Dark Mode Techniques to Light Mode

### Key Differences

When implementing glassmorphism in light mode:

1. **Background Colors**: Use lighter, softer colors
2. **Opacity**: Higher opacity for backgrounds (0.85-0.98 vs 0.6-0.95)
3. **Shadows**: Lighter, softer shadows
4. **Borders**: Subtle, low-contrast borders
5. **Glow Effects**: Use softer, warmer glows

### Light Mode Glassmorphism Template

```css
/* Light mode card with glassmorphism */
.light .bg-card {
  /* Semi-transparent white gradient */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.85) 100%) !important;
  
  /* Subtle border */
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  
  /* Soft shadows */
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.5) !important;
  
  /* Backdrop blur */
  backdrop-filter: blur(12px);
}

/* Hover state */
.light .bg-card:hover {
  border-color: rgba(99, 102, 241, 0.3) !important;
  box-shadow: 
    0 8px 16px -4px rgba(0, 0, 0, 0.08),
    0 4px 8px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
    0 0 20px rgba(99, 102, 241, 0.1) !important;
}
```

### Light Mode Color Palette Suggestions

```css
:root {
  /* Backgrounds */
  --background: #f8fafc;              /* Soft blue-gray */
  --card: rgba(255, 255, 255, 0.9);   /* Semi-transparent white */
  
  /* Borders */
  --border: rgba(226, 232, 240, 0.8); /* Soft gray */
  
  /* Accents */
  --accent: rgba(241, 245, 249, 0.9); /* Very light blue-gray */
  
  /* Shadows */
  --shadow-color: rgba(0, 0, 0, 0.05); /* Very soft black */
}
```

### Light Mode Gradient Examples

```css
/* Background gradient overlay */
background-image: 
  radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
  radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);

/* Card gradient */
background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);

/* Button gradient */
background: linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%);
```

### Light Mode Shadow System

```css
/* Soft card shadow */
box-shadow: 
  0 4px 6px -1px rgba(0, 0, 0, 0.05),
  0 2px 4px -1px rgba(0, 0, 0, 0.03);

/* Elevated shadow (hover) */
box-shadow: 
  0 8px 16px -4px rgba(0, 0, 0, 0.08),
  0 4px 8px -2px rgba(0, 0, 0, 0.05);

/* Glow effect (light mode) */
box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
```

### Comparison: Dark vs Light Mode

| Aspect | Dark Mode | Light Mode |
|--------|-----------|------------|
| Background | #0f1629 (navy) | #f8fafc (soft gray) |
| Card BG | rgba(26, 31, 58, 0.95) | rgba(255, 255, 255, 0.9) |
| Border | rgba(99, 102, 241, 0.2) | rgba(226, 232, 240, 0.8) |
| Shadow | rgba(0, 0, 0, 0.4) | rgba(0, 0, 0, 0.05) |
| Glow | rgba(99, 102, 241, 0.15) | rgba(99, 102, 241, 0.1) |
| Blur | 12px | 12px (same) |
| Inner Highlight | rgba(255, 255, 255, 0.05) | rgba(255, 255, 255, 0.5) |

### Implementation Checklist for Light Mode

- [ ] Update background to soft, light color (#f8fafc or similar)
- [ ] Use semi-transparent white for cards (0.85-0.95 opacity)
- [ ] Reduce shadow opacity (0.03-0.08 vs 0.3-0.5)
- [ ] Use subtle borders (low contrast)
- [ ] Increase inner highlight opacity (0.5 vs 0.05)
- [ ] Soften glow effects (0.1 vs 0.15)
- [ ] Test contrast ratios (text must still be readable)
- [ ] Ensure backdrop blur works with light backgrounds
- [ ] Add radial gradient overlays for depth
- [ ] Test hover states with lighter colors

## Migration Checklist

When updating existing components to use the new styling system:

- [ ] Replace hard-coded colors with CSS variables
- [ ] Update dark mode classes to use semantic names
- [ ] Ensure proper contrast ratios
- [ ] Add hover states where appropriate
- [ ] Use consistent spacing (p-4, p-6, etc.)
- [ ] Apply proper border radius (rounded-lg)
- [ ] Test in both light and dark modes
- [ ] Verify accessibility (contrast, focus states)
- [ ] Implement glassmorphism effects
- [ ] Add gradient backgrounds where appropriate
- [ ] Include backdrop blur for depth
- [ ] Add multi-layer shadows
- [ ] Test on different screen sizes

## Complete Example: Converting a Component

### Before (Basic Styling)
```tsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Card description</p>
</div>
```

### After (Glassmorphism Styling)
```tsx
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-medium text-foreground">Card Title</h3>
  <p className="text-muted-foreground">Card description</p>
</div>
```

### CSS Implementation (in index.css)
```css
/* Dark Mode */
.dark .bg-card {
  background: linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(21, 26, 46, 0.95) 100%) !important;
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.4),
    0 2px 4px -1px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(12px);
}

.dark .bg-card:hover {
  border-color: rgba(99, 102, 241, 0.35) !important;
  box-shadow: 
    0 8px 16px -4px rgba(0, 0, 0, 0.5),
    0 4px 8px -2px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    0 0 20px rgba(99, 102, 241, 0.15) !important;
}

/* Light Mode */
.light .bg-card,
.bg-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.85) 100%) !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(12px);
}

.light .bg-card:hover,
.bg-card:hover {
  border-color: rgba(99, 102, 241, 0.3) !important;
  box-shadow: 
    0 8px 16px -4px rgba(0, 0, 0, 0.08),
    0 4px 8px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
    0 0 20px rgba(99, 102, 241, 0.1) !important;
}
```

---

## Resources

- **Tailwind CSS v4 Documentation**: https://tailwindcss.com
- **shadcn/ui Components**: https://ui.shadcn.com
- **WCAG Contrast Guidelines**: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Glassmorphism Generator**: https://hype4.academy/tools/glassmorphism-generator
- **CSS Gradient Generator**: https://cssgradient.io/

---

## Critical Design Principle: Complete Bifurcation

### The Golden Rule

**Light and Dark modes are COMPLETELY SEPARATE design systems.**

### What This Means

1. **NO Shared Hover Colors**
   - Light mode: `hover:bg-[#ddd9d4]` (neutral beige)
   - Dark mode: `hover:bg-[#6366f1]/10` (blue tint)

2. **NO Blue in Light Mode**
   - Icons: Neutral gray (#6e6b68)
   - Backgrounds: Beige/tan tones
   - Borders: Warm grays
   - Exception: Focus states (accessibility)

3. **Component-Level Control**
   - Use inline Tailwind classes for colors
   - CSS only overrides when necessary
   - Avoid `!important` battles with inline classes

4. **Sidebar Selected States**
   - Light: `bg-[#f5f3f0]` (light cream, solid)
   - Dark: `bg-[#6366f1]/25` (blue, 25% opacity)

5. **Header Behavior**
   - NO hover effects (not interactive)
   - Matches card styling exactly
   - Same gradient and shadow as cards

### Implementation Checklist

When adding new components:

- [ ] Define light mode colors (neutral palette)
- [ ] Define dark mode colors (blue accents)
- [ ] Use inline Tailwind classes for theme-specific colors
- [ ] Override blue classes in light mode if needed
- [ ] Test hover states in both modes
- [ ] Verify no color bleeding between modes
- [ ] Check header doesn't have hover effects
- [ ] Ensure sidebar selected/hover states are distinct

---

## Changelog

### Version 2.0 (Current - November 2025)
- **BREAKING**: Complete bifurcation of light/dark modes
- Light mode: Neutral warm palette (NO blue)
- Dark mode: Navy blue with indigo accents
- Sidebar: Distinct selected/hover states per mode
- Header: Matches card styling, no hover effects
- Icon overrides: Blue → neutral gray in light mode
- Component-level color control with inline Tailwind
- Nuclear CSS overrides for sidebar states
- Glassmorphism in both modes with different palettes

### Version 1.0 (January 2025)
- Initial dark mode implementation with navy blue theme
- Gradient enhancements on cards and buttons
- Glassmorphism effects with backdrop blur
- Glowing indigo borders and accents
- Comprehensive CSS variable system
- Sidebar and header styling
- Input field enhancements

---

*Last Updated: November 10, 2025*
*Maintained by: Frontend Team*