import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'

import './styles/Skeleton.css'
import { LedgetLogoIcon } from '@ledget/media'

const Header = () => (
    <header>
        <div className="header-container">
            <div className="header-logo">
                <LedgetLogoIcon />
            </div>
            <div className="header-right">
            </div>
        </div>
    </header>
)

const NewItems = () => (
    <div id="new-items-container" className="skeleton" >
        <div
            className="new-category skeleton"
            style={{
                zIndex: '3',
                position: 'relative',
            }}
        >
            <div id="new-item-contents" className="skeleton">
                <div>
                    <div className="skeleton-inner" />
                    <div className="skeleton-inner" />
                </div>
                <div>
                    <div className="skeleton-inner" />
                </div>
            </div>
        </div>
        <div
            className="new-category skeleton"
            style={{
                marginTop: '-55px',
                zIndex: '2',
                position: 'relative',
                transform: 'scale(0.9)'
            }} />
        <div
            className="new-category skeleton"
            style={{
                marginTop: '-55px',
                zIndex: '1',
                position: 'relative',
                transform: 'scale(0.8)'
            }} />
    </div>
)

const AllItems = () => {
    const ref = useRef(null)
    const [numberOfItems, setNumberOfItems] = useState(10)

    useLayoutEffect(() => {
        setNumberOfItems(
            ref.current
                ? Math.floor((ref.current.offsetHeight - 50) / 50)
                : 10
        )
    }, [ref])

    return (
        <div ref={ref} id="all-items-window" className="window skeleton" >
            <div className="shadow" />
            {[...Array(numberOfItems)].map((_, i) => (
                <div key={`item-${i}`} >
                    <div
                        className="item-container skeleton"
                        style={{ height: '50px' }}
                    >
                        <div>
                            <div className="skeleton-inner" />
                            <div className="skeleton-inner" />
                        </div>
                        <div>
                            <div className="skeleton-inner" />
                            <div className="skeleton-inner" />
                        </div>
                    </div>
                    {(i !== 9) && <hr />}
                </div>
            ))}
        </div>
    )
}

const SpendingWindow = () => (
    <div id="spending-window" className="skeleton">
        <NewItems />
        <AllItems />
    </div>
)

const BudgetWindow = () => {
    const [numRows, setNumRows] = useState(10)

    const getWidth = () => {
        const width = Math.floor(Math.random() * (15 - 0 + 1)) + 15

        return `${width + 30}%`
    }

    const ref = useRef(null)

    useEffect(() => {
        const handleResize = () => {
            setNumRows(Math.min(Math.round((ref.current.offsetHeight - 200) / 50), 10))
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="window skeleton" id="budget-window" ref={ref}>
            <div className="skeleton-header skeleton-inner" />
            <div>
                <div className="budget-column first-column">
                    <div className="skeleton-inner" />
                    {[...Array(numRows)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: `${getWidth()}`
                            }}
                            className="budget-row skeleton-inner"
                        />
                    ))}
                </div>
                <div className="budget-column second-column">
                    <div className="skeleton-inner" />
                    {[...Array(numRows)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: `${getWidth()}`
                            }}
                            className="budget-row skeleton-inner"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

const Dashboard = () => {
    const [isNarrow, setIsNarrow] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(true)
    const ref = useRef(null)

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(ref.current.offsetWidth < 900)
            setShowSkeleton(ref.current.offsetWidth > 600)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            <Header />
            <div
                style={{
                    backgroundColor: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                }}
                ref={ref}
            >
                {showSkeleton && (

                    <div className="dashboard skeleton" >
                        <BudgetWindow />
                        {!isNarrow && <SpendingWindow />}
                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard
