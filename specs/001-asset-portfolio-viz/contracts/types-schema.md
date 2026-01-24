# TypeScript Type Definitions Contract

**Version**: 1.0
**Purpose**: Type-level contracts for compile-time type safety
**Last Updated**: 2026-01-24

## Overview

This document defines the TypeScript type definitions that serve as compile-time contracts for the application. These types ensure type safety across the codebase and serve as the source of truth for data structures.

---

## Core Entity Types

```typescript
/**
 * Large Category - Represents a major asset class grouping
 * @example { id: "uuid", name: "US Stocks", createdAt: "2026-01-24T10:00:00Z" }
 */
export interface LargeCategory {
  /** UUID v4 unique identifier */
  id: string;
  /** Display name, 1-50 characters, unique (case-insensitive) */
  name: string;
  /** ISO 8601 timestamp of creation */
  createdAt: string;
}

/**
 * Small Category - Represents a sub-classification within large categories
 * @example { id: "uuid", name: "S&P 500 Index", createdAt: "2026-01-24T10:00:00Z" }
 */
export interface SmallCategory {
  /** UUID v4 unique identifier */
  id: string;
  /** Display name, 1-50 characters, unique (case-insensitive) */
  name: string;
  /** ISO 8601 timestamp of creation */
  createdAt: string;
}

/**
 * Category Association - Links SmallCategory to LargeCategory (many-to-many)
 * @example { smallCategoryId: "uuid-1", largeCategoryId: "uuid-2", createdAt: "..." }
 */
export interface CategoryAssociation {
  /** Foreign key to SmallCategory.id */
  smallCategoryId: string;
  /** Foreign key to LargeCategory.id */
  largeCategoryId: string;
  /** ISO 8601 timestamp of association creation */
  createdAt: string;
}

/**
 * Asset - Represents an individual investment holding
 * @example {
 *   id: "uuid",
 *   name: "Vanguard S&P 500",
 *   amount: 10000.50,
 *   smallCategoryId: "uuid-small",
 *   largeCategoryId: "uuid-large",
 *   createdAt: "...",
 *   updatedAt: "..."
 * }
 */
export interface Asset {
  /** UUID v4 unique identifier */
  id: string;
  /** Display name, 1-100 characters */
  name: string;
  /** Monetary value, must be positive > 0 */
  amount: number;
  /** Foreign key to SmallCategory.id */
  smallCategoryId: string;
  /** Foreign key to LargeCategory.id */
  largeCategoryId: string;
  /** ISO 8601 timestamp of creation */
  createdAt: string;
  /** ISO 8601 timestamp of last modification */
  updatedAt: string;
}

/**
 * Settings - Application-level configuration
 * @example { currencySymbol: "$" }
 */
export interface Settings {
  /** Currency symbol to display, 1-5 characters */
  currencySymbol: string;
}

/**
 * Portfolio Data - Complete portfolio structure stored in localStorage
 */
export interface PortfolioData {
  largeCategories: LargeCategory[];
  smallCategories: SmallCategory[];
  categoryAssociations: CategoryAssociation[];
  assets: Asset[];
  settings: Settings;
}
```

---

## Derived/Calculated Types

```typescript
/**
 * Large Category Breakdown - Aggregated allocation by large category
 */
export interface LargeCategoryBreakdown {
  /** Reference to LargeCategory.id */
  categoryId: string;
  /** Display name from LargeCategory.name */
  categoryName: string;
  /** Total amount of all assets in this category */
  totalAmount: number;
  /** Percentage of total portfolio (0-100, 2 decimal places) */
  percentage: number;
}

/**
 * Small Category Breakdown - Aggregated allocation by small category within large category
 */
export interface SmallCategoryBreakdown {
  /** Reference to SmallCategory.id */
  smallCategoryId: string;
  /** Display name from SmallCategory.name */
  smallCategoryName: string;
  /** Reference to LargeCategory.id (parent context) */
  largeCategoryId: string;
  /** Display name from LargeCategory.name (parent context) */
  largeCategoryName: string;
  /** Total amount of assets in this small category under this large category */
  totalAmount: number;
  /** Percentage within parent large category (0-100, 2 decimal places) */
  percentageOfLarge: number;
  /** Percentage of total portfolio (0-100, 2 decimal places) */
  percentageOfPortfolio: number;
}

/**
 * Portfolio Summary - Top-level statistics
 */
export interface PortfolioSummary {
  /** Total portfolio value (sum of all asset amounts) */
  totalValue: number;
  /** Number of individual assets */
  totalAssets: number;
  /** Number of unique large categories used */
  largeCategoryCount: number;
  /** Number of unique small categories used */
  smallCategoryCount: number;
}
```

