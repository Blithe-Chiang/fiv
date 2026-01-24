# Storage Contract

**Version**: 1.0
**Type**: Client-Side Data Storage Interface
**Last Updated**: 2026-01-24

## Overview

This contract defines the interface between the application logic and the browser localStorage persistence layer. It specifies the data structure, operations, error handling, and guarantees provided by the storage service.

---

## Contract Specification

### Storage Key

**Primary Key**: `portfolio_v1`

**Rationale**:
- Versioned key allows future schema migrations without data loss
- Single key reduces localStorage read/write operations
- Namespaced to avoid conflicts with other applications

---

## Data Structure Contract

### Root Schema

```typescript
interface StorageRoot {
  portfolio_v1: PortfolioData;
}

interface PortfolioData {
  largeCategories: LargeCategory[];
  smallCategories: SmallCategory[];
  categoryAssociations: CategoryAssociation[];
  assets: Asset[];
  settings: Settings;
}
```

### Entity Schemas

#### LargeCategory
```typescript
interface LargeCategory {
  id: string;              // UUID v4 format
  name: string;            // 1-50 characters, unique (case-insensitive)
  createdAt: string;       // ISO 8601 timestamp
}
```

#### SmallCategory
```typescript
interface SmallCategory {
  id: string;              // UUID v4 format
  name: string;            // 1-50 characters, unique (case-insensitive)
  createdAt: string;       // ISO 8601 timestamp
}
```

#### CategoryAssociation
```typescript
interface CategoryAssociation {
  smallCategoryId: string; // Foreign key to SmallCategory.id
  largeCategoryId: string; // Foreign key to LargeCategory.id
  createdAt: string;       // ISO 8601 timestamp
}
```
**Constraint**: `(smallCategoryId, largeCategoryId)` pair must be unique

#### Asset
```typescript
interface Asset {
  id: string;              // UUID v4 format
  name: string;            // 1-100 characters
  amount: number;          // Positive finite number > 0
  smallCategoryId: string; // Foreign key to SmallCategory.id
  largeCategoryId: string; // Foreign key to LargeCategory.id
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp (>= createdAt)
}
```

#### Settings
```typescript
interface Settings {
  currencySymbol: string;  // 1-5 characters, default "$"
}
```

---

## Storage Service Interface

### Operations Contract

```typescript
interface StorageService {
  // Initialize/Read Operations
  initialize(): Promise<PortfolioData>;
  getData(): PortfolioData | null;

  // Category Operations
  createLargeCategory(category: Omit<LargeCategory, 'id' | 'createdAt'>): Promise<LargeCategory>;
  updateLargeCategory(id: string, updates: Partial<Pick<LargeCategory, 'name'>>): Promise<LargeCategory>;
  deleteLargeCategory(id: string): Promise<void>;
  getLargeCategories(): LargeCategory[];

  createSmallCategory(category: Omit<SmallCategory, 'id' | 'createdAt'>): Promise<SmallCategory>;
  updateSmallCategory(id: string, updates: Partial<Pick<SmallCategory, 'name'>>): Promise<SmallCategory>;
  deleteSmallCategory(id: string): Promise<void>;
  getSmallCategories(): SmallCategory[];

  // Association Operations
  createAssociation(association: Omit<CategoryAssociation, 'createdAt'>): Promise<CategoryAssociation>;
  deleteAssociation(smallCategoryId: string, largeCategoryId: string): Promise<void>;
  getAssociations(): CategoryAssociation[];
  getAssociationsForSmallCategory(smallCategoryId: string): CategoryAssociation[];
  getAssociationsForLargeCategory(largeCategoryId: string): CategoryAssociation[];
  associationExists(smallCategoryId: string, largeCategoryId: string): boolean;

  // Asset Operations
  createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset>;
  updateAsset(id: string, updates: Partial<Omit<Asset, 'id' | 'createdAt'>>): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
  getAssets(): Asset[];
  getAssetsByLargeCategory(largeCategoryId: string): Asset[];
  getAssetsBySmallCategory(smallCategoryId: string): Asset[];

  // Settings Operations
  updateSettings(settings: Partial<Settings>): Promise<Settings>;
  getSettings(): Settings;

  // Bulk Operations
  importData(data: PortfolioData, strategy: 'merge' | 'replace'): Promise<ImportResult>;
  exportData(): PortfolioData;
  clearAllData(): Promise<void>;
}
```

### Return Types

