import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'

import { useSpring, animated, useTransition, useSpringRef } from '@react-spring/web'

import "./style/NewItems.css"
import Ellipsis from "../assets/svg/Ellipsis"
import CheckMark from "../assets/svg/CheckMark"
import Expand from "../assets/svg/Expand"
import Edit from "../assets/svg/Edit"
import Split from "../assets/svg/Split"
import Details from "../assets/svg/Info"
import Snooze from "../assets/svg/Snooze"
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

const NewItemsStack = () => {
    const stackMax = 2
    const translate = 13
    const expandedTranslate = 75

    // New items container dimensions
    const collapsedHeight = 95
    const expandedHeight = 270

    const [expanded, setExpanded] = useState(false)
    const [items, setItems] = useState(data)
    const [optionsPos, setOptionsPos] = useState(null)
    const [showOptionsMenu, setShowOptionsMenu] = useState(false)
    const newItemsContainerRef = useRef(null)
    const containerRef = useRef(null)
    const itemsApi = useSpringRef()

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

    const rotationSpring = useSpring({
        transform: `rotate(${expanded ? 0 : 180}deg)`
    })

    const [containerSpring, containerApi] = useSpring(() => ({
        maxWidth: '400px',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        boxSize: 'border-box',
        height: collapsedHeight,
    }))

    const getBackground = useCallback((index) => {
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
    }, [expanded])

    const getOpacity = useCallback((index) => {
        const belowStackMax = index > stackMax
        return !expanded && belowStackMax ? 0 : 1
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
                zIndex: (-1 * index),
                opacity: getOpacity(index),
                background: getBackground(index),
            }),
            onRest: (item, index) => {
                expanded &&
                    containerApi.start({
                        overflow: 'scroll',
                    })
            },
            onStart: () => {
                containerApi.start({ overflow: 'hidden' })
                if (!expanded && containerRef.current) {
                    containerRef.current.scrollTop = 0
                }
            },
            config: { tension: 200, friction: 22, mass: 1 },
            ref: itemsApi
        }
    )

    useEffect(() => {
        itemsApi.start()
        containerApi.start({
            height: expanded
                ? Math.min(items.length * expandedTranslate, expandedHeight)
                : (items.length > 0 ? collapsedHeight : 0)
        })
    }, [expanded, items])

    useEffect(() => {
        optionsPos ? setShowOptionsMenu(true) : setShowOptionsMenu(false)
    }, [optionsPos])

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
                        setItems(items.filter((item) => item.id !== i))
                    },
                }
            }
        })
    }

    const NewItem = ({ item, style }) => {
        const ellipsisRef = useRef(null)

        const handleEllipsisClick = (e) => {
            !optionsPos
                ?
                setOptionsPos({
                    x: ellipsisRef.current.getBoundingClientRect().left
                        - newItemsContainerRef.current.getBoundingClientRect().left,
                    y: ellipsisRef.current.getBoundingClientRect().top
                        - newItemsContainerRef.current.getBoundingClientRect().top,
                })
                : setOptionsPos(null)
        }

        return (
            <animated.div
                key={`item-${item.id}`}
                className="new-item"
                style={style}
                tabIndex={expanded ? 0 : -1}
            >
                <div className='new-item-data'>
                    {item.data}
                </div>
                <div className='new-item-icons' >
                    <button
                        className='category-icon'
                        aria-label="Choose budget category"
                        tabIndex={item.id !== 0 && !expanded ? -1 : ''}
                    >
                        Groceries
                    </button>
                    <button
                        className='icon2'
                        onClick={() => handleConfirm(item.id)}
                        aria-label="Confirm item"
                        tabIndex={item.id !== 0 && !expanded ? -1 : ''}
                    >
                        <CheckMark />
                    </button>
                    <button
                        className='narrow-icon'
                        tabIndex={item.id !== 0 && !expanded ? -1 : ''}
                        ref={ellipsisRef}
                        onClick={(e) => handleEllipsisClick(e)}
                    >
                        <Ellipsis />
                    </button>
                </div>
            </animated.div>
        )
    }

    const ItemOptionsMenu = ({ visible }) => {
        const ref = useRef()
        const refs = useRef([]);
        for (let i = 0; i < 4; i++) {
            refs.current[i] = useRef();
        }

        useEffect(() => {
            const handleKeyDown = (event) => {
                if (event.key === 'Escape' || event.key === 'Tab') {
                    setShowOptionsMenu(false)
                    setOptionsPos(null)
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    const currentIndex = refs.current.findIndex((ref) => ref.current === document.activeElement)
                    const previousIndex = Math.max(currentIndex - 1, 0)
                    refs.current[previousIndex].current.focus()
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    const currentIndex = refs.current.findIndex((ref) => ref.current === document.activeElement)
                    const nextIndex = Math.min((currentIndex + 1), refs.current.length - 1)
                    refs.current[nextIndex].current.focus()
                }
            };
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setShowOptionsMenu(false)
                    setOptionsPos(null)
                }
            }

            window.addEventListener("mousedown", handleClickOutside)
            window.addEventListener('keydown', handleKeyDown)
            return () => {
                window.removeEventListener('keydown', handleKeyDown)
                window.removeEventListener("mousedown", handleClickOutside)
            }
        }, [])

        useEffect(() => {
            refs.current[0].current.focus()
        }, [])

        return (
            <div
                className="options-dropdown-container"
                ref={ref}
            >
                <button className={`dropdown-item`} ref={refs.current[0]}>
                    <Split className="dropdown-icon" />
                    Split
                </button>
                <button className={`dropdown-item`} ref={refs.current[1]}>
                    <Edit className="dropdown-icon" />
                    Note
                </button>
                <button className={`dropdown-item`} ref={refs.current[2]}>
                    <Snooze className="dropdown-icon" />
                    Snooze
                </button>
                <button className={`dropdown-item`} ref={refs.current[3]}>
                    <Details className="dropdown-icon" />
                    Details
                </button>
            </div>
        )
    }

    return (
        <>
            <div id="new-items-container" ref={newItemsContainerRef}>
                {expanded && items.length > stackMax &&
                    <div className="shadow shadow-bottom"></div>
                }
                <animated.div
                    style={containerSpring}
                    ref={containerRef}
                    onScroll={() => { setOptionsPos(null) && setShowOptionsMenu(false) }}
                >
                    {transitions((style, item) =>
                        <NewItem item={item} style={style} />)
                    }
                </animated.div >
                <DropAnimation
                    visible={showOptionsMenu}
                    className="dropdown options-dropdown"
                    style={{
                        position: 'absolute',
                        top: optionsPos ? optionsPos.y + 40 : 0,
                        left: optionsPos ? optionsPos.x - 43 : 0,
                        zIndex: 10,
                    }}
                >
                    <ItemOptionsMenu />
                </DropAnimation>
            </div>
            <animated.div
                id="expand-button-container"
                className="bottom-buttons"
                style={buttonContainerProps}
            >
                <button
                    id="expand-button"
                    onClick={() => setExpanded(!expanded)}
                    aria-label="Expand new item stack"
                    tabIndex={0}
                >
                    {`${items.length} `}
                    <animated.div
                        id="expand-button-icon"
                        style={rotationSpring}
                        aria-label="Expand new item stack"
                    >
                        <Expand />
                    </animated.div >
                </button>
            </animated.div>
        </>
    )
}

export default NewItemsStack
