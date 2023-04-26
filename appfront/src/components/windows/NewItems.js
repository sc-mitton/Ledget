import React from 'react'
import { useState, useEffect, useRef } from 'react'

import { useSprings, useSpring, animated } from '@react-spring/web'

import "./NewItems.css"
import Ellipsis from "../../assets/images/Ellipsis"
import CheckMark from "../../assets/images/CheckMark"
import Collapse from "../../assets/images/Collapse"

const data = [
    'Publix', 'Movies', 'Gas', 'Rent', 'Clothes',
    'Pizza', 'Movies', 'Gas', 'Rent', 'Clothes',
]

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

        overflowX: 'hidden',
        maxHeight: '110px',
        backgroundColor: "var(--window)",
        paddingRight: "20px",
        paddingLeft: "24px",
    }))
    const [springs, setSprings] = useSprings(testItems.length, index => ({
        x: 0,
        y: expanded || index === 0 ? 0 : -1 * translate * index,
        transform: `scale(${!expanded ? (Math.pow(scaleFactor, index)) : 1})`,
        zIndex: (testItems.length - index),
        opacity: !expanded && index > stackMax ? 0 : 1,

        position: 'relative',
        backgroundColor: "var(--window-background-color)",
        borderRadius: "8px",
        padding: "20px",
        margin: "8px 0px",
        fontWeight: "400",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 1px 0px"
    }))
    const rotationSpring = useSpring({ transform: `rotate(${expanded ? 0 : 180}deg)` })

    useEffect(() => {
        setSprings.start(index => ({
            x: 0,
            y: expanded || index === 0 ? 0 : -1 * translate * index,
            transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
            opacity: !expanded && index > stackMax ? 0 : 1,
            zIndex: (testItems.length - index)
        }))

        containerApi.start({
            maxHeight: expanded ? '270px' : '110px',
            overflowY: expanded ? "scroll" : "hidden",
            config: { duration: 300 },
            onStart: () => {
                if (!expanded && containerRef.current) {
                    containerRef.current.scrollTop = 0
                }
            }
        })
    }, [expanded])

    const onSuccessfulDelete = (i) => {
        // Call backend to update database
        // Remove item from testItems
        setTestItems(testItems.filter((item, index) => index !== i));
    }

    const handleCheckClick = (i) => {
        setSprings.start(index => ({
            x: i === index ? 500 : 0,
            y: index > i ? (expanded ? -77 : (-1 * translate * index - 17)) : null,
            opacity: !expanded && index > stackMax + 1 ? 0 : 1,
            onRest: () => {
                index === (springs.length - 1) && onSuccessfulDelete(i)
            }
        }))
    }

    const BottomButtons = () => {
        return (
            <div id="collapse-button-container" onClick={() => setExpanded(!expanded)}>
                <div>
                    {!expanded && `${testItems.length} items`}
                    < animated.button
                        className="icon"
                        id="collapse-button"
                        style={rotationSpring}
                    >
                        <Collapse />
                    </animated.button >
                </div>
            </div >
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
                                    onClick={() => handleCheckClick(index)}
                                >
                                    <CheckMark />
                                </div>
                                <div className='icon' id="ellipsis-icon">
                                    <Ellipsis />
                                </div>
                            </div>
                        </animated.div>
                    ))}
                </animated.div >
            </div >
            {testItems.length > 1 && <BottomButtons />}
        </>
    )
}

export default NewItemsStack
