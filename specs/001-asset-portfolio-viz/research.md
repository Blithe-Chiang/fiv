# Research: Asset Portfolio Visualization

**Feature**: 001-asset-portfolio-viz
**Date**: 2026-01-24
**Status**: Completed

## Overview

This document captures research findings for implementing a client-side portfolio visualization tool using React. The research focuses on technology selection, architectural patterns, and implementation approaches aligned with the user requirements: mobile-responsive web UI, React-based, JSON import/export, and Vitest testing.

---

## R1: Chart Visualization Library

### Decision
**Recharts** will be used as the primary charting library.

### Rationale
- **React-Native Integration**: Built specifically for React with declarative component API that matches React's programming model
- **Responsive by Default**: Charts automatically resize for mobile viewports using ResponsiveContainer
- **Sufficient Features**: Provides pie charts and bar charts needed for category breakdowns (FR-024)
- **Small Bundle Size**: ~50KB gzipped, acceptable for the <2MB total bundle constraint
- **Active Maintenance**: Well-maintained with regular updates and strong community support
- **Accessibility**: Better accessibility support compared to D3-based custom solutions

### Alternatives Considered
1. **Chart.js with react-chartjs-2**
   - Rejected: Heavier bundle size (~200KB), imperative API requires refs and manual updates, less idiomatic React

2. **Victory (Formidable)**
   - Rejected: Larger bundle (~140KB), more complex API than needed for simple pie/bar charts

3. **D3.js with custom React wrapper**
   - Rejected: Requires significant custom code, steep learning curve, harder to maintain, overkill for basic charts

4. **Nivo**
   - Rejected: Even heavier than Victory (~180KB), enterprise-focused with features beyond requirements

---

## R2: Responsive UI Framework

### Decision
**TailwindCSS** will be used for styling and responsive design.

### Rationale
- **Mobile-First Design**: Built-in responsive breakpoints (sm, md, lg, xl) make mobile compatibility straightforward
- **Utility-First Approach**: Rapid prototyping and iteration without leaving JSX
- **Small Production Bundle**: PurgeCSS integration removes unused styles, typically <10KB for production
- **Consistent Design System**: Enforces consistent spacing, colors, typography out of the box
- **Developer Experience**: IntelliSense support, no context switching between CSS files
- **Touch-Friendly Defaults**: Adequate spacing and touch target sizes by default

### Alternatives Considered
1. **Styled Components / Emotion**
   - Rejected: Runtime CSS-in-JS adds bundle overhead, not ideal for mobile performance, requires learning curve

2. **Material-UI (MUI)**
   - Rejected: Very large bundle size (300KB+), opinionated design that may not match requirements, overkill for simple UI

3. **Bootstrap**
   - Rejected: Heavier framework, includes jQuery dependencies historically, less modern than Tailwind, more opinionated

4. **Plain CSS Modules**
   - Rejected: More boilerplate, manual responsive breakpoints, no design system constraints

---

## R3: State Management and Data Architecture

### Decision
**React Context + Custom Hooks** with localStorage persistence, no external state management library.

### Rationale
- **Sufficient Complexity**: Application state is simple (categories + assets), doesn't warrant Redux/Zustand
- **Built-in Solution**: React Context API is sufficient for sharing portfolio state across components
- **Custom Hooks Pattern**: Encapsulate business logic in hooks like `usePortfolio()`, `useCategories()` for reusability
- **Direct localStorage**: Single-user requirement means no backend sync, localStorage wrapper service is adequate
- **Performance**: Small data volumes (up to 100 assets) don't require optimized state libraries
- **Testing Friendly**: Custom hooks can be tested in isolation with @testing-library/react-hooks

### LocalStorage Patterns
```typescript
// Structure in localStorage:
{
  "portfolio": {
    "largeCategories": [...],
    "smallCategories": [...],
    "categoryAssociations": [...],  // Many-to-many relationships
    "assets": [...],
    "settings": { "currencySymbol": "$" }
  }
}
```

**Data Limits**: localStorage typically supports 5-10MB per origin, far exceeding the needs of 100 assets (~100KB of JSON data).

### Alternatives Considered
1. **Redux Toolkit**
   - Rejected: Overkill for simple CRUD operations, adds boilerplate and bundle size

2. **Zustand**
   - Rejected: While lightweight, still unnecessary when React Context + hooks suffice

3. **IndexedDB**
   - Rejected: More complex API than needed, localStorage's key-value store is sufficient for structured JSON

---

## R4: Many-to-Many Category Relationship Model

### Decision
**Association Table Pattern** stored as a separate array in the data model.

