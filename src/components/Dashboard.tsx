/**
 * Dashboard - Main application dashboard
 * Integrates asset management, portfolio summary, and category breakdown
 */

import { useState, useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Asset } from '@/types/entities';
import { VisualizationMode, ChartType } from '@/types/ui';
import {
  calculateLargeCategoryBreakdown,
  calculateSmallCategoryBreakdown,
  calculatePortfolioSummary
} from '@/services/calculations';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { EmptyState } from './common/EmptyState';
import { ErrorMessage } from './common/ErrorMessage';
import { AssetForm } from './asset/AssetForm';
import { AssetList } from './asset/AssetList';
import { DeleteConfirmationModal } from './asset/DeleteConfirmationModal';
import { PortfolioSummary } from './visualization/PortfolioSummary';
import { LargeCategoryBreakdownTable } from './visualization/LargeCategoryBreakdownTable';
import { SmallCategoryBreakdownTable } from './visualization/SmallCategoryBreakdownTable';
import { BreakdownChart } from './visualization/BreakdownChart';
import { VisualizationControls } from './visualization/VisualizationControls';
import { useToast } from './common/Toast';
import { getUserFriendlyError } from '@/utils/errors';
import { Skeleton } from './common/Skeleton';

type ModalState =
  | { type: 'none' }
  | { type: 'createAsset' }
  | { type: 'editAsset'; asset: Asset }
  | { type: 'deleteAsset'; asset: Asset };

