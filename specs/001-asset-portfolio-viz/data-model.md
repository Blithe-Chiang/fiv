# Data Model: Asset Portfolio Visualization

**Feature**: 001-asset-portfolio-viz
**Date**: 2026-01-24
**Status**: Approved for Implementation

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the Asset Portfolio Visualization application. The data model supports a client-side application with localStorage persistence and many-to-many relationships between category types.

---

## Entity Relationship Diagram

```text
┌─────────────────┐         ┌──────────────────────┐         ┌────────────────┐
│ LargeCategory   │◄───────►│ CategoryAssociation  │◄───────►│ SmallCategory  │
│                 │  1..*    │                      │  1..*   │                │
│ - id            │         │ - smallCategoryId    │         │ - id           │
│ - name          │         │ - largeCategoryId    │         │ - name         │
│ - createdAt     │         │ - createdAt          │         │ - createdAt    │
└─────────────────┘         └──────────────────────┘         └────────────────┘
        │                                                              │
        │                                                              │
        │ 1                                                          1 │
        │                                                              │
        │                          ┌──────────────┐                   │
        └─────────────────────────►│    Asset     │◄──────────────────┘
                             1..*  │              │  1..*
                                   │ - id         │
                                   │ - name       │
                                   │ - amount     │
                                   │ - smallCategoryId │
                                   │ - largeCategoryId │
                                   │ - createdAt  │
                                   │ - updatedAt  │
                                   └──────────────┘

┌──────────────────┐
│ Settings         │
│                  │
│ - currencySymbol │
└──────────────────┘
```

**Relationships:**
- A `LargeCategory` can have many `SmallCategory` associations (many-to-many)
- A `SmallCategory` can be associated with many `LargeCategory` (many-to-many)
- An `Asset` belongs to exactly one `SmallCategory` and one `LargeCategory`
- The pair `(smallCategoryId, largeCategoryId)` in an Asset must have a valid `CategoryAssociation` record

---

## Entity Definitions

### 1. LargeCategory

Represents a major asset class grouping (e.g., "US Stocks", "International Bonds").

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | string (UUID) | Required, Unique, Immutable | Auto-generated unique identifier |
| `name` | string | Required, Unique, 1-50 chars | Display name for the category |
| `createdAt` | string (ISO 8601) | Required, Immutable | Timestamp of creation |

#### Validation Rules

- **VR-LC-001**: `name` must be unique across all large categories (case-insensitive) ➔ FR-004
- **VR-LC-002**: `name` must not be empty or whitespace-only
- **VR-LC-003**: `name` length must be between 1 and 50 characters
- **VR-LC-004**: `name` must not contain special characters that break rendering (no newlines, tabs)
- **VR-LC-005**: `id` must be a valid UUID v4 format
- **VR-LC-006**: Cannot delete a `LargeCategory` if any `Asset` references it ➔ FR-006
- **VR-LC-007**: Cannot delete a `LargeCategory` if any `CategoryAssociation` references it (must remove associations first)

#### State Transitions

```text
[Create] ──► ACTIVE ──► [Edit name] ──► ACTIVE
                 │
                 └──► [Delete (if no assets/associations)] ──► DELETED
```

**Notes:**
- No soft-delete; deletion is permanent
- Editing a category name updates all associated assets' display (via referential integrity)

---

### 2. SmallCategory

Represents a sub-classification within large categories (e.g., "S&P 500 Index", "Growth Stocks").

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | string (UUID) | Required, Unique, Immutable | Auto-generated unique identifier |
| `name` | string | Required, Unique, 1-50 chars | Display name for the category |
| `createdAt` | string (ISO 8601) | Required, Immutable | Timestamp of creation |

#### Validation Rules

- **VR-SC-001**: `name` must be unique across all small categories (case-insensitive) ➔ FR-004
- **VR-SC-002**: `name` must not be empty or whitespace-only
- **VR-SC-003**: `name` length must be between 1 and 50 characters
- **VR-SC-004**: `name` must not contain special characters that break rendering
- **VR-SC-005**: `id` must be a valid UUID v4 format
- **VR-SC-006**: Cannot delete a `SmallCategory` if any `Asset` references it ➔ FR-006
- **VR-SC-007**: A `SmallCategory` must have at least one `CategoryAssociation` when assets reference it
- **VR-SC-008**: Cannot remove the last association if assets still reference that (small, large) pair

#### State Transitions

```text
[Create] ──► ORPHANED ──► [Add association] ──► ACTIVE ──► [Edit name] ──► ACTIVE
                                                    │
                                                    ├──► [Remove association] ──► ACTIVE (if others exist)
                                                    │                          └──► ORPHANED (if last one)
                                                    │
                                                    └──► [Delete (if no assets)] ──► DELETED
```

