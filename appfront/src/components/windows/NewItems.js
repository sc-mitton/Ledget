import React from 'react'
import { useState, useEffect, useRef } from 'react'

import { useSprings, useSpring, animated, useTransition } from '@react-spring/web'

import "./NewItems.css"
import Ellipsis from "../../assets/images/Ellipsis"
import CheckMark from "../../assets/images/CheckMark"
import Expand from "../../assets/images/Expand"

// TODO: pull this data in from backend
let data = [
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
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
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
    const [ItemsLength, setItemsLength] = useState(data.length)
    const containerRef = useRef(null)
    const [containerSpring, containerApi] = useSpring(() => ({
        zIndex: 100,
        overflowY: expanded ? "scroll" : "hidden",
        ...containerSpringConfig
    }))
    const [springs, setSprings] = useSprings(data.length, index => ({
        from: {
            y: (-1 * translate * index) + 30 * (index + 1),
        },
        to: {
            y: expanded || index === 0 ? 0 : -1 * translate * index,
            transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
            zIndex: (data.length - index),
            opacity: !expanded && index > stackMax ? 0 : 1,
            backgroundColor: index === 0 || expanded
                ? "var(--window-background-color)"
                : `hsl(0, 0%, ${95 - (index * 4)}%)`,
            ...springsConfig
        },
        config: { tension: 100, friction: 15 },
    }))
    const rotationSpring = useSpring({ transform: `rotate(${expanded ? 0 : 180}deg)` })


    useEffect(() => {
        setSprings.start(index => ({
            to: {
                y: expanded || index === 0 ? 0 : -1 * translate * index,
                transform: `scale(${!expanded ? 1 - (index * scaleFactor) : 1})`,
                opacity: !expanded && index > stackMax ? 0 : 1,
                zIndex: (data.length - index),
                backgroundColor: index === 0 || expanded
                    ? "var(--window-background-color)"
                    : `hsl(0, 0%, ${95 - (index * 4)}%)`,
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

    const handleRemove = i => {
        setSprings.start(index => {
            if (index === i) {
                return {
                    opacity: 0,
                    x: 500,
                    transform: `scale(0.5)`,
                    onRest: () => {
                        setSprings.delete(i)
                        springs.splice(i, 1)
                    }
                }
            } else if (index > i) {
                return {
                    y: expanded ? -77 : (-1 * translate * index - 17),
                    transform: `scale(${!expanded ? 1 - ((index - 1) * scaleFactor) : 1})`,
                    backgroundColor: index === 0 || expanded
                        ? "var(--window-background-color)"
                        : `hsl(0, 0%, ${95 - ((index - 1) * 4)}%)`,
                    opacity: !expanded && index > stackMax + 1 ? 0 : 1
                }
            }
        })
    }

    const handleConfirm = i => {
        handleRemove(i)
        // setItemsLength(ItemsLength - 1)
        // remove item from backend
    }

    const BottomButtons = ({ visible }) => {
        return (
            visible &&
            <div id="expand-button-container" >
                <div id="expand-button" onClick={() => setExpanded(!expanded)}>
                    {`${ItemsLength} items `}
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
                {springs.map((props, index) => (
                    <animated.div
                        key={`new-item${index}`}
                        className="new-item"
                        style={props}
                    >
                        <div className='new-item-data'>
                            {data[index]}
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
            <BottomButtons visible={ItemsLength > 1} />
        </>
    )
}

export default NewItemsStack