### Rationale
- **Clear Relationships**: Explicit association records make queries straightforward
- **Integrity**: Easy to validate that assets only use valid category combinations
- **Flexibility**: Simple to add/remove associations without modifying category objects
- **Query Performance**: Can efficiently filter small categories by large category and vice versa

### Data Model Structure
```typescript
interface LargeCategory {
  id: string;
  name: string;
}

interface SmallCategory {
  id: string;
  name: string;
}

interface CategoryAssociation {
  smallCategoryId: string;
  largeCategoryId: string;
}

interface Asset {
  id: string;
  name: string;
  amount: number;
  smallCategoryId: string;
  largeCategoryId: string;
}
```

### Validation Logic
When adding/editing an asset, validate that a `CategoryAssociation` record exists for the selected `(smallCategoryId, largeCategoryId)` pair (FR-009).

### Alternatives Considered
1. **Nested Category Objects** (small categories contain array of large category IDs)
   - Rejected: Makes bidirectional queries harder, denormalized data prone to inconsistencies

2. **Graph Database Structure**
   - Rejected: Massive overkill for simple many-to-many, would require additional library

---

## R5: Import/Export and Data Validation

### Decision
**JSON format** with comprehensive validation using **Zod** schema library.

### Rationale
- **User Requirement**: JSON format explicitly requested
- **Human-Readable**: Users can inspect and manually edit exported files if needed
- **Type Safety**: Zod provides runtime validation that complements TypeScript compile-time checks
- **Error Reporting**: Zod generates detailed error messages for invalid imports (FR-030)
- **Schema Versioning**: Can add version field to JSON for future migration support
- **Small Bundle**: Zod adds ~12KB gzipped, acceptable for validation benefits

### Export Format
```json
{
  "version": "1.0",
  "exportDate": "2026-01-24T10:30:00Z",
  "portfolio": {
    "largeCategories": [...],
    "smallCategories": [...],
    "categoryAssociations": [...],
    "assets": [...],
    "settings": {
      "currencySymbol": "$"
    }
  }
}
```

### Import Conflict Resolution Strategy
**Merge with ID-based deduplication** (FR-031):
- If imported category ID exists: skip (preserve existing)
- If imported category name matches but different ID: prompt user to choose
- If imported asset ID exists: skip
- New categories/assets: add to portfolio

### Alternatives Considered
1. **CSV Format**
   - Rejected: Cannot represent many-to-many relationships without complex encoding, not user-friendly for nested data

2. **No Validation Library** (manual validation)
   - Rejected: Error-prone, harder to maintain, worse error messages

3. **Replace Strategy** (overwrite all data on import)
   - Rejected: Too destructive, doesn't handle incremental backups or merging data from multiple sources

---

## R6: Testing Strategy with Vitest

### Decision
**Three-tier testing approach**: Unit tests (services/utils), Component tests (React Testing Library), Integration tests (user flows).

### Rationale
- **User Requirement**: Vitest specified for testing
- **Fast Execution**: Vitest's ES modules support and parallelization provide fast test runs
- **React Testing Library**: Industry standard for testing React components, focuses on user behavior
- **Coverage Goals**: Aim for >80% coverage on business logic (services, calculations), >60% on UI components
- **Integration Tests**: Cover critical user flows from spec (add asset, view breakdown, import/export)

### Test Priorities
1. **P1 - Business Logic**: Calculation services (percentage calculations, aggregations) - MUST be 100% accurate (SC-003)
2. **P1 - Data Integrity**: Validation functions, localStorage service, import/export handlers
3. **P2 - UI Components**: Category/asset forms, visualization components
4. **P3 - Integration**: End-to-end user flows

