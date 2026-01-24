/**
 * Import/export types for data portability
 */

import { PortfolioData } from './entities';

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
