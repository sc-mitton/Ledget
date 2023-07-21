import React from 'react'
import { useState, useEffect, useRef, useCallback, useContext, createContext } from 'react'

import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'

import "./styles/NewItems.css"
import Ellipsis from "../assets/svg/Ellipsis"
import CheckMark from "../assets/svg/CheckMark"
import ExpandIcon from "../assets/svg/Expand"
import DropAnimation from "./utils/DropAnimation"
import ItemOptionsMenu from "./dropdowns/ItemOptionsMenu"


// TODO: pull this data in from backend

const NewItemsContext = createContext()

const NewItemsProvider = ({ children }) => {
    let data = [
        { 'id': 0, 'data': 'Publix' },
        { 'id': 1, 'data': 'Movies' },
        { 'id': 2, 'data': 'Gas' },
        { 'id': 3, 'data': 'Rent' },
        { 'id': 4, 'data': 'Clothes' },
        { 'id': 5, 'data': 'Pizza' },
        { 'id': 6, 'data': 'Movies' },
        { 'id': 7, 'data': 'Gas' },
        { 'id': 8, 'data': 'Rent' },
        { 'id': 9, 'data': 'Clothes' }
    ]// TODO pull this in from backend

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

const useItemAnimations = (expanded, items, stackMax) => {
    const translate = 13
    const expandedTranslate = 75
    const expandedHeight = 270
    const collapsedHeight = 95

    const [loaded, setLoaded] = useState(false)
    const itemsApi = useSpringRef()

    useEffect(() => { setLoaded(true) }, [])

    const [containerProps, containerApi] = useSpring(() => ({
        maxWidth: '400px',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        boxSize: 'border-box',
        height: collapsedHeight,
    }))

    const getBackground = useCallback((index) => {
        let r = 230 - (Math.min(index, stackMax) ** 2 * 40)
        // Items lower on the stack are darker
        // Don't calculate past the stack max because
        // it's not shown in unexpanded mode
        if (expanded || index === 0) {
            return "linear-gradient(0deg, rgba(237, 237, 237, .85) 0%,  \
                    rgba(237, 237, 237, 1)25%, rgba(237, 237, 237, 1)"
        } else {
            return `linear-gradient(0deg, rgba(${r}, ${r}, ${r}, .75) 0%,
             rgba(${r}, ${r}, ${r}, 1)25%, rgba(${r}, ${r}, ${r}, 1)`
        }
    }, [expanded])

    const getOpacity = useCallback((index) => {
        const belowStackMax = index > stackMax
        return (!expanded && belowStackMax && index !== 0) ? 0 : 1
    }, [expanded])

    const getScale = useCallback((index, loaded = true) => {
        const scale = .08

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
            return index * expandedTranslate
        } else {
            if (index > stackMax) {
                return stackMax * translate
            } else {
                return index * translate
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
                // top: getTop(index, true),
                y: getY(index, true),
                transform: `scale(${getScale(index)})`,
                zIndex: `${(items.length - index)}`,
                opacity: getOpacity(index),
                background: getBackground(index),
                position: 'absolute',
                x: 0,
                left: 0,
                right: 0,
                margin: '0 16px',
                borderRadius: "12px",
                padding: "20px",
                fontWeight: "400",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }),
            update: (item, index) => ({
                // top: getTop(index),
                y: getY(index, true),
                transform: `scale(${getScale(index)})`,
                zIndex: `${(items.length - index)}`,
                opacity: getOpacity(index),
                background: getBackground(index),
            }),
            onRest: (item, index) => {
                expanded &&
                    containerApi.start({
                        overflowX: 'hidden',
                        overflowY: 'scroll',
                    })
            },
            onStart: () => {
                containerApi.start({ overflowX: 'hidden', overflowY: 'hidden' })
            },
            config: {
                tension: 180,
                friction: loaded ? 22 : 40,
                mass: 1
            },
            ref: itemsApi
        }
    )

    const buttonContainerProps = useSpring({
        marginTop: items.length === 0 ? '0px' : '4px',
        marginBottom: items.length > 1 ? '12px' : '0px',
        opacity: items.length > 1 ? 1 : 0,
        height: items.length > 1 ? '1.6em' : '0em',
        marginLeft: 'auto',
        marginRight: 'auto',
        scale: "1.05",
        zIndex: 100,
    })

    useEffect(() => {
        itemsApi.start()
        containerApi.start({
            height: expanded
                ? Math.min(items.length * expandedTranslate, expandedHeight)
                : (items.length > 0 ? collapsedHeight : 0)
        })
    }, [expanded, items])

    return {
        containerApi,
        containerProps,
        itemsApi,
        itemTransitions,
        buttonContainerProps
    }
}

