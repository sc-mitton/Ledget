import React from 'react'
import { useState, useEffect, useRef, useCallback, useContext, createContext } from 'react'

import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'

import "./styles/Window.css"
import Ellipsis from "@assets/icons/Ellipsis"
import CheckMark from "@assets/icons/CheckMark"
import ExpandIcon from "@assets/icons/Expand"
import Wells from "@assets/logos/Wells"
import Ally from "@assets/logos/Ally"
import Discover from "@assets/logos/Discover"
import Visa from "@assets/logos/Visa"
import formatDateOrRelativeDate from "@utils/convertTImestamp"
import ShadowedContainer from '@components/pieces/ShadowedContainer'
import Header from './Header'
import Options from "@components/dropdowns/Options"
import ItemOptions from "./ItemOptions"

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

const useItemAnimations = (expanded, items, stackMax) => {
    const translate = 18
    const expandedTranslate = 85
    const expandedHeight = 320
    const collapsedHeight = 120

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

    const getOpacity = useCallback((index) => {
        const belowStackMax = index > stackMax
        return (!expanded && belowStackMax && index !== 0) ? 0 : 1
    }, [expanded])

    const getScale = useCallback((index, loaded = true) => {
        const scale = .1

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
    }, [expanded])

    const getY = useCallback((index, loaded = true) => {
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
    }, [expanded])

    const itemTransitions = useTransition(
        items,
        {
            from: (item, index) => ({
                // top: getTop(index, false),
                y: getY(index, false),
                transform: `scale(${getScale(index, false)})`,
            }),
            enter: (item, index) => ({
                y: getY(index, true),
                transform: `scale(${getScale(index)})`,
                zIndex: `${(items.length - index)}`,
                opacity: getOpacity(index),
                margin: '0 16px',
                x: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                borderRadius: "12px",
                boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.13)",
                background: "var(--window)",
                padding: "16px 24px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }),
            update: (item, index) => ({
                y: getY(index, true),
                transform: `scale(${getScale(index)})`,
                zIndex: `${(items.length - index)}`,
                opacity: getOpacity(index),
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
            height: expanded
                ? Math.min(items.length * expandedTranslate + 15, expandedHeight)
                : (items.length > 0 ? collapsedHeight : 0)
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
                <button
                    className='btn-grn btn-2slim'
                    aria-label="Choose budget category"
                    tabIndex={tabIndex}
                >
                    {item.category}
                </button>
                <button
                    className='btn btn-scale2'
                    onClick={onConfirm}
                    aria-label="Confirm item"
                    tabIndex={tabIndex}
                >
                    <CheckMark />
                </button>
                <button
                    className='btn-narrow btn-clr'
                    tabIndex={tabIndex}
                    onClick={onEllipsis}
                    aria-label="More options"
                    aria-haspopup="menu"
                >
                    <Ellipsis />
                </button>
            </div>
        </animated.div>
    )
}

const ExpandButton = ({ onClick }) => {
    const [rotated, setRotated] = useState(false)
    const { items } = useContext(NewItemsContext)

    const rotationProps = useSpring({
        transform: `rotate(${rotated ? 0 : 180}deg)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    })

    const buttonContainerProps = useSpring({
        marginTop: items.length === 0 ? '0px' : '8px',
        marginBottom: items.length > 1 ? '12px' : '0px',
        opacity: items.length > 1 ? 1 : 0,
        height: items.length > 1 ? '1.6em' : '0em',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        scale: "1.05",
    })

    return (
        <animated.div
            className="bottom-buttons"
            style={buttonContainerProps}
        >
            <button
                className="btn-sp btn-discreet"
                tabIndex={0}
                style={{ padding: '0 8px' }}
                onClick={() => {
                    setRotated(!rotated)
                    onClick()
                }}
                aria-label="Expand new item stack"
            >
                <animated.div style={rotationProps}>
                    <ExpandIcon stroke={"var(--faded-text)"} />
                </animated.div >
            </button>
        </animated.div>
    )
}

const NeedsConfirmationWindow = () => {
    const { items, setItems } = useContext(NewItemsContext)
    const newItemsRef = useRef(null)
    const [expanded, setExpanded] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [menuPos, setMenuPos] = useState(null)

    const { itemsApi, containerProps, itemTransitions } = useItemAnimations(expanded, items, 2)

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
            <ExpandButton onClick={() => setExpanded(!expanded)} />
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
