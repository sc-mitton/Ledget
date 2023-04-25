import React from 'react'
import { useState, useEffect } from 'react'

import { useSprings, useSpring, animated } from '@react-spring/web'

import "./NewItems.css"
import Ellipsis from "../../assets/images/Ellipsis"
import CheckMark from "../../assets/images/CheckMark"
import Collapse from "../../assets/images/Collapse"

const testItems = [
    'Publix', 'Movies', 'Gas', 'Rent', 'Clothes',
    'Pizza', 'Movies', 'Gas', 'Rent', 'Clothes',
]

const NewItemsStack = () => {
    const stackMax = 4;
    const [expanded, setExpanded] = useState(false)
    const [springs, springApi] = useSprings(testItems.length, index => ({
        from: { transform: `translate3d(0, ${index * 0}px, 0) scale(1)` },
        to: {
            transform:
                `translate3d(0, 0, 0)
                scale(${!expanded ? (1 - index * .03) : 1})`,
            top: `${!expanded && index > 0 ?
                (index < stackMax ? -60 * index : -78 * index)
                : 0
                }px`
        }
    }))
    const [containerSpring, containerApi] = useSpring(() => ({ maxHeight: '140px' }));


    const handleClick = () => {
        setExpanded(!expanded)
    }

    useEffect(() => {
        springApi.start(index => ({
            to: {
                transform:
                    `translate3d(0, 0, 0)
                    scale(${!expanded ? (1 - index * .03) : 1})`,
                top: `${!expanded && index > 0 ?
                    (index < stackMax ? -60 * index : -78 * index)
                    : 0
                    }px`
            }
        }))
        containerApi.start({
            maxHeight: expanded ? '270px' : '140px',
            config: { duration: 300 }
        })
    }, [expanded])

    const BottomButtons = () => {
        return (
            <>
                {
                    expanded ?
                        <div id="collapse-button-container">
                            < button className="icon" id="collapse-button" onClick={handleClick} >
                                <Collapse />
                            </button >
                        </div >
                        : <div id="expand-button-container">
                            <button id="expand-button" onClick={handleClick}>
                                {`${Math.min(testItems.length, 5)}${testItems.length > 5 ? '+' : ''} new items`}
                            </button>
                        </div>
                }
            </>
        )
    }

    return (
        <>
            <div className="new-items">
                <div className="shadow shadow-bottom"></div>
                <animated.div
                    className="new-items-container"
                    style={{
                        ...containerSpring,
                        position: "relative",
                        overflow: expanded ? "scroll" : "hidden",
                        backgroundColor: "var(--window)",
                        paddingRight: "20px",
                        paddingLeft: "24px",
                        zIndex: 100
                    }}
                >
                    {springs.map((props, index) => (
                        <animated.div
                            key={index}
                            className="new-item"
                            style={{
                                ...props,
                                position: 'relative',
                                zIndex: (testItems.length - index),
                                backgroundColor: "var(--window-background-color)",
                                borderRadius: "8px",
                                padding: "20px",
                                margin: "8px 0px",
                                fontWeight: "400",
                                boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 1px 0px"
                            }}
                        >
                            <div className='new-item-data'>
                                {testItems[index]}
                            </div>
                            <div className='new-item-icons'>
                                <div className='category-icon'>
                                    Groceries
                                </div>
                                <div className='icon' id="checkmark-icon">
                                    <CheckMark />
                                </div>
                                <div className='icon' id="ellipsis-icon">
                                    <Ellipsis />
                                </div>
                            </div>
                        </animated.div>
                    ))}
                </animated.div >
            </div>
            <BottomButtons />
        </>
    )
}

export default NewItemsStack
