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
  /** Optional ID of a large category being deleted. */
  deletingLargeId?: string | null;
  /** Optional ID of a small category being deleted. */
  deletingSmallId?: string | null;
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
  deletingLargeId,
  deletingSmallId,
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
      <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)] sm:p-6">
        <h3 className="mb-1 text-xl font-semibold text-slate-950">Large Categories</h3>
        <p className="mb-4 text-sm text-slate-500">Top-level buckets used for macro allocation.</p>
        {largeCategories.length === 0 ? (
          <p className="italic text-slate-500">No large categories yet</p>
        ) : (
          <div className="space-y-2">
            {largeCategories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-slate-900">{category.name}</span>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="secondary"
                    onClick={() => onEditLarge(category)}
                    className="w-full px-3 py-2 text-sm sm:w-auto"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDeleteLarge(category.id)}
                    className="w-full px-3 py-2 text-sm sm:w-auto"
                    disabled={deletingLargeId === category.id}
                  >
                    {deletingLargeId === category.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Small Categories */}
      <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)] sm:p-6">
        <h3 className="mb-1 text-xl font-semibold text-slate-950">Small Categories</h3>
        <p className="mb-4 text-sm text-slate-500">
          Detailed slices that roll up into large categories through associations.
        </p>
        {smallCategories.length === 0 ? (
          <p className="italic text-slate-500">No small categories yet</p>
        ) : (
          <div className="space-y-2">
            {smallCategories.map((category) => {
              const linkedLargeCategories = getAssociationsForSmall(category.id);
              return (
                <div
                  key={category.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                >
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <span className="font-medium text-slate-900">{category.name}</span>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="secondary"
                        onClick={() => onManageAssociations(category)}
                        className="w-full px-3 py-2 text-sm sm:w-auto"
                      >
                        Manage Links
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onEditSmall(category)}
                        className="w-full px-3 py-2 text-sm sm:w-auto"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => onDeleteSmall(category.id)}
                        className="w-full px-3 py-2 text-sm sm:w-auto"
                        disabled={deletingSmallId === category.id}
                      >
                        {deletingSmallId === category.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                  {linkedLargeCategories.length > 0 && (
                    <div className="text-sm text-slate-600">
                      Linked to: {linkedLargeCategories.map((lc) => lc.name).join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
