# Styling Quick Reference

Quick reference for common styling patterns in the IFM MVP Frontend.

**IMPORTANT:** Light and Dark modes use COMPLETELY DIFFERENT color palettes.

## Color Variables

### Backgrounds
```tsx
bg-background      // Main page (#0a0e27 dark, #f0ede9 light)
bg-card           // Card surfaces (#1a1f3a dark, #faf9f7 light)
bg-primary        // Primary buttons (#6366f1 dark, #030213 light)
bg-secondary      // Secondary elements (#252b47 dark, #e8e4df light)
bg-muted          // Muted backgrounds (#1e2337 dark, #ddd9d4 light)
bg-accent         // Highlights (#2d3454 dark, #d4cfc9 light)
```

### Text
```tsx
text-foreground          // Main text (#e8edf4 dark, #2a2826 light)
text-muted-foreground    // Muted text (#94a3b8 dark, #6e6b68 light)
text-primary            // Primary colored text
text-destructive        // Error text (#f43f5e dark, #d4183d light)
```

### Borders
```tsx
border-border    // Standard borders (#2d3454 dark, rgba(195,190,185,0.4) light)
border-input     // Input borders
```

## Critical Rules

### Light Mode
- ❌ **NO BLUE COLORS** (except focus states)
- ✅ Neutral warm grays/beiges only
- ✅ Sidebar hover: `hover:bg-[#ddd9d4]`
- ✅ Sidebar selected: `bg-[#f5f3f0]`
- ✅ Icons: Neutral gray (#6e6b68)

### Dark Mode
- ✅ Blue/indigo accents (#6366f1)
- ✅ Sidebar hover: `hover:bg-[#6366f1]/10`
- ✅ Sidebar selected: `bg-[#6366f1]/25`
- ✅ Glowing borders and shadows

## Common Components

### Card
```tsx
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-medium">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Button (Primary)
```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
  Click Me
</button>
```

### Input
```tsx
<input 
  className="w-full bg-input-background border-input rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring"
  placeholder="Enter text"
/>
```

### Navigation Item
```tsx
<a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
  <Icon className="h-5 w-5" />
  <span>Label</span>
</a>
```

## Spacing Scale

```
p-2  = 0.5rem (8px)
p-4  = 1rem (16px)
p-6  = 1.5rem (24px)
p-8  = 2rem (32px)
```

## Border Radius

```
rounded-sm   = Small
rounded-lg   = Standard (cards, buttons)
rounded-xl   = Large
rounded-full = Circular
```

## Dark Mode Features

- **Background**: Navy blue (#0f1629) with radial gradients
- **Cards**: Gradient backgrounds with glowing borders
- **Buttons**: Triple-gradient with glow effects
- **Sidebar**: Darker gradient (#0a0e1f to #0d1225)
- **Inputs**: Glassmorphism with backdrop blur
- **Highlights**: Indigo gradient with left border accent

## Quick Tips

✅ **DO:**
- Use CSS variables (`bg-card`, `text-foreground`)
- Follow spacing scale (`p-4`, `p-6`)
- Use semantic names (`bg-destructive`)
- Test in both light and dark modes

❌ **DON'T:**
- Hard-code colors (`bg-[#1a1f3a]`)
- Use arbitrary values unnecessarily
- Skip hover states
- Forget focus states for accessibility