### Vitest Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',  // Browser-like environment for React components
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
})
```

### Alternatives Considered
1. **Jest**
   - Rejected: Slower than Vitest, more complex ESM setup, Vitest is modern replacement designed for Vite

2. **No Component Testing** (only unit tests)
   - Rejected: Would miss integration issues, user interaction bugs

3. **E2E Testing with Playwright/Cypress**
   - Rejected: Overkill for single-page app with no backend, slower execution, more complex setup

---

## R7: Mobile Responsiveness Patterns

### Decision
**Mobile-first responsive design** with progressive enhancement for desktop.

### Rationale
- **User Requirement**: Mobile compatibility is mandatory
- **Design Approach**: Start with mobile layout (320px+), add breakpoints for tablet (768px+) and desktop (1024px+)
- **Touch Targets**: Minimum 44x44px touch areas for buttons/links (WCAG 2.1 Level AAA)
- **Chart Behavior**: Charts stack vertically on mobile, side-by-side on desktop where space allows
- **Table Handling**: Responsive tables with horizontal scroll on mobile, full display on desktop
- **Form Inputs**: Large input fields optimized for mobile keyboards

### Key Breakpoints
```css
/* Tailwind breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Mobile-Specific Optimizations
- **Bottom Navigation**: On mobile, place primary actions at bottom (thumb-friendly zone)
- **Collapsible Sections**: Use accordions for category lists on small screens
- **Simplified Charts**: Reduce chart details on mobile, expand on larger screens
- **Swipe Gestures**: Consider swipe actions for delete/edit on mobile (accessibility considerations)

### Alternatives Considered
1. **Desktop-First Design**
   - Rejected: Harder to retrofit mobile support, violates user requirement for mobile compatibility

2. **Separate Mobile App** (React Native)
   - Rejected: Unnecessary complexity, increases maintenance burden, web app can handle mobile well

3. **Fixed Desktop-Only Layout**
   - Rejected: Fails mobile compatibility requirement

---

## R8: Build Tool and Development Environment

### Decision
**Vite 5+** as the build tool and development server.

### Rationale
- **Fast HMR**: Hot Module Replacement is instant, improving development experience
- **Modern Defaults**: Native ESM support, TypeScript out of the box
- **Optimized Builds**: Rollup-based production builds with tree-shaking and code splitting
- **Small Config**: Minimal configuration needed compared to Webpack
- **React Fast Refresh**: Built-in support for preserving component state during development
- **Vitest Integration**: Same config file can be shared between Vite and Vitest

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```

### Alternatives Considered
1. **Create React App (CRA)**
   - Rejected: Deprecated/unmaintained, slow build times, webpack-based

2. **Next.js**
   - Rejected: Overkill for single-page app, SSR/SSG features unnecessary, heavier framework

3. **Webpack + Custom Config**
   - Rejected: Much more complex configuration, slower HMR, steeper learning curve

---

## R9: Accessibility (a11y) Considerations

### Decision
**WCAG 2.1 Level AA compliance** as baseline, with specific focus on keyboard navigation and screen reader support.

### Rationale
- **Legal/Ethical**: Accessibility is both a legal requirement in many jurisdictions and ethical imperative
- **Mobile Users**: Touch-friendly design overlaps significantly with accessibility requirements
- **Keyboard Navigation**: All interactive elements must be keyboard-accessible (no mouse-only actions)
- **Screen Readers**: Proper ARIA labels for charts and dynamic content
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text (WCAG AA standard)

### Implementation Checklist
- ✅ Semantic HTML (proper heading hierarchy, landmarks)
- ✅ Keyboard navigation (focus management, tab order)
- ✅ ARIA labels for interactive elements (buttons, forms, charts)
- ✅ Color contrast validation (use Tailwind's default palette which passes WCAG AA)
- ✅ Focus indicators (visible outline on keyboard focus)
- ✅ Alt text for charts (provide data table alternative)
- ✅ Error messages associated with form fields

### Tools
- **eslint-plugin-jsx-a11y**: Catch accessibility issues during development
- **axe-core**: Runtime accessibility testing in Vitest tests

### Alternatives Considered
1. **No Formal Accessibility Standards**
   - Rejected: Excludes users with disabilities, potential legal issues

2. **WCAG AAA Level**
   - Rejected: More stringent than necessary for MVP, can iterate toward AAA later

---

## Summary of Key Decisions

| Area | Decision | Primary Rationale |
|------|----------|-------------------|
| Charts | Recharts | React-native, responsive, small bundle |
| Styling | TailwindCSS | Mobile-first, utility-first, small production bundle |
| State | React Context + Hooks | Sufficient for simple state, no external library needed |
| Data Model | Association table for M:N | Clear relationships, easy validation |
| Import/Export | JSON + Zod validation | User requirement, type-safe, good errors |
| Testing | Vitest + RTL | User requirement, fast, modern |
| Responsiveness | Mobile-first design | User requirement, progressive enhancement |
| Build Tool | Vite | Fast HMR, modern, Vitest integration |
| Accessibility | WCAG 2.1 AA | Industry standard, legal compliance |

---

## Open Questions / Future Considerations

1. **Localization/Internationalization**: Not in current spec, but currency formatting may need i18n in future
2. **Data Migration**: If schema changes in future versions, need migration strategy for localStorage
3. **Offline PWA**: Consider Progressive Web App features (service worker, app manifest) for better mobile experience
4. **Chart Themes**: Should charts match light/dark mode if added later?
5. **Data Export Formats**: Should we support CSV/Excel in addition to JSON in future iterations?

These questions are deferred to future feature requests and not blockers for the current implementation.
