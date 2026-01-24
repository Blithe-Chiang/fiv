/**
 * PortfolioSummary - Display top-level portfolio statistics
 */

import { PortfolioSummary as PortfolioSummaryType } from '@/types/calculated';
import { formatCurrency } from '@/utils/formatters';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  currencySymbol: string;
}

export function PortfolioSummary({ summary, currencySymbol }: PortfolioSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border-l-4 border-primary-600 pl-4">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalValue, currencySymbol)}
          </p>
        </div>
        <div className="border-l-4 border-blue-600 pl-4">
          <p className="text-sm text-gray-600">Total Assets</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalAssets}</p>
        </div>
        <div className="border-l-4 border-green-600 pl-4">
          <p className="text-sm text-gray-600">Large Categories</p>
          <p className="text-2xl font-bold text-gray-900">{summary.largeCategoryCount}</p>
        </div>
        <div className="border-l-4 border-purple-600 pl-4">
          <p className="text-sm text-gray-600">Small Categories</p>
          <p className="text-2xl font-bold text-gray-900">{summary.smallCategoryCount}</p>
        </div>
      </div>
    </div>
  );
}
