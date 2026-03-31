/**
 * VisualizationControls - Controls for switching between visualization modes and chart types
 */

import { VisualizationMode, ChartType } from '@/types/ui';

interface VisualizationControlsProps {
  mode: VisualizationMode;
  chartType: ChartType;
  onModeChange: (mode: VisualizationMode) => void;
  onChartTypeChange: (chartType: ChartType) => void;
}

export function VisualizationControls({
  mode,
  chartType,
  onModeChange,
  onChartTypeChange,
}: VisualizationControlsProps) {
  const tabBaseClass =
    'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Visualization Controls
          </p>
          <p className="text-sm leading-6 text-slate-600">
            Choose the most useful inspection mode for the current review task.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              View Mode
            </span>
            <div className="grid gap-2 rounded-2xl bg-slate-100 p-1.5 sm:grid-cols-2">
              <button
                type="button"
                className={`${tabBaseClass} ${
                  mode === 'table'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                }`}
              onClick={() => onModeChange('table')}
              aria-pressed={mode === 'table'}
              aria-label="Show table view"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Table
              </button>
              <button
                type="button"
                className={`${tabBaseClass} ${
                  mode === 'chart'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                }`}
              onClick={() => onModeChange('chart')}
              aria-pressed={mode === 'chart'}
              aria-label="Show chart view"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              Chart
              </button>
            </div>
          </div>

          {mode === 'chart' && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Chart Type
              </span>
              <div className="grid gap-2 rounded-2xl bg-slate-100 p-1.5 sm:grid-cols-2">
                <button
                  type="button"
                  className={`${tabBaseClass} ${
                    chartType === 'pie'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                  onClick={() => onChartTypeChange('pie')}
                  aria-pressed={chartType === 'pie'}
                  aria-label="Show pie chart"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                  Pie
                </button>
                <button
                  type="button"
                  className={`${tabBaseClass} ${
                    chartType === 'bar'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                  onClick={() => onChartTypeChange('bar')}
                  aria-pressed={chartType === 'bar'}
                  aria-label="Show bar chart"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Bar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
