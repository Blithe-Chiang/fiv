/**
 * BreakdownChart - Visualize portfolio breakdown as Pie or Bar chart
 * Supports both large and small category breakdowns
 */

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { LargeCategoryBreakdown, SmallCategoryBreakdown } from '@/types/calculated';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

// WCAG AA compliant color palette with good contrast
const CHART_COLORS = [
  '#0ea5e9', // Sky blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#84cc16', // Lime
  '#06b6d4', // Cyan
  '#a855f7', // Purple
];

export type ChartType = 'pie' | 'bar';

interface BreakdownChartProps {
  breakdowns: LargeCategoryBreakdown[] | SmallCategoryBreakdown[];
  currencySymbol: string;
  chartType: ChartType;
  title?: string;
}

export function BreakdownChart({
  breakdowns,
  currencySymbol,
  chartType,
  title = 'Portfolio Breakdown',
}: BreakdownChartProps) {
  if (breakdowns.length === 0) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        No data to display. Add assets to see your portfolio visualization.
      </div>
    );
  }

  // Prepare chart data
  const chartData = breakdowns.map((breakdown) => {
    if ('smallCategoryId' in breakdown) {
      // SmallCategoryBreakdown
      return {
        name: breakdown.smallCategoryName,
        value: breakdown.totalAmount,
        percentage: breakdown.percentageOfPortfolio,
        largeCategoryName: breakdown.largeCategoryName,
      };
    } else {
      // LargeCategoryBreakdown
      return {
        name: breakdown.categoryName,
        value: breakdown.totalAmount,
        percentage: breakdown.percentage,
      };
    }
  });

  // Sort by value descending for better visualization
  const sortedData = [...chartData].sort((a, b) => b.value - a.value);
  const topEntries = sortedData.slice(0, 5);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="font-semibold text-slate-900">{data.name}</p>
          {data.largeCategoryName && (
            <p className="text-sm text-slate-500">{data.largeCategoryName}</p>
          )}
          <p className="mt-1 text-sm tabular-nums text-slate-900">
            Amount: {formatCurrency(data.value, currencySymbol)}
          </p>
          <p className="text-sm font-medium text-primary-600">
            {formatPercentage(data.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)]">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Visual Breakdown
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Compare proportional exposure and concentration by category.
            </p>
          </div>
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{sortedData.length}</span>
            <span className="ml-2">categories visualized</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
          {chartType === 'pie' ? (
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={128}
                  paddingAngle={2}
                  labelLine={false}
                  fill="#2563eb"
                  dataKey="value"
                  aria-label={`Pie chart showing portfolio breakdown by category. ${sortedData.length} categories displayed.`}
                >
                  {sortedData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={sortedData}
                margin={{ top: 16, right: 12, left: 4, bottom: 52 }}
                aria-label={`Bar chart showing portfolio breakdown by category. ${sortedData.length} categories displayed.`}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  height={72}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Amount" radius={[10, 10, 0, 0]}>
                  {sortedData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Top Exposure
          </p>
          <ul className="mt-4 space-y-3">
            {topEntries.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                    {'largeCategoryName' in item && item.largeCategoryName ? (
                      <p className="mt-1 text-xs text-slate-500">{item.largeCategoryName}</p>
                    ) : null}
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-900">
                    {formatPercentage(item.percentage)}
                  </span>
                </div>
                <p className="mt-2 text-sm tabular-nums text-slate-600">
                  {formatCurrency(item.value, currencySymbol)}
                </p>
              </li>
            ))}
          </ul>

          {sortedData.length > topEntries.length && (
            <p className="mt-4 text-sm text-slate-500">
              +{sortedData.length - topEntries.length} more categories available in the chart.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
