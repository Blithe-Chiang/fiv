/**
 * SmallCategoryBreakdownTable - Display allocation by small category within large categories
 * Includes the underlying assets for each small category group.
 */

import { Asset } from '@/types/entities';
import { SmallCategoryBreakdown } from '@/types/calculated';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Button } from '../common/Button';

interface SmallCategoryBreakdownTableProps {
  breakdowns: SmallCategoryBreakdown[];
  assets?: Asset[];
  currencySymbol: string;
  selectedAssetId?: string | null;
  onEditAsset?: (assetId: string) => void;
  onDeleteAsset?: (assetId: string) => void;
}

const getBreakdownKey = (smallCategoryId: string, largeCategoryId: string) =>
  `${smallCategoryId}:${largeCategoryId}`;

export function SmallCategoryBreakdownTable({
  breakdowns,
  assets = [],
  currencySymbol,
  selectedAssetId = null,
  onEditAsset,
  onDeleteAsset,
}: SmallCategoryBreakdownTableProps) {
  if (breakdowns.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No data to display. Add assets to see detailed breakdown by small categories.
      </div>
    );
  }

  const groupedByLarge = new Map<string, SmallCategoryBreakdown[]>();
  for (const breakdown of breakdowns) {
    const existing = groupedByLarge.get(breakdown.largeCategoryId) || [];
    existing.push(breakdown);
    groupedByLarge.set(breakdown.largeCategoryId, existing);
  }

  const assetsByBreakdown = new Map<string, Asset[]>();
  for (const asset of assets) {
    const key = getBreakdownKey(asset.smallCategoryId, asset.largeCategoryId);
    const existing = assetsByBreakdown.get(key) || [];
    existing.push(asset);
    assetsByBreakdown.set(key, existing);
  }

  const sortedLargeCategories = Array.from(groupedByLarge.entries()).sort((a, b) => {
    const totalA = a[1].reduce((sum, item) => sum + item.totalAmount, 0);
    const totalB = b[1].reduce((sum, item) => sum + item.totalAmount, 0);
    return totalB - totalA;
  });

  const portfolioTotal = breakdowns.reduce((sum, breakdown) => sum + breakdown.totalAmount, 0);
  const portfolioPercentage = breakdowns.reduce(
    (sum, breakdown) => sum + breakdown.percentageOfPortfolio,
    0
  );

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)]">
      <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Operating Table
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Small-category breakdown
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Each small category keeps its underlying assets expanded for direct editing and
              exposure review.
            </p>
          </div>
          <p className="text-sm text-slate-500">{assets.length} asset positions shown</p>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        {sortedLargeCategories.map(([largeCategoryId, smallBreakdowns]) => {
          const sortedSmall = [...smallBreakdowns].sort(
            (a, b) => b.percentageOfLarge - a.percentageOfLarge
          );
          const largeCategoryName = sortedSmall[0].largeCategoryName;
          const largeCategoryTotal = sortedSmall.reduce((sum, item) => sum + item.totalAmount, 0);
          const largeCategoryAssetCount = sortedSmall.reduce((sum, item) => {
            const key = getBreakdownKey(item.smallCategoryId, item.largeCategoryId);
            return sum + (assetsByBreakdown.get(key)?.length || 0);
          }, 0);

          return (
            <section
              key={largeCategoryId}
              className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-slate-50/60"
            >
              <div className="border-b border-slate-200/80 bg-white/80 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <h4 className="text-xl font-semibold text-slate-950">{largeCategoryName}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {sortedSmall.length} small categories, {largeCategoryAssetCount} assets
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Large Category Total
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                        {formatCurrency(largeCategoryTotal, currencySymbol)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Portfolio Share
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                        {formatPercentage(
                          sortedSmall.reduce((sum, item) => sum + item.percentageOfPortfolio, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200/80 bg-white">
                {sortedSmall.map((breakdown) => {
                  const breakdownKey = getBreakdownKey(
                    breakdown.smallCategoryId,
                    breakdown.largeCategoryId
                  );
                  const breakdownAssets = [...(assetsByBreakdown.get(breakdownKey) || [])].sort(
                    (a, b) => b.amount - a.amount
                  );

                  return (
                    <div key={breakdownKey} className="p-4 sm:p-5">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
                        <div className="min-w-0 space-y-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h5 className="min-w-0 break-words text-lg font-semibold text-slate-950">
                                {breakdown.smallCategoryName}
                              </h5>
                              <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                {breakdownAssets.length} assets
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              Under {breakdown.largeCategoryName}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                              Total {formatCurrency(breakdown.totalAmount, currencySymbol)}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                              {formatPercentage(breakdown.percentageOfLarge)} of{' '}
                              {breakdown.largeCategoryName}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                              {formatPercentage(breakdown.percentageOfPortfolio)} of portfolio
                            </span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            <span>Allocation within {breakdown.largeCategoryName}</span>
                            <span className="tabular-nums">
                              {formatPercentage(breakdown.percentageOfLarge)}
                            </span>
                          </div>
                          <div className="mt-3 h-2.5 rounded-full bg-slate-200">
                            <div
                              className="h-2.5 rounded-full bg-primary-600"
                              style={{ width: `${breakdown.percentageOfLarge}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-slate-200 pt-3">
                        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-semibold text-slate-900">
                            Assets in {breakdown.smallCategoryName}
                          </p>
                          <p className="text-xs text-slate-500">
                            Edit keeps the context in place and opens the modal above the page.
                          </p>
                        </div>

                        <div className="divide-y divide-slate-200">
                          {breakdownAssets.map((asset) => {
                            const isSelected = selectedAssetId === asset.id;

                            return (
                              <div
                                key={asset.id}
                                className={`py-3 transition first:pt-2 last:pb-1 ${
                                  isSelected
                                    ? 'rounded-2xl bg-primary-50/80 px-3 ring-1 ring-primary-100'
                                    : ''
                                }`}
                              >
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="min-w-0 break-words text-sm font-semibold text-slate-900">
                                        {asset.name}
                                      </p>
                                      {isSelected && (
                                        <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">
                                          Editing
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-1 text-sm tabular-nums text-slate-500">
                                      {formatCurrency(asset.amount, currencySymbol)}
                                    </p>
                                  </div>

                                  {(onEditAsset || onDeleteAsset) && (
                                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
                                      {onEditAsset && (
                                        <Button
                                          variant="secondary"
                                          onClick={() => onEditAsset(asset.id)}
                                          className="w-full px-3 py-2 text-sm sm:w-auto"
                                        >
                                          Edit
                                        </Button>
                                      )}
                                      {onDeleteAsset && (
                                        <Button
                                          variant="danger"
                                          onClick={() => onDeleteAsset(asset.id)}
                                          className="w-full px-3 py-2 text-sm sm:w-auto"
                                        >
                                          Delete
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="rounded-[24px] bg-slate-950 p-4 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Total Portfolio</p>
              <p className="mt-1 text-sm text-slate-300">
                Combined total across all large and small categories
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-semibold tabular-nums">
                {formatCurrency(portfolioTotal, currencySymbol)}
              </p>
              <p className="text-sm text-slate-300">{formatPercentage(portfolioPercentage)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
