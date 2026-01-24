/**
 * ConflictResolutionModal - Display import conflicts and allow user to choose resolution strategy
 */

import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ImportConflict, ImportStrategy } from '@/types/importExport';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  conflicts: ImportConflict[];
  onResolve: (strategy: ImportStrategy) => void;
  onCancel: () => void;
}

export function ConflictResolutionModal({
  isOpen,
  conflicts,
  onResolve,
  onCancel,
}: ConflictResolutionModalProps) {
  const getEntityTypeLabel = (type: ImportConflict['type']): string => {
    switch (type) {
      case 'largeCategory':
        return 'Large Category';
      case 'smallCategory':
        return 'Small Category';
      case 'asset':
        return 'Asset';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Import Conflicts Detected">
      <div className="space-y-4">
        {/* Warning Header */}
        <div className="flex items-start bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              {conflicts.length} Conflict{conflicts.length !== 1 ? 's' : ''} Found
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              The imported file contains items that conflict with your existing data.
            </p>
          </div>
        </div>

        {/* Conflicts List */}
        <div className="max-h-64 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Existing
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Imported
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conflicts.map((conflict, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                    {getEntityTypeLabel(conflict.type)}
                  </td>
                  <td className="px-3 py-2 text-gray-900">
                    {conflict.existingValue}
                  </td>
                  <td className="px-3 py-2 text-gray-900">
                    {conflict.importedValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resolution Options */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900">Choose how to proceed:</p>

          {/* Merge Option */}
          <div className="border border-gray-300 rounded-lg p-4 hover:border-primary-500 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Merge Import</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Skip conflicting items and add only new data. Your existing data will be
                  preserved.
                </p>
                <ul className="text-xs text-gray-500 mt-2 ml-4 list-disc space-y-1">
                  <li>Keeps all your current data</li>
                  <li>Adds new items from import</li>
                  <li>Skips {conflicts.length} conflicting item{conflicts.length !== 1 ? 's' : ''}</li>
                </ul>
              </div>
              <Button
                variant="secondary"
                onClick={() => onResolve('merge')}
                className="ml-4"
              >
                Merge
              </Button>
            </div>
          </div>

          {/* Replace Option */}
          <div className="border border-red-300 rounded-lg p-4 hover:border-red-500 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Replace All Data</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <strong className="text-red-600">Warning:</strong> This will delete all your
                  existing data and replace it with the imported data.
                </p>
                <ul className="text-xs text-gray-500 mt-2 ml-4 list-disc space-y-1">
                  <li>Deletes all current categories, assets, and settings</li>
                  <li>Replaces with imported data</li>
                  <li className="text-red-600 font-medium">This action cannot be undone</li>
                </ul>
              </div>
              <Button
                variant="danger"
                onClick={() => onResolve('replace')}
                className="ml-4"
              >
                Replace
              </Button>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Cancel Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
