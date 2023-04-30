import React from 'react'
import { useState, useEffect, useRef } from 'react'

import { useSpring, animated, useTransition } from '@react-spring/web'

import "./NewItems.css"
import Ellipsis from "../../assets/images/Ellipsis"
import CheckMark from "../../assets/images/CheckMark"
import Expand from "../../assets/images/Expand"

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
const scaleFactor = .05
const translate = 12
const expandedTranslate = 75
const collapsedHeight = 94
const expandedHeight = 270

const springsConfig = {
    position: 'absolute',
    left: 0,
    right: 0,
    marginRight: '12px',
    marginLeft: '16px',
    borderRadius: "8px",
    padding: "20px",
    fontWeight: "400",
    boxShadow: "rgba(0, 0, 0, 0.03) 0px 1px 1px 0px",
    x: 0,
}

const containerSpringConfig = {
    overflowX: 'hidden',
    boxSize: 'border-box',
    height: collapsedHeight,
    backgroundColor: "var(--window)",
    position: 'relative',
    margin: '0 8px',
}

const NewItemsStack = () => {

    const [expanded, setExpanded] = useState(false)
    const [items, setItems] = useState(data)
    const containerRef = useRef(null)
    const [containerSpring, containerApi] = useSpring(() => ({
        zIndex: 100,
        overflowY: expanded ? "scroll" : "hidden",
        ...containerSpringConfig
    }))
    const transitions = useTransition(
        items,
        {
            from: (item, index) => ({
                top: (1 * translate * index) + 30 * (index + 1),
                transform: `scale(${!expanded ? 1 - ((index + 1) * scaleFactor * 2) : 1})`,
            }),
            enter: (item, index) => ({
                top: expanded || index === 0 ? 0 : 1 * translate * index,
                transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
                zIndex: (data.length - index),
                opacity: !expanded && index > stackMax ? 0 : 1,
                backgroundColor: index === 0 || expanded
                    ? "var(--window-background-color)"
                    : `hsl(0, 0%, ${95 - (index * 4)}%)`,
                ...springsConfig
            }),
            update: (item, index, state) => {
                return {
                    top: expanded || index === 0 ? index * expandedTranslate : 1 * translate * index,
                    transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
                    zIndex: (data.length - index),
                    opacity: !expanded && index > stackMax ? 0 : 1,
                    backgroundColor: index === 0 || expanded
                        ? "var(--window-background-color)"
                        : `hsl(0, 0%, ${95 - (index * 4)}%)`,
                }
            },
            leave: (item, index) => async (next, cancel) => {
                // cancel the animation if the item is removed before it's finished animating
                const id = item.id;
                await next({ x: 100, opacity: 0, config: { duration: 100 } });
                if (index === items.findIndex(item => item.id === id)) {
                    setItems(items => items.filter(item => item.id !== id));
                }
            },
            config: { precision: 0.1 }
        }
    )
    const rotationSpring = useSpring({
        transform: `rotate(${expanded ? 0 : 180}deg)`
    })
    const buttomProps = useSpring({
        marginTop: items.length === 0 ? '0px' : '4px',
        height: items.length > 1 ? '1.3em' : '0em',
        marginBottom: items.length > 1 ? '12px' : '0px',
        zIndex: "200",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    })

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
        // // remove item from backend
    }

    const BottomButtons = () => {
        return (
            <animated.div
                id="expand-button-container"
                className="bottom-buttons"
                style={buttomProps}
            >
                <div id="expand-button" onClick={() => setExpanded(!expanded)}>
                    {`${items.length} `}
                    < animated.button

                        id="expand-button-icon"
                        style={rotationSpring}
                    >
                        <Expand />
                    </animated.button >
                </div>
            </animated.div>
        )
    }

    const Stack = () => {
        return (
            <>
                {transitions((style, item) => (
                    <animated.div
                        key={`item-${item.id}`}
                        className="new-item"
                        style={style}
                    >
                        <div className='new-item-data'>
                            {item.data}
                        </div>
                        <div className='new-item-icons'>
                            <div className='category-icon'>
                                Groceries
                            </div>
                            <div
                                className='icon'
                                id="checkmark-icon"
                                onClick={() => handleConfirm(item.id)}
                            >
                                <CheckMark />
                            </div>
                            <div className='icon' id="ellipsis-icon">
                                <Ellipsis />
                            </div>
                        </div>
                    </animated.div>
                ))}
            </>
        )
    }

    return (
        <>
            <div className="new-items">
                <div className="shadow shadow-bottom"></div>
                <animated.div
                    className="new-items-container"
                    style={containerSpring}
                    ref={containerRef}
                >
                    <Stack />
                </animated.div >
            </div >
            <BottomButtons />
        </>
    )
}

export default NewItemsStack
