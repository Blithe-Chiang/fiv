/**
 * StorageService - localStorage-based persistence layer
 * Handles all CRUD operations, validation, and data integrity
 */

import { v4 as uuidv4 } from 'uuid';
import {
  PortfolioData,
  LargeCategory,
  SmallCategory,
  CategoryAssociation,
  Asset,
  Settings,
} from '@/types/entities';
import {
  CreateAssetInput,
  UpdateAssetInput,
  CreateLargeCategoryInput,
  CreateSmallCategoryInput,
  CreateAssociationInput,
  UpdateSettingsInput,
  UpdateCategoryInput,
} from '@/types/forms';
import { StorageError, StorageErrorCode } from '@/types/errors';
import { ImportResult, ImportStrategy } from '@/types/importExport';
import { DEFAULTS } from '@/types/constants';
import { PortfolioDataSchema } from '@/schemas/entities';

/**
 * StorageService class - Singleton pattern for data persistence
 */
export class StorageService {
  private readonly STORAGE_KEY = DEFAULTS.STORAGE_KEY;
  private data: PortfolioData | null = null;

  /**
   * Initialize storage - load from localStorage or create empty structure
   */
  initialize(): PortfolioData {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);

      if (!raw) {
        this.data = this.createEmptyPortfolio();
        this.save();
        return this.data;
      }

      const parsed = JSON.parse(raw);
      const validated = PortfolioDataSchema.parse(parsed);

      // Run integrity checks
      const integrityReport = this.checkIntegrity(validated);
      if (!integrityReport.passed) {
        throw new StorageError(
          StorageErrorCode.INTEGRITY_VIOLATION,
          'Data integrity check failed',
          { violations: integrityReport.violations }
        );
      }

