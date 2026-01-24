/**
 * Settings - Settings page with import/export and configuration options
 */

import { usePortfolio } from '@/hooks/usePortfolio';
import { ImportExportPanel } from '../importExport/ImportExportPanel';
import { PortfolioData } from '@/types/entities';
import { ImportResult } from '@/types/importExport';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

export function Settings() {
  const portfolio = usePortfolio();

  const handleImportSuccess = async (data: PortfolioData, _result: ImportResult) => {
    try {
      // Import data using the portfolio hook
      // Data has already been merged/replaced by ImportExportPanel logic
      // We just need to reload to reflect changes
      await portfolio.importData(data, 'replace');
    } catch (error: any) {
      console.error('Failed to apply imported data:', error);
    }
  };

  if (portfolio.loading) {
    return <LoadingSpinner />;
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your portfolio settings and data</p>
      </div>

      {/* Import/Export Panel */}
      <ImportExportPanel
        portfolioData={portfolioData}
        onImportSuccess={handleImportSuccess}
      />

      {/* Currency Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Currency Settings</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Currency Symbol</p>
            <p className="text-sm text-gray-600 mt-1">
              Currently using: <strong>{portfolio.settings.currencySymbol}</strong>
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Currency symbol is imported/exported with your data
          </div>
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-primary-600">{portfolio.largeCategories.length}</p>
            <p className="text-sm text-gray-600 mt-1">Large Categories</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-primary-600">{portfolio.smallCategories.length}</p>
            <p className="text-sm text-gray-600 mt-1">Small Categories</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-primary-600">{portfolio.associations.length}</p>
            <p className="text-sm text-gray-600 mt-1">Associations</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-primary-600">{portfolio.assets.length}</p>
            <p className="text-sm text-gray-600 mt-1">Assets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
