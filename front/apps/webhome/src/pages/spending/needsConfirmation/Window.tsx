import React, { FC, MouseEventHandler, useState, useEffect, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'
import { shallowEqual } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@hooks/store'

import "./styles/Window.scss"
import { Ellipsis, CheckMark } from "@ledget/media"
import Header from './Header'
import ShadowedContainer from '@components/pieces/ShadowedContainer'
import Options from "@components/dropdowns/Options"
import { SelectCategory } from '@components/dropdowns'
import Split from '@components/split/split'
import ItemOptions from "./ItemOptions"
import {
    NarrowButton,
    ExpandableContainer,
    ExpandButton,
    IconScaleButton,
    Tooltip,
    Base64Logo,
    DollarCents,
    BlueSlimButton,
    GrnSlimButton,
} from "@ledget/ui"
import { formatDateOrRelativeDate, InfiniteScrollDiv } from '@ledget/ui'
import { Category, isCategory, SplitCategory } from '@features/categorySlice'
import { Bill, isBill } from '@features/billSlice'
import {
    useLazyGetUnconfirmedTransactionsQuery,
    useUpdateTransactionsMutation,
    confirmAndUpdateMetaData,
    selectUnconfirmedTransactions,
    selectConfirmedTransactions,
} from '@features/transactionsSlice'
import type { Transaction } from '@features/transactionsSlice'
import { useGetPlaidItemsQuery } from '@features/plaidSlice'

// Sizing (in ems)
const translate = 1
const expandedTranslate = 5.875;
const expandedHeight = 29
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
    if (!expanded && index == 1) {
        return .8
    }
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

const Logo = ({ accountId }: { accountId: string }) => {
    const { data } = useGetPlaidItemsQuery()

    const item = data?.find(item => item.accounts.find(account => account.id === accountId))

    const args = {
        data: item?.institution.logo,
        alt: item ? `${item.institution.name.charAt(0).toUpperCase()}` : ' ',
        ...(!item ? { backgroundColor: '#e0e0e0' } : {})
    }

    return (
        <Base64Logo {...args} />
    )
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
        `${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`
    )
    const [color, setColor] = useState<'blue' | 'green' | 'green-split' | 'blue-split' | 'green-blue-split'>(
        item.predicted_category?.period === 'month' ? 'green' : 'blue'
    )

    useEffect(() => {
        if (isBill(updatedBillCat)) {
            updatedBillCat.period === 'month' ? setColor('green') : setColor('blue')
            updatedBillCat
                ? setName(updatedBillCat.name.charAt(0).toUpperCase() + updatedBillCat.name.slice(1))
                : setName(`${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`)
        } else if (typeof updatedBillCat !== 'undefined') {
            // If all the categories are the 'month' period, then color can be set
            if (updatedBillCat.every(cat => cat.period === 'month')) {
                setColor('green-split')
            } else if (updatedBillCat.every(cat => ['once', 'year'].includes(cat.period))) {
                setColor('blue-split')
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
                        <span>{formatDateOrRelativeDate(new Date(item.datetime!).getTime())}</span>
                    </div>
                </div>
            </div>
            <div className='new-item-icons' >
                {color === 'green' || color === 'green-split'
                    ?
                    <GrnSlimButton
                        aria-label="Choose budget category"
                        tabIndex={tabIndex}
                        onClick={(e) => { onBillCat(e, item) }}
                    >
                        {`${name}`}
                    </GrnSlimButton>
                    :
                    <BlueSlimButton
                        aria-label="Choose budget category"
                        tabIndex={tabIndex}
                        onClick={(e) => { onBillCat(e, item) }}
                    >
                        {`${name}`}
                    </BlueSlimButton>
                }
                <Tooltip
                    msg="Confirm"
                    ariaLabel="Confirm"
                    style={{ left: '-1.1rem' }}
                >
                    <IconScaleButton
                        onClick={() => { handleConfirm(item) }}
                        aria-label="Confirm"
                        tabIndex={tabIndex}
                        className="confirm-button"
                    >
                        <CheckMark />
                    </IconScaleButton>
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
    const [offset, setOffset] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showBillCatSelect, setShowBillCatSelect] = useState(false)
    const [splittingMode, setSplittingMode] = useState(false)
    const [showSplitter, setShowSplitter] = useState(false)
    const [billCatSelectVal, setBillCatSelectVal] = useState<Category | Bill | undefined>()
    const [focusedItem, setFocusedItem] = useState<Transaction | undefined>(undefined)
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | undefined>()
    const [billCatSelectPos, setBillCatSelectPos] = useState<{ x: number, y: number } | undefined>()
    const [transactionUpdates, setTransactionUpdates] =
        useState<{ [key: string]: { categories?: SplitCategory[], bill?: Bill } }>(
            JSON.parse(sessionStorage.getItem('transactionUpdates') || '{}')
        )

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
    const [updateTransactions] = useUpdateTransactionsMutation()
    const newItemsRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setLoaded(true) }, [])

    // Initial fetch when query params change
    useEffect(() => {
        fetchTransactions({
            start: new Date(
                parseInt(searchParams.get('year')!) || new Date().getFullYear(),
                parseInt(searchParams.get('month')!) - 1 || new Date().getMonth()
            ).toISOString(),
            end: new Date(
                parseInt(searchParams.get('year')!) || new Date().getFullYear(),
                parseInt(searchParams.get('month')!) || new Date().getMonth(),
                0
            ).toISOString(),
            offset: offset
        }, true)
    }, [searchParams.get('month'), searchParams.get('year')])

    // Paginated requests
    useEffect(() => {
        if (transactionsData?.next) {
            fetchTransactions({
                start: new Date(
                    parseInt(searchParams.get('year')!) || new Date().getFullYear(),
                    parseInt(searchParams.get('month')!) - 1 || new Date().getMonth()
                ).toISOString(),
                end: new Date(
                    parseInt(searchParams.get('year')!) || new Date().getFullYear(),
                    parseInt(searchParams.get('month')!) || new Date().getMonth(),
                    0
                ).toISOString(),
                offset: offset
            })
        }
    }, [offset])

    // Animation hooks/effects
    const itemsApi = useSpringRef()

    const [containerProps, containerApi] = useSpring(() => ({
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        height: _getContainerHeight(unconfirmedTransactions?.length || 0, expanded),
        overflowX: 'hidden',
        overflowY: 'hidden',
    } as React.CSSProperties))

    const itemTransitions = useTransition(
        unconfirmedTransactions,
        {
            from: (item, index) => ({
                // top: getTop(index, false),
                y: _getY(index, expanded, false),
                transform: `scale(${_getScale(index, expanded, false)})`,
            }),
            enter: (item, index) => ({
                y: _getY(index, expanded, true),
                transform: `scale(${_getScale(index, expanded)})`,
                zIndex: `${(unconfirmedTransactions!.length - index)}`,
                opacity: _getOpacity(index, expanded),
                x: 0,
                left: 0,
                right: 0,
            }),
            update: (item, index) => ({
                y: _getY(index, expanded),
                transform: `scale(${_getScale(index, expanded)})`,
                zIndex: `${(unconfirmedTransactions!.length - index)}`,
                opacity: _getOpacity(index, expanded),
            }),
            onRest: () => {
                expanded
                    ? containerApi.start({ overflowY: 'scroll', overflowX: 'hidden' })
                    : containerApi.start({ overflowY: 'visible', overflowX: 'hidden' })
                splittingMode && setShowSplitter(true)
            },
            config: {
                tension: 180,
                friction: loaded ? 22 : 40,
                mass: 1
            },
            ref: itemsApi
        }
    )

    useEffect(() => { containerApi.start() }, [])

    useEffect(() => {
        containerApi.start({ overflowY: 'hidden', overflowX: 'hidden' })
    }, [expanded])

    useEffect(() => {
        if (unconfirmedTransactions.length > 0) {
            itemsApi.start()
            containerApi.start({
                height: _getContainerHeight(unconfirmedTransactions.length, expanded)
            } as any)
        }
    }, [expanded, unconfirmedTransactions])

    // Menu closing effects, clear positions
    useEffect(() => {
        !showMenu && setMenuPos(undefined)
        !showBillCatSelect && setBillCatSelectPos(undefined)
    }, [showMenu, showBillCatSelect])

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

    // ie activate the options dropdown menu
    const handleEllipsis = (e: any, item: Transaction) => {
        const buttonRect = e.target.closest('button').getBoundingClientRect()
        setMenuPos({
            x: buttonRect.left - newItemsRef.current!.getBoundingClientRect().left || 0,
            y: buttonRect.top - newItemsRef.current!.getBoundingClientRect().top - 4 || 0,
        })
        setFocusedItem(item)
    }

    // Handle confirming an item
    // 1. Animate the item out of the container
    // 2. Remove the item from the items array
    // 3. Add the item to the confirmed items array
    const handleItemConfirm = (transaction: Transaction) => {
        itemsApi.start((index: any, item: any) => {
            if (item._item.transaction_id === transaction.transaction_id) {
                return {
                    x: 100,
                    opacity: 0,
                    config: { duration: 130 },
                    onRest: () => {
                        dispatch(confirmAndUpdateMetaData({
                            transaction: transaction,
                            categories: transactionUpdates[transaction.transaction_id]?.categories
                                || [{ ...transaction.predicted_category!, fraction: 1 }],
                            bill: transactionUpdates[transaction.transaction_id]?.bill?.id
                                || transaction.predicted_bill?.id,
                        }))
                    },
                }
            }
        })
    }

    const handleBillCatClick = (e: any, item: Transaction) => {
        const buttonRect = e.target.closest('button').getBoundingClientRect()
        setBillCatSelectPos({
            x: buttonRect.left - newItemsRef.current!.getBoundingClientRect().left + 8 || 0,
            y: buttonRect.top - newItemsRef.current!.getBoundingClientRect().top - 12 || 0,
        })
        setFocusedItem(item)
    }

    // Handle scrolling
    const handleScroll = (e: any) => {
        // Once the bottom is reached, then fetch the next list of items
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
            transactionsData?.next && setOffset(transactionsData.next)
        }
        setShowMenu(false)
        setShowBillCatSelect(false)
    }

    // When the mouse leaves the container, send the RTK mutation
    // to update the bills/categories. When the mutation is successful,
    // the confirmed queue will be cleared in the extra reducer for the
    // confirmStack slice
    const flushConfirmedQue = () => {
        if (confirmedTransactions.length > 0) {
            updateTransactions(confirmedTransactions)
        }
    }

    const handleSplit = () => {
        setExpanded(false)
        setSplittingMode(true)
        setShowMenu(false)
        !expanded && setShowSplitter(true)
    }

    return (
        <div id="new-items-container">
            <div>
                <Header />
                <InfiniteScrollDiv
                    animate={isFetchingTransactions && offset > 0}
                    ref={newItemsRef}
                    id="new-items"
                    onMouseLeave={() => flushConfirmedQue()}
                >
                    <ShadowedContainer
                        onScroll={handleScroll}
                        showShadow={expanded}
                    >
                        <animated.div style={containerProps}>
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
                                                tabIndex={expanded || index === 0 ? 0 : -1}
                                            />
                                        )
                                    })}
                                </>
                            }
                        </animated.div >
                        <Options
                            show={showBillCatSelect}
                            setShow={setShowBillCatSelect}
                            pos={billCatSelectPos}
                            topArrow={false}
                        >
                            <SelectCategory
                                value={billCatSelectVal}
                                onChange={setBillCatSelectVal}
                            />
                        </Options>
                    </ShadowedContainer >
                    <Options show={showMenu} setShow={setShowMenu} pos={menuPos}>
                        <ItemOptions handlers={[handleSplit]} />
                    </Options>
                    {showSplitter &&
                        <Split
                            title={focusedItem?.name || ''}
                            amount={focusedItem?.amount || 0}
                            defaultCategory={
                                isCategory(transactionUpdates[focusedItem!.transaction_id]) ?
                                    transactionUpdates[focusedItem!.transaction_id].categories![0]
                                    : focusedItem?.predicted_category
                            }
                            onClose={() => {
                                setShowSplitter(false)
                                setSplittingMode(false)
                            }}
                        />
                    }
                </InfiniteScrollDiv >
                <ExpandableContainer
                    expanded={unconfirmedTransactions ? unconfirmedTransactions?.length > 1 : false}>
                    <ExpandButton onClick={() => setExpanded(!expanded)} flipped={expanded} />
                </ExpandableContainer>
            </div >
        </div >
    )
}

export default NeedsConfirmationWindow