**Notes:**
- An ORPHANED small category (no associations) can exist temporarily but should be flagged in UI
- Once assets reference a small category, it must maintain at least one association

---

### 3. CategoryAssociation

Links `SmallCategory` to `LargeCategory` in a many-to-many relationship.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `smallCategoryId` | string (UUID) | Required, Foreign Key | References `SmallCategory.id` |
| `largeCategoryId` | string (UUID) | Required, Foreign Key | References `LargeCategory.id` |
| `createdAt` | string (ISO 8601) | Required, Immutable | Timestamp of association creation |

#### Composite Key
The pair `(smallCategoryId, largeCategoryId)` is unique - no duplicate associations allowed.

#### Validation Rules

- **VR-CA-001**: Both `smallCategoryId` and `largeCategoryId` must reference existing categories ➔ FR-003
- **VR-CA-002**: The pair `(smallCategoryId, largeCategoryId)` must be unique (no duplicate associations)
- **VR-CA-003**: Cannot delete an association if any `Asset` uses that exact pair ➔ FR-009
- **VR-CA-004**: `smallCategoryId` must not equal `largeCategoryId` (prevent self-reference)

#### State Transitions

```text
[Create] ──► ACTIVE ──► [Delete (if no assets use this pair)] ──► DELETED
```

**Notes:**
- This is a pure join table with no additional business logic
- Deletion checks must verify no assets reference the specific (small, large) pair

---

### 4. Asset

Represents an individual investment holding with amount and category classification.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | string (UUID) | Required, Unique, Immutable | Auto-generated unique identifier |
| `name` | string | Required, 1-100 chars | Display name of the asset (e.g., "Vanguard S&P 500") |
| `amount` | number | Required, > 0 | Monetary value in base currency units |
| `smallCategoryId` | string (UUID) | Required, Foreign Key | References `SmallCategory.id` |
| `largeCategoryId` | string (UUID) | Required, Foreign Key | References `LargeCategory.id` |
| `createdAt` | string (ISO 8601) | Required, Immutable | Timestamp of creation |
| `updatedAt` | string (ISO 8601) | Required, Mutable | Timestamp of last modification |

#### Validation Rules

- **VR-A-001**: `name` must not be empty or whitespace-only
- **VR-A-002**: `name` length must be between 1 and 100 characters
- **VR-A-003**: Duplicate `name` values are allowed (users may have multiple positions in same asset)
- **VR-A-004**: `amount` must be a positive number > 0 (no zero or negative amounts) ➔ FR-010
- **VR-A-005**: `amount` must be a valid number (not NaN, not Infinity)
- **VR-A-006**: `amount` should support up to 2 decimal places for currency precision
- **VR-A-007**: `smallCategoryId` must reference an existing `SmallCategory` ➔ FR-008
- **VR-A-008**: `largeCategoryId` must reference an existing `LargeCategory` ➔ FR-008
- **VR-A-009**: A `CategoryAssociation` record must exist for the pair `(smallCategoryId, largeCategoryId)` ➔ FR-009
- **VR-A-010**: `id` must be a valid UUID v4 format
- **VR-A-011**: `updatedAt` must be >= `createdAt`

#### State Transitions

```text
[Create] ──► ACTIVE ──► [Edit] ──► ACTIVE
                 │
                 └──► [Delete] ──► DELETED
```

**Notes:**
- No soft-delete; deletion is permanent
- Editing updates the `updatedAt` timestamp
- When editing categories, must re-validate that the new (small, large) pair has an association

---

### 5. Settings

Application-level configuration for user preferences.

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `currencySymbol` | string | Required, 1-5 chars | Currency symbol to display (e.g., "$", "€", "¥") |

#### Validation Rules

- **VR-S-001**: `currencySymbol` must not be empty
- **VR-S-002**: `currencySymbol` length must be between 1 and 5 characters (supports multi-char symbols like "kr", "R$")
- **VR-S-003**: Default value is "$" if not set

#### State Transitions

```text
[Initialize] ──► DEFAULT ("$") ──► [User updates] ──► CUSTOM
                                         │
                                         └──► [User resets] ──► DEFAULT
```

---

## Derived/Calculated Entities

These are not persisted but calculated on-the-fly from the base entities.

### 6. LargeCategoryBreakdown

Aggregated view of portfolio allocation by large categories.

#### Calculated Fields

