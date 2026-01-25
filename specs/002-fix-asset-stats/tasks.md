---

description: "Task list for Fix Asset Statistics Refresh"
---

# Tasks: Fix Asset Statistics Refresh

**Input**: Design documents from `/Users/blithe/work/github/fiv/specs/002-fix-asset-stats/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in spec; no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline understanding of current asset edit and stats flow

- [x] T001 Review asset edit flow in `src/components/asset/AssetForm.tsx`
- [x] T002 Review statistics calculation usage in `src/components/Dashboard.tsx` and `src/services/calculations.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared utilities and types used by all user stories

- [x] T003 Define draft asset preview type in `src/types/ui.ts`
- [x] T004 Implement draft-asset merge helper in `src/utils/assetDraft.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View updated statistics after asset change (Priority: P1) 🎯 MVP

**Goal**: Live statistics update on field blur, re-validate on save, and reflect all assets without page refresh.

**Independent Test**: Edit an asset amount, blur the field, and confirm summary updates; save and confirm summary matches saved values without refresh.

### Implementation for User Story 1

- [x] T005 [US1] Add draft asset state and derived assets for stats in `src/components/Dashboard.tsx`
- [x] T006 [US1] Emit draft values on field blur from `src/components/asset/AssetForm.tsx`
- [x] T007 [US1] Wire draft updates into statistics calculations in `src/components/Dashboard.tsx`
- [x] T008 [US1] Clear draft state after successful save in `src/components/Dashboard.tsx`

**Checkpoint**: User Story 1 is functional and independently testable

---

## Phase 4: User Story 2 - Confirm accuracy after repeated edits (Priority: P2)

**Goal**: Repeated edits remain accurate, with draft state reset on cancel or modal changes.

**Independent Test**: Edit two assets sequentially; confirm summary updates after each blur and reverts on cancel without refresh.

### Implementation for User Story 2

- [x] T009 [US2] Reset draft state when edit modal closes or asset changes in `src/components/Dashboard.tsx`
- [x] T010 [US2] Revert draft state on cancel or failed save in `src/components/Dashboard.tsx` and `src/components/asset/AssetForm.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and verification polish

- [x] T011 [P] Update verification notes in `specs/002-fix-asset-stats/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 5)**: Depends on user stories completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2), builds on US1 behavior

### Parallel Opportunities

- T011 can run in parallel with any implementation tasks (documentation-only)

---

## Parallel Example: User Story 1

```bash
Task: "Add draft asset state and derived assets for stats in src/components/Dashboard.tsx"
Task: "Emit draft values on field blur from src/components/asset/AssetForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate independent test for User Story 1

### Incremental Delivery

1. Complete Setup + Foundational
2. Implement User Story 1 and validate
3. Implement User Story 2 and validate
4. Apply polish updates
