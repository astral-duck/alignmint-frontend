# Theme Management System Implementation Plan

> **Goal**: Replace the current binary light/dark toggle with a full theme management system supporting multiple light themes, multiple dark themes, system preference detection, and time-based auto-switching.

---

## Current State Summary

### What Exists Today

| Component | Location | Current Behavior |
|-----------|----------|------------------|
| Theme state | `src/contexts/AppContext.tsx:326` | `useState<'light' \| 'dark'>('light')` — no persistence |
| Toggle function | `src/contexts/AppContext.tsx:376-378` | Simple flip between light/dark |
| DOM application | `src/contexts/AppContext.tsx:372-374` | Adds/removes `.dark` class on `<html>` |
| Light theme CSS | `src/styles/globals.css:3-48` | `:root` — "Organic" warm neutrals |
| Dark theme CSS | `src/styles/globals.css:50-91` | `.dark` — "Navy" deep blues |
| Header toggle | `src/components/Header.tsx:90-102` | Moon/Sun icon button |
| Settings toggle | `src/components/Settings.tsx:381-396` | Switch in Preferences tab |
| User dropdown | `src/components/Header.tsx:139-143` | Only "Settings" and "Logout" |

### Problems to Fix

1. Theme resets to light on every page refresh (no localStorage)
2. No system preference detection (`prefers-color-scheme`)
3. Can't add more themes — hardcoded to binary light/dark
4. CSS themes embedded in `:root` and `.dark` — not modular
5. No "Appearance" option in user dropdown
6. Theme names ("Organic", "Navy") not exposed to users

---

## Target Architecture

```
User selects:
├── Mode: Light | Dark | System
├── Light Theme: Organic | [Future Theme 2] | [Future Theme 3]
├── Dark Theme: Navy | [Future Theme 2] | [Future Theme 3]
└── Auto-switch: Off | On (with time settings)

CSS applies:
├── <html data-mode="light|dark" data-theme="organic|navy|...">
└── Themes defined as [data-theme="organic"], [data-theme="navy"], etc.
```

---

## Implementation Steps

### Phase 1: Create Theme Infrastructure

#### Step 1.1: Define Theme Types
**File**: `src/types/theme.ts` (new file)

Create TypeScript types for the theme system:

```typescript
// Theme mode: what the user selected
export type ThemeMode = 'light' | 'dark' | 'system';

// Available light themes
export type LightTheme = 'organic';

// Available dark themes  
export type DarkTheme = 'navy';

// Combined theme identifier (for CSS)
export type ThemeId = 'organic' | 'navy';

// Full theme configuration stored in localStorage
export interface ThemeConfig {
  mode: ThemeMode;
  lightTheme: LightTheme;
  darkTheme: DarkTheme;
  autoSwitch: boolean;
  autoSwitchLightTime: string; // "06:00" format
  autoSwitchDarkTime: string;  // "18:00" format
}

// What gets applied to the DOM
export interface AppliedTheme {
  mode: 'light' | 'dark'; // Resolved mode (never 'system')
  theme: ThemeId;
}
```

---

#### Step 1.2: Create Theme Context
**File**: `src/contexts/ThemeContext.tsx` (new file)

Create a dedicated context for theme management:

```typescript
// Responsibilities:
// 1. Load config from localStorage on mount
// 2. Listen to system preference changes
// 3. Handle time-based auto-switching
// 4. Apply theme to DOM (<html> element)
// 5. Provide theme state and setters to components
```

**Key functions to implement**:
- `getSystemPreference()`: Check `matchMedia('(prefers-color-scheme: dark)')`
- `resolveTheme(config)`: Determine actual theme based on mode/system/time
- `applyThemeToDOM(theme)`: Set `data-mode` and `data-theme` attributes
- `persistConfig(config)`: Save to localStorage

**Context value to expose**:
```typescript
interface ThemeContextValue {
  // Current state
  config: ThemeConfig;
  appliedTheme: AppliedTheme;
  
  // Setters
  setMode: (mode: ThemeMode) => void;
  setLightTheme: (theme: LightTheme) => void;
  setDarkTheme: (theme: DarkTheme) => void;
  setAutoSwitch: (enabled: boolean) => void;
  setAutoSwitchTimes: (light: string, dark: string) => void;
  
  // Convenience
  toggleMode: () => void; // For quick light/dark toggle
}
```