      this.data = validated;
      return this.data;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        StorageErrorCode.PARSE_ERROR,
        'Failed to parse portfolio data',
        { originalError: error }
      );
    }
  }

  /**
   * Get current data (must call initialize first)
   */
  getData(): PortfolioData | null {
    return this.data;
  }

  /**
   * Create empty portfolio structure
   */
  private createEmptyPortfolio(): PortfolioData {
    return {
      largeCategories: [],
      smallCategories: [],
      categoryAssociations: [],
      assets: [],
      settings: {
        currencySymbol: DEFAULTS.CURRENCY_SYMBOL,
      },
    };
  }

  /**
   * Save data to localStorage
   */
  private save(): void {
    if (!this.data) {
      throw new StorageError(StorageErrorCode.WRITE_FAILED, 'No data to save');
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      throw new StorageError(
        StorageErrorCode.QUOTA_EXCEEDED,
        'Failed to save data - storage quota may be exceeded',
        { originalError: error }
      );
    }
  }

  // ============================================================================
  // LARGE CATEGORY OPERATIONS
  // ============================================================================

  getLargeCategories(): LargeCategory[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.largeCategories;
  }

  async createLargeCategory(input: CreateLargeCategoryInput): Promise<LargeCategory> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // VR-LC-001: Check for duplicate name (case-insensitive)
    const duplicate = this.data.largeCategories.find(
      (c) => c.name.toLowerCase() === input.name.toLowerCase()
    );
    if (duplicate) {
      throw new StorageError(
        StorageErrorCode.DUPLICATE_NAME,
        `Large category "${input.name}" already exists`,
        { existingId: duplicate.id }
      );
    }

    const category: LargeCategory = {
      id: uuidv4(),
      name: input.name,
      createdAt: new Date().toISOString(),
    };

    this.data.largeCategories.push(category);
    this.save();
    return category;
  }

  async updateLargeCategory(id: string, updates: UpdateCategoryInput): Promise<LargeCategory> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    const category = this.data.largeCategories.find((c) => c.id === id);
    if (!category) {
      throw new StorageError(
        StorageErrorCode.ENTITY_NOT_FOUND,
        `Large category with ID "${id}" not found`
      );
    }

    if (updates.name) {
      // Check for duplicate name
      const duplicate = this.data.largeCategories.find(
        (c) => c.id !== id && c.name.toLowerCase() === updates.name!.toLowerCase()
      );
      if (duplicate) {
        throw new StorageError(
          StorageErrorCode.DUPLICATE_NAME,
          `Large category "${updates.name}" already exists`
        );
      }
      category.name = updates.name;
    }

    this.save();
    return category;
  }

  async deleteLargeCategory(id: string): Promise<void> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // VR-LC-006: Cannot delete if assets reference it
    const assetsUsingCategory = this.data.assets.filter((a) => a.largeCategoryId === id);
    if (assetsUsingCategory.length > 0) {
      throw new StorageError(
        StorageErrorCode.DELETION_BLOCKED,
        `Cannot delete large category - ${assetsUsingCategory.length} asset(s) use this category`,
        { assetIds: assetsUsingCategory.map((a) => a.id) }
      );
    }

    // VR-LC-007: Cannot delete if associations reference it
    const associationsUsingCategory = this.data.categoryAssociations.filter(
      (a) => a.largeCategoryId === id
    );
    if (associationsUsingCategory.length > 0) {
      throw new StorageError(
        StorageErrorCode.DELETION_BLOCKED,
        `Cannot delete large category - must remove ${associationsUsingCategory.length} association(s) first`
      );
    }

    this.data.largeCategories = this.data.largeCategories.filter((c) => c.id !== id);
    this.save();
  }

  // ============================================================================
  // SMALL CATEGORY OPERATIONS
  // ============================================================================

  getSmallCategories(): SmallCategory[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.smallCategories;
  }

  async createSmallCategory(input: CreateSmallCategoryInput): Promise<SmallCategory> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // VR-SC-001: Check for duplicate name (case-insensitive)
    const duplicate = this.data.smallCategories.find(
      (c) => c.name.toLowerCase() === input.name.toLowerCase()
    );
    if (duplicate) {
      throw new StorageError(
        StorageErrorCode.DUPLICATE_NAME,
        `Small category "${input.name}" already exists`,
        { existingId: duplicate.id }
      );
    }

    const category: SmallCategory = {
      id: uuidv4(),
      name: input.name,
      createdAt: new Date().toISOString(),
    };

    this.data.smallCategories.push(category);
    this.save();
    return category;
  }

  async updateSmallCategory(id: string, updates: UpdateCategoryInput): Promise<SmallCategory> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    const category = this.data.smallCategories.find((c) => c.id === id);
    if (!category) {
      throw new StorageError(
        StorageErrorCode.ENTITY_NOT_FOUND,
        `Small category with ID "${id}" not found`
      );
    }

    if (updates.name) {
      // Check for duplicate name
      const duplicate = this.data.smallCategories.find(
        (c) => c.id !== id && c.name.toLowerCase() === updates.name!.toLowerCase()
      );
      if (duplicate) {
        throw new StorageError(
          StorageErrorCode.DUPLICATE_NAME,
          `Small category "${updates.name}" already exists`
        );
      }
      category.name = updates.name;
    }

    this.save();
    return category;
  }

  async deleteSmallCategory(id: string): Promise<void> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // VR-SC-006: Cannot delete if assets reference it
    const assetsUsingCategory = this.data.assets.filter((a) => a.smallCategoryId === id);
    if (assetsUsingCategory.length > 0) {
      throw new StorageError(
        StorageErrorCode.DELETION_BLOCKED,
        `Cannot delete small category - ${assetsUsingCategory.length} asset(s) use this category`,
        { assetIds: assetsUsingCategory.map((a) => a.id) }
      );
    }

    // Remove all associations for this small category
    this.data.categoryAssociations = this.data.categoryAssociations.filter(
      (a) => a.smallCategoryId !== id
    );

    this.data.smallCategories = this.data.smallCategories.filter((c) => c.id !== id);
    this.save();
  }

  // ============================================================================
  // ASSOCIATION OPERATIONS
  // ============================================================================

  getAssociations(): CategoryAssociation[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.categoryAssociations;
  }

  getAssociationsForSmallCategory(smallCategoryId: string): CategoryAssociation[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.categoryAssociations.filter((a) => a.smallCategoryId === smallCategoryId);
  }

  getAssociationsForLargeCategory(largeCategoryId: string): CategoryAssociation[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.categoryAssociations.filter((a) => a.largeCategoryId === largeCategoryId);
  }

  associationExists(smallCategoryId: string, largeCategoryId: string): boolean {
    if (!this.data) return false;
    return this.data.categoryAssociations.some(
      (a) => a.smallCategoryId === smallCategoryId && a.largeCategoryId === largeCategoryId
    );
  }

  async createAssociation(input: CreateAssociationInput): Promise<CategoryAssociation> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // VR-CA-001: Validate that categories exist
    const smallExists = this.data.smallCategories.some((c) => c.id === input.smallCategoryId);
    const largeExists = this.data.largeCategories.some((c) => c.id === input.largeCategoryId);

    if (!smallExists) {
      throw new StorageError(
        StorageErrorCode.INVALID_REFERENCE,
        `Small category with ID "${input.smallCategoryId}" not found`
      );
    }

    if (!largeExists) {
      throw new StorageError(
        StorageErrorCode.INVALID_REFERENCE,
        `Large category with ID "${input.largeCategoryId}" not found`
      );
    }

    // VR-CA-002: Check for duplicate association
    const duplicate = this.associationExists(input.smallCategoryId, input.largeCategoryId);
    if (duplicate) {
      throw new StorageError(
        StorageErrorCode.DUPLICATE_NAME,
        'This association already exists'
      );
    }

    const association: CategoryAssociation = {
      smallCategoryId: input.smallCategoryId,
      largeCategoryId: input.largeCategoryId,
      createdAt: new Date().toISOString(),
    };

    this.data.categoryAssociations.push(association);
    this.save();
    return association;
  }

  async deleteAssociation(smallCategoryId: string, largeCategoryId: string): Promise<void> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // VR-CA-003: Cannot delete if assets use this pair
    const assetsUsingPair = this.data.assets.filter(
      (a) => a.smallCategoryId === smallCategoryId && a.largeCategoryId === largeCategoryId
    );

    if (assetsUsingPair.length > 0) {
      throw new StorageError(
        StorageErrorCode.DELETION_BLOCKED,
        `Cannot remove association - ${assetsUsingPair.length} asset(s) use this combination`,
        { assetIds: assetsUsingPair.map((a) => a.id) }
      );
    }

    this.data.categoryAssociations = this.data.categoryAssociations.filter(
      (a) => !(a.smallCategoryId === smallCategoryId && a.largeCategoryId === largeCategoryId)
    );
    this.save();
  }

  // ============================================================================
  // ASSET OPERATIONS
  // ============================================================================

  getAssets(): Asset[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.assets;
  }

  getAssetsByLargeCategory(largeCategoryId: string): Asset[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.assets.filter((a) => a.largeCategoryId === largeCategoryId);
  }

  getAssetsBySmallCategory(smallCategoryId: string): Asset[] {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.assets.filter((a) => a.smallCategoryId === smallCategoryId);
  }

  async createAsset(input: CreateAssetInput): Promise<Asset> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // VR-A-007: Validate smallCategoryId exists
    const smallExists = this.data.smallCategories.some((c) => c.id === input.smallCategoryId);
    if (!smallExists) {
      throw new StorageError(
        StorageErrorCode.INVALID_REFERENCE,
        `Small category with ID "${input.smallCategoryId}" not found`
      );
    }

    // VR-A-008: Validate largeCategoryId exists
    const largeExists = this.data.largeCategories.some((c) => c.id === input.largeCategoryId);
    if (!largeExists) {
      throw new StorageError(
        StorageErrorCode.INVALID_REFERENCE,
        `Large category with ID "${input.largeCategoryId}" not found`
      );
    }

    // VR-A-009: Validate association exists
    if (!this.associationExists(input.smallCategoryId, input.largeCategoryId)) {
      throw new StorageError(
        StorageErrorCode.ASSOCIATION_NOT_FOUND,
        'No association exists between the selected categories'
      );
    }

    const now = new Date().toISOString();
    const asset: Asset = {
      id: uuidv4(),
      name: input.name,
      amount: input.amount,
      smallCategoryId: input.smallCategoryId,
      largeCategoryId: input.largeCategoryId,
      createdAt: now,
      updatedAt: now,
    };

    this.data.assets.push(asset);
    this.save();
    return asset;
  }

  async updateAsset(id: string, updates: UpdateAssetInput): Promise<Asset> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    const asset = this.data.assets.find((a) => a.id === id);
    if (!asset) {
      throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, `Asset with ID "${id}" not found`);
    }

    // Validate category IDs if they're being updated
    if (updates.smallCategoryId) {
      const smallExists = this.data.smallCategories.some((c) => c.id === updates.smallCategoryId);
      if (!smallExists) {
        throw new StorageError(
          StorageErrorCode.INVALID_REFERENCE,
          `Small category with ID "${updates.smallCategoryId}" not found`
        );
      }
    }

    if (updates.largeCategoryId) {
      const largeExists = this.data.largeCategories.some((c) => c.id === updates.largeCategoryId);
      if (!largeExists) {
        throw new StorageError(
          StorageErrorCode.INVALID_REFERENCE,
          `Large category with ID "${updates.largeCategoryId}" not found`
        );
      }
    }

    // If either category is being updated, validate the association
    if (updates.smallCategoryId || updates.largeCategoryId) {
      const newSmallId = updates.smallCategoryId || asset.smallCategoryId;
      const newLargeId = updates.largeCategoryId || asset.largeCategoryId;

      if (!this.associationExists(newSmallId, newLargeId)) {
        throw new StorageError(
          StorageErrorCode.ASSOCIATION_NOT_FOUND,
          'No association exists between the selected categories'
        );
      }
    }

    // Apply updates
    if (updates.name !== undefined) asset.name = updates.name;
    if (updates.amount !== undefined) asset.amount = updates.amount;
    if (updates.smallCategoryId !== undefined) asset.smallCategoryId = updates.smallCategoryId;
    if (updates.largeCategoryId !== undefined) asset.largeCategoryId = updates.largeCategoryId;
    asset.updatedAt = new Date().toISOString();

    this.save();
    return asset;
  }

  async deleteAsset(id: string): Promise<void> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    const asset = this.data.assets.find((a) => a.id === id);
    if (!asset) {
      throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, `Asset with ID "${id}" not found`);
    }

    this.data.assets = this.data.assets.filter((a) => a.id !== id);
    this.save();
  }

  // ============================================================================
  // SETTINGS OPERATIONS
  // ============================================================================

  getSettings(): Settings {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return this.data.settings;
  }

  async updateSettings(updates: UpdateSettingsInput): Promise<Settings> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    if (updates.currencySymbol !== undefined) {
      this.data.settings.currencySymbol = updates.currencySymbol;
    }

    this.save();
    return this.data.settings;
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  exportData(): PortfolioData {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');
    return JSON.parse(JSON.stringify(this.data)); // Deep clone
  }

  async importData(data: PortfolioData, strategy: ImportStrategy): Promise<ImportResult> {
    if (!this.data) throw new StorageError(StorageErrorCode.ENTITY_NOT_FOUND, 'Storage not initialized');

    // Validate imported data
    try {
      PortfolioDataSchema.parse(data);
    } catch (error) {
      throw new StorageError(
        StorageErrorCode.VALIDATION_FAILED,
        'Imported data failed validation',
        { zodError: error }
      );
    }

    const result: ImportResult = {
      success: true,
      imported: { largeCategories: 0, smallCategories: 0, associations: 0, assets: 0 },
      skipped: { largeCategories: 0, smallCategories: 0, associations: 0, assets: 0 },
      conflicts: [],
    };

    if (strategy === 'replace') {
      this.data = data;
      result.imported = {
        largeCategories: data.largeCategories.length,
        smallCategories: data.smallCategories.length,
        associations: data.categoryAssociations.length,
        assets: data.assets.length,
      };
    } else {
      // Merge strategy
      // Import large categories
      for (const category of data.largeCategories) {
        const existing = this.data.largeCategories.find((c) => c.id === category.id);
        if (existing) {
          result.skipped.largeCategories++;
        } else {
          const nameDuplicate = this.data.largeCategories.find(
            (c) => c.name.toLowerCase() === category.name.toLowerCase()
          );
          if (nameDuplicate) {
            result.conflicts.push({
              type: 'largeCategory',
              field: 'name',
              existingValue: nameDuplicate.name,
              importedValue: category.name,
              existingId: nameDuplicate.id,
              importedId: category.id,
            });
          } else {
            this.data.largeCategories.push(category);
            result.imported.largeCategories++;
          }
        }
      }

      // Import small categories
      for (const category of data.smallCategories) {
        const existing = this.data.smallCategories.find((c) => c.id === category.id);
        if (existing) {
          result.skipped.smallCategories++;
        } else {
          const nameDuplicate = this.data.smallCategories.find(
            (c) => c.name.toLowerCase() === category.name.toLowerCase()
          );
          if (nameDuplicate) {
            result.conflicts.push({
              type: 'smallCategory',
              field: 'name',
              existingValue: nameDuplicate.name,
              importedValue: category.name,
              existingId: nameDuplicate.id,
              importedId: category.id,
            });
          } else {
            this.data.smallCategories.push(category);
            result.imported.smallCategories++;
          }
        }
      }

      // Import associations
      for (const association of data.categoryAssociations) {
        const exists = this.associationExists(
          association.smallCategoryId,
          association.largeCategoryId
        );
        if (exists) {
          result.skipped.associations++;
        } else {
          // Check if categories exist
          const smallExists = this.data.smallCategories.some(
            (c) => c.id === association.smallCategoryId
          );
          const largeExists = this.data.largeCategories.some(
            (c) => c.id === association.largeCategoryId
          );
          if (smallExists && largeExists) {
            this.data.categoryAssociations.push(association);
            result.imported.associations++;
          } else {
            result.skipped.associations++;
          }
        }
      }

      // Import assets
      for (const asset of data.assets) {
        const existingIndex = this.data.assets.findIndex((a) => a.id === asset.id);
        if (existingIndex === -1) {
          // Check if categories and association exist
          const smallExists = this.data.smallCategories.some((c) => c.id === asset.smallCategoryId);
          const largeExists = this.data.largeCategories.some((c) => c.id === asset.largeCategoryId);
          const associationExists = this.associationExists(
            asset.smallCategoryId,
            asset.largeCategoryId
          );
          if (smallExists && largeExists && associationExists) {
            this.data.assets.push(asset);
            result.imported.assets++;
          } else {
            result.skipped.assets++;
          }
        } else if (
          Date.parse(asset.updatedAt) > Date.parse(this.data.assets[existingIndex].updatedAt)
        ) {
          this.data.assets[existingIndex] = asset;
          result.imported.assets++;
        } else {
          result.skipped.assets++;
        }
      }

      // Update settings if provided
      if (data.settings.currencySymbol) {
        this.data.settings.currencySymbol = data.settings.currencySymbol;
      }
    }

    this.save();
    return result;
  }

  async clearAllData(): Promise<void> {
    this.data = this.createEmptyPortfolio();
    this.save();
  }

  // ============================================================================
  // DATA INTEGRITY
  // ============================================================================

  private checkIntegrity(data: PortfolioData): { passed: boolean; violations: any[] } {
    const violations: any[] = [];

    // Check for orphaned asset references
    for (const asset of data.assets) {
      if (!data.smallCategories.find((c) => c.id === asset.smallCategoryId)) {
        violations.push({
          code: 'ORPHANED_SMALL_CATEGORY',
          message: `Asset references non-existent small category`,
          affectedIds: [asset.id],
        });
      }

      if (!data.largeCategories.find((c) => c.id === asset.largeCategoryId)) {
        violations.push({
          code: 'ORPHANED_LARGE_CATEGORY',
          message: `Asset references non-existent large category`,
          affectedIds: [asset.id],
        });
      }

      const associationExists = data.categoryAssociations.some(
        (a) =>
          a.smallCategoryId === asset.smallCategoryId && a.largeCategoryId === asset.largeCategoryId
      );
      if (!associationExists) {
        violations.push({
          code: 'MISSING_ASSOCIATION',
          message: `Asset uses category pair without association`,
          affectedIds: [asset.id],
        });
      }
    }

    // Check for duplicate category names
    const largeCategoryNames = data.largeCategories.map((c) => c.name.toLowerCase());
    if (new Set(largeCategoryNames).size !== largeCategoryNames.length) {
      violations.push({
        code: 'DUPLICATE_LARGE_CATEGORY_NAME',
        message: 'Duplicate large category names detected',
        affectedIds: [],
      });
    }

    const smallCategoryNames = data.smallCategories.map((c) => c.name.toLowerCase());
    if (new Set(smallCategoryNames).size !== smallCategoryNames.length) {
      violations.push({
        code: 'DUPLICATE_SMALL_CATEGORY_NAME',
        message: 'Duplicate small category names detected',
        affectedIds: [],
      });
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }
}

// Singleton instance
export const storageService = new StorageService();
