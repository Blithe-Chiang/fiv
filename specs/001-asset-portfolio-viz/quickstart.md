# Quickstart Guide: Asset Portfolio Visualization

**Feature**: 001-asset-portfolio-viz
**Last Updated**: 2026-01-24
**For**: Developers implementing this feature

## Overview

This guide provides step-by-step instructions to set up the development environment, understand the architecture, and begin implementing the Asset Portfolio Visualization application.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 9.x or higher (comes with Node.js)
- **Modern Browser**: Chrome 90+, Safari 14+, Firefox 88+, or Edge 90+
- **Code Editor**: VS Code recommended (with TypeScript and Tailwind CSS extensions)
- **Git**: For version control

### Optional but Recommended

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (for .tsx files)
  - Error Lens

---

## Initial Setup

### 1. Initialize the Project

```bash
# Navigate to project root
cd /Users/blithe/work/github/fiv

# Initialize npm project (if not already done)
npm init -y

# Install core dependencies
npm install react@^18.3.0 react-dom@^18.3.0

# Install dev dependencies
npm install -D \
  vite@^5.0.0 \
  @vitejs/plugin-react@^4.2.0 \
  typescript@^5.3.0 \
  @types/react@^18.3.0 \
  @types/react-dom@^18.3.0

# Install testing dependencies
npm install -D \
  vitest@^1.0.0 \
  @testing-library/react@^14.1.0 \
  @testing-library/jest-dom@^6.1.0 \
  @testing-library/user-event@^14.5.0 \
  jsdom@^23.0.0

# Install styling and UI dependencies
npm install tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
npm install recharts@^2.10.0

# Install utility dependencies
npm install zod@^3.22.0
npm install uuid@^9.0.0
npm install -D @types/uuid@^9.0.0
```

### 2. Project Structure

Create the following directory structure:

```bash
# Create source directories
mkdir -p src/components/{layout,category,asset,visualization,common}
mkdir -p src/{hooks,services,types,utils}
mkdir -p tests/{unit,components,integration}
mkdir -p public

# Create test subdirectories
mkdir -p tests/unit/{services,utils,hooks}
mkdir -p tests/components/{category,asset,visualization}
```

### 3. Configuration Files

#### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
  },
});
```

#### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

#### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
```

#### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### package.json scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

### 4. Entry Files

#### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Asset Portfolio Visualization - Track and visualize your investment portfolio" />
    <title>Asset Portfolio Visualization</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### src/main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

#### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

#### src/App.tsx (Placeholder)

```typescript
import React from 'react';

function App() {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center text-primary-600">
        Asset Portfolio Visualization
      </h1>
      <p className="text-center mt-4 text-gray-600">
        Setup complete. Ready to implement features.
      </p>
    </div>
  );
}

export default App;
```

#### tests/setup.ts

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

### 5. Verify Setup

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Start dev server
npm run dev

# In another terminal, run tests
npm run test:run
```

You should see:
- Dev server running at http://localhost:3000
- Browser opens showing "Asset Portfolio Visualization" with "Setup complete"
- Tests pass (0 tests initially, but setup is verified)

---

## Architecture Overview

### Data Flow

```text
┌─────────────────────────────────────────────────────┐
│                   React Components                   │
│  (Category Forms, Asset Forms, Visualizations)       │
└────────────────┬───────────────────────┬─────────────┘
                 │                       │
                 ▼                       ▼
       ┌─────────────────┐     ┌─────────────────┐
       │  Custom Hooks   │     │  Calculation    │
       │  (usePortfolio) │     │  Services       │
       └────────┬────────┘     └────────┬────────┘
                │                       │
                ▼                       │
       ┌─────────────────┐             │
       │ Storage Service │◄────────────┘
       │  (localStorage) │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Browser        │
       │  localStorage   │
       └─────────────────┘
