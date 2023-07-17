import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'

import { useSpring, animated, useTransition } from '@react-spring/web'

import "./style/NewItems.css"
import Ellipsis from "../assets/svg/Ellipsis"
import CheckMark from "../assets/svg/CheckMark"
import Expand from "../assets/svg/Expand"
import Note from "../assets/svg/Note"
import Split from "../assets/svg/Split"
import DropAnimation from "./utils/DropAnimation"
import { Menu } from '@headlessui/react'


// TODO: pull this data in from backend
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
]

const stackMax = 2
const translate = 13
const expandedTranslate = 75

// New items container dimensions
const collapsedHeight = 95
const expandedHeight = 270

// CSS for the new item notification component
const newItemsSpringConfig = {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: '0 auto',
    borderRadius: "12px",
    padding: "20px",
    fontWeight: "400",
    x: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
}

const containerSpringConfig = {
    overflowX: 'hidden',
    boxSize: 'border-box',
    height: collapsedHeight,
    backgroundColor: "var(--window)",
    position: 'relative',
    margin: '0 8px',
    padding: '0 16px',
}

const NewItemsStack = () => {

    const [expanded, setExpanded] = useState(false)
    const [items, setItems] = useState(data)
    const containerRef = useRef(null)
    const [containerSpring, containerApi] = useSpring(() => ({
        zIndex: 1,
        overflowY: expanded ? "scroll" : "hidden",
        ...containerSpringConfig
    }))

    // Calculate the background color of new items
    // Items lower on the stack are darker
    // Don't calculate past the stack max because it's not shown in unexpanded mode
    const getBackground = (index) => {
        let r = 230 - (Math.min(index, stackMax) ** 2 * 18)

        if (expanded || index === 0) {
            return "linear-gradient(0deg, rgba(240, 240, 240, .85) 0%,  \
                    rgba(240, 240, 240, 1)25%, rgba(240, 240, 240, 1)"
        } else {
            return `linear-gradient(0deg, rgba(${r}, ${r}, ${r}, .75) 0%,
             rgba(${r}, ${r}, ${r}, 1)25%, rgba(${r}, ${r}, ${r}, 1)`
        }
    }

    // Hide new items that are below the stack max in unexpanded mode
    const getOpacity = (index) => {
        const belowStackMax = index > stackMax
        return !expanded && belowStackMax ? 0 : 1
    }

    // Calculate the top position of new items
    const getTop = useCallback((index, loaded = true) => {
        if (!loaded) {
            return stackMax * translate + 15
        }

        if (index === 0) {
            return 0
        } else if (expanded) {
            return index * expandedTranslate
        } else {
            return index > stackMax
                ? stackMax * translate
                : index * translate
        }
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

    const transitions = useTransition(
        items,
        {
            from: (item, index) => ({
                top: getTop(index, false),
                transform: `scale(${getScale(index, false)})`,
            }),
            enter: (item, index) => ({
                top: getTop(index, true),
                transform: `scale(${getScale(index)})`,
                zIndex: (-data.length + (data.length - index)),
                opacity: getOpacity(index),
                background: getBackground(index),
                ...newItemsSpringConfig
            }),
            update: (item, index) => {
                return {
                    top: getTop(index),
                    transform: `scale(${getScale(index)})`,
                    zIndex: (-data.length + (data.length - index)),
                    opacity: getOpacity(index),
                    background: getBackground(index),
                }
            },
            leave: (item, index) => async (next, cancel) => {
                // cancel the animation if the item is removed before it's finished animating
                const id = item.id;
                await next({ x: 200, opacity: 0, config: { duration: 200 } });
                if (index === items.findIndex(item => item.id === id)) {
                    setItems(items => items.filter(item => item.id !== id));
                }
            }
        }
    )

    useEffect(() => {
        // update container spring

        // Since items inside container are absolutely positioned
        // we can auto size it, and we have to shrink it when there
        // is empty space at the bottom due to items being removed
        containerApi.start({
            height: expanded
                ? Math.min(expandedHeight, items.length * expandedTranslate)
                : (items.length > 0 ? collapsedHeight : 0),
            overflowY: expanded
                ? (expandedHeight < items.length * expandedTranslate ? 'scroll' : 'hidden')
                : 'hidden',
            onStart: () => {
                if (!expanded && containerRef.current) {
                    containerRef.current.scrollTop = 0
                }
            }
        })
    }, [expanded, items])

    const handleConfirm = i => {
        setItems(items.filter(
            (item) => item.id !== i
        ))
        // TODO backend requests
    }

    const buttonContainerProps = useSpring({
        marginTop: items.length === 0 ? '0px' : '4px',
        opacity: items.length > 1 ? 1 : 0,
        height: items.length > 1 ? '1.6em' : '0em',
        marginBottom: items.length > 1 ? '12px' : '0px',
        scale: "1.05",
        zIndex: "1",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    })

    const rotationSpring = useSpring({
        transform: `rotate(${expanded ? 0 : 180}deg)`
    })

    const BottomButtons = () => {
        return (
            <animated.div
                id="expand-button-container"
                className="bottom-buttons"
                style={buttonContainerProps}
            >
                <button id="expand-button" onClick={() => setExpanded(!expanded)}>
                    {`${items.length} `}
                    < animated.div
                        id="expand-button-icon"
                        style={rotationSpring}
                        aria-label="Expand new item stack"
                    >
                        <Expand />
                    </animated.div >
                </button>
            </animated.div>
        )
    }

    const NewItem = ({ item, style }) => {

        const Options = () => {
            return (
                <Menu>
                    {({ open }) => (
                        <>
                            <Menu.Button className='narrow-icon'>
                                <Ellipsis />
                            </Menu.Button>
                            <DropAnimation visible={open}>
                                <Menu.Items
                                    as="div"
                                    className="dropdown options-dropdown"
                                    static
                                >
                                    <Menu.Item as={React.Fragment}>
                                        {({ active }) => (
                                            <button
                                                className={`dropdown-item ${active && "active-dropdown-item"}`}
                                            >
                                                <Split className="dropdown-icon" />
                                                Split
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item as={React.Fragment}>
                                        {({ active }) => (
                                            <button
                                                className={`dropdown-item ${active && "active-dropdown-item"}`}
                                            >
                                                <Note className="dropdown-icon" />
                                                Note
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </DropAnimation>
                        </>
                    )}
                </Menu>
            )
        }

        return (
            <animated.div
                key={`item-${item.id}`}
                className="new-item"
                style={style}
            >
                <div className='new-item-data'>
                    {item.data}
                </div>
                <div className='new-item-icons'>
                    <button
                        className='category-icon'
                        aria-label="Choose budget category"
                    >
                        Groceries
                    </button>
                    <button
                        className='icon2'
                        onClick={() => handleConfirm(item.id)}
                        aria-label="Confirm item"
                    >
                        <CheckMark />
                    </button>
                    <Options />
                </div>
            </animated.div>
        )
    }

    const Stack = () => {
        return (
            <>
                {transitions((style, item) =>
                    <NewItem item={item} style={style} />)
                }
            </>
        )
    }

    return (
        <>
            <div id="new-items-container" style={{ position: "relative" }}>
                <div className="shadow shadow-bottom"></div>
                <animated.div
                    style={containerSpring}
                    ref={containerRef}
                >
                    <Stack />
                </animated.div >
            </div>
            <BottomButtons />
        </>
    )
}

export default NewItemsStack
