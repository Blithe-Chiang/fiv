# Implementation Plan: Fix Asset Statistics Refresh

**Branch**: `002-fix-asset-stats` | **Date**: 2026-01-25 | **Spec**: `/Users/blithe/work/github/fiv/specs/002-fix-asset-stats/spec.md`
**Input**: Feature specification from `/Users/blithe/work/github/fiv/specs/002-fix-asset-stats/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix live statistics refresh for asset edits so summaries update on field blur, re-validate on save, and always reflect all assets (even when the list is filtered), without page reloads.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3  
**Primary Dependencies**: React 18.3.1, Vite 5.4.21, Tailwind CSS 3.4.19, Recharts 2.15.4, Zod 3.25.76  
**Storage**: Browser localStorage (portfolio data)  
**Testing**: Vitest 1.6.1, Testing Library  
**Target Platform**: Modern desktop/mobile browsers  
**Project Type**: Web single-page app  
**Performance Goals**: 95% of statistics updates visible within 2 seconds after saved edits  
**Constraints**: Live updates trigger on field blur; stats re-validate on save; no page reload required  
**Scale/Scope**: Single-user local portfolio data set (no multi-user concurrency)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Pre-design: No enforceable gates detected; constitution file contains placeholders only.
- Post-design: No changes; still no enforceable gates.

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
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── App.tsx
├── components/
├── hooks/
├── index.css
├── main.tsx
├── schemas/
├── services/
├── types/
└── utils/

tests/
```

**Structure Decision**: Single web app using the existing `src/` + `tests/` layout.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
