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
  const cards = [
    {
      label: 'Asset Positions',
      value: summary.totalAssets.toString(),
      detail: 'Tracked holdings recorded in the portfolio',
    },
    {
      label: 'Large Categories',
      value: summary.largeCategoryCount.toString(),
      detail: 'Top-level allocation buckets',
    },
    {
      label: 'Small Categories',
      value: summary.smallCategoryCount.toString(),
      detail: 'Detailed slices within each allocation bucket',
    },
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
      <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Portfolio Summary
        </p>
        <p className="mt-4 text-sm font-medium text-slate-600">Total Value</p>
        <p className="mt-3 text-4xl font-semibold tabular-nums text-slate-950 sm:text-[2.75rem]">
          {formatCurrency(summary.totalValue, currencySymbol)}
        </p>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
          A consolidated snapshot of the portfolio value and structural breadth across all tracked
          categories.
        </p>
      </div>

      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {card.label}
          </p>
          <p className="mt-4 text-3xl font-semibold tabular-nums text-slate-950">
            {card.value}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{card.detail}</p>
        </div>
      ))}
    </section>
  );
}
