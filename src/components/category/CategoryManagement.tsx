/**
 * CategoryManagement - Main page for managing categories and associations
 */

import { useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { LargeCategory, SmallCategory } from '@/types/entities';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { CategoryList } from './CategoryList';
import { LargeCategoryForm } from './LargeCategoryForm';
import { SmallCategoryForm } from './SmallCategoryForm';
import { AssociationManager } from './AssociationManager';
import { useToast } from '../common/Toast';
import { getUserFriendlyError } from '@/utils/errors';
import { Skeleton } from '../common/Skeleton';

type ModalState =
  | { type: 'none' }
  | { type: 'createLarge' }
  | { type: 'editLarge'; category: LargeCategory }
  | { type: 'createSmall' }
  | { type: 'editSmall'; category: SmallCategory }
  | { type: 'associations'; category: SmallCategory };

export function CategoryManagement() {
  const portfolio = usePortfolio();
  const toast = useToast();
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [error, setError] = useState('');
  const [deletingLargeId, setDeletingLargeId] = useState<string | null>(null);
  const [deletingSmallId, setDeletingSmallId] = useState<string | null>(null);

  if (portfolio.loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (portfolio.error) {
    return (
      <div className="p-4">
        <ErrorMessage message={portfolio.error} />
      </div>
    );
  }

  const hasCategories =
    portfolio.largeCategories.length > 0 || portfolio.smallCategories.length > 0;

  const handleCreateLarge = async (name: string) => {
    try {
      await portfolio.createLargeCategory({ name });
      setModalState({ type: 'none' });
      setError('');
      toast.success('Large category created', name);
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to save category'));
    }
  };

  const handleUpdateLarge = async (id: string, name: string) => {
    try {
      await portfolio.updateLargeCategory(id, { name });
      setModalState({ type: 'none' });
      setError('');
      toast.success('Large category updated', name);
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to save category'));
    }
  };

  const handleDeleteLarge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this large category?')) return;
    try {
      setDeletingLargeId(id);
      await portfolio.deleteLargeCategory(id);
      setError('');
      toast.success('Large category deleted');
    } catch (err: any) {
      setError(getUserFriendlyError(err, 'Failed to delete category'));
    } finally {
      setDeletingLargeId(null);
    }
  };

  const handleCreateSmall = async (name: string) => {
    try {
      await portfolio.createSmallCategory({ name });
      setModalState({ type: 'none' });
      setError('');
      toast.success('Small category created', name);
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to save category'));
    }
  };

  const handleUpdateSmall = async (id: string, name: string) => {
    try {
      await portfolio.updateSmallCategory(id, { name });
      setModalState({ type: 'none' });
      setError('');
      toast.success('Small category updated', name);
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to save category'));
    }
  };

  const handleDeleteSmall = async (id: string) => {
    if (!confirm('Are you sure you want to delete this small category?')) return;
    try {
      setDeletingSmallId(id);
      await portfolio.deleteSmallCategory(id);
      setError('');
      toast.success('Small category deleted');
    } catch (err: any) {
      setError(getUserFriendlyError(err, 'Failed to delete category'));
    } finally {
      setDeletingSmallId(null);
    }
  };

  const handleAddAssociation = async (smallCategoryId: string, largeCategoryId: string) => {
    try {
      await portfolio.createAssociation({ smallCategoryId, largeCategoryId });
      setError('');
      toast.success('Association added');
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to add association'));
    }
  };

  const handleRemoveAssociation = async (smallCategoryId: string, largeCategoryId: string) => {
    try {
      await portfolio.deleteAssociation(smallCategoryId, largeCategoryId);
      setError('');
      toast.success('Association removed');
    } catch (err: any) {
      throw new Error(getUserFriendlyError(err, 'Failed to remove association'));
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)] sm:px-6">
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Category Model
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Category Management</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Define large and small categories for organizing your assets
        </p>
      </section>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => setModalState({ type: 'createLarge' })}
          className="w-full sm:w-auto"
        >
          Add Large Category
        </Button>
        <Button
          variant="secondary"
          onClick={() => setModalState({ type: 'createSmall' })}
          className="w-full sm:w-auto"
        >
          Add Small Category
        </Button>
      </div>

      {!hasCategories ? (
        <EmptyState
          title="No categories yet"
          description="Start by creating large categories (e.g., 'US Stocks', 'International Bonds') and small categories (e.g., 'S&P 500', 'Growth Stocks') to organize your portfolio."
          action={{
            label: 'Add Your First Category',
            onClick: () => setModalState({ type: 'createLarge' }),
          }}
        />
      ) : (
        <CategoryList
          largeCategories={portfolio.largeCategories}
          smallCategories={portfolio.smallCategories}
          associations={portfolio.associations}
          onEditLarge={(category) => setModalState({ type: 'editLarge', category })}
          onDeleteLarge={handleDeleteLarge}
          onEditSmall={(category) => setModalState({ type: 'editSmall', category })}
          onDeleteSmall={handleDeleteSmall}
          onManageAssociations={(category) => setModalState({ type: 'associations', category })}
          deletingLargeId={deletingLargeId}
          deletingSmallId={deletingSmallId}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={modalState.type === 'createLarge'}
        onClose={() => setModalState({ type: 'none' })}
        title="Create Large Category"
      >
        <LargeCategoryForm
          onSubmit={handleCreateLarge}
          onCancel={() => setModalState({ type: 'none' })}
        />
      </Modal>

      <Modal
        isOpen={modalState.type === 'editLarge'}
        onClose={() => setModalState({ type: 'none' })}
        title="Edit Large Category"
      >
        {modalState.type === 'editLarge' && (
          <LargeCategoryForm
            initialValue={modalState.category}
            onSubmit={(name) => handleUpdateLarge(modalState.category.id, name)}
            onCancel={() => setModalState({ type: 'none' })}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalState.type === 'createSmall'}
        onClose={() => setModalState({ type: 'none' })}
        title="Create Small Category"
      >
        <SmallCategoryForm
          onSubmit={handleCreateSmall}
          onCancel={() => setModalState({ type: 'none' })}
        />
      </Modal>

      <Modal
        isOpen={modalState.type === 'editSmall'}
        onClose={() => setModalState({ type: 'none' })}
        title="Edit Small Category"
      >
        {modalState.type === 'editSmall' && (
          <SmallCategoryForm
            initialValue={modalState.category}
            onSubmit={(name) => handleUpdateSmall(modalState.category.id, name)}
            onCancel={() => setModalState({ type: 'none' })}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalState.type === 'associations'}
        onClose={() => setModalState({ type: 'none' })}
        title="Manage Category Associations"
      >
        {modalState.type === 'associations' && (
          <AssociationManager
            smallCategory={modalState.category}
            largeCategories={portfolio.largeCategories}
            currentAssociations={portfolio.associations}
            onAdd={(largeCategoryId) =>
              handleAddAssociation(modalState.category.id, largeCategoryId)
            }
            onRemove={(largeCategoryId) =>
              handleRemoveAssociation(modalState.category.id, largeCategoryId)
            }
            onClose={() => setModalState({ type: 'none' })}
          />
        )}
      </Modal>
    </div>
  );
}