```typescript
interface ImportResult {
  success: boolean;
  imported: {
    largeCategories: number;
    smallCategories: number;
    associations: number;
    assets: number;
  };
  skipped: {
    largeCategories: number;
    smallCategories: number;
    associations: number;
    assets: number;
  };
  conflicts: Array<{
    type: 'category' | 'asset';
    field: string;
    existingValue: string;
    importedValue: string;
  }>;
}
```

---

## Error Contract

### Error Types

```typescript
enum StorageErrorCode {
  // Validation Errors (4xx-style)
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  DUPLICATE_NAME = 'DUPLICATE_NAME',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  ASSOCIATION_NOT_FOUND = 'ASSOCIATION_NOT_FOUND',
  ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
  DELETION_BLOCKED = 'DELETION_BLOCKED',

  // Storage Errors (5xx-style)
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  PARSE_ERROR = 'PARSE_ERROR',
  WRITE_FAILED = 'WRITE_FAILED',
  INTEGRITY_VIOLATION = 'INTEGRITY_VIOLATION',
}

class StorageError extends Error {
  code: StorageErrorCode;
  details?: Record<string, any>;

  constructor(code: StorageErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'StorageError';
    this.code = code;
    this.details = details;
  }
}
```

### Error Scenarios

| Operation | Error Code | Trigger Condition | Example |
|-----------|------------|-------------------|---------|
| `createLargeCategory` | `DUPLICATE_NAME` | Category name already exists (case-insensitive) | "US Stocks" vs "us stocks" |
| `deleteLargeCategory` | `DELETION_BLOCKED` | Assets reference this category | "Cannot delete 'US Stocks' - 5 assets use this category" |
| `deleteAssociation` | `DELETION_BLOCKED` | Assets use this (small, large) pair | "Cannot remove association - 3 assets use this combination" |
| `createAsset` | `INVALID_REFERENCE` | smallCategoryId doesn't exist | "Small category 'abc-123' not found" |
| `createAsset` | `ASSOCIATION_NOT_FOUND` | No association for (small, large) pair | "No association between 'Bonds' and 'US Stocks'" |
| `updateAsset` | `VALIDATION_FAILED` | Amount <= 0 | "Amount must be positive" |
| `importData` | `PARSE_ERROR` | Invalid JSON format | "Expected valid JSON" |
| `importData` | `VALIDATION_FAILED` | Schema validation fails | Zod validation errors |
| Any write operation | `QUOTA_EXCEEDED` | localStorage quota exceeded (rare) | "Storage quota exceeded" |
| Any operation | `INTEGRITY_VIOLATION` | Data invariants violated on read | "Orphaned asset reference detected" |

---

## Guarantees and Invariants

### Data Integrity Guarantees

1. **Atomicity**: All write operations are atomic - either fully succeed or fully fail with no partial writes
2. **Referential Integrity**: All foreign key references are validated before persistence
3. **Uniqueness**: Category names are unique (case-insensitive) within their type
4. **Association Validation**: Assets cannot reference (small, large) pairs without valid associations
5. **Positive Amounts**: Asset amounts are always positive finite numbers

### Performance Guarantees

1. **Read Operations**: All read operations complete in <10ms (in-memory after initial load)
2. **Write Operations**: All write operations complete in <50ms (localStorage write + update in-memory state)
3. **Import Operations**: Import of 100 assets completes in <500ms

### Consistency Guarantees

1. **Strong Consistency**: All reads reflect the most recent write (no caching staleness)
2. **Crash Recovery**: On app reload, data integrity check runs and offers repair if invariants violated
3. **Schema Validation**: All data passing through storage service is validated against Zod schemas

---

## Initialization Contract

### Startup Sequence

```typescript
async function initialize(): Promise<PortfolioData> {
  // 1. Attempt to read from localStorage
  const raw = localStorage.getItem('portfolio_v1');

  // 2. If no data exists, return empty initialized structure
  if (!raw) {
    return createEmptyPortfolio();
  }

  // 3. Parse and validate existing data
  try {
    const parsed = JSON.parse(raw);
    const validated = PortfolioDataSchema.parse(parsed);

    // 4. Run integrity checks
    const integrityReport = checkIntegrity(validated);
    if (!integrityReport.passed) {
      throw new StorageError(
        StorageErrorCode.INTEGRITY_VIOLATION,
        'Data integrity check failed',
        integrityReport.violations
      );
    }

    // 5. Return validated data
    return validated;
  } catch (error) {
    // 6. On error, offer repair/reset to user
    throw error;
  }
}

function createEmptyPortfolio(): PortfolioData {
  return {
    largeCategories: [],
    smallCategories: [],
    categoryAssociations: [],
    assets: [],
    settings: {
      currencySymbol: '$'
    }
  };
}
```

