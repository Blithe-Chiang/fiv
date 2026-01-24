/**
 * SmallCategoryForm - Form for creating/editing small categories
 */

import { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateCategoryName } from '@/utils/validators';
import { SmallCategory } from '@/types/entities';

interface SmallCategoryFormProps {
  initialValue?: SmallCategory;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}

export function SmallCategoryForm({ initialValue, onSubmit, onCancel }: SmallCategoryFormProps) {
  const [name, setName] = useState(initialValue?.name || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateCategoryName(name);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(name);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        placeholder="e.g., S&P 500 Index, Growth Stocks"
        maxLength={50}
        autoFocus
      />
      <div className="text-sm text-gray-500">
        {name.length}/50 characters
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || !name.trim()}>
          {submitting ? 'Saving...' : initialValue ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
