import { memo, useState, useEffect } from 'react';
import styles from './styles/add-categories.module.scss';
import { Edit } from '@geist-ui/icons';
import { useNavigate } from 'react-router-dom';

import Present from '../Present';
import AddCategoriesContext from './Context';
import {
  Window,
  BlueSubmitButton,
  TextButton,
  BillCatLabel,
  TextInputWrapper,
  SecondaryButton,
  useColorScheme,
} from '@ledget/ui';
import CustomCategory from './CustomCategory';
import {
  NewCategory,
  useAddNewCategoryMutation,
} from '@ledget/shared-features';
import { useAddCategoriesContext } from './Context';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const AddCategories = () => {
  const { isDark } = useColorScheme();
  const [
    addNewCategory,
    { isSuccess: hasAddedNewCategories, isLoading: isAddingNewCategories },
  ] = useAddNewCategoryMutation();
  const navigate = useNavigate();
  const { listItems, setListItems, selectedItems, setSelectedItems } =
    useAddCategoriesContext();
  const [focusedCategory, setFocusedCategory] = useState<NewCategory>();

  const onContinue = () => {
    if (selectedItems.length > 0) {
      addNewCategory(
        listItems.filter((item) => selectedItems.includes(item.id!!))
      );
    } else {
      navigate('/welcome/connect');
    }
  };

  useEffect(() => {
    if (hasAddedNewCategories) {
      navigate('/welcome/connect');
    }
  }, [hasAddedNewCategories]);

  return (
    <Present dark={isDark}>
      <Present.Background>
        <Window>
          <div
            className={styles.focusedCategory}
            data-visible={!!focusedCategory}
          >
            <h3>
              How much do you plan to spend on{' '}
              {focusedCategory?.name.toLowerCase()} {focusedCategory?.emoji}{' '}
              every {focusedCategory?.period.replace('ly', '')}?
            </h3>
            <TextInputWrapper>
              <input
                type="text"
                placeholder="$0"
                value={`${formatter.format(
                  Number.isFinite(focusedCategory?.limit_amount)
                    ? focusedCategory?.limit_amount!!
                    : 0
                )}`}
                onChange={(e) => {
                  const target = parseInt(
                    e.target.value.replace(/[^0-9]/g, '')
                  );
                  setFocusedCategory({
                    ...focusedCategory!!,
                    limit_amount: target,
                  });
                }}
              />
            </TextInputWrapper>
            <div>
              <SecondaryButton
                onClick={() => {
                  setFocusedCategory(undefined);
                }}
              >
                Cancel
              </SecondaryButton>
              <BlueSubmitButton
                onClick={() => {
                  setListItems((prev) => {
                    return prev.map((category) => {
                      if (category.id === focusedCategory!!.id) {
                        return focusedCategory!!;
                      }
                      return category;
                    });
                  });
                  setSelectedItems((prev) => {
                    prev.push(focusedCategory!!.id!!);
                    return prev;
                  });
                  setFocusedCategory(undefined);
                }}
              >
                Save
              </BlueSubmitButton>
            </div>
          </div>
          <div className={styles.addCategories}>
            <div className={styles.header}>
              <h2>Add Categories</h2>
              <h4>Add some of your monthly and yearly spending categories.</h4>
              <hr />
              <div className={styles.legend}>
                <span />
                <span>Monthly</span>
                <span />
                <span>Yearly</span>
              </div>
            </div>
            <div className={styles.categories}>
              {listItems.map((category, index) => (
                <button
                  key={`category-${index}`}
                  onClick={() => {
                    if (selectedItems.includes(category.id!!)) {
                      setSelectedItems((prev) => {
                        return prev.filter((item) => item !== category.id!!);
                      });
                    } else if (category?.id?.includes('custom')) {
                      setListItems((prev) => {
                        return prev.filter((item) => item.id !== category.id!!);
                      });
                    } else {
                      setFocusedCategory(category);
                    }
                  }}
                >
                  <BillCatLabel
                    key={`category-${index}`}
                    labelName={category.name}
                    emoji={category.emoji}
                    active={selectedItems.includes(category.id!!)}
                    color={category.period === 'month' ? 'blue' : 'green'}
                  />
                </button>
              ))}
            </div>
            <div className={styles.bottomButtons}>
              <Present.Trigger as={TextButton} className={styles.customButton}>
                <div>
                  Custom <Edit className="icon" />
                </div>
              </Present.Trigger>
              <BlueSubmitButton
                onClick={onContinue}
                submitting={isAddingNewCategories}
              >
                Continue
              </BlueSubmitButton>
            </div>
          </div>
        </Window>
      </Present.Background>
      <CustomCategory />
    </Present>
  );
};

export default memo(function () {
  return (
    <AddCategoriesContext>
      <AddCategories />
    </AddCategoriesContext>
  );
});
