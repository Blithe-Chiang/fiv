/**
 * AssetList - Display all assets in a table
 */

import { Asset, LargeCategory, SmallCategory } from '@/types/entities';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '../common/Button';

interface AssetListProps {
  assets: Asset[];
  largeCategories: LargeCategory[];
  smallCategories: SmallCategory[];
  currencySymbol: string;
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
}

export function AssetList({
  assets,
  largeCategories,
  smallCategories,
  currencySymbol,
  onEdit,
  onDelete,
}: AssetListProps) {
  const getCategoryName = (categoryId: string, categories: (LargeCategory | SmallCategory)[]) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No assets yet. Add your first asset to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Small Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Large Category
            </th>
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {asset.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(asset.amount, currencySymbol)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {getCategoryName(asset.smallCategoryId, smallCategories)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {getCategoryName(asset.largeCategoryId, largeCategories)}
              </td>
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="secondary"
                        onClick={() => onEdit(asset)}
                        className="text-xs px-2 py-1"
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="danger"
                        onClick={() => onDelete(asset.id)}
                        className="text-xs px-2 py-1"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
