import React, { FC, useCallback, useState, useEffect, useRef } from 'react'

import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'
import { shallowEqual } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import dayjs from 'dayjs'
import { Check } from '@geist-ui/icons'

import "./styles/Window.scss"
import TransactionModal from '@modals/TransactionItem'
import { Ellipsis } from "@ledget/media"
import Header from './Header'
import { SelectCategoryBill } from '@components/dropdowns'
import { Logo } from '@components/pieces'
import ItemOptions from "./ItemOptions"
import {
    NarrowButton,
    ExpandableContainer,
    ExpandButton,
    IconButton,
    Tooltip,
    DollarCents,
    BillCatLabel,
    AbsPosMenu
} from "@ledget/ui"
import { formatDateOrRelativeDate, InfiniteScrollDiv, useLoaded } from '@ledget/ui'
import { Category, isCategory, SplitCategory, addTransaction2Cat } from '@features/categorySlice'
import { Bill, isBill, addTransaction2Bill } from '@features/billSlice'
import {
    useLazyGetUnconfirmedTransactionsQuery,
    confirmAndUpdateMetaData,
    selectUnconfirmedTransactions,
    selectConfirmedTransactions,
    useConfirmTransactionsMutation,
    ConfirmedQueue,
    QueueItemWithCategory,
    QueueItemWithBill,
    removeUnconfirmedTransaction
} from '@features/transactionsSlice'
import type { Transaction } from '@features/transactionsSlice'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { useFilterFormContext } from '../context'
import { useColorScheme } from '@ledget/ui'
import { useScreenContext } from '@context/context'

// Sizing (in ems)
const translate = 1
const expandedTranslate = 6.125;
const expandedHeight = 25
const collapsedHeight = 8
const scale = .1
const stackMax = 2

const _getContainerHeight = (length: number, expanded: boolean) => {
    if (expanded) {
        return `${Math.min(length * expandedTranslate + 1, expandedHeight)}em`
    } else if (length > stackMax) {
        return `${collapsedHeight}em`
    } else if (length > 0) {
        return `${collapsedHeight - ((stackMax - length) * translate)}em`
    } else {
        return `0em`
    }
}

const _getOpacity = (index: number, expanded: boolean) => {
    const belowStackMax = index > stackMax
    return (!expanded && belowStackMax && index !== 0) ? 0 : 1
}

const _getScale = (index: number, expanded: boolean, loaded = true,) => {

    if (!loaded) {
        return 1 - ((index + 1) * scale * 2)
    }

    if (expanded) {
        return 1
    } else {
        if (index > stackMax) {
            return 1 - (stackMax * scale)
        } else {
            return 1 - (index * scale)
        }
    }
}

const _getY = (index: number, expanded: boolean, loaded = true) => {
    if (!loaded) {
        return `${(index ** 2) * .3125 + 1.875}em`
    }

    if (index === 0 || expanded) {
        return `${index * expandedTranslate + .5}em`
    } else {
        if (index > stackMax) {
            return `${stackMax * translate + .5}em`
        } else {
            return `${index * translate + .5}em`
        }
    }
}

const _getBackGroundColor = (index: number, expanded: boolean, darkMode: boolean, smallScreen: boolean) => {
    let lightness: number
    if (smallScreen) {
        if (index === 0 || expanded) {
            lightness = darkMode ? 8 : 100
        } else {
            lightness = darkMode ? 8 - (index * 1.75) : 98
        }
    } else {
        if (index === 0 || expanded) {
            lightness = darkMode ? 11 : 100
        } else {
            lightness = darkMode ? 11 - (index * 2) : 98
        }
    }

    return `hsl(0, 0%, ${lightness}%)`
}

