# Research: Fix Asset Statistics Refresh

## Summary

No open technical unknowns were identified in the plan template. The feature will use the existing React/Vite/Tailwind stack and current data model.

## Decisions

### Live statistics update trigger
- **Decision**: Update statistics on field blur and re-validate after save.
- **Rationale**: Balances responsiveness with stability and aligns with clarified behavior.
- **Alternatives considered**: Update on every keystroke; update only on explicit apply.

### Filter behavior
- **Decision**: Statistics always reflect all assets, regardless of filters.
- **Rationale**: Matches clarified requirement and avoids mismatched totals across views.
- **Alternatives considered**: Tie statistics to filtered list.

### API contracts
- **Decision**: No external API contracts are required for this change.
- **Rationale**: The feature is a client-side update to existing calculations and UI refresh behavior.
- **Alternatives considered**: Introduce a backend endpoint for recalculation.