---

#### Step 1.3: Refactor CSS Theme Definitions
**File**: `src/styles/globals.css`

**Before** (current):
```css
:root {
  --background: #f0ede9;
  /* ... organic light vars ... */
}

.dark {
  --background: #0a0e27;
  /* ... navy dark vars ... */
}
```

**After** (new structure):
```css
/* Base defaults (fallback) */
:root {
  --radius: 0.625rem;
  /* ... non-theme vars ... */
}

/* Organic Light Theme */
[data-theme="organic"] {
  --background: #f0ede9;
  --foreground: #2a2826;
  /* ... all organic light vars ... */
}

/* Navy Dark Theme */
[data-theme="navy"] {
  --background: #0a0e27;
  --foreground: #e8edf4;
  /* ... all navy dark vars ... */
}

/* Mode-specific overrides (for things like .dark selectors in components) */
[data-mode="dark"] {
  /* This allows existing .dark:class selectors to still work */
}
```

**Also update**:
- Change `html:not(.dark)` selectors to `[data-mode="light"]`
- Change `.dark` selectors to `[data-mode="dark"]`
- Keep backward compatibility during transition

---

#### Step 1.4: Update DOM Application
**File**: `src/contexts/ThemeContext.tsx`

The `applyThemeToDOM` function should:

```typescript
function applyThemeToDOM(applied: AppliedTheme) {
  const html = document.documentElement;
  
  // Set mode (for existing .dark selectors compatibility)
  html.setAttribute('data-mode', applied.mode);
  html.classList.toggle('dark', applied.mode === 'dark');
  
  // Set theme (for CSS variable definitions)
  html.setAttribute('data-theme', applied.theme);
}
```

---

### Phase 2: Integrate with Existing App

#### Step 2.1: Wrap App with ThemeProvider
**File**: `src/main.tsx` or `src/App.tsx`

Add `ThemeProvider` as a wrapper:

```tsx
<ThemeProvider>
  <AppProvider>
    {/* ... rest of app ... */}
  </AppProvider>
</ThemeProvider>
```

---

#### Step 2.2: Remove Theme from AppContext
**File**: `src/contexts/AppContext.tsx`

Remove these items:
- Line 76: `theme: 'light' | 'dark';` from interface
- Line 77: `toggleTheme: () => void;` from interface
- Line 326: `const [theme, setTheme] = useState<'light' | 'dark'>('light');`
- Lines 372-374: `useEffect` that applies theme to DOM
- Lines 376-378: `toggleTheme` function
- Lines 576-577: `theme` and `toggleTheme` from context value

---

#### Step 2.3: Update Header Component
**File**: `src/components/Header.tsx`

**Option A**: Remove the theme toggle button entirely (since Appearance will be in dropdown)

**Option B**: Keep it as a quick toggle that cycles through modes

For now, choose **Option A** — remove lines 90-102 (the Moon/Sun button).

Update the user dropdown to add "Appearance":

```tsx
<DropdownMenuContent align="end">
  <DropdownMenuItem onClick={() => setCurrentPage('appearance')}>
    Appearance
  </DropdownMenuItem>
  <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
    Settings
  </DropdownMenuItem>
  <DropdownMenuItem>Logout</DropdownMenuItem>
</DropdownMenuContent>
```

---

#### Step 2.4: Update Settings Component
**File**: `src/components/Settings.tsx`

Remove the "Dark Mode" switch from the Preferences tab (lines 381-396).

The Appearance section will now live in its own dedicated page/modal.

---

### Phase 3: Build Appearance UI

#### Step 3.1: Create Appearance Component
**File**: `src/components/Appearance.tsx` (new file)

This component will be the main UI for theme management:

