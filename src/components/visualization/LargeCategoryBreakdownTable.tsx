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
      <div className="py-8 text-center text-gray-500">
        No data to display. Add assets to see your portfolio breakdown.
      </div>
    );
  }

  const sortedBreakdowns = [...breakdowns].sort((a, b) => b.percentage - a.percentage);
  const totalAmount = sortedBreakdowns.reduce((sum, breakdown) => sum + breakdown.totalAmount, 0);
  const totalPercentage = sortedBreakdowns.reduce((sum, breakdown) => sum + breakdown.percentage, 0);

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)]">
      <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Allocation
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Large-category distribution
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Macro allocation across the portfolio, ranked by share of total value.
            </p>
          </div>
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900 tabular-nums">
              {formatCurrency(totalAmount, currencySymbol)}
            </span>
            <span className="mx-2 text-slate-300">/</span>
            <span>{sortedBreakdowns.length} categories</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {sortedBreakdowns.map((breakdown) => (
          <div
            key={breakdown.categoryId}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900">{breakdown.categoryName}</p>
                <p className="mt-1 text-sm tabular-nums text-slate-600">
                  {formatCurrency(breakdown.totalAmount, currencySymbol)}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-slate-900">
                {formatPercentage(breakdown.percentage)}
              </p>
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-slate-200">
              <div
                className="h-2.5 rounded-full bg-primary-600"
                style={{ width: `${breakdown.percentage}%` }}
              />
            </div>
          </div>
        ))}

        <div className="rounded-2xl bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold">Total</p>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">
                {formatCurrency(totalAmount, currencySymbol)}
              </p>
              <p className="text-sm text-slate-300">{formatPercentage(totalPercentage)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Category
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Percentage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Allocation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {sortedBreakdowns.map((breakdown, index) => (
              <tr key={breakdown.categoryId} className="transition hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                      {index + 1}
                    </span>
                    <span>{breakdown.categoryName}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm tabular-nums text-slate-900">
                  {formatCurrency(breakdown.totalAmount, currencySymbol)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold tabular-nums text-slate-900">
                  {formatPercentage(breakdown.percentage)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-2.5 w-full max-w-xs rounded-full bg-slate-200">
                      <div
                        className="h-2.5 rounded-full bg-primary-600"
                        style={{ width: `${breakdown.percentage}%` }}
                      />
                    </div>
                    <span className="min-w-[64px] text-sm tabular-nums text-slate-500">
                      {formatPercentage(breakdown.percentage)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/80">
            <tr>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">Total</td>
              <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-slate-900">
                {formatCurrency(totalAmount, currencySymbol)}
              </td>
              <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-slate-900">
                {formatPercentage(totalPercentage)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