---

## Form Input Types

```typescript
/**
 * Form data for creating a new large category
 */
export interface CreateLargeCategoryInput {
  name: string;
}

/**
 * Form data for creating a new small category
 */
export interface CreateSmallCategoryInput {
  name: string;
}

/**
 * Form data for creating a category association
 */
export interface CreateAssociationInput {
  smallCategoryId: string;
  largeCategoryId: string;
}

/**
 * Form data for creating a new asset
 */
export interface CreateAssetInput {
  name: string;
  amount: number;
  smallCategoryId: string;
  largeCategoryId: string;
}

/**
 * Form data for updating an existing asset
 */
export interface UpdateAssetInput {
  name?: string;
  amount?: number;
  smallCategoryId?: string;
  largeCategoryId?: string;
}

/**
 * Form data for updating settings
 */
export interface UpdateSettingsInput {
  currencySymbol?: string;
}
```

---

## Import/Export Types

```typescript
/**
 * Export file structure
 */
export interface ExportFile {
  /** Schema version for future migrations */
  version: string;
  /** ISO 8601 timestamp of export */
  exportDate: string;
  /** Portfolio data snapshot */
  portfolio: PortfolioData;
}

/**
 * Import result report
 */
export interface ImportResult {
  /** Overall success status */
  success: boolean;
  /** Count of successfully imported entities */
  imported: {
    largeCategories: number;
    smallCategories: number;
    associations: number;
    assets: number;
  };
  /** Count of skipped entities (duplicates) */
  skipped: {
    largeCategories: number;
    smallCategories: number;
    associations: number;
    assets: number;
  };
  /** List of conflicts requiring user resolution */
  conflicts: ImportConflict[];
}

/**
 * Conflict detected during import
 */
export interface ImportConflict {
  /** Type of entity in conflict */
  type: 'largeCategory' | 'smallCategory' | 'asset';
  /** Field causing the conflict (typically 'name') */
  field: string;
  /** Value in existing data */
  existingValue: string;
  /** Value in imported data */
  importedValue: string;
  /** ID of existing entity */
  existingId: string;
  /** ID in imported data */
  importedId: string;
}

/**
 * Import strategy option
 */
export type ImportStrategy = 'merge' | 'replace';
```

---

## Error Types

```typescript
/**
 * Storage error codes
 */
export enum StorageErrorCode {
  // Validation Errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  DUPLICATE_NAME = 'DUPLICATE_NAME',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  ASSOCIATION_NOT_FOUND = 'ASSOCIATION_NOT_FOUND',
  ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
  DELETION_BLOCKED = 'DELETION_BLOCKED',

  // Storage Errors
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  PARSE_ERROR = 'PARSE_ERROR',
  WRITE_FAILED = 'WRITE_FAILED',
  INTEGRITY_VIOLATION = 'INTEGRITY_VIOLATION',
}

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
  code: StorageErrorCode;
  details?: Record<string, any>;

  constructor(code: StorageErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'StorageError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Type guard for StorageError
 */
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}
```

---

## Validation Result Types

```typescript
/**
 * Validation result for entity operations
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** List of validation errors (empty if valid) */
  errors: ValidationError[];
}

/**
 * Individual validation error
 */
export interface ValidationError {
  /** Field that failed validation */
  field: string;
  /** Error message */
  message: string;
  /** Validation rule code (e.g., VR-A-001) */
  code: string;
}
```

