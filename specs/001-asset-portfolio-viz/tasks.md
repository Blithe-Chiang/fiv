# Tasks: Asset Portfolio Visualization

**Input**: Design documents from `/specs/001-asset-portfolio-viz/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification - focusing on implementation tasks only

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US0, US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize npm project with TypeScript 5.x and configure package.json scripts
- [X] T002 [P] Install React 18+ dependencies (react, react-dom) and their TypeScript types
- [X] T003 [P] Install Vite 5+ build tool and @vitejs/plugin-react
- [X] T004 [P] Install TailwindCSS 3.4+, PostCSS, and Autoprefixer for styling
- [X] T005 [P] Install Recharts 2.10+ for chart visualizations
- [X] T006 [P] Install Zod 3.22+ for runtime validation
- [X] T007 [P] Install uuid 9.0+ for ID generation and @types/uuid
- [X] T008 [P] Install Vitest 1.x, @testing-library/react, @testing-library/jest-dom, jsdom for testing
- [X] T009 Create project directory structure (src/{components,hooks,services,types,utils}, tests/{unit,components,integration}, public/)
- [X] T010 [P] Configure vite.config.ts with path aliases and build settings
- [X] T011 [P] Configure vitest.config.ts with jsdom environment and coverage settings
- [X] T012 [P] Configure tsconfig.json with strict mode and path aliases
- [X] T013 [P] Configure tailwind.config.js with custom theme and content paths
- [X] T014 [P] Configure postcss.config.js with Tailwind and Autoprefixer plugins
- [X] T015 [P] Create index.html entry file with root div and viewport meta tag
- [X] T016 [P] Create src/main.tsx entry point with React root mounting
- [X] T017 [P] Create src/index.css with Tailwind directives
- [X] T018 [P] Create src/App.tsx placeholder component
- [X] T019 [P] Create tests/setup.ts with testing-library configuration and localStorage mock
- [X] T020 Verify setup by running dev server and tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Type Definitions

- [X] T021 [P] Define core entity types in src/types/entities.ts (LargeCategory, SmallCategory, CategoryAssociation, Asset, Settings, PortfolioData)
- [X] T022 [P] Define derived/calculated types in src/types/calculated.ts (LargeCategoryBreakdown, SmallCategoryBreakdown, PortfolioSummary)
- [X] T023 [P] Define form input types in src/types/forms.ts (CreateLargeCategoryInput, CreateSmallCategoryInput, CreateAssetInput, UpdateAssetInput, etc.)
- [X] T024 [P] Define error types in src/types/errors.ts (StorageErrorCode enum, StorageError class, ValidationError interface)
- [X] T025 [P] Define UI state types in src/types/ui.ts (LoadingState, AsyncState, FormState, VisualizationMode, ChartType)
- [X] T026 [P] Define import/export types in src/types/importExport.ts (ExportFile, ImportResult, ImportConflict, ImportStrategy)
- [X] T027 [P] Define constants in src/types/constants.ts (VALIDATION_CONSTRAINTS, DEFAULTS, PERFORMANCE_TARGETS)

### Zod Schemas

- [X] T028 [P] Create Zod schemas in src/schemas/entities.ts for runtime validation (LargeCategorySchema, SmallCategorySchema, CategoryAssociationSchema, AssetSchema, SettingsSchema, PortfolioDataSchema, ExportSchema)

### Storage Service

- [X] T029 Implement StorageService class in src/services/storage.ts with initialize() and getData() methods
- [X] T030 [P] Implement large category CRUD operations in src/services/storage.ts (createLargeCategory, updateLargeCategory, deleteLargeCategory, getLargeCategories)
- [X] T031 [P] Implement small category CRUD operations in src/services/storage.ts (createSmallCategory, updateSmallCategory, deleteSmallCategory, getSmallCategories)
- [X] T032 [P] Implement association operations in src/services/storage.ts (createAssociation, deleteAssociation, getAssociations, associationExists)
- [X] T033 [P] Implement asset CRUD operations in src/services/storage.ts (createAsset, updateAsset, deleteAsset, getAssets, getAssetsByCategory)
- [X] T034 [P] Implement settings operations in src/services/storage.ts (updateSettings, getSettings)
- [X] T035 [P] Implement bulk operations in src/services/storage.ts (importData, exportData, clearAllData)
- [X] T036 [P] Implement data integrity checking in src/services/storage.ts (checkIntegrity with all invariants INV-001 through INV-008)
- [X] T037 [P] Add all validation rules to storage service operations (VR-LC-001 through VR-S-003)
- [X] T038 Create singleton storageService instance and export in src/services/storage.ts

### Calculation Services

- [X] T039 [P] Implement calculateLargeCategoryBreakdown() in src/services/calculations.ts with percentage calculation and rounding (CR-LC-001, CR-LC-002, CR-LC-003)
- [X] T040 [P] Implement calculateSmallCategoryBreakdown() in src/services/calculations.ts with nested percentage calculations (CR-SC-001, CR-SC-002, CR-SC-003)
- [X] T041 [P] Implement calculatePortfolioSummary() in src/services/calculations.ts with total value and counts
- [X] T042 [P] Implement percentage adjustment utility in src/services/calculations.ts to handle rounding errors (ensure sum to 100%)

### Validation & Formatting Utilities

- [X] T043 [P] Implement validation utilities in src/utils/validators.ts (validateCategoryName, validateAssetAmount, validateCurrencySymbol, validateAssociation)
- [X] T044 [P] Implement formatting utilities in src/utils/formatters.ts (formatCurrency, formatPercentage, formatNumber with thousand separators)

### Custom Hooks

- [X] T045 Implement useLocalStorage hook in src/hooks/useLocalStorage.ts for localStorage state management
- [X] T046 Implement usePortfolio hook in src/hooks/usePortfolio.ts with portfolio state and all CRUD operations
- [X] T047 [P] Implement useCategories hook in src/hooks/useCategories.ts with category management operations
- [X] T048 [P] Implement useAssets hook in src/hooks/useAssets.ts with asset management operations

### Common UI Components

- [X] T049 [P] Create Button component in src/components/common/Button.tsx with variants (primary, secondary, danger)
- [X] T050 [P] Create Input component in src/components/common/Input.tsx with validation state
- [X] T051 [P] Create Select component in src/components/common/Select.tsx with options list
- [X] T052 [P] Create Modal component in src/components/common/Modal.tsx for dialogs
- [X] T053 [P] Create EmptyState component in src/components/common/EmptyState.tsx for empty portfolio display
- [X] T054 [P] Create ErrorMessage component in src/components/common/ErrorMessage.tsx for error display
- [X] T055 [P] Create LoadingSpinner component in src/components/common/LoadingSpinner.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 0 - Define Categories (Priority: P1)

**Goal**: Users can create, edit, and manage large and small categories with many-to-many associations

**Independent Test**: Create large categories and small categories, associate small categories with multiple large categories, verify associations are saved and available for asset creation

### Implementation for User Story 0

- [X] T056 [P] [US0] Create CategoryList component in src/components/category/CategoryList.tsx to display all categories with associations
- [X] T057 [P] [US0] Create LargeCategoryForm component in src/components/category/LargeCategoryForm.tsx with name input and validation
- [X] T058 [P] [US0] Create SmallCategoryForm component in src/components/category/SmallCategoryForm.tsx with name input and validation
- [X] T059 [US0] Create AssociationManager component in src/components/category/AssociationManager.tsx to add/remove category associations
- [X] T060 [US0] Create CategoryManagement page component in src/components/category/CategoryManagement.tsx integrating all category components
- [X] T061 [US0] Add category name uniqueness validation (case-insensitive) in form components
- [X] T062 [US0] Add deletion blocking when categories have assets assigned (VR-LC-006, VR-SC-006)
- [X] T063 [US0] Add deletion blocking when removing last association with assets (VR-SC-008)
- [X] T064 [US0] Add character count display for category name inputs (max 50 chars)
- [X] T065 [US0] Implement mobile-responsive layout for category management screens

**Checkpoint**: Users can define and manage complete category structures ready for asset creation

---

## Phase 4: User Story 1 - Add Asset and View Portfolio Summary (Priority: P1) 🎯 MVP

**Goal**: Users can add assets with category classifications and view large category allocation breakdown

**Independent Test**: Add one or more assets and verify portfolio summary displays correct totals and percentages for large categories

### Implementation for User Story 1

- [X] T066 [P] [US1] Create AssetForm component in src/components/asset/AssetForm.tsx with name, amount, category selection inputs
- [X] T067 [P] [US1] Create AssetList component in src/components/asset/AssetList.tsx to display all assets in a table
- [X] T068 [US1] Implement category dropdown filtering in AssetForm (only show valid small category + large category pairs)
- [X] T069 [US1] Add association validation in AssetForm (VR-A-009: verify CategoryAssociation exists for selected pair)
- [X] T070 [US1] Add amount validation in AssetForm (VR-A-004: positive numbers > 0, up to 2 decimal places)
- [X] T071 [US1] Create PortfolioSummary component in src/components/visualization/PortfolioSummary.tsx displaying total value and asset count
- [X] T072 [US1] Create LargeCategoryBreakdownTable component in src/components/visualization/LargeCategoryBreakdownTable.tsx with percentage and amount columns
- [X] T073 [US1] Integrate currency symbol from settings in all amount displays
- [X] T074 [US1] Add empty state handling (FR-025: display "Add your first asset" when portfolio is empty)
- [X] T075 [US1] Add category prerequisite check (FR-026: prevent asset creation when no categories defined)
- [X] T076 [US1] Implement mobile-responsive layout for asset forms and portfolio summary
- [X] T077 [US1] Create main Dashboard component in src/components/Dashboard.tsx integrating portfolio summary and asset list

**Checkpoint**: Users can add assets and see basic portfolio allocation - MVP is functional

---

## Phase 5: User Story 2 - View Detailed Category Breakdown (Priority: P2)

**Goal**: Users can drill down to see small category breakdowns within large categories with table and chart visualizations

**Independent Test**: Add assets with same large category but different small categories, verify small category breakdown shows correct percentages in table and chart formats

### Implementation for User Story 2

- [X] T078 [P] [US2] Create SmallCategoryBreakdownTable component in src/components/visualization/SmallCategoryBreakdownTable.tsx showing breakdown by small category grouped by large category
- [X] T079 [P] [US2] Create BreakdownChart component in src/components/visualization/BreakdownChart.tsx using Recharts PieChart
- [X] T080 [P] [US2] Create BarChart visualization option in src/components/visualization/BreakdownChart.tsx using Recharts BarChart
- [X] T081 [US2] Create VisualizationControls component in src/components/visualization/VisualizationControls.tsx with mode toggle (table/chart) and chart type selector (pie/bar)
- [X] T082 [US2] Integrate small category breakdown calculations into Dashboard component
- [X] T083 [US2] Add chart responsiveness using Recharts ResponsiveContainer for mobile viewports
- [X] T084 [US2] Add color palette for chart segments (ensure WCAG AA contrast compliance)
- [X] T085 [US2] Add chart legend and tooltips showing category name, amount, and percentage
- [X] T086 [US2] Handle single small category case (display 100% in table/chart)
- [X] T087 [US2] Add aria-labels for charts for screen reader accessibility

**Checkpoint**: Users can view detailed breakdowns in multiple formats (table and charts)

---

## Phase 6: User Story 3 - Manage Existing Assets (Priority: P3)

**Goal**: Users can edit asset details and delete assets from their portfolio

**Independent Test**: Create an asset, modify its details, verify portfolio recalculates. Delete an asset and verify removal

### Implementation for User Story 3

- [X] T088 [US3] Add edit button to each asset row in AssetList component
- [X] T089 [US3] Modify AssetForm to support edit mode with initialValues prop
- [X] T090 [US3] Add delete button to each asset row in AssetList component
- [X] T091 [US3] Create DeleteConfirmationModal component in src/components/asset/DeleteConfirmationModal.tsx
- [X] T092 [US3] Implement optimistic updates for asset edit (immediate UI update)
- [X] T093 [US3] Add automatic recalculation of all portfolio breakdowns after asset changes (FR-021)
- [X] T094 [US3] Update updatedAt timestamp on asset edit operations

**Checkpoint**: Users can fully manage their asset portfolio with edit and delete capabilities

---

## Phase 7: User Story 4 - Export and Import Portfolio Data (Priority: P3)

**Goal**: Users can export complete portfolio to JSON file for backup and import from file to restore data

**Independent Test**: Create portfolio with categories and assets, export to file, clear all data, import file, verify complete restoration

### Implementation for User Story 4

- [X] T095 [P] [US4] Create ExportButton component in src/components/importExport/ExportButton.tsx triggering JSON file download
- [X] T096 [P] [US4] Create ImportButton component in src/components/importExport/ImportButton.tsx with file input
- [X] T097 [US4] Implement export file generation in src/services/export.ts using ExportFile schema with version and timestamp
- [X] T098 [US4] Implement file parsing and Zod validation in src/services/import.ts (FR-030: validate format and reject invalid files)
- [X] T099 [US4] Implement import conflict detection in src/services/import.ts (check for ID and name conflicts)
- [X] T100 [US4] Create ConflictResolutionModal component in src/components/importExport/ConflictResolutionModal.tsx for handling conflicts (FR-031)
- [X] T101 [US4] Implement merge import strategy (skip existing IDs, prompt on name conflicts)
- [X] T102 [US4] Implement replace import strategy (clear existing data, import all)
- [X] T103 [US4] Add error handling for invalid JSON and corrupted files (display user-friendly error messages)
- [X] T104 [US4] Add referential integrity validation on import (verify all foreign keys are valid)
- [X] T105 [US4] Create ImportExportPanel component in src/components/importExport/ImportExportPanel.tsx integrating export/import UI

**Checkpoint**: Users can safely backup and restore their complete portfolio data

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T106 [P] Add Settings panel in src/components/settings/SettingsPanel.tsx for currency symbol configuration (FR-032, FR-033)
- [ ] T107 [P] Create Header component in src/components/layout/Header.tsx with app title and navigation
- [ ] T108 [P] Create Layout component in src/components/layout/Layout.tsx wrapping all pages
- [ ] T109 Add keyboard navigation support (tab order, enter to submit forms, escape to close modals)
- [ ] T110 Add focus indicators for all interactive elements (WCAG 2.1 AA compliance)
- [ ] T111 [P] Add loading states for all async operations (asset CRUD, import/export)
- [ ] T112 [P] Add error boundaries for graceful error handling in src/components/common/ErrorBoundary.tsx
- [ ] T113 Optimize calculation memoization with useMemo for expensive portfolio breakdowns
- [ ] T114 Add localStorage quota exceeded error handling
- [ ] T115 Add form input debouncing for real-time validation
- [ ] T116 [P] Add success toast notifications for operations (create, update, delete, import, export)
- [ ] T117 [P] Polish mobile touch targets (minimum 44x44px for all buttons)
- [ ] T118 [P] Add skeleton loaders for initial portfolio load
- [ ] T119 [P] Document component APIs with JSDoc comments
- [ ] T120 Run final validation against quickstart.md setup guide

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 0 (Phase 3)**: Depends on Foundational - Prerequisite for US1
- **User Story 1 (Phase 4)**: Depends on Foundational + US0 (categories must exist to add assets)
- **User Story 2 (Phase 5)**: Depends on Foundational + US0 + US1 (needs assets to visualize)
- **User Story 3 (Phase 6)**: Depends on Foundational + US0 + US1 (needs assets to edit/delete)
- **User Story 4 (Phase 7)**: Depends on Foundational + US0 + US1 (needs data to export/import)
- **Polish (Phase 8)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 0 (P1)**: Foundation only - Can start once Phase 2 complete
- **User Story 1 (P1)**: US0 must be complete (categories required for assets)
- **User Story 2 (P2)**: US0 + US1 complete (needs assets with categories to visualize breakdowns)
- **User Story 3 (P3)**: US0 + US1 complete (needs existing assets to edit/delete)
- **User Story 4 (P3)**: US0 + US1 complete (needs portfolio data to export/import)

### Within Each User Story

- Components marked [P] can be built in parallel (different files)
- Forms before integration components
- Basic components before composite components
- Core functionality before mobile responsive refinements

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T002-T008: All dependency installations can run in parallel
- T010-T014: All configuration files can be created in parallel
- T016-T019: All entry files can be created in parallel

**Foundational Phase (Phase 2)**:
- T021-T027: All type definition files can be created in parallel
- T030-T034: All storage CRUD operations can be implemented in parallel
- T039-T042: All calculation services can be implemented in parallel
- T043-T044: Validation and formatting utilities can be implemented in parallel
- T047-T048: useCategories and useAssets hooks can be implemented in parallel
- T049-T055: All common UI components can be built in parallel

**User Story 0 (Phase 3)**:
- T056-T058: CategoryList and both category forms can be built in parallel

**User Story 1 (Phase 4)**:
- T066-T067: AssetForm and AssetList can be built in parallel

**User Story 2 (Phase 5)**:
- T078-T080: All visualization components can be built in parallel

**User Story 4 (Phase 7)**:
- T095-T096: Export and Import buttons can be built in parallel

**Polish Phase (Phase 8)**:
- T106-T108: Settings, Header, and Layout components can be built in parallel
- T111-T112: Loading states and error boundaries can be added in parallel
- T116-T118: Toast notifications, touch targets, and skeleton loaders can be added in parallel

---

## Parallel Example: User Story 1 (MVP)

After completing Phase 2 (Foundational), the following tasks can run in parallel:

```bash
# Build core components in parallel:
Task T066: "Create AssetForm component in src/components/asset/AssetForm.tsx"
Task T067: "Create AssetList component in src/components/asset/AssetList.tsx"