const NewItem: FC<{
    item: Transaction
    style: React.CSSProperties
    onEllipsis: (e: any, item: Transaction) => void
    onBillCat: (e: any, item: Transaction) => void
    handleConfirm: (transaction: Transaction) => void
    updatedBillCat?: SplitCategory[] | Bill
    tabIndex: number
}> = (props) => {
    const { item, style, updatedBillCat, onEllipsis, onBillCat, handleConfirm, tabIndex } = props
    const [name, setName] = useState<string>(
        item.predicted_category
            ? `${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`
            : ''
    )
    const [color, setColor] = useState<'blue' | 'green' | 'green-split' | 'blue-split' | 'green-blue-split'>(
        item.predicted_category?.period === 'month' ? 'blue' : 'green'
    )

    useEffect(() => {
        if (isBill(updatedBillCat)) {
            updatedBillCat.period === 'month' ? setColor('blue') : setColor('green')
            updatedBillCat
                ? setName(updatedBillCat.name.charAt(0).toUpperCase() + updatedBillCat.name.slice(1))
                : setName(`${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`)
        } else if (typeof updatedBillCat !== 'undefined') {
            // If all the categories are the 'month' period, then color can be set
            if (updatedBillCat.every(cat => cat.period === 'month')) {
                setColor('blue-split')
            } else if (updatedBillCat.every(cat => ['once', 'year'].includes(cat.period))) {
                setColor('green-split')
            } else {
                setColor('green-blue-split')
            }

            setName(`${updatedBillCat[0].name.charAt(0).toUpperCase()}${updatedBillCat[0].name.slice(1)}`)
        }
    }, [updatedBillCat])

    return (
        <animated.div
            key={`item-${item.transaction_id}`}
            className="new-item"
            style={style}
        >
            <div className='new-item-data'>
                <div>
                    <Logo accountId={item.account} />
                </div>
                <div>
                    <div>
                        <span>{item.name}</span>
                    </div>
                    <div className={item.amount! < 0 ? 'is-debit' : ''}>
                        <DollarCents value={item.amount!} />
                        <span>{formatDateOrRelativeDate(dayjs(item.datetime! || item.date).valueOf())}</span>
                    </div>
                </div>
            </div>
            <div className='new-item-icons' >
                <BillCatLabel
                    name={name}
                    slim={true}
                    as='button'
                    color={color}
                    aria-label="Choose budget category"
                    tabIndex={tabIndex}
                    onClick={(e) => { onBillCat(e, item) }}
                />
                <Tooltip
                    msg="Confirm"
                    ariaLabel="Confirm"
                >
                    <IconButton
                        onClick={() => { handleConfirm(item) }}
                        aria-label="Confirm"
                        tabIndex={tabIndex}
                        className="confirm-button"
                    >
                        <Check className="icon" strokeWidth={2} />
                    </IconButton>
                </Tooltip>
                <NarrowButton
                    tabIndex={tabIndex}
                    onClick={(e) => { onEllipsis(e, item) }}
                    aria-label="More options"
                    aria-haspopup="menu"
                >
                    <Ellipsis />
                </NarrowButton>
            </div>
        </animated.div>
    )
}

