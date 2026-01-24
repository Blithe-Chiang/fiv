/**
 * LargeCategoryBreakdownTable - Display allocation by large category
 */

import { LargeCategoryBreakdown } from '@/types/calculated';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface LargeCategoryBreakdownTableProps {
  breakdowns: LargeCategoryBreakdown[];
  currencySymbol: string;
}

export function LargeCategoryBreakdownTable({
  breakdowns,
  currencySymbol,
}: LargeCategoryBreakdownTableProps) {
  if (breakdowns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to display. Add assets to see your portfolio breakdown.
      </div>
    );
  }

  // Sort by percentage descending
  const sortedBreakdowns = [...breakdowns].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Allocation by Large Category</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedBreakdowns.map((breakdown) => (
              <tr key={breakdown.categoryId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {breakdown.categoryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(breakdown.totalAmount, currencySymbol)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatPercentage(breakdown.percentage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${breakdown.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-3 text-sm font-bold text-gray-900">Total</td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">
                {formatCurrency(
                  sortedBreakdowns.reduce((sum, b) => sum + b.totalAmount, 0),
                  currencySymbol
                )}
              </td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">
                {formatPercentage(sortedBreakdowns.reduce((sum, b) => sum + b.percentage, 0))}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
