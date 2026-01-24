/**
 * ImportExportPanel - Complete import/export workflow with conflict resolution
 */

import { useState } from 'react';
import { ExportButton } from './ExportButton';
import { ImportButton } from './ImportButton';
import { ConflictResolutionModal } from './ConflictResolutionModal';
import { PortfolioData } from '@/types/entities';
import { ExportFile, ImportResult, ImportStrategy } from '@/types/importExport';
import { importPortfolioData, detectConflicts, validateReferentialIntegrity } from '@/services/import';
import { ErrorMessage } from '../common/ErrorMessage';

interface ImportExportPanelProps {
  portfolioData: PortfolioData;
  onImportSuccess: (data: PortfolioData, result: ImportResult) => void;
  onExportSuccess?: () => void;
}

export function ImportExportPanel({
  portfolioData,
  onImportSuccess,
  onExportSuccess,
}: ImportExportPanelProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingImport, setPendingImport] = useState<{
    exportFile: ExportFile;
    file: File;
  } | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const handleExportSuccess = () => {
    setSuccess('Portfolio exported successfully!');
    setError('');
    setTimeout(() => setSuccess(''), 5000);
    onExportSuccess?.();
  };

  const handleExportError = (errorMsg: string) => {
    setError(errorMsg);
    setSuccess('');
  };

  const handleFileSelected = (exportFile: ExportFile, file: File) => {
    try {
      // Validate referential integrity
      const integrityErrors = validateReferentialIntegrity(exportFile.portfolio);
      if (integrityErrors.length > 0) {
        setError(
          `Import validation failed:\n${integrityErrors.slice(0, 3).join('\n')}${
            integrityErrors.length > 3 ? `\n...and ${integrityErrors.length - 3} more errors` : ''
          }`
        );
        return;
      }

      // Check for conflicts
      const conflicts = detectConflicts(portfolioData, exportFile.portfolio);

      if (conflicts.length > 0) {
        // Show conflict resolution modal
        setPendingImport({ exportFile, file });
        setShowConflictModal(true);
        setError('');
      } else {
        // No conflicts - proceed with merge directly
        performImport(exportFile, 'merge');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to process import file');
      setSuccess('');
    }
  };

  const handleImportError = (errorMsg: string) => {
    setError(errorMsg);
    setSuccess('');
  };

  const handleConflictResolution = (strategy: ImportStrategy) => {
    if (!pendingImport) return;

    try {
      performImport(pendingImport.exportFile, strategy);
      setShowConflictModal(false);
      setPendingImport(null);
    } catch (error: any) {
      setError(error.message || 'Import failed');
      setSuccess('');
      setShowConflictModal(false);
      setPendingImport(null);
    }
  };

  const handleCancelImport = () => {
    setShowConflictModal(false);
    setPendingImport(null);
    setError('');
  };

  const performImport = (exportFile: ExportFile, strategy: ImportStrategy) => {
    try {
      // Create a working copy of portfolio data
      const workingData: PortfolioData = JSON.parse(JSON.stringify(portfolioData));

      // Perform import
      const result = importPortfolioData(workingData, exportFile, strategy);

      // Get final data based on strategy
      const finalData = strategy === 'replace' ? exportFile.portfolio : workingData;

      // Success - pass to parent
      onImportSuccess(finalData, result);

      // Show success message
      const totalImported =
        result.imported.largeCategories +
        result.imported.smallCategories +
        result.imported.associations +
        result.imported.assets;

      const totalSkipped =
        result.skipped.largeCategories +
        result.skipped.smallCategories +
        result.skipped.associations +
        result.skipped.assets;

      let successMsg = `Import successful! Added ${totalImported} item${totalImported !== 1 ? 's' : ''}.`;
      if (totalSkipped > 0) {
        successMsg += ` Skipped ${totalSkipped} duplicate${totalSkipped !== 1 ? 's' : ''}.`;
      }

      setSuccess(successMsg);
      setError('');
      setTimeout(() => setSuccess(''), 7000);
    } catch (error: any) {
      throw error;
    }
  };

  const conflicts = pendingImport
    ? detectConflicts(portfolioData, pendingImport.exportFile.portfolio)
    : [];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Portability</h2>
        <p className="text-sm text-gray-600">
          Export your portfolio to backup your data, or import from a previously exported file.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      {/* Export/Import Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Export</h3>
          <ExportButton
            portfolioData={portfolioData}
            onSuccess={handleExportSuccess}
            onError={handleExportError}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Import</h3>
          <ImportButton
            onFileSelected={handleFileSelected}
            onError={handleImportError}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How it works</h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>
            <strong>Export:</strong> Download your complete portfolio as a JSON file for backup
          </li>
          <li>
            <strong>Import:</strong> Upload a previously exported file to restore or merge data
          </li>
          <li>
            Conflicts are detected automatically - you'll be asked how to handle them
          </li>
          <li>
            Data is validated to ensure consistency before import
          </li>
        </ul>
      </div>

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={showConflictModal}
        conflicts={conflicts}
        onResolve={handleConflictResolution}
        onCancel={handleCancelImport}
      />
    </div>
  );
}