---

## UI State Types

```typescript
/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic async operation state
 */
export interface AsyncState<T> {
  status: LoadingState;
  data?: T;
  error?: string;
}

/**
 * Form state for category/asset forms
 */
export interface FormState<T> {
  /** Current form values */
  values: T;
  /** Field-level errors */
  errors: Partial<Record<keyof T, string>>;
  /** Whether form has been submitted */
  submitted: boolean;
  /** Whether form is currently submitting */
  submitting: boolean;
}

/**
 * View mode for visualizations
 */
export type VisualizationMode = 'table' | 'chart';

/**
 * Chart type for visualizations
 */
export type ChartType = 'pie' | 'bar';
```

---

## Utility Types

```typescript
/**
 * Omit standard auto-generated fields from entity creation
 */
export type CreateInput<T extends { id: string; createdAt: string }> = Omit<T, 'id' | 'createdAt'>;

/**
 * Omit immutable fields from entity updates
 */
export type UpdateInput<T extends { id: string; createdAt: string }> = Partial<Omit<T, 'id' | 'createdAt'>>;

/**
 * Extract only mutable fields from entity
 */
export type MutableFields<T extends { id: string; createdAt: string }> = Omit<T, 'id' | 'createdAt'>;

/**
 * Make specific fields required in a partial type
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Category with associated relationships (for UI display)
 */
export interface SmallCategoryWithAssociations extends SmallCategory {
  /** Array of large category IDs this small category is associated with */
  associatedLargeCategoryIds: string[];
}

/**
 * Asset with resolved category names (for UI display)
 */
export interface AssetWithCategories extends Asset {
  /** Resolved small category name */
  smallCategoryName: string;
  /** Resolved large category name */
  largeCategoryName: string;
}
```

---

## React Component Props Types

```typescript
/**
 * Props for Asset form component
 */
export interface AssetFormProps {
  /** Initial values (undefined for create, Asset for edit) */
  initialValues?: Asset;
  /** Available small categories for selection */
  smallCategories: SmallCategory[];
  /** Available large categories for selection */
  largeCategories: LargeCategory[];
  /** Category associations to validate selections */
  associations: CategoryAssociation[];
  /** Current currency symbol */
  currencySymbol: string;
  /** Submit handler */
  onSubmit: (data: CreateAssetInput | UpdateAssetInput) => Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
}

/**
 * Props for Category form component
 */
export interface CategoryFormProps<T extends LargeCategory | SmallCategory> {
  /** Form title */
  title: string;
  /** Initial values (undefined for create, category for edit) */
  initialValues?: T;
  /** Submit handler */
  onSubmit: (data: CreateInput<T>) => Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
}

/**
 * Props for Association manager component
 */
export interface AssociationManagerProps {
  /** Small category to manage associations for */
  smallCategory: SmallCategory;
  /** All available large categories */
  largeCategories: LargeCategory[];
  /** Current associations for this small category */
  currentAssociations: CategoryAssociation[];
  /** Handler to add association */
  onAdd: (largeCategoryId: string) => Promise<void>;
  /** Handler to remove association */
  onRemove: (largeCategoryId: string) => Promise<void>;
}

/**
 * Props for Breakdown visualization component
 */
export interface BreakdownVisualizationProps {
  /** Breakdown data to display */
  data: LargeCategoryBreakdown[] | SmallCategoryBreakdown[];
  /** Display mode */
  mode: VisualizationMode;
  /** Chart type (only used if mode is 'chart') */
  chartType: ChartType;
  /** Currency symbol for formatting */
  currencySymbol: string;
  /** Title for the visualization */
  title: string;
}

/**
 * Props for Export/Import component
 */
export interface ExportImportProps {
  /** Handler for export action */
  onExport: () => ExportFile;
  /** Handler for import action */
  onImport: (file: File) => Promise<ImportResult>;
}
```