```

### Module Layers

1. **Presentation Layer** (`src/components/`)
   - React components for UI
   - Receives data from hooks, dispatches actions

2. **State Management Layer** (`src/hooks/`)
   - Custom hooks wrapping React Context
   - Manages application state and side effects

3. **Business Logic Layer** (`src/services/`)
   - Portfolio calculations
   - Data validation
   - Import/export handlers

4. **Data Layer** (`src/services/storage.ts`)
   - localStorage wrapper
   - CRUD operations
   - Data persistence

5. **Types Layer** (`src/types/`)
   - TypeScript interfaces and types
   - Shared across all layers

---

## Development Workflow

### 1. Start with Types

Begin by implementing types in `src/types/`:

```typescript
// src/types/entities.ts
export interface LargeCategory {
  id: string;
  name: string;
  createdAt: string;
}

// ... other types from types-schema.md
```

**Files to create**:
- `src/types/entities.ts` - Core entity types
- `src/types/forms.ts` - Form input types
- `src/types/errors.ts` - Error types
- `src/types/ui.ts` - UI state types

### 2. Implement Storage Service

Next, implement the storage service in `src/services/storage.ts`:

```typescript
// src/services/storage.ts
import { PortfolioData, Asset, LargeCategory, SmallCategory } from '@/types/entities';

export class StorageService {
  private readonly STORAGE_KEY = 'portfolio_v1';

  initialize(): PortfolioData {
    // ... implementation
  }

  // ... other methods from storage-contract.md
}

export const storageService = new StorageService();
```

**Write tests first** (TDD):
- Create `tests/unit/services/storage.test.ts`
- Write failing tests for each operation
- Implement storage service to make tests pass

### 3. Implement Calculation Services

```typescript
// src/services/calculations.ts
import { Asset, LargeCategoryBreakdown } from '@/types/entities';

export function calculateLargeCategoryBreakdown(assets: Asset[]): LargeCategoryBreakdown[] {
  // ... implementation
}

// ... other calculation functions
```

**Write tests first**:
- Create `tests/unit/services/calculations.test.ts`
- Test percentage calculations, aggregations, rounding

### 4. Create Custom Hooks

```typescript
// src/hooks/usePortfolio.ts
import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage';
import { PortfolioData } from '@/types/entities';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const data = storageService.initialize();
    setPortfolio(data);
  }, []);

  // ... CRUD operations

  return {
    portfolio,
    createAsset,
    updateAsset,
    deleteAsset,
    // ...
  };
}
```

### 5. Build UI Components

Start with core components:

1. **Category Management** (`src/components/category/`)
   - `CategoryList.tsx` - Display categories
   - `CategoryForm.tsx` - Create/edit categories
   - `AssociationManager.tsx` - Manage category associations

2. **Asset Management** (`src/components/asset/`)
   - `AssetList.tsx` - Display assets
   - `AssetForm.tsx` - Create/edit assets

3. **Visualizations** (`src/components/visualization/`)
   - `PortfolioSummary.tsx` - Top-level stats
   - `LargeCategoryBreakdown.tsx` - Large category breakdown
   - `SmallCategoryBreakdown.tsx` - Small category breakdown
   - `BreakdownTable.tsx` - Table view
   - `BreakdownChart.tsx` - Chart view (using Recharts)

4. **Common** (`src/components/common/`)
   - `Button.tsx`, `Input.tsx`, `Select.tsx`, etc.

### 6. Integration Testing

Once components are built:

```typescript
// tests/integration/add-asset-flow.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

