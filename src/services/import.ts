/**
 * Import service - Parse and validate JSON import files
 * Handles conflict detection and data merging
 */

import { PortfolioData } from '@/types/entities';
import { ExportFile, ImportResult, ImportConflict, ImportStrategy } from '@/types/importExport';
import { ExportFileSchema } from '@/schemas/entities';
import { ZodError } from 'zod';

/**
 * Parse and validate a JSON file
 * @param fileContent JSON string content
 * @returns Parsed and validated ExportFile
 * @throws Error if JSON is invalid or schema validation fails
 */
export function parseImportFile(fileContent: string): ExportFile {
  try {
    // Parse JSON
    const parsed = JSON.parse(fileContent);

    // Validate against schema
    const validated = ExportFileSchema.parse(parsed);

    return validated;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      throw new Error(
        `Schema validation failed: ${firstError.path.join('.')} - ${firstError.message}`
      );
    }
    throw error;
  }
}

/**
 * Read a file as text
 * @param file File object from input
 * @returns Promise with file content as string
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file);
  });
}

/**
 * Detect conflicts between existing and imported data
 * @param existingData Current portfolio data
 * @param importedData Imported portfolio data
 * @returns Array of detected conflicts
 */
export function detectConflicts(
  existingData: PortfolioData,
  importedData: PortfolioData
): ImportConflict[] {
  const conflicts: ImportConflict[] = [];

  // Check large category name conflicts
  for (const importedCategory of importedData.largeCategories) {
    const existing = existingData.largeCategories.find(
      (c) => c.name.toLowerCase() === importedCategory.name.toLowerCase()
    );
    if (existing && existing.id !== importedCategory.id) {
      conflicts.push({
        type: 'largeCategory',
        field: 'name',
        existingValue: existing.name,
        importedValue: importedCategory.name,
        existingId: existing.id,
        importedId: importedCategory.id,
      });
    }
  }

  // Check small category name conflicts
  for (const importedCategory of importedData.smallCategories) {
    const existing = existingData.smallCategories.find(
      (c) => c.name.toLowerCase() === importedCategory.name.toLowerCase()
    );
    if (existing && existing.id !== importedCategory.id) {
      conflicts.push({
        type: 'smallCategory',
        field: 'name',
        existingValue: existing.name,
        importedValue: importedCategory.name,
        existingId: existing.id,
        importedId: importedCategory.id,
      });
    }
  }

  return conflicts;
}

/**
 * Validate referential integrity of imported data
 * @param data Portfolio data to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateReferentialIntegrity(data: PortfolioData): string[] {
  const errors: string[] = [];

  // Validate associations reference existing categories
  for (const assoc of data.categoryAssociations) {
    const smallExists = data.smallCategories.some((c) => c.id === assoc.smallCategoryId);
    if (!smallExists) {
      errors.push(
        `Association references non-existent small category: ${assoc.smallCategoryId}`
      );
    }

    const largeExists = data.largeCategories.some((c) => c.id === assoc.largeCategoryId);
    if (!largeExists) {
      errors.push(
        `Association references non-existent large category: ${assoc.largeCategoryId}`
      );
    }
  }

  // Validate assets reference existing categories
  for (const asset of data.assets) {
    const smallExists = data.smallCategories.some((c) => c.id === asset.smallCategoryId);
    if (!smallExists) {
      errors.push(`Asset "${asset.name}" references non-existent small category`);
    }

    const largeExists = data.largeCategories.some((c) => c.id === asset.largeCategoryId);
    if (!largeExists) {
      errors.push(`Asset "${asset.name}" references non-existent large category`);
    }

    // Validate association exists for asset's category pair
    const assocExists = data.categoryAssociations.some(
      (a) => a.smallCategoryId === asset.smallCategoryId && a.largeCategoryId === asset.largeCategoryId
    );
    if (!assocExists) {
      errors.push(
        `Asset "${asset.name}" uses category pair without association`
      );
    }
  }

  return errors;
}

/**
 * Merge imported data into existing data
 * - Keep the newest asset when IDs match, based on updatedAt
 * - Skip categories and associations with existing IDs
 * - Skip entities with conflicting names (different IDs but same name)
 * - Add new entities
 * @param existingData Current portfolio data
 * @param importedData Imported portfolio data
 * @returns ImportResult with counts and conflicts
 */