# After forms are ready, these can run in parallel:
Task T071: "Create PortfolioSummary component in src/components/visualization/PortfolioSummary.tsx"
Task T072: "Create LargeCategoryBreakdownTable component"
```

---

## Implementation Strategy

### MVP First (User Stories 0 + 1 Only)

1. Complete Phase 1: Setup (~1-2 hours)
2. Complete Phase 2: Foundational (CRITICAL - ~6-8 hours)
3. Complete Phase 3: User Story 0 (~3-4 hours)
4. Complete Phase 4: User Story 1 (~4-6 hours)
5. **STOP and VALIDATE**: Test category creation and asset management independently
6. **MVP READY**: Users can track portfolio with basic visualizations

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US0 + US1 → Test independently → **MVP DEPLOYED** (basic portfolio tracking)
3. Add US2 → Test independently → **v1.1 DEPLOYED** (enhanced visualizations with charts)
4. Add US3 → Test independently → **v1.2 DEPLOYED** (full portfolio management)
5. Add US4 → Test independently → **v1.3 DEPLOYED** (data portability)
6. Add Phase 8 polish → **v2.0 DEPLOYED** (production-ready)

### Parallel Team Strategy

With multiple developers:

1. **Team Setup Phase**: Everyone works on Phase 1 + Phase 2 together (~8-10 hours)
2. **Once Foundational Complete**:
   - Developer A: User Story 0 (categories) → Prerequisites for all
   - After US0 complete, parallel work begins:
     - Developer A: User Story 1 (assets + summary)
     - Developer B: User Story 2 (detailed visualizations) - starts after US1 has basic assets
     - Developer C: User Story 4 (import/export) - starts after US1 has basic data
   - Developer D: User Story 3 (asset management) - starts after US1 complete
3. **Integration Phase**: Team validates all stories work independently and together
4. **Polish Phase**: Team adds Phase 8 improvements

---

## Success Criteria Mapping

- **SC-001** (Add asset <30s): T066-T070 (AssetForm with streamlined input)
- **SC-002** (Calculations <1s): T039-T042 (Optimized calculation services)
- **SC-003** (Percentage accuracy 0.01%): T039-T040, T042 (Rounding and adjustment utilities)
- **SC-004** (View without scrolling): T071-T072, T076 (Responsive layout)
- **SC-005** (95% success rate): T069-T070, T074-T075 (Clear validation and empty states)
- **SC-006** (100 assets no degradation): T113 (Memoization optimization)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Focus on implementation first - tests not explicitly requested in spec
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Mobile-responsive design considerations included throughout (SC-004, WCAG 2.1 AA)
- All tasks include exact file paths for immediate implementation
- Storage service validates all 43 validation rules (VR-LC-001 through VR-S-003)
- Calculations implement all 8 calculation rules (CR-LC-001 through CR-SC-003)
- Data integrity checked via 8 invariants (INV-001 through INV-008)
