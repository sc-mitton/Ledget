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

const fn = (order, down, originalIndex, curIndex, y) => (index) => {

}

const NewItemsStack = () => {
    const stackMax = 2
    const scaleFactor = .97
    const translate = 93
    const [expanded, setExpanded] = useState(false)
    const [testItems, setTestItems] = useState(data) // will eventually use hook to pull in api data
    const containerRef = useRef(null)
    const [springs, setSprings] = useSprings(testItems.length, index => ({
        transform:
            `translate3d(0,
                    ${expanded || index === 0
                ? 0
                : -translate - (translate * (index - 1))}%
                , 0)
                scale(${!expanded ? (Math.pow(scaleFactor, index)) : 1})`,
        opacity: !expanded && index > stackMax ? 0 : 1,
        position: 'relative',
        zIndex: (testItems.length - index),
        backgroundColor: "var(--window-background-color)",
        borderRadius: "8px",
        padding: "20px",
        margin: "8px 0px",
        fontWeight: "400",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 1px 0px"
    }))
    const [containerSpring, containerApi] = useSpring(() => ({
        maxHeight: '110px',
        position: "relative",
        overflow: expanded ? "scroll" : "scroll",
        backgroundColor: "var(--window)",
        paddingRight: "20px",
        paddingLeft: "24px",
        zIndex: 100,
    }))
    const rotationSpring = useSpring({ transform: `rotate(${expanded ? 0 : 180}deg)` })

    useEffect(() => {
        setSprings.start(index => ({
            transform:
                `translate3d(0,
                        ${expanded || index === 0
                    ? 0
                    : -translate - (translate * (index - 1))}%
                    , 0)
                    scale(${!expanded ? (Math.pow(scaleFactor, index)) : 1})`,
            opacity: !expanded && index > stackMax ? 0 : 1,
        }))
        containerApi.start({
            maxHeight: expanded ? '270px' : '110px',
            config: { duration: 300 },
            onStart: () => {
                if (!expanded && containerRef.current) {
                    containerRef.current.scrollTop = 0
                }
            }
        })
    }, [expanded])

    const foo = () => {
        setSprings.start(index => ({
            to: {
                transform:
                    `translate3d(0,
                        ${expanded || index === 0
                        ? -100
                        : -translate}%
                    , 0)
                    scale(${!expanded ? (2 - scaleFactor) : 1})`,
                opacity: !expanded && index > stackMax ? 0 : 1,
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
                                <div className='icon' id="checkmark-icon" onClick={foo}>
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
