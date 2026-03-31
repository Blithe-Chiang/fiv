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
import { AssetDraftUpdate } from '@/types/ui';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface AssetFormProps {
  initialValue?: Asset;
  smallCategories: SmallCategory[];
  largeCategories: LargeCategory[];
  associations: CategoryAssociation[];
  currencySymbol: string;
  onDraftChange?: (draft: AssetDraftUpdate | null) => void;
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
  onDraftChange,
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

  useEffect(() => {
    setName(initialValue?.name || '');
    setAmount(initialValue?.amount?.toString() || '');
    setSmallCategoryId(initialValue?.smallCategoryId || '');
    setLargeCategoryId(initialValue?.largeCategoryId || '');
    setErrors({});
    setSubmitting(false);
    setTouched({ name: false, amount: false });
  }, [initialValue]);

  const validLargeCategories = useMemo(() => {
    if (!smallCategoryId) return [];
    return associations
      .filter((association) => association.smallCategoryId === smallCategoryId)
      .map((association) =>
        largeCategories.find((category) => category.id === association.largeCategoryId)
      )
      .filter(Boolean) as LargeCategory[];
  }, [smallCategoryId, associations, largeCategories]);

  const validSmallCategories = useMemo(() => {
    if (!largeCategoryId) return smallCategories;
    return associations
      .filter((association) => association.largeCategoryId === largeCategoryId)
      .map((association) =>
        smallCategories.find((category) => category.id === association.smallCategoryId)
      )
      .filter(Boolean) as SmallCategory[];
  }, [largeCategoryId, associations, smallCategories]);

  const isValidPair = useMemo(() => {
    if (!smallCategoryId || !largeCategoryId) return true;
    return associations.some(
      (association) =>
        association.smallCategoryId === smallCategoryId &&
        association.largeCategoryId === largeCategoryId
    );
  }, [smallCategoryId, largeCategoryId, associations]);

  useEffect(() => {
    if (!initialValue || !onDraftChange) return;

    const amountNum = parseFloat(amount);
    const canUseCategories = Boolean(smallCategoryId && largeCategoryId && isValidPair);

    onDraftChange({
      id: initialValue.id,
      name: name.trim() || undefined,
      amount: Number.isFinite(amountNum) ? amountNum : undefined,
      smallCategoryId: canUseCategories ? smallCategoryId : undefined,
      largeCategoryId: canUseCategories ? largeCategoryId : undefined,
    });
  }, [initialValue, onDraftChange, name, amount, smallCategoryId, largeCategoryId, isValidPair]);

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
    if (largeCategoryId) {
      const pairIsValid = associations.some(
        (association) =>
          association.smallCategoryId === value &&
          association.largeCategoryId === largeCategoryId
      );

      if (!pairIsValid) {
        setLargeCategoryId('');
      }
    }
  };

  const handleLargeCategoryChange = (value: string) => {
    setLargeCategoryId(value);
    if (smallCategoryId) {
      const pairIsValid = associations.some(
        (association) =>
          association.smallCategoryId === smallCategoryId &&
          association.largeCategoryId === value
      );

      if (!pairIsValid) {
        setSmallCategoryId('');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};
    const nameError = validateAssetName(name);
    const amountNum = parseFloat(amount);
    const amountError = validateAssetAmount(amountNum);

    if (nameError) {
      newErrors.name = nameError.message;
    }

    if (amountError) {
      newErrors.amount = amountError.message;
    }

    if (!smallCategoryId) {
      newErrors.smallCategoryId = 'Small category is required';
    }

    if (!largeCategoryId) {
      newErrors.largeCategoryId = 'Large category is required';
    }

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
        name: name.trim(),
        amount: amountNum,
        smallCategoryId,
        largeCategoryId,
      });
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to save asset' });
      onDraftChange?.(null);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onDraftChange?.(null);
    onCancel();
  };

  const canSubmit = Boolean(name.trim() && amount && smallCategoryId && largeCategoryId && isValidPair);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.submit && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errors.submit}
        </div>
      )}

      {errors.association && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errors.association}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Input
          label="Asset Name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setTouched((prev) => ({ ...prev, name: true }));
          }}
          error={errors.name}
          placeholder="e.g., Vanguard S&P 500, Apple Stock"
          maxLength={100}
          autoFocus
        />

        <Input
          label={`Amount (${currencySymbol})`}
          type="number"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setTouched((prev) => ({ ...prev, amount: true }));
          }}
          error={errors.amount}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Select
          label="Small Category"
          value={smallCategoryId}
          onChange={(event) => handleSmallCategoryChange(event.target.value)}
          error={errors.smallCategoryId}
          options={[
            { value: '', label: 'Select a small category...' },
            ...validSmallCategories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          ]}
        />

        <Select
          label="Large Category"
          value={largeCategoryId}
          onChange={(event) => handleLargeCategoryChange(event.target.value)}
          error={errors.largeCategoryId}
          options={[
            { value: '', label: 'Select a large category...' },
            ...validLargeCategories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          ]}
        />
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-900">
          {initialValue ? 'Editing tip' : 'New asset tip'}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {initialValue
            ? 'As you change the asset, the detailed breakdown beside this form updates so you can compare the allocation before saving.'
            : 'Pick a small category first to narrow the valid large-category choices, or start from a large category if that is easier.'}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit || submitting} className="w-full sm:w-auto">
          {submitting ? 'Saving...' : initialValue ? 'Update Asset' : 'Add Asset'}
        </Button>
      </div>
    </form>
  );
}
