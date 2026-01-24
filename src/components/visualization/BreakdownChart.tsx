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
  Legend,
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
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          {data.largeCategoryName && (
            <p className="text-sm text-gray-600">{data.largeCategoryName}</p>
          )}
          <p className="text-sm text-gray-900 mt-1">
            Amount: {formatCurrency(data.value, currencySymbol)}
          </p>
          <p className="text-sm text-primary-600 font-medium">
            {formatPercentage(data.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${formatPercentage(percentage)})`}
                outerRadius={120}
                fill="#8884d8"
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
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, _entry: any) => {
                  const data = sortedData.find((d) => d.name === value);
                  return `${value} - ${formatPercentage(data?.percentage || 0)}`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              aria-label={`Bar chart showing portfolio breakdown by category. ${sortedData.length} categories displayed.`}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: `Amount (${currencySymbol})`,
                  angle: -90,
                  position: 'insideLeft',
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={() => 'Amount'}
              />
              <Bar dataKey="value" fill="#0ea5e9" name="Amount">
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

      {/* Mobile-friendly data summary */}
      <div className="px-6 pb-4 sm:hidden">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Categories:</p>
          <ul className="space-y-1">
            {sortedData.slice(0, 5).map((item, index) => (
              <li key={index} className="flex justify-between">
                <span className="truncate mr-2">{item.name}</span>
                <span className="font-medium whitespace-nowrap">
                  {formatPercentage(item.percentage)}
                </span>
              </li>
            ))}
            {sortedData.length > 5 && (
              <li className="text-gray-400">
                +{sortedData.length - 5} more categories
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
