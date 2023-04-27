import React from 'react'
import { useState, useEffect, useRef } from 'react'

import { useSprings, useSpring, animated } from '@react-spring/web'

import "./NewItems.css"
import Ellipsis from "../../assets/images/Ellipsis"
import CheckMark from "../../assets/images/CheckMark"
import Expand from "../../assets/images/Expand"

// TODO: pull this data in from backend
const data = [
    'Publix', 'Movies', 'Gas', 'Rent', 'Clothes',
    'Pizza', 'Movies', 'Gas', 'Rent', 'Clothes'
]

const springsConfig = {
    position: 'relative',
    backgroundColor: "var(--window-background-color)",
    borderRadius: "8px",
    padding: "20px",
    margin: "8px 0px",
    fontWeight: "400",
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 1px 0px"
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
    const [testItems, setTestItems] = useState(data)
    const containerRef = useRef(null)
    const [containerSpring, containerApi] = useSpring(() => ({
        zIndex: 100,
        overflowY: expanded ? "scroll" : "hidden",
        ...containerSpringConfig
    }))
    const [springs, setSprings] = useSprings(testItems.length, index => ({
        from: {
            x: 0,
            y: (-1 * translate * index) + 30 * (index + 1),
        },
        to: {
            x: 0,
            y: expanded || index === 0 ? 0 : -1 * translate * index,
            transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
            zIndex: (testItems.length - index),
            opacity: !expanded && index > stackMax ? 0 : 1,
            backgroundColor: index === 0 || expanded
                ? "var(--window-background-color)"
                : `hsl(240, 0%, ${100 - ((index + 2) * 4)}%)`,
            ...springsConfig
        },
        config: { tension: 100, friction: 15 },
    }))
    const rotationSpring = useSpring({ transform: `rotate(${expanded ? 0 : 180}deg)` })

    useEffect(() => {
        setSprings.start(index => ({
            to: {
                x: 0,
                y: expanded || index === 0 ? 0 : -1 * translate * index,
                transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
                opacity: !expanded && index > stackMax ? 0 : 1,
                zIndex: (testItems.length - index),
                backgroundColor: index === 0 || expanded
                    ? "var(--window-background-color)"
                    : `hsl(240, 0%, ${100 - ((index + 2) * 4)}%)`,
            }
        }))

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

    const removeNewItem = (i) => {
        setTestItems(testItems.filter((item, index) => index !== i))
        setSprings.set(index => ({
            x: 0,
            y: expanded || index === 0 ? 0 : -1 * translate * index,
            transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
            opacity: !expanded && index > stackMax ? 0 : 1,
            zIndex: (testItems.length - index)
        }))
        // TODO: remove item from backend
    }

    const handleConfirm = (i) => {
        setSprings.start(index => ({
            x: i === index ? 500 : 0,
            y: index > i ? (expanded ? -77 : (-1 * translate * index - 17)) : null,
            transform: `scale(${!expanded ? 1 - ((index - 1) * scaleFactor) : 1})`,
            opacity: !expanded && index > stackMax + 1 ? 0 : 1,
            onRest: () => index === i && removeNewItem(i)
        }))
    }

    const BottomButtons = ({ visible }) => {
        return (
            visible &&
            <div id="expand-button-container" onClick={() => setExpanded(!expanded)}>
                <div id="expand-button">
                    {`${testItems.length} items`}
                    < animated.button
                        className="icon"
                        id="expand-button"
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
                {springs.map((props, index) => (
                    <animated.div
                        key={index}
                        className="new-item"
                        style={props}
                    >
                        <div className='new-item-data'>
                            {testItems[index]}
                        </div>
                        <div className='new-item-icons'>
                            <div className='category-icon'>
                                Groceries
                            </div>
                            <div
                                className='icon'
                                id="checkmark-icon"
                                onClick={() => handleConfirm(index)}
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
            <BottomButtons visible={testItems.length > 1} />
        </>
    )
}

export default NewItemsStack
