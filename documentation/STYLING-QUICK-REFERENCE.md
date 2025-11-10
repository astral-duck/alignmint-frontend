# Styling Quick Reference

Quick reference for the IFM MVP Frontend styling system.

## 🎨 Typography (Claude-Inspired)

### Font Stack
```css
--font-sans: 'Inter'     // Body text, UI elements
--font-serif: 'Lora'     // Headings (h1, h2, h3)
```

### Usage
- **Body/UI**: Inter (clean, modern sans-serif)
- **Headings**: Lora (elegant serif for visual hierarchy)
- **Numbers**: Tabular figures for perfect alignment

### Font Features
```css
font-variant-numeric: tabular-nums;  // Monospaced numbers
font-feature-settings: 'tnum' 1;     // Enable tabular figures
```

---

## 🎨 Color System

**CRITICAL:** Light and Dark modes are COMPLETELY SEPARATE

### Light Mode
- ❌ **NO BLUE COLORS** (except focus states)
- ✅ Neutral warm grays/beiges only
- ✅ Primary buttons: `#5a5550` (warm gray-brown)
- ✅ Sidebar hover: `hover:bg-[#ddd9d4]`
- ✅ Sidebar selected: `bg-[#f5f3f0]`

### Dark Mode
- ✅ Blue/indigo accents (#6366f1)
- ✅ Primary buttons: Blue gradient
- ✅ Sidebar hover: `hover:bg-[#6366f1]/10`
- ✅ Sidebar selected: `bg-[#6366f1]/25`

---

## 📦 Common Patterns

### Backgrounds
```tsx
bg-background      // Main page
bg-card           // Card surfaces
bg-primary        // Primary buttons
bg-muted          // Muted backgrounds
```

### Text
```tsx
text-foreground          // Main text
text-muted-foreground    // Muted text
font-serif              // Use serif font (headings)
```

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