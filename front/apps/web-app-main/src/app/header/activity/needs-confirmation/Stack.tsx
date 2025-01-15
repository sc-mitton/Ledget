import { useCallback, useState, useEffect, useRef } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useTransition, useSpringRef } from '@react-spring/web';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import dayjs from 'dayjs';

import styles from './styles/stack.module.scss';
import { SelectCategoryBill } from '@components/inputs';
import { ZeroConfig } from '@components/pieces';
import { CheckAll } from '@ledget/media';
import ItemOptions from './ItemOptions';
import { AbsPosMenu, LoadingRingDiv, TextButton } from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';
import { setTransactionModal } from '@features/modalSlice';
import {
  useLazyGetUnconfirmedTransactionsQuery,
  confirmAndUpdateMetaData,
  selectUnconfirmedTransactions,
  selectConfirmedTransactions,
  useConfirmTransactionsMutation,
  ConfirmedQueue,
  QueueItemWithCategory,
  QueueItemWithBill,
  removeUnconfirmedTransaction,
  useGetTransactionsCountQuery,
  addTransaction2Cat,
  addTransaction2Bill,
  selectBudgetMonthYear,
  isCategory,
  updateTransaction,
} from '@ledget/shared-features';
import type { Transaction, Bill, Category } from '@ledget/shared-features';
import NewItem from './NewItem';