export function mergeImportData(
  existingData: PortfolioData,
  importedData: PortfolioData
): ImportResult {
  const result: ImportResult = {
    success: true,
    imported: {
      largeCategories: 0,
      smallCategories: 0,
      associations: 0,
      assets: 0,
    },
    skipped: {
      largeCategories: 0,
      smallCategories: 0,
      associations: 0,
      assets: 0,
    },
    conflicts: detectConflicts(existingData, importedData),
  };

  // Merge large categories
  for (const imported of importedData.largeCategories) {
    const idExists = existingData.largeCategories.some((c) => c.id === imported.id);
    const nameConflict = existingData.largeCategories.some(
      (c) => c.name.toLowerCase() === imported.name.toLowerCase() && c.id !== imported.id
    );

    if (idExists || nameConflict) {
      result.skipped.largeCategories++;
    } else {
      existingData.largeCategories.push(imported);
      result.imported.largeCategories++;
    }
  }

  // Merge small categories
  for (const imported of importedData.smallCategories) {
    const idExists = existingData.smallCategories.some((c) => c.id === imported.id);
    const nameConflict = existingData.smallCategories.some(
      (c) => c.name.toLowerCase() === imported.name.toLowerCase() && c.id !== imported.id
    );

    if (idExists || nameConflict) {
      result.skipped.smallCategories++;
    } else {
      existingData.smallCategories.push(imported);
      result.imported.smallCategories++;
    }
  }

  // Merge associations
  for (const imported of importedData.categoryAssociations) {
    const exists = existingData.categoryAssociations.some(
      (a) =>
        a.smallCategoryId === imported.smallCategoryId &&
        a.largeCategoryId === imported.largeCategoryId
    );

    if (exists) {
      result.skipped.associations++;
    } else {
      existingData.categoryAssociations.push(imported);
      result.imported.associations++;
    }
  }

  // Merge assets
  for (const imported of importedData.assets) {
    const existingIndex = existingData.assets.findIndex((a) => a.id === imported.id);

    if (existingIndex === -1) {
      existingData.assets.push(imported);
      result.imported.assets++;
    } else if (
      Date.parse(imported.updatedAt) > Date.parse(existingData.assets[existingIndex].updatedAt)
    ) {
      existingData.assets[existingIndex] = imported;
      result.imported.assets++;
    } else {
      result.skipped.assets++;
    }
  }

  // Update settings (prefer imported if different)
  if (importedData.settings.currencySymbol !== existingData.settings.currencySymbol) {
    existingData.settings.currencySymbol = importedData.settings.currencySymbol;
  }

  return result;
}

/**
 * Replace all existing data with imported data
 * @param importedData Imported portfolio data
 * @returns ImportResult with counts
 */
export function replaceImportData(importedData: PortfolioData): ImportResult {
  const result: ImportResult = {
    success: true,
    imported: {
      largeCategories: importedData.largeCategories.length,
      smallCategories: importedData.smallCategories.length,
      associations: importedData.categoryAssociations.length,
      assets: importedData.assets.length,
    },
    skipped: {
      largeCategories: 0,
      smallCategories: 0,
      associations: 0,
      assets: 0,
    },
    conflicts: [],
  };

  return result;
}

/**
 * Import portfolio data from ExportFile
 * @param existingData Current portfolio data (will be modified if merge)
 * @param exportFile Validated export file
 * @param strategy Import strategy ('merge' or 'replace')
 * @returns ImportResult with operation summary
 */
export function importPortfolioData(
  existingData: PortfolioData,
  exportFile: ExportFile,
  strategy: ImportStrategy
): ImportResult {
  // Validate referential integrity
  const integrityErrors = validateReferentialIntegrity(exportFile.portfolio);
  if (integrityErrors.length > 0) {
    throw new Error(`Referential integrity validation failed:\n${integrityErrors.join('\n')}`);
  }

  if (strategy === 'replace') {
    // Replace mode: return imported data as-is
    return replaceImportData(exportFile.portfolio);
  } else {
    // Merge mode: merge imported data into existing
    return mergeImportData(existingData, exportFile.portfolio);
  }
}
