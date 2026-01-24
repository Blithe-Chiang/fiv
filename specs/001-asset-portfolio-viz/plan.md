# Implementation Plan: Asset Portfolio Visualization

**Branch**: `001-asset-portfolio-viz` | **Date**: 2026-01-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-asset-portfolio-viz/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A single-page web application for personal investment portfolio tracking with category-based visualization. Users define large and small categories (many-to-many relationships), add assets classified by these categories, and view allocation breakdowns via tables and charts. The application supports export/import for data portability and runs entirely client-side with no backend or authentication requirements. Built with React for mobile-responsive UI, utilizing local storage for data persistence and JSON format for import/export operations.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022
**Primary Dependencies**: React 18+, Vite 5+ (build tool), Recharts (chart library), TailwindCSS (responsive styling)
**Storage**: Browser localStorage (client-side persistence, no backend required)
**Testing**: Vitest 1.x (unit tests), @testing-library/react (component tests)
**Target Platform**: Modern web browsers (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+), mobile-responsive (iOS Safari, Chrome Mobile)
**Project Type**: Single-page web application (SPA) - client-side only, no backend infrastructure
**Performance Goals**: <100ms UI response time for all interactions, <500ms initial load time, smooth 60fps chart animations
**Constraints**: Offline-capable (no network dependencies after initial load), <2MB bundle size, accessible on mobile viewports (320px+), data export/import via JSON files
**Scale/Scope**: Single-user application, support up to 100 assets without performance degradation, 3-5 main views/screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ No constitution defined yet

The project constitution file (`.specify/memory/constitution.md`) contains only template placeholders and no actual principles have been ratified. Therefore, there are no gates to evaluate at this time. Once project-wide principles are established via `/speckit.constitution`, this section should be revisited to ensure compliance.

**Recommendation**: Consider defining constitution principles for:
- Testing requirements (e.g., TDD, coverage thresholds)
- Code organization patterns (e.g., feature-based, layered)
- Dependency management policies
- Accessibility and internationalization standards

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/           # React UI components
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   ├── category/        # Category management components
│   ├── asset/           # Asset management components
│   ├── visualization/   # Chart and table visualization components
│   └── common/          # Shared/reusable UI components
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── usePortfolio.ts
│   └── useCategories.ts
├── services/            # Business logic and data operations
│   ├── storage.ts       # localStorage wrapper
│   ├── calculations.ts  # Portfolio calculation utilities
│   └── export.ts        # Import/export JSON handlers
├── types/               # TypeScript type definitions
│   ├── asset.ts
│   ├── category.ts
│   └── portfolio.ts
├── utils/               # General utilities
│   ├── formatters.ts    # Number/currency formatting
│   └── validators.ts    # Input validation
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles (Tailwind imports)

tests/
├── unit/                # Unit tests for services, utils, hooks
│   ├── services/
│   ├── utils/
│   └── hooks/
├── components/          # Component tests
│   ├── category/
│   ├── asset/
│   └── visualization/
└── integration/         # Integration tests (user flows)
    ├── category-management.test.tsx
    ├── asset-management.test.tsx
    └── import-export.test.tsx

public/                  # Static assets
├── favicon.ico
└── manifest.json