export const NeedsConfirmationStack = () => {
  const loaded = useLoaded(1000);
  const [showMenu, setShowMenu] = useState(false);
  const [showBillCatSelect, setShowBillCatSelect] = useState(false);
  const [billCatSelectVal, setBillCatSelectVal] = useState<
    Category | Bill | undefined
  >();
  const [focusedItem, setFocusedItem] = useState<Transaction | undefined>();
  const [menuPos, setMenuPos] = useState<
    { x: number; y: number } | undefined
  >();
  const [confirmAll, setConfirmAll] = useState(false);
  const [billCatSelectPos, setBillCatSelectPos] = useState<
    { x: number; y: number } | undefined
  >();
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: tCountData, isSuccess: isGetTransactionsCountSuccess } =
    useGetTransactionsCountQuery(
      { confirmed: false, month, year },
      { skip: !month || !year }
    );

  const [confirmTransactions] = useConfirmTransactionsMutation();
  const unconfirmedTransactions = useAppSelector(
    (state) =>
      selectUnconfirmedTransactions(state, {
        month: month || new Date().getMonth(),
        year: year || new Date().getFullYear(),
      }),
    shallowEqual
  );
  const confirmedTransactions = useAppSelector(
    (state) =>
      selectConfirmedTransactions(state, {
        month: month || new Date().getMonth(),
        year: year || new Date().getFullYear(),
      }),
    shallowEqual
  );
  const dispatch = useAppDispatch();

  const [
    fetchTransactions,
    { data: transactionsData, isSuccess, isLoading: isFetchingTransactions },
  ] = useLazyGetUnconfirmedTransactionsQuery();
  const newItemsRef = useRef<HTMLDivElement>(null);

  // Initial fetch when query params change
  useEffect(() => {
    if (month && year) {
      fetchTransactions({ month, year, offset: 0 }, true);
    }
  }, [month, year]);

  const itemsApi = useSpringRef();
  const itemTransitions = useTransition(unconfirmedTransactions, {
    from: (item, index) => ({ x: 0, maxHeight: 300 }),
    enter: (item, index) => ({ x: 0, maxHeight: 300 }),
    config: {
      tension: 180,
      friction: loaded ? 22 : 40,
      mass: 1,
    },
    immediate: !loaded,
    ref: itemsApi,
  });

  // When options are selected from the bill/category combo dropdown
  // update the list of updated bills/categories, then clean up
  // the focused item and selected value
  useEffect(() => {
    if (focusedItem && billCatSelectVal) {
      dispatch(
        updateTransaction({
          transaction: focusedItem,
          categories: isCategory(billCatSelectVal)
            ? [{ ...billCatSelectVal, fraction: 1 }]
            : undefined,
          bill: isCategory(billCatSelectVal) ? undefined : billCatSelectVal,
        })
      );
      setFocusedItem(undefined);
      setBillCatSelectVal(undefined);
    }
  }, [billCatSelectVal]);

  // Handle confirming an item
  // 1. Animate the item out of the container
  // 2. Remove the item from the items array
  // 3. Add the item to the confirmed items array
  const handleItemConfirm = useCallback((transaction: Transaction) => {
    itemsApi.start((index: any, item: any) => {
      if (item._item.transaction_id === transaction.transaction_id) {
        return {
          x: 100,
          opacity: 0,
          config: { duration: 130 },
          onStart: () => {
            dispatch(confirmAndUpdateMetaData(transaction));
          },
        };
      }
    });
  }, []);

  // Confirm All
  // Send the updates to the backend whilst updating the category
  // and bill metadata in the store.
  useEffect(() => {
    if (confirmAll) {
      itemsApi.start((index: any, item: any) => ({
        x: 100,
        opacity: 0,
        delay: index * 50,
        config: { duration: 130 },
      }));

      // Dispatch confirm for all items
      setTimeout(() => {
        const confirmed: ConfirmedQueue = [];
        for (let transaction of unconfirmedTransactions) {
          const ready2ConfirmItem: QueueItemWithCategory | QueueItemWithBill = {
            transaction: transaction,
            bill: transaction.predicted_bill?.id,
          };

          // Update meta data for immediate ui updates
          if (ready2ConfirmItem.bill) {
            dispatch(
              addTransaction2Bill({
                billId: ready2ConfirmItem.bill,
                amount: ready2ConfirmItem.transaction.amount,
              })
            );
          } else if (ready2ConfirmItem.categories) {
            for (let category of ready2ConfirmItem.categories) {
              dispatch(
                addTransaction2Cat({
                  categoryId: category.id,
                  amount: ready2ConfirmItem.transaction.amount,
                  period: category.period,
                })
              );
            }
          }
          dispatch(removeUnconfirmedTransaction(transaction.transaction_id));
          confirmed.push(ready2ConfirmItem);
        }
        confirmTransactions(
          confirmed.map((item) => ({
            transaction_id: item.transaction.transaction_id,
            splits: item.categories
              ? item.categories.map((cat) => ({
                  category: cat.id,
                  fraction: cat.fraction,
                }))
              : undefined,
            bill: item.bill,
          }))
        );
      }, 130 + unconfirmedTransactions.length * 50);
    }
    return () => {
      setConfirmAll(false);
    };
  }, [confirmAll]);

  const flushConfirmedQue = useCallback(() => {
    if (confirmedTransactions.length > 0) {
      confirmTransactions(
        confirmedTransactions.map((item) => ({
          transaction_id: item.transaction.transaction_id,
          splits: item.categories
            ? item.categories.map((cat) => ({
                category: cat.id,
                fraction: cat.fraction,
              }))
            : undefined,
          bill: item.bill,
        }))
      );
    }
  }, [confirmedTransactions]);

  const handleEllipsis = useCallback((e: any, item: Transaction) => {
    const buttonRect = e.target.closest('button').getBoundingClientRect();
    setMenuPos({
      x:
        buttonRect.right -
          newItemsRef.current!.getBoundingClientRect().left +
          14 || 0,
      y:
        buttonRect.top - newItemsRef.current!.getBoundingClientRect().top - 4 ||
        0,
    });
    setFocusedItem(item);
    setShowBillCatSelect(false);
  }, []);

  const handleBillCatClick = useCallback((e: any, item: Transaction) => {
    const buttonRect = e.target.closest('button').getBoundingClientRect();
    setBillCatSelectPos({
      x:
        buttonRect.right - newItemsRef.current!.getBoundingClientRect().left ||
        0,
      y:
        buttonRect.top -
          newItemsRef.current!.getBoundingClientRect().top -
          12 || 0,
    });
    setFocusedItem(item);
    setShowMenu(false);
  }, []);

  // Handle scrolling
  const handleScroll = (e: any) => {
    // Once the bottom is reached, then fetch the next list of items
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      transactionsData?.next &&
        fetchTransactions({ month, year, offset: transactionsData?.next });
    }
    setShowMenu(false);
    setShowBillCatSelect(false);
  };

  return (
    <LoadingRingDiv
      size={24}
      className={styles.needsConfirmationStack}
      loading={isFetchingTransactions}
    >
      {tCountData?.count === 0 && isGetTransactionsCountSuccess ? (
        <ZeroConfig />
      ) : (
        <>
          <div
            className={styles.newItems}
            ref={newItemsRef}
            onMouseLeave={() => flushConfirmedQue()}
          >
            <div>
              <div onScroll={handleScroll} className={styles.newItemsContainer}>
                {isSuccess && unconfirmedTransactions && (
                  <>
                    {itemTransitions((style, item, obj, index) => {
                      if (!item) return null;
                      return (
                        <NewItem
                          item={item}
                          style={style}
                          onBillCat={(e, item) => handleBillCatClick(e, item)}
                          onEllipsis={(e, item) => handleEllipsis(e, item)}
                          handleConfirm={handleItemConfirm}
                        />
                      );
                    })}
                  </>
                )}
                <div className={styles.confirmAllButton}>
                  <TextButton>
                    <span>
                      Confirm All
                      <CheckAll className="icon" strokeWidth={2} />
                    </span>
                  </TextButton>
                </div>
              </div>
            </div>
          </div>
          <AbsPosMenu
            show={showBillCatSelect}
            setShow={setShowBillCatSelect}
            pos={billCatSelectPos}
            id="select-new-item-bill-category"
          >
            <SelectCategoryBill
              includeCategories={true}
              includeBills={true}
              value={billCatSelectVal}
              onChange={setBillCatSelectVal}
              month={month}
              year={year}
            />
          </AbsPosMenu>
          <AbsPosMenu
            show={showMenu}
            setShow={setShowMenu}
            pos={menuPos}
            id="new-item-menu"
          >
            <ItemOptions
              handlers={[
                () => {
                  focusedItem &&
                    dispatch(
                      setTransactionModal({
                        item: focusedItem,
                        splitMode: true,
                      })
                    );
                },
                () => {
                  navigate(
                    {
                      pathname: '/budget/new-bill',
                      search: location.search,
                    },
                    {
                      state: {
                        period: 'month',
                        upper_amount: focusedItem?.amount,
                        name: focusedItem?.name,
                        day: dayjs(
                          focusedItem?.datetime || focusedItem?.date
                        ).date(),
                      },
                    }
                  ),
                    setShowMenu(false);
                },
                () => {
                  navigate(
                    {
                      pathname: '/budget/new-bill',
                      search: location.search,
                    },
                    {
                      state: {
                        period: 'year',
                        upper_amount: focusedItem?.amount,
                        name: focusedItem?.name,
                        day: dayjs(
                          focusedItem?.datetime || focusedItem?.date
                        ).date(),
                        month:
                          dayjs(
                            focusedItem?.datetime || focusedItem?.date
                          ).month() + 1,
                      },
                    }
                  ),
                    setShowMenu(false);
                },
                () => {
                  focusedItem &&
                    dispatch(setTransactionModal({ item: focusedItem }));
                },
              ]}
            />
          </AbsPosMenu>
        </>
      )}
    </LoadingRingDiv>
  );
};
