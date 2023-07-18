import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'

import { useSpring, animated, useTransition, useSpringRef, useChain } from '@react-spring/web'

import "./style/NewItems.css"
import Ellipsis from "../assets/svg/Ellipsis"
import CheckMark from "../assets/svg/CheckMark"
import Expand from "../assets/svg/Expand"
import Edit from "../assets/svg/Edit"
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
    x: 0,
    left: 0,
    right: 0,
    margin: '0 24px',
    borderRadius: "12px",
    padding: "20px",
    fontWeight: "400",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
}

const containerSpringConfig = {
    maxWidth: '400px',
    position: 'relative',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
    boxSize: 'border-box',
    height: collapsedHeight,
}

const NewItemsStack = () => {
    const [expanded, setExpanded] = useState(false)
    const [items, setItems] = useState(data)
    const containerRef = useRef(null)
    const itemsApi = useSpringRef()

    const [containerSpring, containerApi] = useSpring(() => ({
        ...containerSpringConfig
    }))

    const defaultOverflow = {
        overflow: expanded
            ? (expandedHeight < items.length * expandedTranslate) ? 'scroll' : 'visible'
            : 'visible',
    }

    // Calculate the background color of new items
    const getBackground = (index) => {
        let r = 230 - (Math.min(index, stackMax) ** 2 * 18)
        // Items lower on the stack are darker
        // Don't calculate past the stack max because
        // it's not shown in unexpanded mode
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
            return stackMax * translate + 15
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

    const transitions = useTransition(
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
                zIndex: (-1 * index),
                opacity: getOpacity(index),
                background: getBackground(index),
                ...newItemsSpringConfig
            }),
            update: (item, index) => ({
                // top: getTop(index),
                y: getY(index, true),
                transform: `scale(${getScale(index)})`,
                zIndex: (-1 * index),
                opacity: getOpacity(index),
                background: getBackground(index),
            }),
            onStart: () => {
                if (!expanded && containerRef.current) {
                    containerRef.current.scrollTop = 0
                }
                containerApi.start({
                    height: expanded
                        ? Math.min(items.length * expandedTranslate, expandedHeight)
                        : (items.length > 0 ? collapsedHeight : 0),
                })
            },
            onRest: () => {
                containerApi.start({
                    overflow: expanded
                        ? (expandedHeight < items.length * expandedTranslate) ? 'scroll' : 'visible'
                        : 'visible',
                })
            },
            ref: itemsApi
        }
    )

    useEffect(() => {
        containerApi.start({ overflow: 'hidden' })
        itemsApi.start()
    }, [expanded, items])


    const handleConfirm = i => {
        itemsApi.start((item, index) => {
            if (item === i) {
                return {
                    x: 100,
                    opacity: 0,
                    config: {
                        duration: 130,
                        tension: 170,
                        friction: 26
                    },
                    onStart: () => {
                        containerApi.start({ overflow: 'hidden' })
                    },
                    onRest: () => {
                        setItems(items.filter(
                            (item) => item.id !== i
                        ))
                    },
                }
            }
        })
    }

    const buttonContainerProps = useSpring({
        marginTop: items.length === 0 ? '0px' : '4px',
        marginBottom: items.length > 1 ? '12px' : '0px',
        marginLeft: 'auto',
        marginRight: 'auto',
        opacity: items.length > 1 ? 1 : 0,
        height: items.length > 1 ? '1.6em' : '0em',
        scale: "1.05",
        zIndex: 100,
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
                                            <Split
                                                className="dropdown-icon"
                                                width={'1em'}
                                                height={'1em'}
                                            />
                                            Split
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item as={React.Fragment}>
                                    {({ active }) => (
                                        <button
                                            className={`dropdown-item ${active && "active-dropdown-item"}`}
                                        >
                                            <Edit
                                                className="dropdown-icon"
                                                width={'1em'}
                                                height={'1em'}
                                            />
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

    const NewItem = ({ item, style }) => {

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

    return (
        <>
            <div id="new-items-container">
                {expanded && items.length > stackMax &&
                    <div className="shadow shadow-bottom"></div>
                }
                <animated.div
                    style={containerSpring}
                    ref={containerRef}
                >
                    {transitions((style, item) =>
                        <NewItem item={item} style={style} />)
                    }
                </animated.div >
            </div>
            <BottomButtons />
        </>
    )
}

export default NewItemsStack
