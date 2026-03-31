/**
 * Dashboard - Main application dashboard
 * Integrates asset management, portfolio summary, and category breakdown
 */

import { useEffect, useMemo, useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Asset } from '@/types/entities';
import { VisualizationMode, ChartType, AssetDraftUpdate } from '@/types/ui';
import {
  calculateLargeCategoryBreakdown,
  calculateSmallCategoryBreakdown,
  calculatePortfolioSummary,
} from '@/services/calculations';
import { applyAssetDraft } from '@/utils/assetDraft';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { EmptyState } from './common/EmptyState';
import { ErrorMessage } from './common/ErrorMessage';
import { AssetForm } from './asset/AssetForm';
import { DeleteConfirmationModal } from './asset/DeleteConfirmationModal';
import { PortfolioSummary } from './visualization/PortfolioSummary';
import { LargeCategoryBreakdownTable } from './visualization/LargeCategoryBreakdownTable';
import { SmallCategoryBreakdownTable } from './visualization/SmallCategoryBreakdownTable';
import { BreakdownChart } from './visualization/BreakdownChart';
import { VisualizationControls } from './visualization/VisualizationControls';
import { useToast } from './common/Toast';
import { getUserFriendlyError } from '@/utils/errors';
import { Skeleton } from './common/Skeleton';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

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
  const [draftAsset, setDraftAsset] = useState<AssetDraftUpdate | null>(null);

  useEffect(() => {
    if (modalState.type !== 'editAsset') {
      setDraftAsset(null);
      return;
    }

    if (draftAsset && draftAsset.id !== modalState.asset.id) {
      setDraftAsset(null);
    }
  }, [modalState, draftAsset]);

  const derivedAssets = useMemo(
    () => applyAssetDraft(portfolio.assets, draftAsset),
    [portfolio.assets, draftAsset]
  );

  const portfolioSummary = useMemo(
    () => calculatePortfolioSummary(derivedAssets),
    [derivedAssets]
  );

  const largeCategoryBreakdown = useMemo(
    () => calculateLargeCategoryBreakdown(derivedAssets, portfolio.largeCategories),
    [derivedAssets, portfolio.largeCategories]
  );

  const smallCategoryBreakdown = useMemo(
    () =>
      calculateSmallCategoryBreakdown(
        derivedAssets,
        portfolio.largeCategories,
        portfolio.smallCategories
      ),
    [derivedAssets, portfolio.largeCategories, portfolio.smallCategories]
  );

  const largestExposure = useMemo(
    () =>
      largeCategoryBreakdown.reduce<(typeof largeCategoryBreakdown)[number] | null>(
        (currentLargest, currentBreakdown) => {
          if (!currentLargest || currentBreakdown.percentage > currentLargest.percentage) {
            return currentBreakdown;
          }
          return currentLargest;
        },
        null
      ),
    [largeCategoryBreakdown]
  );

  const largestPosition = useMemo(
    () =>
      derivedAssets.reduce<Asset | null>((currentLargest, asset) => {
        if (!currentLargest || asset.amount > currentLargest.amount) {
          return asset;
        }
        return currentLargest;
      }, null),
    [derivedAssets]
  );

  if (portfolio.loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-56 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
        <Skeleton className="h-64 w-full rounded-[28px]" />
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

  const hasCategories =
    portfolio.largeCategories.length > 0 && portfolio.smallCategories.length > 0;
  const hasAssociations = portfolio.associations.length > 0;
  const hasAssets = portfolio.assets.length > 0;
  const canAddAssets = hasCategories && hasAssociations;
  const activeAssetId = modalState.type === 'editAsset' ? modalState.asset.id : null;

  const closeAssetModal = () => {
    setDraftAsset(null);
    setModalState({ type: 'none' });
  };

  const handleCreateAsset = async (data: {
    name: string;
    amount: number;
    smallCategoryId: string;
    largeCategoryId: string;
  }) => {
    try {
      await portfolio.createAsset(data);
      closeAssetModal();
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
      closeAssetModal();
      setError('');
      toast.success('Asset updated', `${data.name} was updated.`);
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to update asset'));
    }
  };

  const handleDeleteAsset = async (id: string) => {
    const asset = portfolio.assets.find((item) => item.id === id);
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:space-y-8 lg:px-8">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-6 text-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.95)] sm:px-8 sm:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.16),transparent_30%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-end">
          <div className="space-y-5">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-slate-200">
                Portfolio Command Center
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  Portfolio Dashboard
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Review total exposure, compare category allocation, and manage underlying asset
                  positions from a single operational view tailored for portfolio analysis.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                onClick={() => setModalState({ type: 'createAsset' })}
                disabled={!canAddAssets}
                className="w-full border-primary-400 bg-primary-500 text-white shadow-[0_20px_40px_-20px_rgba(37,99,235,0.9)] hover:border-primary-300 hover:bg-primary-400 sm:w-auto"
              >
                Add Asset
              </Button>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                {hasAssets
                  ? `${portfolioSummary.totalAssets} positions across ${portfolioSummary.largeCategoryCount} large categories`
                  : canAddAssets
                    ? 'Categories are ready. Start populating the portfolio with asset positions.'
                    : 'Create categories and associations first to unlock portfolio tracking.'}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Total Portfolio
              </p>
              <p className="mt-3 text-3xl font-semibold tabular-nums text-white">
                {formatCurrency(portfolioSummary.totalValue, portfolio.settings.currencySymbol)}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Full current market value tracked across all recorded assets.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Largest Allocation
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {largestExposure?.categoryName ?? 'No category data'}
              </p>
              <p className="mt-1 text-sm tabular-nums text-slate-200">
                {largestExposure
                  ? `${formatPercentage(largestExposure.percentage)} · ${formatCurrency(
                      largestExposure.totalAmount,
                      portfolio.settings.currencySymbol
                    )}`
                  : 'Add assets to see the current allocation leader.'}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Largest Position
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {largestPosition?.name ?? 'No asset positions'}
              </p>
              <p className="mt-1 text-sm tabular-nums text-slate-200">
                {largestPosition
                  ? formatCurrency(largestPosition.amount, portfolio.settings.currencySymbol)
                  : 'Once assets are added, the top individual position will appear here.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {!hasCategories && (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50/95 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
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
              <h3 className="text-sm font-semibold text-amber-900">Categories Required</h3>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                You need to create categories before adding assets. Please set up your large and
                small categories first.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasCategories && !hasAssociations && (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50/95 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
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
              <h3 className="text-sm font-semibold text-amber-900">Associations Required</h3>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                You need to link your small categories to large categories before adding assets.
                Please create category associations first.
              </p>
            </div>
          </div>
        </div>
      )}

      {canAddAssets && !hasAssets && (
        <EmptyState
          title="No assets yet"
          description="Start building your portfolio by adding your first asset. After that, each small category section will list the underlying asset positions directly in the breakdown."
          action={{
            label: 'Add Your First Asset',
            onClick: () => setModalState({ type: 'createAsset' }),
          }}
        />
      )}

      {hasAssets && (
        <>
          <PortfolioSummary
            summary={portfolioSummary}
            currencySymbol={portfolio.settings.currencySymbol}
          />

          <LargeCategoryBreakdownTable
            breakdowns={largeCategoryBreakdown}
            currencySymbol={portfolio.settings.currencySymbol}
          />

          <section className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                  Drilldown
                </span>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Small-category exposure and underlying positions
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                    Switch between a detailed operating table and a visual chart to review how
                    category allocation is built from individual assets.
                  </p>
                </div>
              </div>
            </div>

            <VisualizationControls
              mode={visualizationMode}
              chartType={chartType}
              onModeChange={setVisualizationMode}
              onChartTypeChange={setChartType}
            />

            {visualizationMode === 'table' ? (
              <SmallCategoryBreakdownTable
                breakdowns={smallCategoryBreakdown}
                assets={derivedAssets}
                currencySymbol={portfolio.settings.currencySymbol}
                selectedAssetId={activeAssetId}
                onEditAsset={(id) => {
                  const asset = portfolio.assets.find((item) => item.id === id);
                  if (!asset) return;
                  setModalState({ type: 'editAsset', asset });
                }}
                onDeleteAsset={handleDeleteAsset}
              />
            ) : (
              <BreakdownChart
                breakdowns={smallCategoryBreakdown}
                currencySymbol={portfolio.settings.currencySymbol}
                chartType={chartType}
                title="Small Category Breakdown"
              />
            )}
          </section>
        </>
      )}

      <Modal
        isOpen={modalState.type === 'createAsset'}
        onClose={closeAssetModal}
        title="Add New Asset"
      >
        <AssetForm
          smallCategories={portfolio.smallCategories}
          largeCategories={portfolio.largeCategories}
          associations={portfolio.associations}
          currencySymbol={portfolio.settings.currencySymbol}
          onSubmit={handleCreateAsset}
          onCancel={closeAssetModal}
        />
      </Modal>

      <Modal
        isOpen={modalState.type === 'editAsset'}
        onClose={closeAssetModal}
        title="Edit Asset"
      >
        {modalState.type === 'editAsset' && (
          <AssetForm
            initialValue={modalState.asset}
            smallCategories={portfolio.smallCategories}
            largeCategories={portfolio.largeCategories}
            associations={portfolio.associations}
            currencySymbol={portfolio.settings.currencySymbol}
            onDraftChange={setDraftAsset}
            onSubmit={(data) => handleUpdateAsset(modalState.asset.id, data)}
            onCancel={closeAssetModal}
          />
        )}
      </Modal>

      <DeleteConfirmationModal
        isOpen={modalState.type === 'deleteAsset'}
        assetName={modalState.type === 'deleteAsset' ? modalState.asset.name : ''}
        onConfirm={confirmDeleteAsset}
        onCancel={() => setModalState({ type: 'none' })}
        isDeleting={modalState.type === 'deleteAsset' && deletingAssetId === modalState.asset.id}
      />
    </div>
  );
}
