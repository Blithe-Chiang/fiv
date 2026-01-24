/**
 * Error types for storage and validation
 */

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