### Integrity Check Rules

```typescript
interface IntegrityReport {
  passed: boolean;
  violations: Array<{
    code: string;
    message: string;
    affectedIds: string[];
  }>;
}

function checkIntegrity(data: PortfolioData): IntegrityReport {
  const violations = [];

  // Check for orphaned asset references
  for (const asset of data.assets) {
    if (!data.smallCategories.find(c => c.id === asset.smallCategoryId)) {
      violations.push({
        code: 'ORPHANED_SMALL_CATEGORY',
        message: `Asset references non-existent small category`,
        affectedIds: [asset.id]
      });
    }

    if (!data.largeCategories.find(c => c.id === asset.largeCategoryId)) {
      violations.push({
        code: 'ORPHANED_LARGE_CATEGORY',
        message: `Asset references non-existent large category`,
        affectedIds: [asset.id]
      });
    }

    const associationExists = data.categoryAssociations.some(
      a => a.smallCategoryId === asset.smallCategoryId &&
           a.largeCategoryId === asset.largeCategoryId
    );
    if (!associationExists) {
      violations.push({
        code: 'MISSING_ASSOCIATION',
        message: `Asset uses category pair without association`,
        affectedIds: [asset.id]
      });
    }
  }

  // Check for duplicate category names
  const largeCategoryNames = data.largeCategories.map(c => c.name.toLowerCase());
  if (new Set(largeCategoryNames).size !== largeCategoryNames.length) {
    violations.push({
      code: 'DUPLICATE_LARGE_CATEGORY_NAME',
      message: 'Duplicate large category names detected',
      affectedIds: []
    });
  }

  const smallCategoryNames = data.smallCategories.map(c => c.name.toLowerCase());
  if (new Set(smallCategoryNames).size !== smallCategoryNames.length) {
    violations.push({
      code: 'DUPLICATE_SMALL_CATEGORY_NAME',
      message: 'Duplicate small category names detected',
      affectedIds: []
    });
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

---

## Versioning and Migration

### Version History

- **v1.0** (2026-01-24): Initial schema with categories, associations, assets, settings

### Future Migration Path

If schema changes in future versions:

```typescript
async function migrateStorage(currentVersion: string): Promise<void> {
  // Example migration from v1 to v2
  if (currentVersion === '1.0') {
    const v1Data = localStorage.getItem('portfolio_v1');
    const v2Data = transformV1ToV2(JSON.parse(v1Data));
    localStorage.setItem('portfolio_v2', JSON.stringify(v2Data));
    // Keep v1 data for rollback capability
  }
}
```

### Backward Compatibility

- No breaking changes allowed within a major version (1.x)
- New optional fields can be added (default values provided)
- Removal of fields requires major version bump (v1 → v2)

---

## Testing Contract

### Unit Test Requirements

Storage service implementation MUST pass these test scenarios:

1. **CRUD Operations**: Create, read, update, delete for all entity types
2. **Validation**: All validation rules (VR-* from data-model.md) enforced
3. **Error Handling**: All error codes triggered and handled correctly
4. **Referential Integrity**: Foreign key validations prevent orphaned references
5. **Association Validation**: Assets cannot use invalid (small, large) pairs
6. **Uniqueness**: Duplicate category names rejected
7. **Import/Export**: Round-trip export → import produces identical data
8. **Merge Strategy**: Import with existing data correctly merges/skips
9. **Integrity Checks**: Startup integrity check detects all violation types
10. **Performance**: Read <10ms, write <50ms, import 100 assets <500ms

### Integration Test Requirements

1. **Full User Flows**: Each user story from spec.md exercised end-to-end
2. **Browser Compatibility**: Test on Chrome, Safari, Firefox, Edge (latest versions)
3. **LocalStorage Limits**: Test behavior approaching 5MB limit (graceful degradation)
4. **Concurrency**: Multiple rapid writes don't corrupt state (unlikely in single-user app, but test anyway)

---

## Summary

This storage contract provides:
- ✅ Well-defined interface for all storage operations
- ✅ Comprehensive error handling with specific error codes
- ✅ Data integrity guarantees and validation rules
- ✅ Performance benchmarks for operations
- ✅ Initialization and integrity checking procedures
- ✅ Versioning strategy for future schema evolution
- ✅ Clear testing requirements

Implementation of this contract ensures reliable, type-safe persistence for the portfolio application.