| Field | Type | Calculation | Description |
|-------|------|-------------|-------------|
| `categoryId` | string | From LargeCategory.id | Reference to large category |
| `categoryName` | string | From LargeCategory.name | Display name |
| `totalAmount` | number | SUM(Asset.amount WHERE Asset.largeCategoryId = categoryId) | Total value in this category |
| `percentage` | number | (totalAmount / portfolioTotal) * 100 | Percentage of total portfolio ➔ FR-013 |

#### Calculation Rules

- **CR-LC-001**: Percentages must sum to 100% (with ≤0.01% tolerance for rounding) ➔ SC-003
- **CR-LC-002**: Percentages rounded to 2 decimal places for display ➔ FR-027
- **CR-LC-003**: Only include categories that have at least one asset (zero-amount categories excluded)

### 7. SmallCategoryBreakdown

Aggregated view of portfolio allocation by small categories within large categories.

#### Calculated Fields

| Field | Type | Calculation | Description |
|-------|------|-------------|-------------|
| `smallCategoryId` | string | From SmallCategory.id | Reference to small category |
| `smallCategoryName` | string | From SmallCategory.name | Display name |
| `largeCategoryId` | string | From LargeCategory.id | Parent large category |
| `largeCategoryName` | string | From LargeCategory.name | Parent display name |
| `totalAmount` | number | SUM(Asset.amount WHERE Asset.smallCategoryId = scId AND Asset.largeCategoryId = lcId) | Total value |
| `percentageOfLarge` | number | (totalAmount / largeCategoryTotal) * 100 | Percentage within parent category ➔ FR-015 |
| `percentageOfPortfolio` | number | (totalAmount / portfolioTotal) * 100 | Percentage of total portfolio |

#### Calculation Rules

- **CR-SC-001**: Within each large category, small category percentages must sum to 100% (≤0.01% tolerance) ➔ FR-018
- **CR-SC-002**: Percentages rounded to 2 decimal places for display ➔ FR-027
- **CR-SC-003**: Only include small categories that have assets in the given large category context

### 8. PortfolioSummary

Top-level portfolio statistics.

#### Calculated Fields

| Field | Type | Calculation | Description |
|-------|------|-------------|-------------|
| `totalValue` | number | SUM(Asset.amount) | Total portfolio value ➔ FR-012 |
| `totalAssets` | number | COUNT(Asset) | Number of individual assets |
| `largeCategoryCount` | number | COUNT(DISTINCT Asset.largeCategoryId) | Number of unique large categories used |
| `smallCategoryCount` | number | COUNT(DISTINCT Asset.smallCategoryId) | Number of unique small categories used |

---

## Data Persistence Schema

### LocalStorage Structure

```json
{
  "portfolio_v1": {
    "largeCategories": [
      {
        "id": "uuid-v4-string",
        "name": "US Stocks",
        "createdAt": "2026-01-24T10:00:00.000Z"
      }
    ],
    "smallCategories": [
      {
        "id": "uuid-v4-string",
        "name": "S&P 500 Index",
        "createdAt": "2026-01-24T10:00:00.000Z"
      }
    ],
    "categoryAssociations": [
      {
        "smallCategoryId": "uuid-small",
        "largeCategoryId": "uuid-large",
        "createdAt": "2026-01-24T10:00:00.000Z"
      }
    ],
    "assets": [
      {
        "id": "uuid-v4-string",
        "name": "Vanguard S&P 500",
        "amount": 10000.50,
        "smallCategoryId": "uuid-small",
        "largeCategoryId": "uuid-large",
        "createdAt": "2026-01-24T10:00:00.000Z",
        "updatedAt": "2026-01-24T10:00:00.000Z"
      }
    ],
    "settings": {
      "currencySymbol": "$"
    }
  }
}
```

**Key**: `portfolio_v1` includes version suffix for future migration support.

---

## Import/Export Schema

### Export Format (JSON)

```json
{
  "version": "1.0",
  "exportDate": "2026-01-24T10:30:00.000Z",
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

#### Schema Validation (Zod)

```typescript
import { z } from 'zod';

const LargeCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  createdAt: z.string().datetime()
});

const SmallCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  createdAt: z.string().datetime()
});

const CategoryAssociationSchema = z.object({
  smallCategoryId: z.string().uuid(),
  largeCategoryId: z.string().uuid(),
  createdAt: z.string().datetime()
});

const AssetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  amount: z.number().positive().finite(),
  smallCategoryId: z.string().uuid(),
  largeCategoryId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

const SettingsSchema = z.object({
  currencySymbol: z.string().min(1).max(5)
});

const PortfolioDataSchema = z.object({
  largeCategories: z.array(LargeCategorySchema),
  smallCategories: z.array(SmallCategorySchema),
  categoryAssociations: z.array(CategoryAssociationSchema),
  assets: z.array(AssetSchema),
  settings: SettingsSchema
});

