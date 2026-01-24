/**
 * usePortfolio hook - Main hook for portfolio state management
 * Provides access to all portfolio data and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/services/storage';
import {
  PortfolioData,
  LargeCategory,
  SmallCategory,
  CategoryAssociation,
  Asset,
  Settings,
} from '@/types/entities';
import {
  CreateLargeCategoryInput,
  CreateSmallCategoryInput,
  CreateAssociationInput,
  CreateAssetInput,
  UpdateAssetInput,
  UpdateSettingsInput,
  UpdateCategoryInput,
} from '@/types/forms';
import { ImportResult, ImportStrategy } from '@/types/importExport';
import { StorageError } from '@/types/errors';

interface UsePortfolioReturn {
  // Data
  portfolio: PortfolioData | null;
  loading: boolean;
  error: string | null;

  // Large Category Operations
  largeCategories: LargeCategory[];
  createLargeCategory: (input: CreateLargeCategoryInput) => Promise<LargeCategory>;
  updateLargeCategory: (id: string, updates: UpdateCategoryInput) => Promise<LargeCategory>;
  deleteLargeCategory: (id: string) => Promise<void>;

  // Small Category Operations
  smallCategories: SmallCategory[];
  createSmallCategory: (input: CreateSmallCategoryInput) => Promise<SmallCategory>;
  updateSmallCategory: (id: string, updates: UpdateCategoryInput) => Promise<SmallCategory>;
  deleteSmallCategory: (id: string) => Promise<void>;

  // Association Operations
  associations: CategoryAssociation[];
  createAssociation: (input: CreateAssociationInput) => Promise<CategoryAssociation>;
  deleteAssociation: (smallCategoryId: string, largeCategoryId: string) => Promise<void>;
  getAssociationsForSmallCategory: (smallCategoryId: string) => CategoryAssociation[];
  getAssociationsForLargeCategory: (largeCategoryId: string) => CategoryAssociation[];
  associationExists: (smallCategoryId: string, largeCategoryId: string) => boolean;

  // Asset Operations
  assets: Asset[];
  createAsset: (input: CreateAssetInput) => Promise<Asset>;
  updateAsset: (id: string, updates: UpdateAssetInput) => Promise<Asset>;
  deleteAsset: (id: string) => Promise<void>;
  getAssetsByLargeCategory: (largeCategoryId: string) => Asset[];
  getAssetsBySmallCategory: (smallCategoryId: string) => Asset[];

  // Settings Operations
  settings: Settings;
  updateSettings: (updates: UpdateSettingsInput) => Promise<Settings>;

  // Bulk Operations
  importData: (data: PortfolioData, strategy: ImportStrategy) => Promise<ImportResult>;
  exportData: () => PortfolioData;
  clearAllData: () => Promise<void>;

  // Utility
  refresh: () => void;
}

/**
 * Main portfolio hook - manages all portfolio state and operations
 */
