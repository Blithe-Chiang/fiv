/**
 * ExportButton - Trigger portfolio data export to JSON file
 */

import { useState } from 'react';
import { Button } from '../common/Button';
import { PortfolioData } from '@/types/entities';
import { exportToFile, getExportFileSizeEstimate } from '@/services/export';

interface ExportButtonProps {
  portfolioData: PortfolioData;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ExportButton({ portfolioData, onSuccess, onError }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      // Check if there's data to export
      const hasData =
        portfolioData.largeCategories.length > 0 ||
        portfolioData.smallCategories.length > 0 ||
        portfolioData.assets.length > 0;

      if (!hasData) {
        onError?.('No data to export. Please add some categories or assets first.');
        setExporting(false);
        return;
      }

      // Export to file
      exportToFile(portfolioData);

      // Success callback
      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message || 'Failed to export portfolio data');
    } finally {
      setExporting(false);
    }
  };

  const fileSizeEstimate = getExportFileSizeEstimate(portfolioData);

  return (
    <div className="space-y-2">
      <Button onClick={handleExport} disabled={exporting} variant="primary">
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {exporting ? 'Exporting...' : 'Export Portfolio'}
      </Button>
      <p className="text-xs text-gray-500">
        Download your complete portfolio as a JSON file (~{fileSizeEstimate} KB)
      </p>
    </div>
  );
}
