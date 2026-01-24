/**
 * Calculation services for portfolio breakdowns and aggregations
 * Implements all calculation rules (CR-LC-*, CR-SC-*)
 */

import { Asset, LargeCategory, SmallCategory } from '@/types/entities';
import {
  LargeCategoryBreakdown,
  SmallCategoryBreakdown,
  PortfolioSummary,
} from '@/types/calculated';
import { VALIDATION_CONSTRAINTS } from '@/types/constants';

/**
 * Calculate large category breakdown with percentages
 * CR-LC-001: Percentages must sum to 100% (with ≤0.01% tolerance)
 * CR-LC-002: Percentages rounded to 2 decimal places
 * CR-LC-003: Only include categories with assets
 */
export function calculateLargeCategoryBreakdown(
  assets: Asset[],
  largeCategories: LargeCategory[]
): LargeCategoryBreakdown[] {
  if (assets.length === 0) {
    return [];
  }

  // Calculate total portfolio value
  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

  if (totalValue === 0) {
    return [];
  }

  // Group assets by large category and calculate totals
  const categoryTotals = new Map<string, number>();
  for (const asset of assets) {
    const current = categoryTotals.get(asset.largeCategoryId) || 0;
    categoryTotals.set(asset.largeCategoryId, current + asset.amount);
  }

  // Create breakdown objects
  const breakdowns: LargeCategoryBreakdown[] = [];
  for (const [categoryId, totalAmount] of categoryTotals.entries()) {
    const category = largeCategories.find((c) => c.id === categoryId);
    if (!category) continue; // Skip if category not found

    const percentage = (totalAmount / totalValue) * 100;

    breakdowns.push({
      categoryId,
      categoryName: category.name,
      totalAmount,
      percentage: roundToDecimalPlaces(percentage, VALIDATION_CONSTRAINTS.PERCENTAGE_DECIMAL_PLACES),
    });
  }

  // Adjust percentages to ensure they sum to 100%
  adjustPercentagesToSum100(breakdowns);

  return breakdowns;
}

/**
 * Calculate small category breakdown with nested percentages
 * CR-SC-001: Within each large category, small category percentages must sum to 100%
 * CR-SC-002: Percentages rounded to 2 decimal places
 * CR-SC-003: Only include small categories with assets in the given large category context
 */
export function calculateSmallCategoryBreakdown(
  assets: Asset[],
  largeCategories: LargeCategory[],
  smallCategories: SmallCategory[]
): SmallCategoryBreakdown[] {
  if (assets.length === 0) {
    return [];
  }

  // Calculate total portfolio value
  const totalPortfolioValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

  if (totalPortfolioValue === 0) {
    return [];
  }

  // Group assets by (smallCategory, largeCategory) pair
  const pairKey = (smallId: string, largeId: string) => `${smallId}:${largeId}`;
  const pairTotals = new Map<string, { smallId: string; largeId: string; amount: number }>();

  for (const asset of assets) {
    const key = pairKey(asset.smallCategoryId, asset.largeCategoryId);
    const current = pairTotals.get(key);
    if (current) {
      current.amount += asset.amount;
    } else {
      pairTotals.set(key, {
        smallId: asset.smallCategoryId,
        largeId: asset.largeCategoryId,
        amount: asset.amount,
      });
    }
  }

  // Calculate large category totals for percentage calculations
  const largeCategoryTotals = new Map<string, number>();
  for (const asset of assets) {
    const current = largeCategoryTotals.get(asset.largeCategoryId) || 0;
    largeCategoryTotals.set(asset.largeCategoryId, current + asset.amount);
  }

  // Create breakdown objects
  const breakdowns: SmallCategoryBreakdown[] = [];
  for (const [_, pair] of pairTotals.entries()) {
    const smallCategory = smallCategories.find((c) => c.id === pair.smallId);
    const largeCategory = largeCategories.find((c) => c.id === pair.largeId);
    if (!smallCategory || !largeCategory) continue;

    const largeCategoryTotal = largeCategoryTotals.get(pair.largeId) || 0;
    const percentageOfLarge = (pair.amount / largeCategoryTotal) * 100;
    const percentageOfPortfolio = (pair.amount / totalPortfolioValue) * 100;

    breakdowns.push({
      smallCategoryId: pair.smallId,
      smallCategoryName: smallCategory.name,
      largeCategoryId: pair.largeId,
      largeCategoryName: largeCategory.name,
      totalAmount: pair.amount,
      percentageOfLarge: roundToDecimalPlaces(
        percentageOfLarge,
        VALIDATION_CONSTRAINTS.PERCENTAGE_DECIMAL_PLACES
      ),
      percentageOfPortfolio: roundToDecimalPlaces(
        percentageOfPortfolio,
        VALIDATION_CONSTRAINTS.PERCENTAGE_DECIMAL_PLACES
      ),
    });
  }

  // Adjust percentages within each large category to sum to 100%
  const breakdownsByLarge = new Map<string, SmallCategoryBreakdown[]>();
  for (const breakdown of breakdowns) {
    const existing = breakdownsByLarge.get(breakdown.largeCategoryId) || [];
    existing.push(breakdown);
    breakdownsByLarge.set(breakdown.largeCategoryId, existing);
  }

  for (const [_, groupBreakdowns] of breakdownsByLarge.entries()) {
    adjustPercentagesToSum100(groupBreakdowns, 'percentageOfLarge');
  }

  return breakdowns;
}

