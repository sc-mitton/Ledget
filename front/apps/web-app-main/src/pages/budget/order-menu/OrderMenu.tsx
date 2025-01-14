import { ArrowUp, ArrowDown } from '@geist-ui/icons';

import styles from './styles.module.scss';
import { StyledMenu, IconButtonBorderedGray } from '@ledget/ui';
import {
  OrderOptions,
  selectBillOrder,
  selectCategoryOrder,
  setBillOrder,
  setCategoryOrder,
} from '@ledget/shared-features';
import { Filter2 } from '@ledget/media';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { camelToSpaceWithCaps } from '@ledget/helpers';

const Icon = ({ label }: { label: string }) => (
  <div className={styles.icon}>
    <span>{label.toLowerCase().includes('name') ? 'a-z' : '$'}</span>
    {label.toLowerCase().includes('asc') ? (
      <ArrowUp size={'1em'} />
    ) : (
      <ArrowDown size={'1em'} />
    )}
  </div>
);

const OrderMenu = ({ itemType }: { itemType: 'bill' | 'category' }) => {
  const dispatch = useAppDispatch();
  const billOrder = useAppSelector(selectBillOrder);
  const categoryOrder = useAppSelector(selectCategoryOrder);

  return (
    <StyledMenu>
      <StyledMenu.Button
        as={IconButtonBorderedGray}
        className={styles.button}
        data-selected={
          (itemType === 'bill' && billOrder !== 'default') ||
          (itemType === 'category' && categoryOrder !== 'default')
        }
      >
        {(itemType === 'bill' && billOrder !== 'default') ||
        (itemType === 'category' && categoryOrder !== 'default') ? (
          <Icon label={billOrder || categoryOrder} />
        ) : (
          <Filter2 />
        )}
      </StyledMenu.Button>
      <StyledMenu.Items>
        {OrderOptions.filter((o) => o !== 'default').map((option) => {
          const FinishedIcon = <Icon label={option} />;
          return (
            <StyledMenu.Item
              as="div"
              className={styles.item}
              data-selected={
                itemType === 'bill'
                  ? option === billOrder
                  : option === categoryOrder
              }
              label={camelToSpaceWithCaps(option)}
              icon={FinishedIcon}
              onClick={() => {
                if (itemType === 'bill') {
                  dispatch(
                    setBillOrder(option === billOrder ? 'default' : option)
                  );
                } else {
                  dispatch(
                    setCategoryOrder(
                      option === categoryOrder ? 'default' : option
                    )
                  );
                }
              }}
            />
          );
        })}
      </StyledMenu.Items>
    </StyledMenu>
  );
};

export default OrderMenu;
