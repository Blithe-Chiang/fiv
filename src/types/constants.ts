/**
 * Application constants for validation, defaults, and performance targets
 */

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
 * Performance targets (in milliseconds)
 */
export const PERFORMANCE_TARGETS = {
  UI_RESPONSE_TIME_MS: 100,
  STORAGE_READ_TIME_MS: 10,
  STORAGE_WRITE_TIME_MS: 50,
  IMPORT_100_ASSETS_MS: 500,
} as const;
