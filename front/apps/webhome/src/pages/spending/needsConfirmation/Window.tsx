import React, { FC, MouseEventHandler, useState, useEffect, useRef } from 'react'

import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'

import "./styles/Window.scss"
import { Ellipsis, CheckMark } from "@ledget/media"
import ShadowedContainer from '@components/pieces/ShadowedContainer'
import Header from './Header'
import Options from "@components/dropdowns/Options"
import ItemOptions from "./ItemOptions"
import {
    NarrowButton,
    ExpandableContainer,
    ExpandButton,
    GrnSlimButton2,
    BlueSlimButton2,
    IconScaleButton,
    Tooltip,
    Base64Logo,
    DollarCents
} from "@ledget/ui"
import { formatDateOrRelativeDate } from '@ledget/ui'
import { useGetTransactionsQuery } from '@features/transactionsSlice'
import type { Transaction } from '@features/transactionsSlice'
import { useGetPlaidItemsQuery } from '@features/plaidSlice'

// Sizing (in ems)
const translate = 1
const expandedTranslate = 5.625;
const expandedHeight = 29
const collapsedHeight = 7.5
const scale = .1
const stackMax = 2

const _getContainerHeight = (length: number, expanded: boolean) => {
    expanded
        ? `${Math.min(length * expandedTranslate + 1, expandedHeight)}em`
        : (length > 0 ? `${collapsedHeight}em` : 0)

    if (expanded) {
        return `${Math.min(length * expandedTranslate + 1, expandedHeight)}em`
    } else if (length > stackMax) {
        return `${collapsedHeight}em`
    } else if (length > 0) {
        return `${collapsedHeight - ((stackMax - length) * translate)}em`
    } else {
        return 0
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

interface NewItemProps {
    item: Transaction
    style: React.CSSProperties
    onEllipsis: MouseEventHandler<HTMLButtonElement>
    onConfirm: () => void
    tabIndex: number
}

const Logo = ({ accountId }: { accountId: string }) => {
    const { data } = useGetPlaidItemsQuery()

    const item = data?.find(item => item.accounts.find(account => account.id === accountId))

    return (
        <Base64Logo
            data={item?.institution.logo}
            alt={item?.institution.name}
        />
    )
}

const NewItem: FC<NewItemProps> = (props: NewItemProps) => {
    const { item, style, onEllipsis, onConfirm, tabIndex } = props

    return (
        <animated.div
            key={`item-${item.transaction_id}`}
            className="new-item"
            style={style}
        >
            <div className='new-item-data'>
                <div>
                    <Logo accountId={item.account!} />
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
                {item.category!.period === 'month'
                    ?
                    <GrnSlimButton2
                        aria-label="Choose budget category"
                        tabIndex={tabIndex}
                    >
                        {item.category?.name}
                    </GrnSlimButton2>
                    :
                    <BlueSlimButton2
                        aria-label="Choose budget category"
                        tabIndex={tabIndex}
                    >
                        {item.category?.name}
                    </BlueSlimButton2>
                }
                <Tooltip
                    msg="Confirm"
                    ariaLabel="Confirm"
                    type="top"
                    style={{ left: '-1.1rem' }}
                >
                    <IconScaleButton
                        onClick={onConfirm}
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
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)
    const [expanded, setExpanded] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null)
    const [items, setItems] = useState<Transaction[] | undefined>()

    const { data: transactionsData, isSuccess } = useGetTransactionsQuery({
        month: new Date().getMonth() + 1,
        confirmed: false,
        offset: offset,
        limit: limit,
    })
    const newItemsRef = useRef<HTMLDivElement>(null)

    const [loaded, setLoaded] = useState(false)
    const itemsApi = useSpringRef()

    useEffect(() => {
        isSuccess && setItems(transactionsData?.results)
    }, [isSuccess])

    useEffect(() => { setLoaded(true) }, [])

    const [containerProps, containerApi] = useSpring(() => ({
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        height: `${collapsedHeight}em`,
        overflowX: 'hidden',
        overflowY: 'hidden',
    } as React.CSSProperties))

    const itemTransitions = useTransition(
        items,
        {
            from: (item, index) => ({
                // top: getTop(index, false),
                y: _getY(index, expanded, false),
                transform: `scale(${_getScale(index, expanded, false)})`,
            }),
            enter: (item, index) => ({
                y: _getY(index, expanded, true),
                transform: `scale(${_getScale(index, expanded)})`,
                zIndex: `${(items!.length - index)}`,
                opacity: _getOpacity(index, expanded),
                x: 0,
                left: 0,
                right: 0,
            }),
            update: (item, index) => ({
                y: _getY(index, expanded),
                transform: `scale(${_getScale(index, expanded)})`,
                zIndex: `${(items!.length - index)}`,
                opacity: _getOpacity(index, expanded),
            }),
            onRest: () => {
                expanded &&
                    containerApi.start({
                        overflowY: 'scroll',
                    })
            },
            config: {
                tension: 180,
                friction: loaded ? 22 : 40,
                mass: 1
            },
            ref: itemsApi
        }
    )

    useEffect(() => {
        if (items) {
            itemsApi.start()
            containerApi.start({
                height: _getContainerHeight(items!.length, expanded)
            } as any)
        }
    }, [expanded, items])

    useEffect(() => {
        containerApi.start({
            overflowY: 'hidden',
        })
    }, [expanded])

    useEffect(() => {
        !showMenu && setMenuPos(null)
    }, [showMenu])

    const handleConfirm = (id: string | undefined) => {
        itemsApi.start((item: Transaction) => {
            if (item.transaction_id === id) {
                return {
                    x: 100,
                    opacity: 0,
                    config: { duration: 130 },
                    onRest: () => {
                        // TODO
                    },
                }
            }
        })
    }

    const handleEllipsis = (e: any) => {
        const buttonRect = e.target.closest('button').getBoundingClientRect()
        setMenuPos({
            x: buttonRect.left - newItemsRef.current!.getBoundingClientRect().left || 0,
            y: buttonRect.top - newItemsRef.current!.getBoundingClientRect().top - 4 || 0,
        })
    }

    return (
        <div id="new-items-container">
            <div>
                <Header />
                <div ref={newItemsRef} id="new-items">
                    <ShadowedContainer
                        onScroll={() => setShowMenu(false)}
                        showShadow={expanded}
                    >
                        <animated.div style={containerProps}>
                            {(isSuccess && items) &&
                                <>
                                    {itemTransitions((style, item, index) => {
                                        if (!item) return null
                                        return (
                                            <NewItem
                                                item={item}
                                                style={style}
                                                onEllipsis={(e) => handleEllipsis(e)}
                                                onConfirm={() => handleConfirm(item.transaction_id)}
                                                // tabIndex={expanded || index === 0 ? 0 : -1} TODO
                                                tabIndex={0}
                                            />
                                        )
                                    }
                                    )}
                                </>
                            }
                        </animated.div >
                        <Options show={showMenu} setShow={setShowMenu} pos={menuPos}>
                            <ItemOptions />
                        </Options>
                    </ShadowedContainer >
                </div >
                <ExpandableContainer
                    expanded={transactionsData?.results ? transactionsData.results.length > 0 : false}
                >
                    <ExpandButton onClick={() => setExpanded(!expanded)} flipped={expanded} />
                </ExpandableContainer>
            </div >
        </div >
    )
}

export default NeedsConfirmationWindow