export function Dashboard() {
  const portfolio = usePortfolio();
  const toast = useToast();
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [error, setError] = useState('');
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('table');
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);

  // Calculate portfolio metrics
  const portfolioSummary = useMemo(
    () => calculatePortfolioSummary(portfolio.assets),
    [portfolio.assets]
  );

  const largeCategoryBreakdown = useMemo(
    () => calculateLargeCategoryBreakdown(portfolio.assets, portfolio.largeCategories),
    [portfolio.assets, portfolio.largeCategories]
  );

  const smallCategoryBreakdown = useMemo(
    () => calculateSmallCategoryBreakdown(
      portfolio.assets,
      portfolio.largeCategories,
      portfolio.smallCategories
    ),
    [portfolio.assets, portfolio.largeCategories, portfolio.smallCategories]
  );

  if (portfolio.loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (portfolio.error) {
    return (
      <div className="p-4">
        <ErrorMessage message={portfolio.error} />
      </div>
    );
  }

  const hasCategories = portfolio.largeCategories.length > 0 && portfolio.smallCategories.length > 0;
  const hasAssociations = portfolio.associations.length > 0;
  const hasAssets = portfolio.assets.length > 0;

  const handleCreateAsset = async (data: {
    name: string;
    amount: number;
    smallCategoryId: string;
    largeCategoryId: string;
  }) => {
    try {
      await portfolio.createAsset(data);
      setModalState({ type: 'none' });
      setError('');
      toast.success('Asset added', `${data.name} was added to your portfolio.`);
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to save asset'));
    }
  };

  const handleUpdateAsset = async (
    id: string,
    data: {
      name: string;
      amount: number;
      smallCategoryId: string;
      largeCategoryId: string;
    }
  ) => {
    try {
      await portfolio.updateAsset(id, data);
      setModalState({ type: 'none' });
      setError('');
      toast.success('Asset updated', `${data.name} was updated.`);
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to update asset'));
    }
  };

  const handleDeleteAsset = async (id: string) => {
    const asset = portfolio.assets.find((a) => a.id === id);
    if (!asset) return;
    setModalState({ type: 'deleteAsset', asset });
  };

  const confirmDeleteAsset = async () => {
    if (modalState.type !== 'deleteAsset') return;
    try {
      setDeletingAssetId(modalState.asset.id);
      await portfolio.deleteAsset(modalState.asset.id);
      setModalState({ type: 'none' });
      setError('');
      toast.success('Asset deleted', `${modalState.asset.name} was removed.`);
    } catch (err: any) {
      setError(getUserFriendlyError(err, 'Failed to delete asset'));
      setModalState({ type: 'none' });
    } finally {
      setDeletingAssetId(null);
    }
  };

  // Check if user can add assets
  const canAddAssets = hasCategories && hasAssociations;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-gray-600">Track and visualize your investment portfolio</p>
        </div>
        <Button
          onClick={() => setModalState({ type: 'createAsset' })}
          disabled={!canAddAssets}
        >
          Add Asset
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Prerequisites Check */}
      {!hasCategories && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Categories Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You need to create categories before adding assets. Please set up your large and
                small categories first.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasCategories && !hasAssociations && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Associations Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You need to link your small categories to large categories before adding assets.
                Please create category associations first.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {canAddAssets && !hasAssets && (
        <EmptyState
          title="No assets yet"
          description="Start building your portfolio by adding your first asset. Track stocks, bonds, real estate, and more."
          action={{
            label: 'Add Your First Asset',
            onClick: () => setModalState({ type: 'createAsset' }),
          }}
        />
      )}

      {/* Portfolio Content */}
      {hasAssets && (
        <>
          {/* Portfolio Summary */}
          <PortfolioSummary summary={portfolioSummary} currencySymbol={portfolio.settings.currencySymbol} />

          {/* Large Category Breakdown */}
          <LargeCategoryBreakdownTable
            breakdowns={largeCategoryBreakdown}
            currencySymbol={portfolio.settings.currencySymbol}
          />

          {/* Small Category Breakdown - Detailed Visualization */}
          <div className="space-y-4">
            <VisualizationControls
              mode={visualizationMode}
              chartType={chartType}
              onModeChange={setVisualizationMode}
              onChartTypeChange={setChartType}
            />

            {visualizationMode === 'table' ? (
              <SmallCategoryBreakdownTable
                breakdowns={smallCategoryBreakdown}
                currencySymbol={portfolio.settings.currencySymbol}
              />
            ) : (
              <BreakdownChart
                breakdowns={smallCategoryBreakdown}
                currencySymbol={portfolio.settings.currencySymbol}
                chartType={chartType}
                title="Small Category Breakdown"
              />
            )}
          </div>

          {/* Asset List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Assets</h3>
            </div>
            <AssetList
              assets={portfolio.assets}
              largeCategories={portfolio.largeCategories}
              smallCategories={portfolio.smallCategories}
              currencySymbol={portfolio.settings.currencySymbol}
              onEdit={(asset) => setModalState({ type: 'editAsset', asset })}
              onDelete={handleDeleteAsset}
            />
          </div>
        </>
      )}

      {/* Create Asset Modal */}
      <Modal
        isOpen={modalState.type === 'createAsset'}
        onClose={() => setModalState({ type: 'none' })}
        title="Add New Asset"
      >
        <AssetForm
          smallCategories={portfolio.smallCategories}
          largeCategories={portfolio.largeCategories}
          associations={portfolio.associations}
          currencySymbol={portfolio.settings.currencySymbol}
          onSubmit={handleCreateAsset}
          onCancel={() => setModalState({ type: 'none' })}
        />
      </Modal>

      {/* Edit Asset Modal */}
      <Modal
        isOpen={modalState.type === 'editAsset'}
        onClose={() => setModalState({ type: 'none' })}
        title="Edit Asset"
      >
        {modalState.type === 'editAsset' && (
          <AssetForm
            initialValue={modalState.asset}
            smallCategories={portfolio.smallCategories}
            largeCategories={portfolio.largeCategories}
            associations={portfolio.associations}
            currencySymbol={portfolio.settings.currencySymbol}
            onSubmit={(data) => handleUpdateAsset(modalState.asset.id, data)}
            onCancel={() => setModalState({ type: 'none' })}
          />
        )}
      </Modal>

      {/* Delete Asset Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={modalState.type === 'deleteAsset'}
        assetName={modalState.type === 'deleteAsset' ? modalState.asset.name : ''}
        onConfirm={confirmDeleteAsset}
        onCancel={() => setModalState({ type: 'none' })}
        isDeleting={
          modalState.type === 'deleteAsset' && deletingAssetId === modalState.asset.id
        }
      />
    </div>
  );
}
