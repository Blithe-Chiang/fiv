/**
 * AssociationManager - Manage associations between small and large categories
 */

import { useState } from 'react';
import { SmallCategory, LargeCategory, CategoryAssociation } from '@/types/entities';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

interface AssociationManagerProps {
  smallCategory: SmallCategory;
  largeCategories: LargeCategory[];
  currentAssociations: CategoryAssociation[];
  onAdd: (largeCategoryId: string) => Promise<void>;
  onRemove: (largeCategoryId: string) => Promise<void>;
  onClose: () => void;
}

export function AssociationManager({
  smallCategory,
  largeCategories,
  currentAssociations,
  onAdd,
  onRemove,
  onClose,
}: AssociationManagerProps) {
  const [selectedLargeCategoryId, setSelectedLargeCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const linkedLargeCategoryIds = new Set(
    currentAssociations
      .filter((a) => a.smallCategoryId === smallCategory.id)
      .map((a) => a.largeCategoryId)
  );

  const availableLargeCategories = largeCategories.filter(
    (lc) => !linkedLargeCategoryIds.has(lc.id)
  );

  const linkedLargeCategories = largeCategories.filter((lc) => linkedLargeCategoryIds.has(lc.id));

  const handleAdd = async () => {
    if (!selectedLargeCategoryId) return;

    setSubmitting(true);
    setError('');
    try {
      await onAdd(selectedLargeCategoryId);
      setSelectedLargeCategoryId('');
    } catch (err: any) {
      setError(err.message || 'Failed to add association');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (largeCategoryId: string) => {
    setSubmitting(true);
    setError('');
    try {
      await onRemove(largeCategoryId);
    } catch (err: any) {
      setError(err.message || 'Failed to remove association');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Managing associations for: <span className="text-gray-900">{smallCategory.name}</span>
        </h4>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Current Associations */}
      <div>
        <h5 className="text-sm font-medium text-gray-700 mb-2">Currently Linked To:</h5>
        {linkedLargeCategories.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No associations yet</p>
        ) : (
          <div className="space-y-2">
            {linkedLargeCategories.map((lc) => (
              <div
                key={lc.id}
                className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm">{lc.name}</span>
                <Button
                  variant="danger"
                  onClick={() => handleRemove(lc.id)}
                  disabled={submitting}
                  className="w-full px-3 py-2 text-xs sm:w-auto"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Association */}
      {availableLargeCategories.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Add New Association:</h5>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              value={selectedLargeCategoryId}
              onChange={(e) => setSelectedLargeCategoryId(e.target.value)}
              options={[
                { value: '', label: 'Select a large category...' },
                ...availableLargeCategories.map((lc) => ({
                  value: lc.id,
                  label: lc.name,
                })),
              ]}
              className="flex-1"
            />
            <Button
              onClick={handleAdd}
              disabled={!selectedLargeCategoryId || submitting}
              className="w-full sm:w-auto"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {availableLargeCategories.length === 0 && linkedLargeCategories.length > 0 && (
        <p className="text-sm text-gray-500 italic">
          All large categories are already linked
        </p>
      )}

      <div className="flex justify-end pt-4">
        <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
          Done
        </Button>
      </div>
    </div>
  );
}