const NeedsConfirmationWindow = () => {
    const [searchParams] = useSearchParams()
    const loaded = useLoaded()
    const [showMenu, setShowMenu] = useState(false)
    const [showBillCatSelect, setShowBillCatSelect] = useState(false)
    const [showTransactionModal, setShowTransactionModal] = useState<{ split: boolean }>()
    const [billCatSelectVal, setBillCatSelectVal] = useState<Category | Bill | undefined>()
    const [focusedItem, setFocusedItem] = useState<Transaction | undefined>(undefined)
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | undefined>()
    const [billCatSelectPos, setBillCatSelectPos] = useState<{ x: number, y: number } | undefined>()
    const [transactionUpdates, setTransactionUpdates] =
        useState<{ [key: string]: { categories?: SplitCategory[], bill?: Bill } }>(
            JSON.parse(sessionStorage.getItem('transactionUpdates') || '{}')
        )
    const { start, end } = useGetStartEndQueryParams()
    const { setShowFilterForm, unconfirmedStackExpanded, setUnconfirmedStackExpanded } = useFilterFormContext()
    const { isDark } = useColorScheme()
    const navigate = useNavigate()
    const location = useLocation()
    const { screenSize } = useScreenContext()

    const [confirmTransactions] = useConfirmTransactionsMutation()
    const unconfirmedTransactions = useAppSelector(
        state => selectUnconfirmedTransactions(state, {
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            year: parseInt(searchParams.get('year')!) || new Date().getFullYear()
        }), shallowEqual
    )
    const confirmedTransactions = useAppSelector(
        state => selectConfirmedTransactions(state, {
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            year: parseInt(searchParams.get('year')!) || new Date().getFullYear()
        }), shallowEqual
    )
    const dispatch = useAppDispatch()

    const [
        fetchTransactions,
        { data: transactionsData, isSuccess, isFetching: isFetchingTransactions }
    ] = useLazyGetUnconfirmedTransactionsQuery()
    const newItemsRef = useRef<HTMLDivElement>(null)

    // Initial fetch when query params change
    useEffect(() => {
        if (start && end) {
            fetchTransactions({ start, end, offset: 0 }, true)
        }
    }, [start, end])

    // Animation hooks/effects
    const itemsApi = useSpringRef()

    const [containerProps, containerApi] = useSpring(() => ({
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        height: _getContainerHeight(unconfirmedTransactions?.length || 0, unconfirmedStackExpanded),
        overflowX: 'hidden',
        overflowY: 'hidden',
    } as React.CSSProperties))

    const itemTransitions = useTransition(
        unconfirmedTransactions,
        {
            from: (item, index) => ({
                // top: getTop(index, false),
                y: _getY(index, unconfirmedStackExpanded, false),
                transform: `scale(${_getScale(index, unconfirmedStackExpanded, false)})`,
                backgroundColor: _getBackGroundColor(index, unconfirmedStackExpanded, isDark, screenSize !== 'extra-large'),
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
                backgroundColor: _getBackGroundColor(index, unconfirmedStackExpanded, isDark, screenSize !== 'extra-large'),
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
                height: _getContainerHeight(unconfirmedTransactions.length, unconfirmedStackExpanded)
            } as any)
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
    const handleItemConfirm = (transaction: Transaction) => {
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
                    onRest: () => {
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
    }

    // Send the updates to the backend whist updating the category
    // and bill metadata in the store.
    const handleConfirmAll = () => {
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
                    dispatch(addTransaction2Bill({ billId: ready2ConfirmItem.bill, amount: ready2ConfirmItem.transaction.amount }))
                } else if (ready2ConfirmItem.categories) {
                    for (let category of ready2ConfirmItem.categories) {
                        dispatch(addTransaction2Cat({ categoryId: category.id, amount: ready2ConfirmItem.transaction.amount }))
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

    const flushConfirmedQue = () => {
        if (confirmedTransactions.length > 0) {
            confirmTransactions(confirmedTransactions.map((item) => ({
                transaction_id: item.transaction.transaction_id,
                splits: item.categories
                    ? item.categories.map((cat) => ({ category: cat.id, fraction: cat.fraction }))
                    : undefined,
                bill: item.bill
            })))
        }
    }

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
        setShowBillCatSelect(false)
    }, [])

    // Handle scrolling
    const handleScroll = (e: any) => {
        // Once the bottom is reached, then fetch the next list of items
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
            transactionsData?.next && fetchTransactions({ start, end, offset: transactionsData?.next })
        }
        setShowMenu(false)
        setShowBillCatSelect(false)
    }

    return (
        <div id='needs-confirmation-stack'>
            <Header onConfirmAll={handleConfirmAll} />
            <InfiniteScrollDiv
                id="new-items"
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
                <AbsPosMenu
                    show={showBillCatSelect}
                    setShow={setShowBillCatSelect}
                    pos={billCatSelectPos}
                    topArrow={false}
                >
                    <SelectCategoryBill
                        value={billCatSelectVal}
                        onChange={setBillCatSelectVal}
                        month={new Date(start).getMonth() + 1}
                        year={new Date(start).getFullYear()}
                    />
                </AbsPosMenu>
                <AbsPosMenu
                    show={showMenu}
                    setShow={setShowMenu}
                    pos={menuPos}
                >
                    <ItemOptions handlers={[
                        () => { setShowTransactionModal({ split: true }) },
                        () => {
                            navigate({
                                pathname: '/budget/new-bill',
                                search: location.search,
                            }, { state: { period: 'month', upper_amount: focusedItem?.amount, name: focusedItem?.name } }),
                                setShowMenu(false)
                        },
                        () => {
                            navigate({
                                pathname: '/budget/new-bill',
                                search: location.search,
                            }, { state: { period: 'year', upper_amount: focusedItem?.amount, name: focusedItem?.name } }),
                                setShowMenu(false)
                        },
                        () => { setShowTransactionModal({ split: false }) },
                    ]} />
                </AbsPosMenu>
            </InfiniteScrollDiv >
            <ExpandableContainer
                className='new-items-expand-button--container'
                expanded={unconfirmedTransactions ? unconfirmedTransactions?.length > 1 : false}>
                <ExpandButton
                    hasBackground={false}
                    onClick={() => setUnconfirmedStackExpanded(!unconfirmedStackExpanded)} flipped={unconfirmedStackExpanded}
                />
            </ExpandableContainer>
            {showTransactionModal && focusedItem &&
                <TransactionModal
                    item={focusedItem}
                    splitMode={showTransactionModal.split}
                    onClose={() => setShowTransactionModal(undefined)} />}
        </ div>
    )
}

export default NeedsConfirmationWindow
