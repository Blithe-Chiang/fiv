/**
 * Formatting utilities for display values
 * Handles currency, percentages, and numbers with proper formatting
 */

import { VALIDATION_CONSTRAINTS } from '@/types/constants';

/**
 * Format currency value with symbol
 * @param amount - The monetary amount
 * @param currencySymbol - Currency symbol to display
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatCurrency(
  amount: number,
  currencySymbol: string = '$',
  decimals: number = VALIDATION_CONSTRAINTS.AMOUNT_DECIMAL_PLACES
): string {
  const formatted = formatNumber(amount, decimals);
  return `${currencySymbol}${formatted}`;
}

/**
 * Format percentage value
 * @param percentage - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatPercentage(
  percentage: number,
  decimals: number = VALIDATION_CONSTRAINTS.PERCENTAGE_DECIMAL_PLACES
): string {
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format number with thousand separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Parse a formatted currency string back to a number
 * Strips currency symbols and commas
 */
export function parseCurrencyString(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned);
}

/**
 * Truncate long text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncating
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}
