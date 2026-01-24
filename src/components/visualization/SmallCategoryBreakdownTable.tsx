/**
 * SmallCategoryBreakdownTable - Display allocation by small category within large categories
 * Groups small categories by their parent large category
 */

import { SmallCategoryBreakdown } from '@/types/calculated';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface SmallCategoryBreakdownTableProps {
  breakdowns: SmallCategoryBreakdown[];
  currencySymbol: string;
}

export function SmallCategoryBreakdownTable({
  breakdowns,
  currencySymbol,
}: SmallCategoryBreakdownTableProps) {
  if (breakdowns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to display. Add assets to see detailed breakdown by small categories.
      </div>
    );
  }

  // Group breakdowns by large category
  const groupedByLarge = new Map<string, SmallCategoryBreakdown[]>();
  for (const breakdown of breakdowns) {
    const existing = groupedByLarge.get(breakdown.largeCategoryId) || [];
    existing.push(breakdown);
    groupedByLarge.set(breakdown.largeCategoryId, existing);
  }

  // Sort large categories by total amount descending
  const sortedLargeCategories = Array.from(groupedByLarge.entries()).sort((a, b) => {
    const totalA = a[1].reduce((sum, b) => sum + b.totalAmount, 0);
    const totalB = b[1].reduce((sum, b) => sum + b.totalAmount, 0);
    return totalB - totalA;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Breakdown by Small Category
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Grouped by large category
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Small Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Large Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % of Large
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % of Portfolio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedLargeCategories.map(([largeCategoryId, smallBreakdowns]) => {
              // Sort small categories within each large category by percentage descending
              const sortedSmall = [...smallBreakdowns].sort(
                (a, b) => b.percentageOfLarge - a.percentageOfLarge
              );
              const largeCategoryName = sortedSmall[0].largeCategoryName;
              const largeCategoryTotal = sortedSmall.reduce((sum, b) => sum + b.totalAmount, 0);

              return (
                <React.Fragment key={largeCategoryId}>
                  {/* Large category header row */}
                  <tr className="bg-gray-100">
                    <td
                      colSpan={6}
                      className="px-6 py-3 text-sm font-bold text-gray-900"
                    >
                      {largeCategoryName} - {formatCurrency(largeCategoryTotal, currencySymbol)}
                    </td>
                  </tr>
                  {/* Small category rows */}
                  {sortedSmall.map((breakdown) => (
                    <tr key={breakdown.smallCategoryId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 pl-12">
                        {breakdown.smallCategoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {breakdown.largeCategoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(breakdown.totalAmount, currencySymbol)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatPercentage(breakdown.percentageOfLarge)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatPercentage(breakdown.percentageOfPortfolio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${breakdown.percentageOfLarge}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={2} className="px-6 py-3 text-sm font-bold text-gray-900">
                Total Portfolio
              </td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">
                {formatCurrency(
                  breakdowns.reduce((sum, b) => sum + b.totalAmount, 0),
                  currencySymbol
                )}
              </td>
              <td></td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">
                {formatPercentage(
                  breakdowns.reduce((sum, b) => sum + b.percentageOfPortfolio, 0)
                )}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// Need to import React for Fragment
import React from 'react';
