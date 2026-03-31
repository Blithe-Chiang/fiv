/**
 * AssetList - Display all assets in a responsive list or table
 */

import { Asset, LargeCategory, SmallCategory } from '@/types/entities';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '../common/Button';

interface AssetListProps {
  assets: Asset[];
  largeCategories: LargeCategory[];
  smallCategories: SmallCategory[];
  currencySymbol: string;
  layout?: 'table' | 'cards';
  selectedAssetId?: string | null;
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
}

export function AssetList({
  assets,
  largeCategories,
  smallCategories,
  currencySymbol,
  layout = 'table',
  selectedAssetId = null,
  onEdit,
  onDelete,
}: AssetListProps) {
  const getCategoryName = (categoryId: string, categories: (LargeCategory | SmallCategory)[]) => {
    const category = categories.find((item) => item.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (assets.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No assets yet. Add your first asset to get started.
      </div>
    );
  }

  const renderActions = (asset: Asset) =>
    onEdit || onDelete ? (
      <div className="flex flex-col gap-2 sm:flex-row">
        {onEdit && (
          <Button
            variant="secondary"
            onClick={() => onEdit(asset)}
            className="w-full px-3 py-2 text-sm sm:w-auto"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="danger"
            onClick={() => onDelete(asset.id)}
            className="w-full px-3 py-2 text-sm sm:w-auto"
          >
            Delete
          </Button>
        )}
      </div>
    ) : null;

  const renderCard = (asset: Asset) => {
    const isSelected = selectedAssetId === asset.id;
    const smallCategory = getCategoryName(asset.smallCategoryId, smallCategories);
    const largeCategory = getCategoryName(asset.largeCategoryId, largeCategories);

    return (
      <div
        key={asset.id}
        className={`rounded-xl border p-4 transition-colors ${
          isSelected
            ? 'border-primary-300 bg-primary-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-base font-semibold text-gray-900">{asset.name}</p>
                {isSelected && (
                  <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                    Editing
                  </span>
                )}
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(asset.amount, currencySymbol)}
              </p>
            </div>
            {renderActions(asset)}
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Small Category
              </dt>
              <dd className="mt-1 font-medium text-gray-900">{smallCategory}</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Large Category
              </dt>
              <dd className="mt-1 font-medium text-gray-900">{largeCategory}</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };

  if (layout === 'cards') {
    return <div className="space-y-3 p-4 sm:p-5">{assets.map(renderCard)}</div>;
  }

  return (
    <>
      <div className="space-y-3 p-4 lg:hidden">{assets.map(renderCard)}</div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Small Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Large Category
              </th>
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {assets.map((asset) => {
              const isSelected = selectedAssetId === asset.id;

              return (
                <tr
                  key={asset.id}
                  className={isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {asset.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(asset.amount, currencySymbol)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {getCategoryName(asset.smallCategoryId, smallCategories)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {getCategoryName(asset.largeCategoryId, largeCategories)}
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="secondary"
                            onClick={() => onEdit(asset)}
                            className="px-2 py-1 text-xs"
                          >
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="danger"
                            onClick={() => onDelete(asset.id)}
                            className="px-2 py-1 text-xs"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