# Configuration files at root
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.js
└── index.html           # Entry HTML file
```

**Structure Decision**: Single-project structure is appropriate because this is a pure frontend SPA with no backend services. All code runs in the browser, with localStorage as the persistence layer. The structure follows React best practices with component-based organization, custom hooks for state management, and a clear separation between UI components and business logic in services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: N/A - No constitution violations to track.

Since no project constitution has been defined, there are no complexity gates or violations to justify at this time.

---

## Implementation Phases

### Phase 0: Outline & Research ✅ COMPLETED

**Objective**: Resolve all technical unknowns and make informed technology decisions.

**Deliverables**:
- ✅ [research.md](research.md) - Comprehensive research covering:
  - R1: Chart Visualization Library → **Decision: Recharts**
  - R2: Responsive UI Framework → **Decision: TailwindCSS**
  - R3: State Management & Data Architecture → **Decision: React Context + Custom Hooks**
  - R4: Many-to-Many Category Relationship Model → **Decision: Association Table Pattern**
  - R5: Import/Export and Data Validation → **Decision: JSON with Zod validation**
  - R6: Testing Strategy with Vitest → **Decision: Three-tier testing (unit, component, integration)**
  - R7: Mobile Responsiveness Patterns → **Decision: Mobile-first responsive design**
  - R8: Build Tool and Development Environment → **Decision: Vite 5+**
  - R9: Accessibility Considerations → **Decision: WCAG 2.1 Level AA compliance**

**Key Research Findings**:
- All technology choices align with user requirements (React, Vitest, JSON, mobile-responsive)
- Client-side only architecture keeps bundle size small (<2MB) and enables offline capability
- Association table pattern cleanly models many-to-many category relationships
- Recharts provides declarative React-friendly charts with responsive behavior
- Zod provides runtime validation complementing TypeScript compile-time checks

---

### Phase 1: Design & Contracts ✅ COMPLETED

**Objective**: Define data model, entity relationships, validation rules, and service contracts.

**Deliverables**:

1. ✅ **[data-model.md](data-model.md)** - Complete data model specification:
   - Entity definitions: LargeCategory, SmallCategory, CategoryAssociation, Asset, Settings
   - Derived entities: LargeCategoryBreakdown, SmallCategoryBreakdown, PortfolioSummary
   - 43 validation rules (VR-LC-001 through VR-S-003)
   - 8 calculation rules (CR-LC-001 through CR-SC-003)
   - 8 data integrity invariants (INV-001 through INV-008)
   - Edge case matrix covering all scenarios from spec
   - LocalStorage persistence schema
   - Import/export JSON schema with Zod validation

2. ✅ **[contracts/storage-contract.md](contracts/storage-contract.md)** - Storage service interface:
   - Complete StorageService interface with 25+ methods
   - CRUD operations for all entity types
   - Error contract with 10 error codes and scenarios
   - Data integrity guarantees (atomicity, referential integrity, uniqueness)
   - Performance guarantees (read <10ms, write <50ms, import 100 assets <500ms)
   - Initialization contract with integrity checking
   - Versioning strategy for future schema evolution
   - Testing requirements (10 unit test scenarios, 4 integration test scenarios)

3. ✅ **[contracts/types-schema.md](contracts/types-schema.md)** - TypeScript type definitions:
   - Core entity types (LargeCategory, SmallCategory, CategoryAssociation, Asset, Settings)
   - Derived/calculated types (breakdowns, summary)
   - Form input types (CreateInput, UpdateInput for all entities)
   - Import/export types (ExportFile, ImportResult, ImportConflict)
   - Error types (StorageError, ValidationError)
   - UI state types (LoadingState, AsyncState, FormState)
   - React component props types (15+ component interfaces)
   - Type guards and utility types
   - Constants (validation constraints, defaults, performance targets)

4. ✅ **[quickstart.md](quickstart.md)** - Developer onboarding guide:
   - Prerequisites and recommended tools
   - Initial setup with all npm dependencies
   - Complete configuration files (vite, vitest, tsconfig, tailwind)
   - Project structure creation commands
   - Entry files (index.html, main.tsx, App.tsx, setup.ts)
   - Architecture overview with data flow diagram
   - Development workflow (start with types → storage → calculations → hooks → components)
   - Implementation priority aligned with user stories (P1 → P2 → P3)
   - Testing strategy breakdown
   - Common commands and debugging tips
   - Troubleshooting guide

5. ✅ **Agent Context Update**:
   - Updated [CLAUDE.md](../../CLAUDE.md) with technology stack:
     - Language: TypeScript 5.x / JavaScript ES2022
     - Framework: React 18+, Vite 5+, Recharts, TailwindCSS
     - Database: Browser localStorage
     - Project Type: Single-page web application (SPA)

**Design Highlights**:

- **Many-to-Many Relationships**: Clean association table pattern enables flexible category hierarchies
- **Data Integrity**: 8 invariants enforced with automatic integrity checking on startup
- **Validation**: 43 validation rules covering all edge cases from spec
- **Performance**: Specific performance targets defined and achievable with client-side architecture
- **Type Safety**: Comprehensive TypeScript types ensure compile-time correctness
- **Testing**: Three-tier strategy (unit, component, integration) with specific coverage targets

**Alignment with Requirements**:
- ✅ React-based (user requirement)
- ✅ Mobile-responsive design (TailwindCSS mobile-first)
- ✅ Vitest for testing (user requirement)
- ✅ JSON import/export format (user requirement)
- ✅ All 34 functional requirements (FR-001 through FR-034) addressed in data model
- ✅ All 6 success criteria (SC-001 through SC-006) achievable with chosen architecture

---

### Phase 2: Task Generation (Next Step)

**Objective**: Generate actionable, dependency-ordered tasks for implementation.

**Next Command**: `/speckit.tasks`

This will create [tasks.md](tasks.md) with:
- Granular implementation tasks derived from user stories
- Dependency ordering (prerequisites, blockers)
- Acceptance criteria for each task
- Estimated complexity/effort
- Mapping to functional requirements and test scenarios

**Note**: Task generation is a separate command and is NOT part of `/speckit.plan`.

---

## Constitution Check Re-evaluation (Post-Design)

*As required by the planning workflow, re-checking constitution after Phase 1 design.*

**Status**: ✅ No violations

Since no project constitution has been defined, there are no principles to evaluate against. The design follows industry best practices:
- Simple architecture (client-side only, no unnecessary backend)
- Established patterns (React Context, association tables, Zod validation)
- Testability (three-tier testing strategy with clear coverage targets)
- Maintainability (typed interfaces, clear separation of concerns)
- Performance (measured targets, efficient client-side calculations)

If constitution principles are added in the future via `/speckit.constitution`, this plan should be reviewed for compliance.