```
┌─────────────────────────────────────────────────────┐
│ Appearance                                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Theme Mode                                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│ │  Light  │ │  Dark   │ │ System  │                │
│ └─────────┘ └─────────┘ └─────────┘                │
│                                                     │
│ ─────────────────────────────────────────────────── │
│                                                     │
│ Light Theme                     (shown if Light/System)
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Organic (warm neutrals)                       │ │
│ │   [preview swatch]                              │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Coming Soon...                                │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ─────────────────────────────────────────────────── │
│                                                     │
│ Dark Theme                      (shown if Dark/System)
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Navy (deep blues)                             │ │
│ │   [preview swatch]                              │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Coming Soon...                                │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ─────────────────────────────────────────────────── │
│                                                     │
│ Auto-Switch by Time                                 │
│ [ ] Enable automatic switching                      │
│                                                     │
│ (if enabled)                                        │
│ Light mode starts at: [06:00 ▼]                    │
│ Dark mode starts at:  [18:00 ▼]                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### Step 3.2: Add Appearance to Page Router
**File**: `src/contexts/AppContext.tsx`

Add `'appearance'` to the `PageView` type:

```typescript
type PageView = 'dashboard' | 'settings' | 'appearance' | /* ... others ... */;
```

---

#### Step 3.3: Render Appearance in Main Layout
**File**: `src/App.tsx` or wherever page routing happens

Add case for rendering `<Appearance />` when `currentPage === 'appearance'`.

---

### Phase 4: System Preference & Auto-Switch

#### Step 4.1: System Preference Listener
**File**: `src/contexts/ThemeContext.tsx`

Add effect to listen for system preference changes:

```typescript
useEffect(() => {
  if (config.mode !== 'system') return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    const newMode = e.matches ? 'dark' : 'light';
    // Re-resolve and apply theme
  };
  
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}, [config.mode]);
```

---

#### Step 4.2: Time-Based Auto-Switch
**File**: `src/contexts/ThemeContext.tsx`

Add effect for time-based switching:

```typescript
useEffect(() => {
  if (!config.autoSwitch) return;
  
  const checkTime = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const lightMinutes = parseTime(config.autoSwitchLightTime);
    const darkMinutes = parseTime(config.autoSwitchDarkTime);
    
    // Determine if we should be in light or dark mode
    // Apply if different from current
  };
  
  checkTime(); // Check immediately
  const interval = setInterval(checkTime, 60000); // Check every minute
  
  return () => clearInterval(interval);
}, [config.autoSwitch, config.autoSwitchLightTime, config.autoSwitchDarkTime]);
```

---

### Phase 5: Testing & Cleanup

#### Step 5.1: Test Checklist

- [ ] Theme persists across page refresh
- [ ] System mode follows OS preference
- [ ] System mode updates live when OS preference changes
- [ ] Light theme selector works (only Organic for now)
- [ ] Dark theme selector works (only Navy for now)
- [ ] Auto-switch toggles theme at correct times
- [ ] All existing UI components render correctly in both themes
- [ ] No console errors or warnings
- [ ] Mobile responsive

#### Step 5.2: Remove Dead Code

After confirming everything works:

- Remove any unused imports in `AppContext.tsx`
- Remove old theme-related comments
- Clean up any `// TODO` markers

#### Step 5.3: Update Component Imports

Search codebase for any components still importing `theme` or `toggleTheme` from `useApp()` and update them to use `useTheme()` from the new context.

---

## File Change Summary

| File | Action |
|------|--------|
| `src/types/theme.ts` | **CREATE** — Theme type definitions |
| `src/contexts/ThemeContext.tsx` | **CREATE** — Theme context and provider |
| `src/styles/globals.css` | **MODIFY** — Refactor to data-attribute selectors |
| `src/contexts/AppContext.tsx` | **MODIFY** — Remove theme state |
| `src/components/Header.tsx` | **MODIFY** — Remove toggle, add Appearance to dropdown |
| `src/components/Settings.tsx` | **MODIFY** — Remove dark mode switch |
| `src/components/Appearance.tsx` | **CREATE** — New appearance settings UI |
| `src/App.tsx` or `src/main.tsx` | **MODIFY** — Add ThemeProvider wrapper |

---

## Future Enhancements (Out of Scope)

These can be added later once the foundation is solid:

1. **Additional light themes**: e.g., "Ocean", "Forest"
2. **Additional dark themes**: e.g., "Midnight", "Charcoal"
3. **Theme preview on hover**: Show live preview before selecting
4. **Custom theme builder**: Let users create their own color schemes
5. **Per-entity themes**: Different themes for different organizations
6. **Sync across devices**: Store preference in user profile (backend)

---

## Notes

- Keep the `.dark` class on `<html>` for backward compatibility with existing Tailwind `dark:` variants
- The `data-theme` attribute is for our custom CSS variable definitions
- The `data-mode` attribute is for any mode-specific styling that isn't theme-specific
- localStorage key: `alignmint-theme-config`