const Shadow = ({ visible }) => {
    return (
        <>
            {visible && <div className="shadow shadow-bottom"></div>}
        </>
    )
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
                {item.data}
            </div>
            <div className='new-item-icons' >
                <button
                    className='category-icon'
                    aria-label="Choose budget category"
                    tabIndex={tabIndex}
                >
                    Groceries
                </button>
                <button
                    className='icon2'
                    onClick={onConfirm}
                    aria-label="Confirm item"
                    tabIndex={tabIndex}
                >
                    <CheckMark />
                </button>
                <button
                    className='narrow-icon'
                    tabIndex={tabIndex}
                    onClick={onEllipsis}
                >
                    <Ellipsis />
                </button>
            </div>
        </animated.div>
    )
}

const ExpandButton = ({ onClick, children }) => {
    const [rotated, setRotated] = useState(false)

    const rotationProps = useSpring({
        transform: `rotate(${rotated ? 0 : 180}deg)`
    })

    return (

        <button
            id="expand-button"
            onClick={() => {
                setRotated(!rotated)
                onClick()
            }}
            aria-label="Expand new item stack"
            tabIndex={0}
        >
            {children}
            <animated.div
                id="expand-button-icon"
                style={rotationProps}
                aria-label="Expand new item stack"
            >
                <ExpandIcon />
            </animated.div >
        </button>
    )
}

const Menu = ({ pos, show, setShow }) => {
    const menuRef = useRef('')

    useEffect(() => {
        if (pos) {
            setShow(true)
        }

        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShow(false)
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Tab') {
                setShow(false)
            }
        };

        const handleWindowResize = () => {
            setShow(false)
        };

        window.addEventListener('click', handleClick)
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('resize', handleWindowResize)

        return () => {
            window.removeEventListener('resize', handleWindowResize)
            window.removeEventListener('click', handleClick)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [pos])

    return (
        <DropAnimation
            visible={show}
            className="dropdown options-dropdown"
            style={{
                position: 'absolute',
                top: pos ? pos.y + 35 : 0,
                left: pos ? pos.x - 43 : 0,
                zIndex: 10,
            }}
            ref={menuRef}
        >
            <ItemOptionsMenu />
        </DropAnimation>
    )
}

const NewItemsStack = ({ stackMax }) => {
    const { items, setItems } = useContext(NewItemsContext)
    const containerRef = useRef(null)
    const [expanded, setExpanded] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [menuPos, setMenuPos] = useState(null)

    const {
        itemsApi,
        containerApi,
        containerProps,
        itemTransitions,
        buttonContainerProps
    } = useItemAnimations(expanded, items, stackMax)

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
                    onStart: () => {
                        containerApi.start({ overflowX: 'hidden', overflowY: 'hidden' })
                    },
                    onRest: () => {
                        setItems(items.filter((item) => item.id !== i))
                    },
                }
            }
        })
    }

    const handleEllipsis = (e) => {
        setMenuPos({
            x: e.target.getBoundingClientRect().left
                - newItemsContainerRef.current.getBoundingClientRect().left,
            y: e.target.getBoundingClientRect().top
                - newItemsContainerRef.current.getBoundingClientRect().top,
        })
    }

    return (
        <>
            <div id="new-items-container">
                <Shadow visible={expanded && items.length > stackMax} />
                <animated.div
                    style={containerProps}
                    ref={containerRef}
                    onScroll={() => { setShowMenu(false) }}
                >
                    {itemTransitions((style, item) =>
                        <NewItem
                            item={item}
                            style={style}
                            onEllipsis={(e) => handleEllipsis(e)}
                            onConfirm={() => handleConfirm(item.id)}
                            tabIndex={expanded || item.id === 0 ? 0 : -1}
                        />)
                    }
                </animated.div >
                <Menu
                    show={showMenu}
                    setShow={setShowMenu}
                    pos={menuPos}
                />
            </div>
            <animated.div
                id="expand-button-container"
                className="bottom-buttons"
                style={buttonContainerProps}
            >
                <ExpandButton onClick={() => setExpanded(!expanded)}>
                    {`${items.length} `}
                </ExpandButton>
            </animated.div>
        </>
    )
}

const NewItemsWindow = () => {

    return (
        <NewItemsProvider>
            <NewItemsStack stackMax={2} />
        </NewItemsProvider>
    )
}

export default NewItemsWindow
