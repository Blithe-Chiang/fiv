/**
 * Export service - Generate JSON export files for portfolio data
 */

import { PortfolioData } from '@/types/entities';
import { ExportFile } from '@/types/importExport';

const EXPORT_VERSION = '1.0';

/**
 * Generate an export file from portfolio data
 * @param portfolioData Complete portfolio data to export
 * @returns ExportFile structure ready for serialization
 */
export function generateExportFile(portfolioData: PortfolioData): ExportFile {
  return {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    portfolio: portfolioData,
  };
}

/**
 * Export portfolio data as a downloadable JSON file
 * @param portfolioData Complete portfolio data to export
 * @param filename Optional filename (default: portfolio-backup-YYYYMMDD.json)
 */
export function exportToFile(portfolioData: PortfolioData, filename?: string): void {
  const exportFile = generateExportFile(portfolioData);
  const jsonString = JSON.stringify(exportFile, null, 2);

  // Create blob and download link
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Generate default filename with date
  const defaultFilename = `portfolio-backup-${formatDateForFilename(new Date())}.json`;
  const finalFilename = filename || defaultFilename;

  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format date as YYYYMMDD for filename
 */
function formatDateForFilename(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Get export file size estimate in KB
 * @param portfolioData Portfolio data to estimate
 * @returns Estimated file size in kilobytes
 */
export function getExportFileSizeEstimate(portfolioData: PortfolioData): number {
  const exportFile = generateExportFile(portfolioData);
  const jsonString = JSON.stringify(exportFile);
  const bytes = new Blob([jsonString]).size;
  return Math.ceil(bytes / 1024); // Convert to KB
}
