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
import { LoadingSpinner } from '../common/LoadingSpinner';
import { CategoryList } from './CategoryList';
import { LargeCategoryForm } from './LargeCategoryForm';
import { SmallCategoryForm } from './SmallCategoryForm';
import { AssociationManager } from './AssociationManager';

type ModalState =
  | { type: 'none' }
  | { type: 'createLarge' }
  | { type: 'editLarge'; category: LargeCategory }
  | { type: 'createSmall' }
  | { type: 'editSmall'; category: SmallCategory }
  | { type: 'associations'; category: SmallCategory };

export function CategoryManagement() {
  const portfolio = usePortfolio();
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [error, setError] = useState('');

  if (portfolio.loading) {
    return <LoadingSpinner />;
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
    } catch (err: any) {
      throw err;
    }
  };

  const handleUpdateLarge = async (id: string, name: string) => {
    try {
      await portfolio.updateLargeCategory(id, { name });
      setModalState({ type: 'none' });
      setError('');
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteLarge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this large category?')) return;
    try {
      await portfolio.deleteLargeCategory(id);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleCreateSmall = async (name: string) => {
    try {
      await portfolio.createSmallCategory({ name });
      setModalState({ type: 'none' });
      setError('');
    } catch (err: any) {
      throw err;
    }
  };

  const handleUpdateSmall = async (id: string, name: string) => {
    try {
      await portfolio.updateSmallCategory(id, { name });
      setModalState({ type: 'none' });
      setError('');
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteSmall = async (id: string) => {
    if (!confirm('Are you sure you want to delete this small category?')) return;
    try {
      await portfolio.deleteSmallCategory(id);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleAddAssociation = async (smallCategoryId: string, largeCategoryId: string) => {
    try {
      await portfolio.createAssociation({ smallCategoryId, largeCategoryId });
      setError('');
    } catch (err: any) {
      throw err;
    }
  };

  const handleRemoveAssociation = async (smallCategoryId: string, largeCategoryId: string) => {
    try {
      await portfolio.deleteAssociation(smallCategoryId, largeCategoryId);
      setError('');
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Management</h1>
        <p className="text-gray-600">
          Define large and small categories for organizing your assets
        </p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex gap-4 mb-6">
        <Button onClick={() => setModalState({ type: 'createLarge' })}>
          Add Large Category
        </Button>
        <Button variant="secondary" onClick={() => setModalState({ type: 'createSmall' })}>
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
