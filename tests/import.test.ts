import { beforeEach, describe, expect, it } from 'vitest';
import { importPortfolioData } from '@/services/import';
import { StorageService } from '@/services/storage';
import { DEFAULTS } from '@/types/constants';
import { ExportFile } from '@/types/importExport';
import { PortfolioData } from '@/types/entities';

const largeCategoryId = '11111111-1111-4111-8111-111111111111';
const smallCategoryId = '22222222-2222-4222-8222-222222222222';
const assetId = '33333333-3333-4333-8333-333333333333';

function createPortfolio(assetOverrides: Partial<PortfolioData['assets'][number]> = {}): PortfolioData {
  return {
    largeCategories: [
      {
        id: largeCategoryId,
        name: 'US Stock',
        createdAt: '2026-01-24T03:13:00.112Z',
      },
    ],
    smallCategories: [
      {
        id: smallCategoryId,
        name: 'S&P 500',
        createdAt: '2026-01-24T03:13:13.845Z',
      },
    ],
    categoryAssociations: [
      {
        smallCategoryId,
        largeCategoryId,
        createdAt: '2026-01-24T03:13:44.745Z',
      },
    ],
    assets: [
      {
        id: assetId,
        name: 'Old asset name',
        amount: 100,
        smallCategoryId,
        largeCategoryId,
        createdAt: '2026-01-24T03:16:44.783Z',
        updatedAt: '2026-04-22T00:00:00.000Z',
        ...assetOverrides,
      },
    ],
    settings: {
      currencySymbol: '$',
    },
  };
}

function createExportFile(portfolio: PortfolioData): ExportFile {
  return {
    version: '1.0',
    exportDate: '2026-04-23T00:58:12.750Z',
    portfolio,
  };
}

describe('import merge behavior', () => {
  it('updates an existing asset when the imported asset has a newer updatedAt timestamp', () => {
    const existingData = createPortfolio();
    const importedData = createPortfolio({
      name: 'New asset name',
      amount: 250,
      updatedAt: '2026-04-23T00:00:00.000Z',
    });

    const result = importPortfolioData(existingData, createExportFile(importedData), 'merge');

    expect(result.imported.assets).toBe(1);
    expect(result.skipped.assets).toBe(0);
    expect(existingData.assets).toHaveLength(1);
    expect(existingData.assets[0]).toMatchObject({
      id: assetId,
      name: 'New asset name',
      amount: 250,
      updatedAt: '2026-04-23T00:00:00.000Z',
    });
  });

  it('keeps an existing asset when the imported asset is not newer', () => {
    const existingData = createPortfolio({
      name: 'Current asset name',
      amount: 250,
      updatedAt: '2026-04-23T00:00:00.000Z',
    });
    const importedData = createPortfolio({
      name: 'Older asset name',
      amount: 100,
      updatedAt: '2026-04-22T00:00:00.000Z',
    });

    const result = importPortfolioData(existingData, createExportFile(importedData), 'merge');

    expect(result.imported.assets).toBe(0);
    expect(result.skipped.assets).toBe(1);
    expect(existingData.assets[0]).toMatchObject({
      id: assetId,
      name: 'Current asset name',
      amount: 250,
      updatedAt: '2026-04-23T00:00:00.000Z',
    });
  });
});

describe('StorageService import merge behavior', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('updates an existing asset during storage-level merge when imported data is newer', async () => {
    localStorage.setItem(DEFAULTS.STORAGE_KEY, JSON.stringify(createPortfolio()));

    const storage = new StorageService();
    storage.initialize();

    const result = await storage.importData(
      createPortfolio({
        name: 'Storage merged asset name',
        amount: 300,
        updatedAt: '2026-04-23T00:00:00.000Z',
      }),
      'merge'
    );

    expect(result.imported.assets).toBe(1);
    expect(result.skipped.assets).toBe(0);
    expect(storage.getAssets()[0]).toMatchObject({
      id: assetId,
      name: 'Storage merged asset name',
      amount: 300,
      updatedAt: '2026-04-23T00:00:00.000Z',
    });
  });
});
