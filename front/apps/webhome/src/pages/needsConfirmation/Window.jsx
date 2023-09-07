import React from 'react'
import { useState, useEffect, useRef, useCallback, useContext, createContext } from 'react'

import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'

import "./styles/Window.css"
import { Ellipsis, CheckMark } from "@ledget/shared-assets"
import Wells from "@assets/logos/Wells"
import Ally from "@assets/logos/Ally"
import Discover from "@assets/logos/Discover"
import Visa from "@assets/logos/Visa"
import ShadowedContainer from '@components/pieces/ShadowedContainer'
import Header from './Header'
import Options from "@components/dropdowns/Options"
import ItemOptions from "./ItemOptions"
import { Tooltip } from "@components/pieces"
import { formatDateOrRelativeDate } from "@ledget/shared-utils"
import { NarrowButton, ExpandableContainer, ExpandButton, GrnSlimButton } from "@ledget/shared-ui"

// TODO: eventually these will go away, data will be pulled from backend
// and logos will be brought in another way

const NewItemsContext = createContext()

const NewItemsProvider = ({ children }) => {
    let data = [
        { 'id': 0, 'account': 'wells-fargo', 'timestamp': 1690035917, 'name': 'Publix', 'amount': 8632, 'category': '🛒 Groceries' },
        { 'id': 1, 'account': 'ally-bank', 'timestamp': 1689883555, 'name': 'Cinemark', 'amount': 3120, 'category': '❤️ Dates' },
        { 'id': 2, 'account': 'discover-card', 'timestamp': 1689624355, 'name': 'Shell', 'amount': 4321, 'category': '⛽️ Gas' },
        { 'id': 3, 'account': 'wells-fargo', 'timestamp': 1689537955, 'name': 'Venmo', 'amount': 140000, 'category': '🏠 Rent' },
        { 'id': 4, 'account': 'visa', 'timestamp': 1689451555, 'name': 'Banana Republic', 'amount': 12340, 'category': "🙋🏼‍♂️ Spencer" },
        { 'id': 5, 'account': 'visa', 'timestamp': 1689451555, 'name': 'Slice of the Berg', 'amount': 2010, 'category': '🍕 Food' },
        { 'id': 6, 'account': 'discover-card', 'timestamp': 1689278755, 'name': 'Cinemark', 'amount': 3120, 'category': '💖 Dates' },
        { 'id': 7, 'account': 'discover-card', 'timestamp': 1689192355, 'name': '7 Eleven', 'amount': 4321, 'category': '⛽️ Gas' },
        { 'id': 8, 'account': 'wells-fargo', 'timestamp': 1689185155, 'name': 'Venmo', 'amount': 1234, 'category': '🏠 Rent' },
        { 'id': 9, 'account': 'visa', 'timestamp': 1689185155, 'name': 'Ann Taylor', 'amount': 12340, 'category': "💅🏽 Allie" },
    ] // TODO pull this in from backend

    const [items, setItems] = useState(data)

    const values = {
        items,
        setItems,
    }

    return (
        <NewItemsContext.Provider value={values}>
            {children}
        </NewItemsContext.Provider>
    )
}

const AccountLogo = ({ account }) => {
    const logos = {
        'wells-fargo': <Wells />,
        'ally-bank': <Ally />,
        'discover-card': <Discover />,
        'visa': <Visa />,
    }

    return (
        <>{
            logos[account]
        }</>
    )
}

// End TODO
const translate = 13
const expandedTranslate = 85
const expandedHeight = 320
const collapsedHeight = 110
const scale = .1
const stackMax = 2

const getContainerHeight = (length, expanded) => {
    expanded
        ? Math.min(length * expandedTranslate + 15, expandedHeight)
        : (length > 0 ? collapsedHeight : 0)

    if (expanded) {
        return Math.min(length * expandedTranslate + 15, expandedHeight)
    } else if (length > stackMax) {
        return collapsedHeight
    } else if (length > 0) {
        return collapsedHeight - ((stackMax - length) * translate)
    } else {
        return 0
    }
}

const getOpacity = (index, expanded) => {
    const belowStackMax = index > stackMax
    return (!expanded && belowStackMax && index !== 0) ? 0 : 1
}