/**
 * Calculate portfolio summary statistics
 */
export function calculatePortfolioSummary(
  assets: Asset[]
): PortfolioSummary {
  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

  const uniqueLargeCategoryIds = new Set(assets.map((a) => a.largeCategoryId));
  const uniqueSmallCategoryIds = new Set(assets.map((a) => a.smallCategoryId));

  return {
    totalValue,
    totalAssets: assets.length,
    largeCategoryCount: uniqueLargeCategoryIds.size,
    smallCategoryCount: uniqueSmallCategoryIds.size,
  };
}

/**
 * Round a number to specified decimal places
 */
export function roundToDecimalPlaces(value: number, decimalPlaces: number): number {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Adjust percentages in a breakdown array to ensure they sum to 100%
 * This handles rounding errors by adjusting the largest category
 *
 * @param breakdowns Array of breakdown objects with percentage field
 * @param percentageField Name of the percentage field to adjust (default: 'percentage')
 */
function adjustPercentagesToSum100<T extends Record<string, any>>(
  breakdowns: T[],
  percentageField: string = 'percentage'
): void {
  if (breakdowns.length === 0) {
    return;
  }

  // Calculate current sum
  const currentSum = breakdowns.reduce((sum, b) => sum + (b[percentageField] as number), 0);

  // Calculate residual (difference from 100%)
  const residual = roundToDecimalPlaces(
    100 - currentSum,
    VALIDATION_CONSTRAINTS.PERCENTAGE_DECIMAL_PLACES
  );

  // If residual is within tolerance (≤0.01%), adjust the largest category
  if (Math.abs(residual) > 0 && Math.abs(residual) <= 0.01) {
    // Find the breakdown with the largest percentage
    let largestIndex = 0;
    let largestValue = breakdowns[0][percentageField] as number;

    for (let i = 1; i < breakdowns.length; i++) {
      const value = breakdowns[i][percentageField] as number;
      if (value > largestValue) {
        largestValue = value;
        largestIndex = i;
      }
    }

    // Adjust the largest category
    const adjusted = roundToDecimalPlaces(
      largestValue + residual,
      VALIDATION_CONSTRAINTS.PERCENTAGE_DECIMAL_PLACES
    );
    (breakdowns[largestIndex] as any)[percentageField] = adjusted;
  }
}
