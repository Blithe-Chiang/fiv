/**
 * Validation utilities for user inputs
 * Implements validation rules from data model
 */

import { VALIDATION_CONSTRAINTS } from '@/types/constants';
import { ValidationError } from '@/types/errors';

/**
 * Validate category name (VR-LC-002/003/004, VR-SC-002/003/004)
 */
export function validateCategoryName(name: string): ValidationError | null {
  // VR-*-002: Must not be empty or whitespace-only
  if (!name || name.trim().length === 0) {
    return {
      field: 'name',
      message: 'Category name cannot be empty',
      code: 'VR-CAT-002',
    };
  }

  // VR-*-003: Length must be between 1 and 50 characters
  if (
    name.length < VALIDATION_CONSTRAINTS.CATEGORY_NAME_MIN_LENGTH ||
    name.length > VALIDATION_CONSTRAINTS.CATEGORY_NAME_MAX_LENGTH
  ) {
    return {
      field: 'name',
      message: `Category name must be between ${VALIDATION_CONSTRAINTS.CATEGORY_NAME_MIN_LENGTH} and ${VALIDATION_CONSTRAINTS.CATEGORY_NAME_MAX_LENGTH} characters`,
      code: 'VR-CAT-003',
    };
  }

  // VR-*-004: Must not contain special characters that break rendering
  if (/[\n\r\t]/.test(name)) {
    return {
      field: 'name',
      message: 'Category name cannot contain newlines or tabs',
      code: 'VR-CAT-004',
    };
  }

  return null;
}

/**
 * Validate asset name (VR-A-001, VR-A-002)
 */
export function validateAssetName(name: string): ValidationError | null {
  // VR-A-001: Must not be empty or whitespace-only
  if (!name || name.trim().length === 0) {
    return {
      field: 'name',
      message: 'Asset name cannot be empty',
      code: 'VR-A-001',
    };
  }

  // VR-A-002: Length must be between 1 and 100 characters
  if (
    name.length < VALIDATION_CONSTRAINTS.ASSET_NAME_MIN_LENGTH ||
    name.length > VALIDATION_CONSTRAINTS.ASSET_NAME_MAX_LENGTH
  ) {
    return {
      field: 'name',
      message: `Asset name must be between ${VALIDATION_CONSTRAINTS.ASSET_NAME_MIN_LENGTH} and ${VALIDATION_CONSTRAINTS.ASSET_NAME_MAX_LENGTH} characters`,
      code: 'VR-A-002',
    };
  }

  return null;
}

/**
 * Validate asset amount (VR-A-004, VR-A-005)
 */
export function validateAssetAmount(amount: number): ValidationError | null {
  // VR-A-005: Must be a valid number
  if (isNaN(amount) || !isFinite(amount)) {
    return {
      field: 'amount',
      message: 'Amount must be a valid number',
      code: 'VR-A-005',
    };
  }

  // VR-A-004: Must be positive > 0
  if (amount <= VALIDATION_CONSTRAINTS.ASSET_AMOUNT_MIN) {
    return {
      field: 'amount',
      message: 'Amount must be greater than zero',
      code: 'VR-A-004',
    };
  }

  return null;
}

/**
 * Validate currency symbol (VR-S-001, VR-S-002)
 */
export function validateCurrencySymbol(symbol: string): ValidationError | null {
  // VR-S-001: Must not be empty
  if (!symbol || symbol.trim().length === 0) {
    return {
      field: 'currencySymbol',
      message: 'Currency symbol cannot be empty',
      code: 'VR-S-001',
    };
  }

  // VR-S-002: Length must be between 1 and 5 characters
  if (
    symbol.length < VALIDATION_CONSTRAINTS.CURRENCY_SYMBOL_MIN_LENGTH ||
    symbol.length > VALIDATION_CONSTRAINTS.CURRENCY_SYMBOL_MAX_LENGTH
  ) {
    return {
      field: 'currencySymbol',
      message: `Currency symbol must be between ${VALIDATION_CONSTRAINTS.CURRENCY_SYMBOL_MIN_LENGTH} and ${VALIDATION_CONSTRAINTS.CURRENCY_SYMBOL_MAX_LENGTH} characters`,
      code: 'VR-S-002',
    };
  }

  return null;
}

/**
 * Validate all fields in a create asset form
 */
export function validateCreateAsset(input: {
  name: string;
  amount: number;
  smallCategoryId: string;
  largeCategoryId: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateAssetName(input.name);
  if (nameError) errors.push(nameError);

  const amountError = validateAssetAmount(input.amount);
  if (amountError) errors.push(amountError);

  if (!input.smallCategoryId) {
    errors.push({
      field: 'smallCategoryId',
      message: 'Small category must be selected',
      code: 'VR-A-007',
    });
  }

  if (!input.largeCategoryId) {
    errors.push({
      field: 'largeCategoryId',
      message: 'Large category must be selected',
      code: 'VR-A-008',
    });
  }

  return errors;
}
