/**
 * Helpers for applying draft asset edits to derived calculations.
 */

import { Asset } from '@/types/entities';
import { AssetDraftUpdate } from '@/types/ui';

function isValidAmount(amount: number | undefined): amount is number {
  return typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
}

export function applyAssetDraft(
  assets: Asset[],
  draft: AssetDraftUpdate | null | undefined
): Asset[] {
  if (!draft) return assets;

  return assets.map((asset) => {
    if (asset.id !== draft.id) return asset;

    return {
      ...asset,
      ...(draft.name ? { name: draft.name } : {}),
      ...(isValidAmount(draft.amount) ? { amount: draft.amount } : {}),
      ...(draft.smallCategoryId ? { smallCategoryId: draft.smallCategoryId } : {}),
      ...(draft.largeCategoryId ? { largeCategoryId: draft.largeCategoryId } : {}),
    };
  });
}
