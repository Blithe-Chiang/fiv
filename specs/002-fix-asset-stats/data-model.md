# Data Model: Fix Asset Statistics Refresh

## Entities

### Asset
- **Purpose**: Individual investment holding used in statistics aggregation.
- **Fields**:
  - `id` (string, UUID)
  - `name` (string, 1-100 chars)
  - `amount` (number, > 0)
  - `smallCategoryId` (string, foreign key)
  - `largeCategoryId` (string, foreign key)
  - `createdAt` (string, ISO 8601)
  - `updatedAt` (string, ISO 8601)

### LargeCategory
- **Purpose**: High-level asset grouping.
- **Fields**:
  - `id` (string, UUID)
  - `name` (string, 1-50 chars, unique case-insensitive)
  - `createdAt` (string, ISO 8601)

### SmallCategory
- **Purpose**: Sub-category within large categories.
- **Fields**:
  - `id` (string, UUID)
  - `name` (string, 1-50 chars, unique case-insensitive)
  - `createdAt` (string, ISO 8601)

### CategoryAssociation
- **Purpose**: Links small categories to large categories (many-to-many).
- **Fields**:
  - `smallCategoryId` (string, foreign key)
  - `largeCategoryId` (string, foreign key)
  - `createdAt` (string, ISO 8601)

### StatisticsSummary
- **Purpose**: Derived aggregates used in the UI (not persisted).
- **Fields**:
  - `totalValue` (number)
  - `assetCount` (number)
  - `totalsByLargeCategory` (map: largeCategoryId -> number)
  - `totalsBySmallCategory` (map: smallCategoryId -> number)

## Relationships

- **Asset** belongs to one **LargeCategory** and one **SmallCategory**.
- **SmallCategory** can associate with multiple **LargeCategory** entries via **CategoryAssociation**.

## Validation Rules

- Asset amounts must be positive numbers.
- Category names must be unique (case-insensitive) within their category type.

## State Transitions

- Asset edits move through: `editing` -> `saved` or `canceled` (UI state), which drives live statistics updates and final re-validation.
