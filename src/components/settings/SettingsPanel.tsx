/**
 * SettingsPanel - Currency symbol configuration panel.
 */

import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { validateCurrencySymbol } from '@/utils/validators';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface SettingsPanelProps {
  /** Current currency symbol displayed across the app. */
  currencySymbol: string;
  /** Persist the updated symbol. */
  onSave: (symbol: string) => Promise<void>;
}

export function SettingsPanel({ currencySymbol, onSave }: SettingsPanelProps) {
  const [symbol, setSymbol] = useState(currencySymbol);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const debouncedSymbol = useDebouncedValue(symbol, 300);

  useEffect(() => {
    if (!touched) return;
    const validationError = validateCurrencySymbol(debouncedSymbol);
    setError(validationError ? validationError.message : '');
  }, [debouncedSymbol, touched]);

  useEffect(() => {
    setSymbol(currencySymbol);
  }, [currencySymbol]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    const validationError = validateCurrencySymbol(symbol);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setSaving(true);
    try {
      await onSave(symbol.trim());
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to update currency symbol');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Currency Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Currency Symbol"
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value);
            if (!touched) setTouched(true);
          }}
          error={error}
          placeholder="$"
          maxLength={5}
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Currently using: <strong>{currencySymbol}</strong>
          </p>
          <Button type="submit" disabled={saving || !!error}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}
