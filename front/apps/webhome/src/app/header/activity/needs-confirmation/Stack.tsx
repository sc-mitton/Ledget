import React, { useCallback, useState, useEffect, useRef } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'
import { shallowEqual } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import dayjs from 'dayjs'

import styles from './styles/stack.module.scss'
import { SelectCategoryBill } from '@components/inputs'
import { ZeroConfig } from '@components/pieces'
import ItemOptions from "./ItemOptions"
import {
    ExpandableContainer,
    ExpandButton,
    AbsPosMenu,
    useLoaded,
    useColorScheme,
    LoadingRingDiv,
} from "@ledget/ui"
import { setTransactionModal } from '@features/modalSlice'
import { Category, isCategory, SplitCategory } from '@features/categorySlice'
import { addTransaction2Cat, addTransaction2Bill, selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'
import { Bill } from '@features/billSlice'
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
    useGetTransactionsCountQuery
} from '@features/transactionsSlice'
import type { Transaction } from '@features/transactionsSlice'
import { useFilterFormContext } from '../context'
import NewItem from './NewItem'
import {
    _getContainerHeight,
    _getOpacity,
    _getScale,
    _getY,
    _getBackGroundColor
} from './helpers'

export const NeedsConfirmationStack = () => {
    const loaded = useLoaded(1000)
    const [showMenu, setShowMenu] = useState(false)
    const [showBillCatSelect, setShowBillCatSelect] = useState(false)
    const [billCatSelectVal, setBillCatSelectVal] = useState<Category | Bill | undefined>()
    const [focusedItem, setFocusedItem] = useState<Transaction | undefined>(undefined)
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | undefined>()
    const [billCatSelectPos, setBillCatSelectPos] = useState<{ x: number, y: number } | undefined>()
    const [transactionUpdates, setTransactionUpdates] =
        useState<{ [key: string]: { categories?: SplitCategory[], bill?: Bill } }>(
            JSON.parse(sessionStorage.getItem('transactionUpdates') || '{}')
        )
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { setShowFilterForm, unconfirmedStackExpanded, setUnconfirmedStackExpanded, confirmAll, setConfirmAll } = useFilterFormContext()
    const { isDark } = useColorScheme()
    const navigate = useNavigate()
    const location = useLocation()
    const { data: tCountData, isSuccess: isGetTransactionsCountSuccess } =
        useGetTransactionsCountQuery({ confirmed: false, month, year }, { skip: !month || !year })

    const [confirmTransactions] = useConfirmTransactionsMutation()
    const unconfirmedTransactions = useAppSelector(
        state => selectUnconfirmedTransactions(state, { month: month || new Date().getMonth(), year: year || new Date().getFullYear() }), shallowEqual
    )
    const confirmedTransactions = useAppSelector(
        state => selectConfirmedTransactions(state, { month: month || new Date().getMonth(), year: year || new Date().getFullYear() }), shallowEqual
    )
    const dispatch = useAppDispatch()

    const [
        fetchTransactions,
        { data: transactionsData, isSuccess, isLoading: isFetchingTransactions }
    ] = useLazyGetUnconfirmedTransactionsQuery()
    const newItemsRef = useRef<HTMLDivElement>(null)

    // Initial fetch when query params change
    useEffect(() => {
        if (month && year) {
            fetchTransactions({ month, year, offset: 0 }, true)
        }
    }, [month, year])

    const [containerProps, containerApi] = useSpring(() => ({
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        height: _getContainerHeight(unconfirmedTransactions?.length || 0, unconfirmedStackExpanded),
        overflowX: 'hidden',
        overflowY: 'hidden',
    } as React.CSSProperties))

    const itemsApi = useSpringRef()
    const itemTransitions = useTransition(
        unconfirmedTransactions,
        {
            from: (item, index) => ({
                // top: getTop(index, false),
                y: _getY(index, unconfirmedStackExpanded, false),
                transform: `scale(${_getScale(index, unconfirmedStackExpanded, false)})`,
                backgroundColor: _getBackGroundColor(index, unconfirmedStackExpanded, isDark),
            }),
            enter: (item, index) => ({
                y: _getY(index, unconfirmedStackExpanded, true),
                transform: `scale(${_getScale(index, unconfirmedStackExpanded)})`,
                zIndex: `${(unconfirmedTransactions!.length - index)}`,
                opacity: _getOpacity(index, unconfirmedStackExpanded),
                x: 0,
                left: 0,
                right: 0,
            }),
            update: (item, index) => ({
                y: _getY(index, unconfirmedStackExpanded),
                transform: `scale(${_getScale(index, unconfirmedStackExpanded)})`,
                zIndex: `${(unconfirmedTransactions!.length - index)}`,
                opacity: _getOpacity(index, unconfirmedStackExpanded),
                backgroundColor: _getBackGroundColor(index, unconfirmedStackExpanded, isDark),
            }),
            onRest: () => {
                unconfirmedStackExpanded
                    ? containerApi.start({ overflowY: 'scroll', overflowX: 'hidden' })
                    : containerApi.start({ overflowY: 'hidden', overflowX: 'hidden' })
            },
            config: {
                tension: 180,
                friction: loaded ? 22 : 40,
                mass: 1
            },
            immediate: !loaded && unconfirmedStackExpanded,
            ref: itemsApi
        }
    )

    // Initial animate container expanding
    useEffect(() => { containerApi.start() }, [])

    useEffect(() => {
        containerApi.start({ overflowY: 'hidden', overflowX: 'hidden' })
    }, [unconfirmedStackExpanded])

    // Animate the container shrinking when list gets smaller
    useEffect(() => {
        if (unconfirmedTransactions.length >= 0) {
            itemsApi.start()
            containerApi.start({
                height: _getContainerHeight(unconfirmedTransactions.length, unconfirmedStackExpanded),
                immediate: !loaded
            })
        }
        setShowFilterForm(false)
    }, [unconfirmedStackExpanded, unconfirmedTransactions])

    // When options are selected from the bill/category combo dropdown
    // update the list of updated bills/categories, then clean up
    // the focused item and selected value
    useEffect(() => {
        if (focusedItem && billCatSelectVal) {
            setTransactionUpdates((prev) => ({
                ...prev,
                [focusedItem.transaction_id]: isCategory(billCatSelectVal)
                    ? { categories: [{ ...billCatSelectVal, fraction: 1 }] }
                    : { bill: billCatSelectVal },
            }))
            sessionStorage.setItem(
                'transactionUpdates',
                JSON.stringify({
                    ...transactionUpdates,
                    [focusedItem.transaction_id]: isCategory(billCatSelectVal)
                        ? {
                            categories: [{
                                id: billCatSelectVal.id,
                                name: billCatSelectVal.name,
                                period: billCatSelectVal.period,
                                fraction: 1
                            }]
                        }
                        : { bill: billCatSelectVal },
                })
            )
            setFocusedItem(undefined)
            setBillCatSelectVal(undefined)
        }
    }, [billCatSelectVal])

    // Handle confirming an item
    // 1. Animate the item out of the container
    // 2. Remove the item from the items array
    // 3. Add the item to the confirmed items array
    const handleItemConfirm = useCallback((transaction: Transaction) => {
        itemsApi.start((index: any, item: any) => {
            if (item._item.transaction_id === transaction.transaction_id) {
                const updatedCategories = transactionUpdates[transaction.transaction_id]?.categories
                const updatedBillId = transactionUpdates[transaction.transaction_id]?.bill?.id
                const predictedCategories = [{ ...transaction.predicted_category, fraction: 1 }]
                const predictedBillId = transaction.predicted_bill?.id

                return {
                    x: 100,
                    opacity: 0,
                    config: { duration: 130 },
                    onStart: () => {
                        dispatch(confirmAndUpdateMetaData({
                            transaction: transaction,
                            categories: (updatedCategories && !updatedBillId)
                                ? updatedCategories
                                : !updatedBillId ? predictedCategories as SplitCategory[] : undefined,
                            bill: (updatedBillId && !updatedCategories)
                                ? updatedBillId
                                : !updatedCategories ? predictedBillId : undefined,
                        }))
                    },
                }
            }
        })
    }, [])

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
            }))

            // Dispatch confirm for all items
            setTimeout(() => {
                const confirmed: ConfirmedQueue = []
                for (let transaction of unconfirmedTransactions) {
                    const updatedCategories = transactionUpdates[transaction.transaction_id]?.categories
                    const updatedBillId = transactionUpdates[transaction.transaction_id]?.bill?.id
                    const predictedCategories = [{ ...transaction.predicted_category, fraction: 1 }]
                    const predictedBillId = transaction.predicted_bill?.id

                    let ready2ConfirmItem: QueueItemWithCategory | QueueItemWithBill
                    if ((updatedCategories && !updatedBillId) || predictedCategories) {
                        ready2ConfirmItem = {
                            transaction: transaction,
                            categories: updatedCategories || predictedCategories as SplitCategory[],
                        }
                    } else {
                        ready2ConfirmItem = {
                            transaction: transaction,
                            bill: updatedBillId || predictedBillId,
                        }
                    }

                    if (ready2ConfirmItem.bill) {
                        dispatch(addTransaction2Bill({
                            billId: ready2ConfirmItem.bill,
                            amount: ready2ConfirmItem.transaction.amount

                        }))
                    } else if (ready2ConfirmItem.categories) {
                        for (let category of ready2ConfirmItem.categories) {
                            dispatch(addTransaction2Cat({
                                categoryId: category.id,
                                amount: ready2ConfirmItem.transaction.amount,
                                period: category.period
                            }))
                        }
                    }
                    dispatch(removeUnconfirmedTransaction(transaction.transaction_id))
                    confirmed.push(ready2ConfirmItem)
                }
                confirmTransactions(confirmed.map((item) => ({
                    transaction_id: item.transaction.transaction_id,
                    splits: item.categories
                        ? item.categories.map((cat) => ({ category: cat.id, fraction: cat.fraction }))
                        : undefined,
                    bill: item.bill
                })))
            }, 130 + unconfirmedTransactions.length * 50)
        }
        return () => { setConfirmAll(false) }
    }, [confirmAll])

    const flushConfirmedQue = useCallback(() => {
        if (confirmedTransactions.length > 0) {
            confirmTransactions(confirmedTransactions.map((item) => ({
                transaction_id: item.transaction.transaction_id,
                splits: item.categories
                    ? item.categories.map((cat) => ({ category: cat.id, fraction: cat.fraction }))
                    : undefined,
                bill: item.bill
            })))
        }
    }, [confirmedTransactions])

    const handleEllipsis = useCallback((e: any, item: Transaction) => {
        const buttonRect = e.target.closest('button').getBoundingClientRect()
        setMenuPos({
            x: buttonRect.right - newItemsRef.current!.getBoundingClientRect().left + 14 || 0,
            y: buttonRect.top - newItemsRef.current!.getBoundingClientRect().top - 4 || 0,
        })
        setFocusedItem(item)
        setShowBillCatSelect(false)
    }, [])

    const handleBillCatClick = useCallback((e: any, item: Transaction) => {
        const buttonRect = e.target.closest('button').getBoundingClientRect()
        setBillCatSelectPos({
            x: buttonRect.right - newItemsRef.current!.getBoundingClientRect().left || 0,
            y: buttonRect.top - newItemsRef.current!.getBoundingClientRect().top - 12 || 0,
        })
        setFocusedItem(item)
        setShowMenu(false)
    }, [])

    // Handle scrolling
    const handleScroll = (e: any) => {
        // Once the bottom is reached, then fetch the next list of items
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
            transactionsData?.next && fetchTransactions({ month, year, offset: transactionsData?.next })
        }
        setShowMenu(false)
        setShowBillCatSelect(false)
    }

    return (
        <LoadingRingDiv className={styles.needsConfirmationStack} loading={isFetchingTransactions}>
            {tCountData?.count === 0 && isGetTransactionsCountSuccess
                ? <ZeroConfig />
                : <>
                    <div
                        className={styles.newItems}
                        ref={newItemsRef}
                        onMouseLeave={() => flushConfirmedQue()}
                    >
                        <div>
                            <animated.div style={containerProps} onScroll={handleScroll}>
                                {(isSuccess && unconfirmedTransactions) &&
                                    <>
                                        {itemTransitions((style, item, obj, index) => {
                                            if (!item) return null
                                            return (
                                                <NewItem
                                                    item={item}
                                                    style={style}
                                                    updatedBillCat={
                                                        transactionUpdates[item.transaction_id]?.categories
                                                        || transactionUpdates[item.transaction_id]?.bill
                                                    }
                                                    onBillCat={(e, item) => handleBillCatClick(e, item)}
                                                    onEllipsis={(e, item) => handleEllipsis(e, item)}
                                                    handleConfirm={handleItemConfirm}
                                                    tabIndex={unconfirmedStackExpanded || index === 0 ? 0 : -1}
                                                />
                                            )
                                        })}
                                    </>
                                }
                            </animated.div >
                        </div>
                    </div >
                    <AbsPosMenu
                        show={showBillCatSelect}
                        setShow={setShowBillCatSelect}
                        pos={billCatSelectPos}
                        topArrow={false}
                        id='select-new-item-bill-category'
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
                        id='new-item-menu'
                    >
                        <ItemOptions handlers={[
                            () => {
                                focusedItem && dispatch(setTransactionModal({ item: focusedItem, splitMode: true }))
                            },
                            () => {
                                navigate({
                                    pathname: '/budget/new-bill',
                                    search: location.search,
                                }, {
                                    state: {
                                        period: 'month',
                                        upper_amount: focusedItem?.amount,
                                        name: focusedItem?.name,
                                        day: dayjs(focusedItem?.datetime || focusedItem?.date).date()
                                    },
                                }), setShowMenu(false)
                            },
                            () => {
                                navigate({
                                    pathname: '/budget/new-bill',
                                    search: location.search,
                                }, {
                                    state: {
                                        period: 'year',
                                        upper_amount: focusedItem?.amount,
                                        name: focusedItem?.name,
                                        day: dayjs(focusedItem?.datetime || focusedItem?.date).date(),
                                        month: dayjs(focusedItem?.datetime || focusedItem?.date).month() + 1
                                    },
                                }), setShowMenu(false)
                            },
                            () => {
                                focusedItem && dispatch(setTransactionModal({ item: focusedItem }))
                            },
                        ]} />
                    </AbsPosMenu>
                    <ExpandableContainer
                        className={styles.newItemsExpandButtonContainer}
                        expanded={unconfirmedTransactions ? unconfirmedTransactions?.length > 1 : false}>
                        <ExpandButton
                            hasBackground={false}
                            onClick={() => setUnconfirmedStackExpanded(!unconfirmedStackExpanded)} flipped={unconfirmedStackExpanded}
                        />
                    </ExpandableContainer>
                </>}
        </ LoadingRingDiv>
    )
}
