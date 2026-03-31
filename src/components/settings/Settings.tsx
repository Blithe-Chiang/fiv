/**
 * Settings - Settings page with import/export and configuration options
 */

import { usePortfolio } from '@/hooks/usePortfolio';
import { ImportExportPanel } from '../importExport/ImportExportPanel';
import { PortfolioData } from '@/types/entities';
import { ImportResult } from '@/types/importExport';
import { ErrorMessage } from '../common/ErrorMessage';
import { SettingsPanel } from './SettingsPanel';
import { useToast } from '../common/Toast';
import { Skeleton } from '../common/Skeleton';
import { getUserFriendlyError } from '@/utils/errors';

export function Settings() {
  const portfolio = usePortfolio();
  const toast = useToast();

  const handleImportSuccess = async (data: PortfolioData, _result: ImportResult) => {
    try {
      // Import data using the portfolio hook
      // Data has already been merged/replaced by ImportExportPanel logic
      // We just need to reload to reflect changes
      await portfolio.importData(data, 'replace');
      toast.success('Import complete', 'Your portfolio data has been updated.');
    } catch (error: any) {
      toast.error('Import failed', getUserFriendlyError(error, 'Failed to apply imported data.'));
      console.error('Failed to apply imported data:', error);
    }
  };

  if (portfolio.loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-48 w-full" />
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

  const portfolioData: PortfolioData = {
    largeCategories: portfolio.largeCategories,
    smallCategories: portfolio.smallCategories,
    categoryAssociations: portfolio.associations,
    assets: portfolio.assets,
    settings: portfolio.settings,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)] sm:px-6">
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Workspace Settings
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Settings</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Manage your portfolio settings, import/export workflows, and workspace configuration.
        </p>
      </section>

      {/* Import/Export Panel */}
      <ImportExportPanel
        portfolioData={portfolioData}
        onImportSuccess={handleImportSuccess}
        onExportSuccess={() => toast.success('Export complete', 'Portfolio data downloaded.')}
      />

      {/* Currency Settings */}
      <SettingsPanel
        currencySymbol={portfolio.settings.currencySymbol}
        onSave={async (symbol) => {
          try {
            await portfolio.updateSettings({ currencySymbol: symbol });
            toast.success('Settings saved', `Currency symbol updated to ${symbol}.`);
          } catch (error: any) {
            toast.error('Save failed', getUserFriendlyError(error, 'Failed to update settings.'));
            throw error;
          }
        }}
      />

      {/* Portfolio Statistics */}
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)]">
        <h2 className="mb-4 text-xl font-semibold text-slate-950">Portfolio Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-primary-600">{portfolio.largeCategories.length}</p>
            <p className="mt-1 text-sm text-slate-600">Large Categories</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-primary-600">{portfolio.smallCategories.length}</p>
            <p className="mt-1 text-sm text-slate-600">Small Categories</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-primary-600">{portfolio.associations.length}</p>
            <p className="mt-1 text-sm text-slate-600">Associations</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-primary-600">{portfolio.assets.length}</p>
            <p className="mt-1 text-sm text-slate-600">Assets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
