/**
 * AssetForm - Form for creating/editing assets
 * Includes category selection with association validation
 */

import { useEffect, useMemo, useState } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateAssetName, validateAssetAmount } from '@/utils/validators';
import { Asset, LargeCategory, SmallCategory, CategoryAssociation } from '@/types/entities';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface AssetFormProps {
  initialValue?: Asset;
  smallCategories: SmallCategory[];
  largeCategories: LargeCategory[];
  associations: CategoryAssociation[];
  currencySymbol: string;
  onSubmit: (data: {
    name: string;
    amount: number;
    smallCategoryId: string;
    largeCategoryId: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function AssetForm({
  initialValue,
  smallCategories,
  largeCategories,
  associations,
  currencySymbol,
  onSubmit,
  onCancel,
}: AssetFormProps) {
  const [name, setName] = useState(initialValue?.name || '');
  const [amount, setAmount] = useState(initialValue?.amount?.toString() || '');
  const [smallCategoryId, setSmallCategoryId] = useState(initialValue?.smallCategoryId || '');
  const [largeCategoryId, setLargeCategoryId] = useState(initialValue?.largeCategoryId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ name: false, amount: false });

  const debouncedName = useDebouncedValue(name, 300);
  const debouncedAmount = useDebouncedValue(amount, 300);

  // Get valid large categories for selected small category
  const validLargeCategories = useMemo(() => {
    if (!smallCategoryId) return [];
    return associations
      .filter((a) => a.smallCategoryId === smallCategoryId)
      .map((a) => largeCategories.find((lc) => lc.id === a.largeCategoryId))
      .filter(Boolean) as LargeCategory[];
  }, [smallCategoryId, associations, largeCategories]);

  // Get valid small categories for selected large category
  const validSmallCategories = useMemo(() => {
    if (!largeCategoryId) return smallCategories;
    return associations
      .filter((a) => a.largeCategoryId === largeCategoryId)
      .map((a) => smallCategories.find((sc) => sc.id === a.smallCategoryId))
      .filter(Boolean) as SmallCategory[];
  }, [largeCategoryId, associations, smallCategories]);

  // Check if current selection is valid
  const isValidPair = useMemo(() => {
    if (!smallCategoryId || !largeCategoryId) return true;
    return associations.some(
      (a) => a.smallCategoryId === smallCategoryId && a.largeCategoryId === largeCategoryId
    );
  }, [smallCategoryId, largeCategoryId, associations]);

  useEffect(() => {
    if (!touched.name) return;
    const nameError = validateAssetName(debouncedName);
    setErrors((prev) => {
      const next = { ...prev };
      if (nameError) {
        next.name = nameError.message;
      } else {
        delete next.name;
      }
      return next;
    });
  }, [debouncedName, touched.name]);

  useEffect(() => {
    if (!touched.amount) return;
    const amountNum = parseFloat(debouncedAmount);
    const amountError = validateAssetAmount(amountNum);
    setErrors((prev) => {
      const next = { ...prev };
      if (amountError) {
        next.amount = amountError.message;
      } else {
        delete next.amount;
      }
      return next;
    });
  }, [debouncedAmount, touched.amount]);

  const handleSmallCategoryChange = (value: string) => {
    setSmallCategoryId(value);
    // Clear large category if current selection is invalid
    if (largeCategoryId) {
      const isValid = associations.some(
        (a) => a.smallCategoryId === value && a.largeCategoryId === largeCategoryId
      );
      if (!isValid) {
        setLargeCategoryId('');
      }
    }
  };

  const handleLargeCategoryChange = (value: string) => {
    setLargeCategoryId(value);
    // Clear small category if current selection is invalid
    if (smallCategoryId) {
      const isValid = associations.some(
        (a) => a.smallCategoryId === smallCategoryId && a.largeCategoryId === value
      );
      if (!isValid) {
        setSmallCategoryId('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Validate name
    const nameError = validateAssetName(name);
    if (nameError) {
      newErrors.name = nameError.message;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    const amountError = validateAssetAmount(amountNum);
    if (amountError) {
      newErrors.amount = amountError.message;
    }

    // Validate categories
    if (!smallCategoryId) {
      newErrors.smallCategoryId = 'Small category is required';
    }
    if (!largeCategoryId) {
      newErrors.largeCategoryId = 'Large category is required';
    }

    // Validate association exists
    if (smallCategoryId && largeCategoryId && !isValidPair) {
      newErrors.association = 'No association exists between the selected categories';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name,
        amount: amountNum,
        smallCategoryId,
        largeCategoryId,
      });
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to save asset' });
      setSubmitting(false);
    }
  };

  const canSubmit = name.trim() && amount && smallCategoryId && largeCategoryId && isValidPair;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
          {errors.submit}
        </div>
      )}

      {errors.association && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
          {errors.association}
        </div>
      )}

      <Input
        label="Asset Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setTouched((prev) => ({ ...prev, name: true }));
        }}
        error={errors.name}
        placeholder="e.g., Vanguard S&P 500, Apple Stock"
        maxLength={100}
        autoFocus
      />

      <div>
        <Input
          label={`Amount (${currencySymbol})`}
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setTouched((prev) => ({ ...prev, amount: true }));
          }}
          error={errors.amount}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <Select
        label="Small Category"
        value={smallCategoryId}
        onChange={(e) => handleSmallCategoryChange(e.target.value)}
        error={errors.smallCategoryId}
        options={[
          { value: '', label: 'Select a small category...' },
          ...validSmallCategories.map((sc) => ({
            value: sc.id,
            label: sc.name,
          })),
        ]}
      />

      <Select
        label="Large Category"
        value={largeCategoryId}
        onChange={(e) => handleLargeCategoryChange(e.target.value)}
        error={errors.largeCategoryId}
        options={[
          { value: '', label: 'Select a large category...' },
          ...validLargeCategories.map((lc) => ({
            value: lc.id,
            label: lc.name,
          })),
        ]}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit || submitting}>
          {submitting ? 'Saving...' : initialValue ? 'Update Asset' : 'Add Asset'}
        </Button>
      </div>
    </form>
  );
}
