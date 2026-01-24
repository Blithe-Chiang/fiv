/**
 * DeleteConfirmationModal - Confirmation dialog for asset deletion
 * Provides better UX than browser confirm dialog
 */

import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  assetName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  assetName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Asset">
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
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
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Are you sure you want to delete <strong>"{assetName}"</strong>?
              </p>
              <p className="mt-2">
                This action cannot be undone. The asset will be permanently removed from your
                portfolio and all breakdowns will be recalculated.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Asset
          </Button>
        </div>
      </div>
    </Modal>
  );
}
