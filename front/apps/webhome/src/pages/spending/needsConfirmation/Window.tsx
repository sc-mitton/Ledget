import React, { FC, MouseEventHandler, useState, useEffect, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'
import { useDispatch, useSelector } from 'react-redux'

import "./styles/Window.scss"
import { Ellipsis, CheckMark } from "@ledget/media"
import Header from './Header'
import ShadowedContainer from '@components/pieces/ShadowedContainer'
import Options from "@components/dropdowns/Options"
import { SelectCategory } from '@components/dropdowns'
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
import { addTransaction2Cat, Category, isCategory } from '@features/categorySlice'
import { addTransaction2Bill, Bill, isBill } from '@features/billSlice'
import {
    useLazyGetUnconfirmedTransactionsQuery,
    useUpdateTransactionsMutation,
    pushConfirmedTransaction,
    selectConfirmedQueue,
    selectConfirmedQueueLength
} from '@features/transactionsSlice'
import type { Transaction } from '@features/transactionsSlice'
import { useGetPlaidItemsQuery } from '@features/plaidSlice'

// Sizing (in ems)
const translate = 1
const expandedTranslate = 5.875;
const expandedHeight = 29
const collapsedHeight = 7.5
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
    newBillCat: Category | Bill | undefined
    style: React.CSSProperties
    onEllipsis: MouseEventHandler<HTMLButtonElement>
    onBillCat: (e: any, item: Transaction) => void
    handleConfirm: (transaction: Transaction) => void
    tabIndex: number
}> = (props) => {
    const { item, newBillCat, style, onEllipsis, onBillCat, handleConfirm, tabIndex } = props
    const dispatch = useDispatch()

    const handleConfirmClick = () => {
        const billId = (isBill(newBillCat) && !isCategory(newBillCat)) ? newBillCat.id : item?.predicted_bill?.id
        const categoryId = (isCategory(newBillCat) && !isBill(newBillCat)) ? newBillCat.id : item?.predicted_category?.id

        if (categoryId) {
            dispatch(addTransaction2Cat({
                categoryId: categoryId,
                amount: item.amount,
            }))
        } else if (billId) {
            dispatch(addTransaction2Bill({
                billId: billId,
                amount: item.amount,
            }))
        }
        dispatch(pushConfirmedTransaction({
            transaction_id: item.transaction_id,
            category: categoryId,
            bill: billId,
        }))
        handleConfirm({
            ...item,
            ...(isCategory(newBillCat) && { category: newBillCat }),
            ...(isBill(newBillCat) && { bill: newBillCat }),
        } as Transaction)
    }

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
                {item.predicted_category?.period === 'month'
                    ?
                    <GrnSlimButton
                        aria-label="Choose budget category"
                        tabIndex={tabIndex}
                        onClick={(e) => { onBillCat(e, item) }}
                    >
                        {newBillCat
                            ? `${newBillCat.name.charAt(0).toUpperCase()}${newBillCat.name.slice(1)}`
                            : `${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`}
                    </GrnSlimButton>
                    :
                    <BlueSlimButton
                        aria-label="Choose budget category"
                        tabIndex={tabIndex}
                        onClick={(e) => { onBillCat(e, item) }}
                    >
                        {newBillCat
                            ? `${newBillCat.name.charAt(0).toUpperCase()}${newBillCat.name.slice(1)}`
                            : `${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`}
                    </BlueSlimButton>
                }
                <Tooltip
                    msg="Confirm"
                    ariaLabel="Confirm"
                    style={{ left: '-1.1rem' }}
                >
                    <IconScaleButton
                        onClick={handleConfirmClick}
                        aria-label="Confirm"
                        tabIndex={tabIndex}
                        className="confirm-button"
                    >
                        <CheckMark />
                    </IconScaleButton>
                </Tooltip>
                <NarrowButton
                    tabIndex={tabIndex}
                    onClick={onEllipsis}
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
    const [billCatSelectVal, setBillCatSelectVal] = useState<Category | Bill | undefined>()
    const [focusedItem, setFocusedItem] = useState<Transaction | undefined>(undefined)
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | undefined>()
    const [billCatSelectPos, setBillCatSelectPos] = useState<{ x: number, y: number } | undefined>()
    const [updatedBillCats, setUpdatedBillCats] =
        useState<({ transactionId: string, category: Category | undefined, bill: Bill | undefined })[]>(
            sessionStorage.getItem('updatedBillCats') ? JSON.parse(sessionStorage.getItem('updatedBillCats')!) : [])
    const [unconfirmedTransactions, setUnconfirmedTransactions] = useState<Transaction[] | undefined>()

    const [
        fetchTransactions,
        { data: transactionsData, isSuccess, isFetching: isFetchingTransactions }
    ] = useLazyGetUnconfirmedTransactionsQuery()
    const [updateTransactions] = useUpdateTransactionsMutation()
    const newItemsRef = useRef<HTMLDivElement>(null)
    const confirmedQueue = useSelector(selectConfirmedQueue)
    const confirmedQueueLength = useSelector(selectConfirmedQueueLength)

    useEffect(() => { setLoaded(true) }, [])

    // Initial fetch when query params change
    useEffect(() => {
        fetchTransactions({
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            year: parseInt(searchParams.get('year')!) || new Date().getFullYear(),
            offset: offset
        }, true)
    }, [searchParams.get('month')])

    // Paginated requests
    useEffect(() => {
        if (transactionsData?.next) {
            fetchTransactions({
                month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
                year: parseInt(searchParams.get('year')!) || new Date().getFullYear(),
                confirmed: false,
                offset: offset
            })
        }
    }, [offset])

    // When the data is fetched, set the items state variable
    useEffect(() => {
        isSuccess && setUnconfirmedTransactions(transactionsData?.results)
    }, [isSuccess, transactionsData])

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
                    : containerApi.start({ overflowY: 'visible', overflowX: 'visible' })
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
        if (unconfirmedTransactions) {
            itemsApi.start()
            containerApi.start({
                height: _getContainerHeight(unconfirmedTransactions.length, expanded)
            } as any)
        }
    }, [expanded, unconfirmedTransactions])

    // Menu closing effects
    useEffect(() => {
        !showMenu && setMenuPos(undefined)
        if (!showBillCatSelect) {
            setBillCatSelectPos(undefined)
            setFocusedItem(undefined)
            setBillCatSelectVal(undefined)
        }
    }, [showMenu, showBillCatSelect])

    // Set updatedBillCats in session storage for persistence over page refreshes
    useEffect(() => {
        sessionStorage.setItem('updatedBillCats', JSON.stringify(updatedBillCats))
    }, [updatedBillCats])

    // When options are selected from the bill/category combo dropdown
    // update the list of updated bills/categories
    useEffect(() => {
        if (!focusedItem) return

        setUpdatedBillCats(prev => {
            let updated = false
            const updatedList = prev.map((item) => {
                if (item.transactionId === focusedItem.transaction_id) {
                    updated = true
                    return {
                        transactionId: focusedItem.transaction_id,
                        category: isCategory(billCatSelectVal) ? billCatSelectVal : item.category,
                        bill: isBill(billCatSelectVal) ? billCatSelectVal : item.bill,
                    }
                } else {
                    return item
                }
            })
            if (updated) {
                return updatedList
            } else {
                const newItem = {
                    transactionId: focusedItem.transaction_id,
                    category: isCategory(billCatSelectVal) ? billCatSelectVal : undefined,
                    bill: isBill(billCatSelectVal) ? billCatSelectVal : undefined,
                }
                return [...prev, newItem]
            }
        })
        setShowBillCatSelect(false) // close the dropdown

    }, [billCatSelectVal])

    // ie activate the options dropdown menu
    const handleEllipsis = (e: any) => {
        const buttonRect = e.target.closest('button').getBoundingClientRect()
        setMenuPos({
            x: buttonRect.left - newItemsRef.current!.getBoundingClientRect().left || 0,
            y: buttonRect.top - newItemsRef.current!.getBoundingClientRect().top - 4 || 0,
        })
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
                        setUnconfirmedTransactions(prev =>
                            prev?.filter(t => t.transaction_id !== transaction.transaction_id)
                        )
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

    // When the mouse leaves the container, flush the confirmed items que
    const flushConfirmedQue = () => {
        if (confirmedQueueLength > 0) {
            setUpdatedBillCats([])
            updateTransactions(confirmedQueue)
        }
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
                                                onBillCat={(e, item) => handleBillCatClick(e, item)}
                                                newBillCat={
                                                    updatedBillCats.find(billCat => billCat.transactionId === item.transaction_id)?.category ||
                                                    updatedBillCats.find(billCat => billCat.transactionId === item.transaction_id)?.bill
                                                }
                                                onEllipsis={(e) => handleEllipsis(e)}
                                                handleConfirm={handleItemConfirm}
                                                tabIndex={expanded || index === 0 ? 0 : -1}
                                            />
                                        )
                                    })}
                                </>
                            }
                        </animated.div >
                        <Options show={showMenu} setShow={setShowMenu} pos={menuPos}>
                            <ItemOptions />
                        </Options>
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
                </InfiniteScrollDiv >
                <ExpandableContainer expanded={unconfirmedTransactions ? unconfirmedTransactions?.length > 1 : false}>
                    <ExpandButton onClick={() => setExpanded(!expanded)} flipped={expanded} />
                </ExpandableContainer>
            </div >
        </div >
    )
}

export default NeedsConfirmationWindow