const getScale = (index, expanded, loaded = true,) => {

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

const getY = (index, expanded, loaded = true) => {
    if (!loaded) {
        return (index ** 2) * 5 + 30
    }

    if (index === 0 || expanded) {
        return index * expandedTranslate + 8
    } else {
        if (index > stackMax) {
            return stackMax * translate + 8
        } else {
            return index * translate + 8
        }
    }
}

const useItemAnimations = (expanded, items) => {

    const [loaded, setLoaded] = useState(false)
    const itemsApi = useSpringRef()

    useEffect(() => { setLoaded(true) }, [])

    const [containerProps, containerApi] = useSpring(() => ({
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        height: collapsedHeight,
        overflowX: "hidden",
        overflowY: "hidden",
    }))


    const itemTransitions = useTransition(
        items,
        {
            from: (item, index) => ({
                // top: getTop(index, false),
                y: getY(index, expanded, false),
                transform: `scale(${getScale(index, expanded, false)})`,
            }),
            enter: (item, index) => ({
                y: getY(index, expanded, true),
                transform: `scale(${getScale(index, expanded)})`,
                zIndex: `${(items.length - index)}`,
                opacity: getOpacity(index, expanded),
                margin: '0 12px',
                x: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                borderRadius: "var(--border-radius3)",
                boxShadow: "var(--new-item-drop-shadow)",
                background: "var(--window)",
                padding: "16px 24px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }),
            update: (item, index) => ({
                y: getY(index, expanded),
                transform: `scale(${getScale(index, expanded)})`,
                zIndex: `${(items.length - index)}`,
                opacity: getOpacity(index, expanded),
            }),
            onRest: (item, index) => {
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
        itemsApi.start()
        containerApi.start({
            height: getContainerHeight(items.length, expanded),
        })
    }, [expanded, items])

    useEffect(() => {
        containerApi.start({
            overflowY: 'hidden',
        })
    }, [expanded])

    return {
        containerApi,
        containerProps,
        itemsApi,
        itemTransitions
    }
}

const NewItem = (props) => {
    const { item, style, onEllipsis, onConfirm, tabIndex } = props

    return (
        <animated.div
            key={`item-${item.id}`}
            className="new-item"
            style={style}
        >
            <div className='new-item-data'>
                <div>
                    <span>{item.name}</span>
                </div>
                <div>
                    <AccountLogo account={item.account} />
                    <span>{`$${item.amount / 100}`}</span>&nbsp;&nbsp;&nbsp;
                    <span>{formatDateOrRelativeDate(item.timestamp)}</span>
                </div>
            </div>
            <div className='new-item-icons' >
                <GrnSlimButton
                    aria-label="Choose budget category"
                    tabIndex={tabIndex}
                >
                    {item.category}
                </GrnSlimButton>
                <Tooltip
                    msg="Confirm"
                    ariaLabel="Confirm"
                    type="top"
                    style={{ left: '-1.1rem' }}
                >
                    <button
                        className='btn btn-scale2'
                        onClick={onConfirm}
                        aria-label="Confirm"
                        tabIndex={tabIndex}
                    >
                        <CheckMark />
                    </button>
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
    const { items, setItems } = useContext(NewItemsContext)
    const newItemsRef = useRef(null)
    const [expanded, setExpanded] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [menuPos, setMenuPos] = useState(null)

    const { itemsApi, containerProps, itemTransitions } = useItemAnimations(expanded, items)

    useEffect(() => {
        !showMenu && setMenuPos(null)
    }, [showMenu])

    const handleConfirm = i => {
        itemsApi.start((item, index) => {
            if (item === i) {
                return {
                    x: 100,
                    opacity: 0,
                    config: { duration: 130 },
                    onRest: () => {
                        setItems(items.filter((item) => item.id !== i))
                    },
                }
            }
        })
    }

    const handleEllipsis = (e) => {
        const buttonRect = e.target.closest('button').getBoundingClientRect()
        setMenuPos({
            x: buttonRect.left - newItemsRef.current.getBoundingClientRect().left,
            y: buttonRect.top - newItemsRef.current.getBoundingClientRect().top,
        })
    }

    return (
        <div id="new-items-container">
            <Header />
            <div ref={newItemsRef} id="new-items">
                <ShadowedContainer
                    onScroll={() => setShowMenu(false)}
                    showShadow={expanded}
                >
                    <animated.div style={containerProps}>
                        {itemTransitions((style, item) =>
                            <NewItem
                                item={item}
                                style={style}
                                onEllipsis={(e) => handleEllipsis(e)}
                                onConfirm={() => handleConfirm(item.id)}
                                tabIndex={expanded || item.id === 0 ? 0 : -1}
                            />
                        )}
                    </animated.div >
                    <Options show={showMenu} setShow={setShowMenu} pos={menuPos}>
                        <ItemOptions />
                    </Options>
                </ShadowedContainer>
            </div>
            <ExpandableContainer expanded={items.length > 1}>
                <ExpandButton onClick={() => setExpanded(!expanded)} flipped={expanded} />
            </ExpandableContainer>
        </div>
    )
}

// Eventually this extra wrapper will go away
const Window = () => {

    return (
        <NewItemsProvider>
            <NeedsConfirmationWindow />
        </NewItemsProvider>
    )
}

export default Window