test('User Story 1: Add asset and view portfolio summary', async () => {
  const user = userEvent.setup();
  render(<App />);

  // 1. Setup categories first
  // 2. Add an asset
  // 3. Verify portfolio summary displays correct totals
  // ... test implementation
});
```

---

## Implementation Priority

Follow this order based on user story priorities:

### Phase 1: P1 Features (Core Value)

1. **User Story 0: Define Categories** (P1)
   - Implement category management (create, edit, list)
   - Implement category associations
   - Tests: Unit tests for storage operations, component tests for forms

2. **User Story 1: Add Asset and View Portfolio Summary** (P1)
   - Implement asset CRUD operations
   - Implement large category breakdown calculation
   - Implement portfolio summary display
   - Tests: Unit tests for calculations, integration test for full flow

### Phase 2: P2 Features (Enhanced Value)

3. **User Story 2: View Detailed Category Breakdown** (P2)
   - Implement small category breakdown calculation
   - Implement table view for breakdowns
   - Implement chart visualizations (Recharts)
   - Tests: Component tests for visualizations

### Phase 3: P3 Features (Nice-to-Have)

4. **User Story 3: Manage Existing Assets** (P3)
   - Already covered in Phase 1 (CRUD operations)

5. **User Story 4: Export and Import Portfolio Data** (P3)
   - Implement export to JSON
   - Implement import with validation and conflict resolution
   - Tests: Unit tests for import/export logic, edge cases

---

## Testing Strategy

### Unit Tests (80%+ coverage goal)

```bash
# Run unit tests only
npm run test -- tests/unit

# Run with coverage
npm run coverage
```

**Priority**:
1. Storage service - 100% coverage
2. Calculation services - 100% coverage
3. Validation utilities - 100% coverage
4. Custom hooks - 80%+ coverage

### Component Tests (60%+ coverage goal)

```bash
# Run component tests only
npm run test -- tests/components
```

Test user interactions:
- Form submissions
- Button clicks
- Input validation
- Error display

### Integration Tests

```bash
# Run integration tests only
npm run test -- tests/integration
```

Test complete user flows from the spec:
- User Story 0: Category setup flow
- User Story 1: Add asset and view summary flow
- User Story 2: View detailed breakdown flow
- User Story 4: Export/import flow

---

## Common Commands

```bash
# Development
npm run dev                # Start dev server (http://localhost:3000)
npm run build              # Production build
npm run preview            # Preview production build

# Testing
npm run test               # Run tests in watch mode
npm run test:run           # Run tests once
npm run test:ui            # Run tests with UI
npm run coverage           # Generate coverage report

# Quality Checks
npm run type-check         # TypeScript type checking
npm run lint               # Lint code (if ESLint configured)
```

---

## Debugging Tips

### 1. localStorage Inspection

Open Chrome DevTools:
- **Application Tab** → **Local Storage** → View `portfolio_v1` key

### 2. React DevTools

Install React DevTools extension to inspect component state and props.

### 3. Vitest UI

```bash
npm run test:ui
```

Opens a browser UI for interactive test debugging.

### 4. Source Maps

Vite generates source maps in development, so you can set breakpoints in original TypeScript code in Chrome DevTools.

---

## Troubleshooting

### Issue: Vite dev server won't start

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in imports

**Solution**: Check `tsconfig.json` paths are correct and restart VS Code TypeScript server (Cmd+Shift+P → "Restart TS Server").

### Issue: Tailwind styles not applying

**Solution**:
1. Ensure `@tailwind` directives are in `src/index.css`
2. Check `tailwind.config.js` content paths include `.tsx` files
3. Restart dev server

### Issue: Tests failing with "document is not defined"

**Solution**: Ensure `vitest.config.ts` has `environment: 'jsdom'` set.

---

## Next Steps

Once setup is complete:

1. ✅ Verify all commands work (`npm run dev`, `npm run test`, etc.)
2. ✅ Read through the following design documents:
   - [data-model.md](data-model.md) - Understand entity relationships
   - [storage-contract.md](contracts/storage-contract.md) - Understand storage interface
   - [types-schema.md](contracts/types-schema.md) - Understand TypeScript types
3. ✅ Start implementing following the priority order above
4. ✅ Write tests first (TDD approach)
5. ✅ Commit frequently with clear messages

---

## Resources

- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Vitest Docs**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **Recharts**: https://recharts.org/
- **TailwindCSS**: https://tailwindcss.com/
- **Zod**: https://zod.dev/

---

## Questions or Issues?

Refer to:
1. Feature spec: [spec.md](spec.md)
2. Implementation plan: [plan.md](plan.md)
3. Research decisions: [research.md](research.md)

Happy coding! 🚀
