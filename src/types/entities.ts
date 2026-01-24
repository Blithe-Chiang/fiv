/**
 * Core entity types for the Asset Portfolio Visualization application
 * These types represent the persisted data structures
 */

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