export function usePortfolio(): UsePortfolioReturn {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize portfolio on mount
  useEffect(() => {
    try {
      const data = storageService.initialize();
      setPortfolio(data);
      setLoading(false);
    } catch (err) {
      const message = err instanceof StorageError ? err.message : 'Failed to initialize portfolio';
      setError(message);
      setLoading(false);
    }
  }, []);

  // Refresh portfolio data
  const refresh = useCallback(() => {
    const data = storageService.getData();
    if (data) {
      setPortfolio(data);
    }
  }, []);

  // Large Category Operations
  const createLargeCategory = useCallback(
    async (input: CreateLargeCategoryInput) => {
      const category = await storageService.createLargeCategory(input);
      refresh();
      return category;
    },
    [refresh]
  );

  const updateLargeCategory = useCallback(
    async (id: string, updates: UpdateCategoryInput) => {
      const category = await storageService.updateLargeCategory(id, updates);
      refresh();
      return category;
    },
    [refresh]
  );

  const deleteLargeCategory = useCallback(
    async (id: string) => {
      await storageService.deleteLargeCategory(id);
      refresh();
    },
    [refresh]
  );

  // Small Category Operations
  const createSmallCategory = useCallback(
    async (input: CreateSmallCategoryInput) => {
      const category = await storageService.createSmallCategory(input);
      refresh();
      return category;
    },
    [refresh]
  );

  const updateSmallCategory = useCallback(
    async (id: string, updates: UpdateCategoryInput) => {
      const category = await storageService.updateSmallCategory(id, updates);
      refresh();
      return category;
    },
    [refresh]
  );

  const deleteSmallCategory = useCallback(
    async (id: string) => {
      await storageService.deleteSmallCategory(id);
      refresh();
    },
    [refresh]
  );

  // Association Operations
  const createAssociation = useCallback(
    async (input: CreateAssociationInput) => {
      const association = await storageService.createAssociation(input);
      refresh();
      return association;
    },
    [refresh]
  );

  const deleteAssociation = useCallback(
    async (smallCategoryId: string, largeCategoryId: string) => {
      await storageService.deleteAssociation(smallCategoryId, largeCategoryId);
      refresh();
    },
    [refresh]
  );

  const getAssociationsForSmallCategory = useCallback(
    (smallCategoryId: string) => {
      return storageService.getAssociationsForSmallCategory(smallCategoryId);
    },
    []
  );

  const getAssociationsForLargeCategory = useCallback((largeCategoryId: string) => {
    return storageService.getAssociationsForLargeCategory(largeCategoryId);
  }, []);

  const associationExists = useCallback((smallCategoryId: string, largeCategoryId: string) => {
    return storageService.associationExists(smallCategoryId, largeCategoryId);
  }, []);

  // Asset Operations
  const createAsset = useCallback(
    async (input: CreateAssetInput) => {
      const asset = await storageService.createAsset(input);
      refresh();
      return asset;
    },
    [refresh]
  );

  const updateAsset = useCallback(
    async (id: string, updates: UpdateAssetInput) => {
      const asset = await storageService.updateAsset(id, updates);
      refresh();
      return asset;
    },
    [refresh]
  );

  const deleteAsset = useCallback(
    async (id: string) => {
      await storageService.deleteAsset(id);
      refresh();
    },
    [refresh]
  );

  const getAssetsByLargeCategory = useCallback((largeCategoryId: string) => {
    return storageService.getAssetsByLargeCategory(largeCategoryId);
  }, []);

  const getAssetsBySmallCategory = useCallback((smallCategoryId: string) => {
    return storageService.getAssetsBySmallCategory(smallCategoryId);
  }, []);

  // Settings Operations
  const updateSettings = useCallback(
    async (updates: UpdateSettingsInput) => {
      const settings = await storageService.updateSettings(updates);
      refresh();
      return settings;
    },
    [refresh]
  );

  // Bulk Operations
  const importData = useCallback(
    async (data: PortfolioData, strategy: ImportStrategy) => {
      const result = await storageService.importData(data, strategy);
      refresh();
      return result;
    },
    [refresh]
  );

  const exportData = useCallback(() => {
    return storageService.exportData();
  }, []);

  const clearAllData = useCallback(async () => {
    await storageService.clearAllData();
    refresh();
  }, [refresh]);

  return {
    // Data
    portfolio,
    loading,
    error,

    // Large Category Operations
    largeCategories: portfolio?.largeCategories || [],
    createLargeCategory,
    updateLargeCategory,
    deleteLargeCategory,

    // Small Category Operations
    smallCategories: portfolio?.smallCategories || [],
    createSmallCategory,
    updateSmallCategory,
    deleteSmallCategory,

    // Association Operations
    associations: portfolio?.categoryAssociations || [],
    createAssociation,
    deleteAssociation,
    getAssociationsForSmallCategory,
    getAssociationsForLargeCategory,
    associationExists,

    // Asset Operations
    assets: portfolio?.assets || [],
    createAsset,
    updateAsset,
    deleteAsset,
    getAssetsByLargeCategory,
    getAssetsBySmallCategory,

    // Settings Operations
    settings: portfolio?.settings || { currencySymbol: '$' },
    updateSettings,

    // Bulk Operations
    importData,
    exportData,
    clearAllData,

    // Utility
    refresh,
  };
}
