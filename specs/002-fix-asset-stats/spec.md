# Feature Specification: Fix Asset Statistics Refresh

**Feature Branch**: `001-fix-asset-stats`  
**Created**: 2025-09-28  
**Status**: Draft  
**Input**: User description: "项目有一bug: 在有asset的情况下，更改asset A的值，这个时候asset列表的中asset A会触发对应更新，但是统计信息没有实时更新。手动刷新页面，统计信息中的会更新。"

## Clarifications

### Session 2026-01-25

- Q: Should statistics follow filtered views or always include all assets? → A: Statistics always reflect all assets, regardless of filters.
- Q: When should statistics update relative to asset edits? → A: Statistics update live during edits and are re-validated after save.
- Q: Are there different user roles that affect statistics behavior? → A: Single user role; same behavior for all users.
- Q: When should live updates occur during editing? → A: Update when the field loses focus.
- Q: How should concurrent edits be handled? → A: No special handling.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View updated statistics after asset change (Priority: P1)

As a user who edits asset values, I need the statistics panel to refresh automatically so the summary reflects the latest asset data without refreshing the page.

**Why this priority**: The statistics are decision-making data; stale numbers after edits mislead users.

**Independent Test**: Can be fully tested by editing a single asset value and confirming the statistics update without a page refresh.

**Acceptance Scenarios**:

1. **Given** a page showing the asset list and statistics, **When** an existing asset value is changed and saved, **Then** the statistics reflect the updated value without reloading the page.
2. **Given** multiple statistics derived from assets, **When** a change affects several metrics, **Then** all affected metrics update consistently.

---

### User Story 2 - Confirm accuracy after repeated edits (Priority: P2)

As a user making several edits in a row, I need statistics to stay accurate after each change so I can trust the summary while working.

**Why this priority**: Users often adjust multiple assets; accuracy across successive edits builds confidence.

**Independent Test**: Can be tested by performing two or more consecutive edits and verifying the statistics after each change.

**Acceptance Scenarios**:

1. **Given** the statistics panel is visible, **When** the user edits two different assets sequentially, **Then** the statistics reflect each edit without requiring a page refresh.

### Edge Cases

- Statistics should not update if an asset edit fails to save.
- If multiple edits occur in quick succession, the statistics must reflect the latest saved values.
- If the asset list is filtered, the statistics still reflect all assets.
- When an edit is canceled or fails to save, statistics revert to the last saved values.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST refresh the statistics panel after a successful asset value change without requiring a page reload.
- **FR-002**: System MUST ensure all statistics derived from the changed asset reflect the new saved value.
- **FR-003**: System MUST update statistics live as asset values are edited.
- **FR-004**: System MUST re-validate statistics after a successful save to match saved values.
- **FR-005**: System MUST revert statistics to last saved values when an edit is canceled or fails to save.
- **FR-006**: System MUST compute statistics over all assets, regardless of any active asset list filters.
- **FR-007**: System MUST refresh live statistics when an edited field loses focus.

### Key Entities *(include if feature involves data)*

- **Asset**: An item with editable values that contributes to aggregated statistics.
- **Asset List**: The visible collection of assets the user can edit.
- **Statistics Summary**: Aggregated metrics derived from assets in scope.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: After a saved asset edit, 95% of statistics updates are visible within 2 seconds without page refresh.
- **SC-002**: 100% of asset edits that save successfully result in statistics that match the saved values.
- **SC-003**: User-reported discrepancies between asset list and statistics drop by 80% compared to before the fix.
- **SC-004**: At least 90% of users can verify updated statistics on the first try without manual refresh.

## Assumptions

- Asset edits are confirmed as successful before triggering statistics updates.
- The statistics panel and asset list are visible within the same user session.

## Out of Scope

- Changes to how statistics are calculated, only when they refresh.
- Visual redesign of the asset list or statistics panel.
- Special concurrency handling beyond existing behavior.