const ExportSchema = z.object({
  version: z.literal("1.0"),
  exportDate: z.string().datetime(),
  portfolio: PortfolioDataSchema
});
```

#### Import Validation Steps

1. **Schema Validation**: Validate against `ExportSchema` using Zod ➔ FR-030
2. **Referential Integrity**: Verify all foreign keys reference existing entities
3. **Association Validation**: Verify all asset (small, large) pairs have corresponding associations ➔ VR-A-009
4. **Duplicate Detection**: Check for ID conflicts with existing data ➔ FR-031
5. **Business Rules**: Validate uniqueness of category names, positive amounts, etc.

---

## Edge Cases and Error Handling

### Edge Case Matrix

| Scenario | Behavior | Related FR/VR |
|----------|----------|---------------|
| No categories defined | Block asset creation, show setup prompt | FR-026, VR-A-007/008 |
| Empty portfolio (no assets) | Display empty state with "Add first asset" CTA | FR-025 |
| Single asset in portfolio | Show 100% allocation to its categories | CR-LC-001 |
| Asset with zero/negative amount | Reject during validation | VR-A-004, FR-010 |
| Deleting category with assets | Block deletion, show error message listing affected assets | VR-LC-006, VR-SC-006, FR-006 |
| Removing last association for a small category that has assets | Block removal, show error message | VR-SC-008 |
| Duplicate category names | Block creation/edit, show error message | VR-LC-001, VR-SC-001, FR-004 |
| Category name >50 chars | Truncate input, show character count | VR-LC-003, VR-SC-003 |
| Importing file with invalid JSON | Show parse error, don't modify data | FR-030 |
| Importing file with schema violations | Show detailed Zod error messages, don't modify data | FR-030 |
| Importing data with ID conflicts | Merge strategy: skip existing IDs, prompt on name conflicts | FR-031 |
| Percentages not summing to 100% | Adjust largest category by residual amount (e.g., 0.01%) | CR-LC-001, SC-003 |
| Very long asset names in mobile view | Truncate with ellipsis, show full name on tap/hover | Responsive design |
| LocalStorage quota exceeded (unlikely) | Show error message, suggest export and fresh start | None (edge case) |

---

## Data Integrity Constraints

### Invariants (Must Always Be True)

1. **INV-001**: All `Asset.largeCategoryId` values must reference existing `LargeCategory.id`
2. **INV-002**: All `Asset.smallCategoryId` values must reference existing `SmallCategory.id`
3. **INV-003**: For every `Asset`, a `CategoryAssociation` exists with matching `(smallCategoryId, largeCategoryId)`
4. **INV-004**: No two `LargeCategory` records have the same `name` (case-insensitive)
5. **INV-005**: No two `SmallCategory` records have the same `name` (case-insensitive)
6. **INV-006**: No two `CategoryAssociation` records have the same `(smallCategoryId, largeCategoryId)` pair
7. **INV-007**: All `Asset.amount` values are positive finite numbers
8. **INV-008**: All `updatedAt` timestamps are >= corresponding `createdAt` timestamps

### Enforcement Strategy

- **Client-Side Validation**: All mutations (create/update/delete) validate against these invariants before persisting
- **Atomic Operations**: LocalStorage writes are wrapped in try-catch to ensure partial writes don't corrupt state
- **Data Repair**: On app startup, run integrity check and offer repair/reset if invariants are violated (e.g., orphaned references)

---

## Performance Considerations

### Calculation Caching

Given the performance goal of <100ms UI response time (Technical Context):

- **Derived Data**: Portfolio breakdowns should be memoized and only recalculated when assets/categories change
- **React Optimization**: Use `useMemo` for expensive calculations, `useCallback` for event handlers
- **LocalStorage Reads**: Minimize reads by loading all data once on app init, then operating on in-memory state

### Data Volume Scaling

For the scale constraint of up to 100 assets (SC-006):

- **Linear Complexity**: All calculations are O(n) or better, where n = number of assets
- **Grouping Operations**: Use efficient JavaScript `reduce()` or `Map` structures for aggregations
- **No N+1 Queries**: Since all data is in memory, no risk of database N+1 problems

---

## Summary

This data model provides:
- ✅ Clear entity definitions with comprehensive validation rules
- ✅ Support for many-to-many category relationships via association table
- ✅ Referential integrity constraints to prevent orphaned references
- ✅ Calculated entities for portfolio visualizations
- ✅ Typed schema validation for import/export (Zod)
- ✅ Edge case handling and error prevention
- ✅ Performance optimization strategies for client-side calculations

All entities align with the functional requirements (FR-001 through FR-034) and support the user stories defined in the feature specification.
