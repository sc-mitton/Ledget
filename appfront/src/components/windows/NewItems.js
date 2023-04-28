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

const springsConfig = {
    position: 'relative',
    borderRadius: "8px",
    padding: "20px",
    margin: "8px 0px",
    fontWeight: "400",
    boxShadow: "rgba(0, 0, 0, 0.03) 0px 1px 1px 0px",
    x: 0,
}

const containerSpringConfig = {
    overflowX: 'hidden',
    maxHeight: '110px',
    backgroundColor: "var(--window)",
    paddingRight: "20px",
    paddingLeft: "24px",
}

const NewItemsStack = () => {
    const stackMax = 2
    const scaleFactor = .05
    const translate = 60

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
                y: (-1 * translate * index) + 30 * (index + 1),
                transform: `scale(${!expanded ? 1 - ((index + 1) * scaleFactor * 2) : 1})`,
            }),
            enter: (item, index) => ({
                y: expanded || index === 0 ? 0 : -1 * translate * index,
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
                    y: expanded || index === 0 ? 0 : -1 * translate * index,
                    transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
                    zIndex: (data.length - index),
                    opacity: !expanded && index > stackMax ? 0 : 1,
                    backgroundColor: index === 0 || expanded
                        ? "var(--window-background-color)"
                        : `hsl(0, 0%, ${95 - (index * 4)}%)`,
                }
            },
            leave: [{ x: 700, opacity: 0, height: '0%' }],
            config: { tension: 100, friction: 15 },
        }
    )
    const rotationSpring = useSpring({ transform: `rotate(${expanded ? 0 : 180}deg)` })

    useEffect(() => {
        // update container spring
        containerApi.start({
            maxHeight: expanded ? '270px' : '110px',
            overflowY: expanded ? "scroll" : "hidden",
            onStart: () => {
                if (!expanded && containerRef.current) {
                    containerRef.current.scrollTop = 0
                }
            }
        })
    }, [expanded])

    const handleConfirm = i => {
        setItems(items.filter(
            (item) => item.id !== i
        ))
        // // remove item from backend
    }

    const BottomButtons = ({ visible }) => {
        return (
            visible &&
            <div id="expand-button-container" >
                <div id="expand-button" onClick={() => setExpanded(!expanded)}>
                    {`${items.length} items `}
                    < animated.button
                        id="expand-button-icon"
                        style={rotationSpring}
                    >
                        <Expand />
                    </animated.button >
                </div>
            </div >
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
                <animated.div
                    className="new-items-container"
                    style={containerSpring}
                    ref={containerRef}
                >
                    <div className="shadow shadow-bottom"></div>
                    <Stack />
                </animated.div >
            </div >
            <BottomButtons visible={items.length > 1} />
        </>
    )
}

export default NewItemsStack
