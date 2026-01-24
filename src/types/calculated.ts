/**
 * Derived/calculated types - computed from base entities
 * These are not persisted but calculated on-the-fly
 */

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
