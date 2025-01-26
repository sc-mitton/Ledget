import { useEffect } from 'react';

import styles from './styles/delete-category-modal.module.scss';
import { Category, useRemoveCategoriesMutation } from '@ledget/shared-features';
import { GraySubmitButton, ErepairableButton } from '@ledget/ui';

export const DeleteCategory = (props: {
  category: Category;
  onClose: () => void;
}) => {
  const [deleteCategory, { isSuccess, isLoading }] =
    useRemoveCategoriesMutation();

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        props.onClose();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  return (
    <div className={styles.header}>
      <h3>Delete Category</h3>
      <div className={styles.message}>
        All data for this category will be deleted for the month, and the
        category will be removed.
      </div>
      <div className={styles.buttons}>
        <GraySubmitButton
          type="button"
          onClick={props.onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              props.onClose();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Cancel"
          aria-roledescription="button"
          style={{ cursor: 'pointer', borderRadius: '8px' }}
        >
          Cancel
        </GraySubmitButton>
        <ErepairableButton
          success={isSuccess}
          submitting={isLoading}
          onClick={() => {
            deleteCategory([props.category.id]);
          }}
        >
          Delete
        </ErepairableButton>
      </div>
    </div>
  );
};
