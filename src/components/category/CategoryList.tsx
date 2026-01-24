/**
 * CategoryList - Display all categories with their associations
 */

import { LargeCategory, SmallCategory, CategoryAssociation } from '@/types/entities';
import { Button } from '../common/Button';

interface CategoryListProps {
  largeCategories: LargeCategory[];
  smallCategories: SmallCategory[];
  associations: CategoryAssociation[];
  onEditLarge: (category: LargeCategory) => void;
  onDeleteLarge: (id: string) => void;
  onEditSmall: (category: SmallCategory) => void;
  onDeleteSmall: (id: string) => void;
  onManageAssociations: (category: SmallCategory) => void;
}

export function CategoryList({
  largeCategories,
  smallCategories,
  associations,
  onEditLarge,
  onDeleteLarge,
  onEditSmall,
  onDeleteSmall,
  onManageAssociations,
}: CategoryListProps) {
  const getAssociationsForSmall = (smallId: string) => {
    return associations
      .filter((a) => a.smallCategoryId === smallId)
      .map((a) => largeCategories.find((lc) => lc.id === a.largeCategoryId))
      .filter(Boolean) as LargeCategory[];
  };

  return (
    <div className="space-y-8">
      {/* Large Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Large Categories</h3>
        {largeCategories.length === 0 ? (
          <p className="text-gray-500 italic">No large categories yet</p>
        ) : (
          <div className="space-y-2">
            {largeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
              >
                <span className="font-medium">{category.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => onEditLarge(category)}
                    className="text-sm px-3 py-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDeleteLarge(category.id)}
                    className="text-sm px-3 py-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Small Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Small Categories</h3>
        {smallCategories.length === 0 ? (
          <p className="text-gray-500 italic">No small categories yet</p>
        ) : (
          <div className="space-y-2">
            {smallCategories.map((category) => {
              const linkedLargeCategories = getAssociationsForSmall(category.id);
              return (
                <div
                  key={category.id}
                  className="p-3 bg-white border border-gray-200 rounded-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => onManageAssociations(category)}
                        className="text-sm px-3 py-1"
                      >
                        Manage Links
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onEditSmall(category)}
                        className="text-sm px-3 py-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => onDeleteSmall(category.id)}
                        className="text-sm px-3 py-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  {linkedLargeCategories.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Linked to: {linkedLargeCategories.map((lc) => lc.name).join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