---

## Type Guards

```typescript
/**
 * Type guard to check if breakdown is LargeCategoryBreakdown
 */
export function isLargeCategoryBreakdown(
  breakdown: LargeCategoryBreakdown | SmallCategoryBreakdown
): breakdown is LargeCategoryBreakdown {
  return 'categoryId' in breakdown && !('smallCategoryId' in breakdown);
}

/**
 * Type guard to check if breakdown is SmallCategoryBreakdown
 */
export function isSmallCategoryBreakdown(
  breakdown: LargeCategoryBreakdown | SmallCategoryBreakdown
): breakdown is SmallCategoryBreakdown {
  return 'smallCategoryId' in breakdown;
}

/**
 * Type guard to check if value is a valid Asset
 */
export function isValidAsset(value: unknown): value is Asset {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'amount' in value &&
    'smallCategoryId' in value &&
    'largeCategoryId' in value &&
    typeof (value as Asset).amount === 'number' &&
    (value as Asset).amount > 0
  );
}
```

---

## Constants

```typescript
/**
 * Validation constraints
 */
export const VALIDATION_CONSTRAINTS = {
  CATEGORY_NAME_MIN_LENGTH: 1,
  CATEGORY_NAME_MAX_LENGTH: 50,
  ASSET_NAME_MIN_LENGTH: 1,
  ASSET_NAME_MAX_LENGTH: 100,
  CURRENCY_SYMBOL_MIN_LENGTH: 1,
  CURRENCY_SYMBOL_MAX_LENGTH: 5,
  ASSET_AMOUNT_MIN: 0,
  PERCENTAGE_DECIMAL_PLACES: 2,
  AMOUNT_DECIMAL_PLACES: 2,
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  CURRENCY_SYMBOL: '$',
  PORTFOLIO_VERSION: '1.0',
  STORAGE_KEY: 'portfolio_v1',
} as const;

/**
 * Performance targets
 */
export const PERFORMANCE_TARGETS = {
  UI_RESPONSE_TIME_MS: 100,
  STORAGE_READ_TIME_MS: 10,
  STORAGE_WRITE_TIME_MS: 50,
  IMPORT_100_ASSETS_MS: 500,
} as const;
```

---

## Usage Examples

```typescript
// Example 1: Creating a new asset with type safety
const newAsset: CreateAssetInput = {
  name: 'Vanguard S&P 500',
  amount: 10000.50,
  smallCategoryId: 'uuid-small',
  largeCategoryId: 'uuid-large',
};

// Example 2: Updating an asset (all fields optional)
const updates: UpdateAssetInput = {
  amount: 15000.00,
};

// Example 3: Type-safe form state
const [formState, setFormState] = useState<FormState<CreateAssetInput>>({
  values: {
    name: '',
    amount: 0,
    smallCategoryId: '',
    largeCategoryId: '',
  },
  errors: {},
  submitted: false,
  submitting: false,
});

// Example 4: Async state for loading portfolio
const [portfolioState, setPortfolioState] = useState<AsyncState<PortfolioData>>({
  status: 'idle',
});

// Example 5: Type guard usage
function handleBreakdown(breakdown: LargeCategoryBreakdown | SmallCategoryBreakdown) {
  if (isSmallCategoryBreakdown(breakdown)) {
    console.log(`Small category: ${breakdown.smallCategoryName}`);
  } else {
    console.log(`Large category: ${breakdown.categoryName}`);
  }
}
```

---

## Summary

This type contract provides:
- ✅ Comprehensive TypeScript types for all entities and operations
- ✅ Form input types with proper field optionality
- ✅ Import/export types with conflict resolution
- ✅ Error types with specific error codes
- ✅ UI state types for React components
- ✅ Utility types for common patterns (CreateInput, UpdateInput, etc.)
- ✅ Type guards for runtime type checking
- ✅ Constants for validation and configuration

All types align with the data model (data-model.md) and storage contract (storage-contract.md) to ensure consistency across the application.
