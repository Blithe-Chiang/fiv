/**
 * VisualizationControls - Controls for switching between visualization modes and chart types
 */

import { VisualizationMode, ChartType } from '@/types/ui';
import { Button } from '@/components/common/Button';

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
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow">
      {/* Visualization Mode Toggle */}
      <div className="flex gap-2">
        <span className="text-sm font-medium text-gray-700 self-center mr-2">
          View:
        </span>
        <Button
          variant={mode === 'table' ? 'primary' : 'secondary'}
          onClick={() => onModeChange('table')}
          aria-pressed={mode === 'table'}
          aria-label="Show table view"
        >
          <svg
            className="w-4 h-4 mr-2"
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
        </Button>
        <Button
          variant={mode === 'chart' ? 'primary' : 'secondary'}
          onClick={() => onModeChange('chart')}
          aria-pressed={mode === 'chart'}
          aria-label="Show chart view"
        >
          <svg
            className="w-4 h-4 mr-2"
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
        </Button>
      </div>

      {/* Chart Type Toggle - Only visible when in chart mode */}
      {mode === 'chart' && (
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 self-center mr-2">
            Chart Type:
          </span>
          <Button
            variant={chartType === 'pie' ? 'primary' : 'secondary'}
            onClick={() => onChartTypeChange('pie')}
            aria-pressed={chartType === 'pie'}
            aria-label="Show pie chart"
          >
            <svg
              className="w-4 h-4 mr-2"
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
          </Button>
          <Button
            variant={chartType === 'bar' ? 'primary' : 'secondary'}
            onClick={() => onChartTypeChange('bar')}
            aria-pressed={chartType === 'bar'}
            aria-label="Show bar chart"
          >
            <svg
              className="w-4 h-4 mr-2"
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
          </Button>
        </div>
      )}
    </div>
  );
}
