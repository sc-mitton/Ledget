import React, { useState, useRef, useLayoutEffect } from 'react'

import './styles/Skeleton.css'
import logoIcon from '@assets/icons/logoIcon.svg'
import { ShadowedContainer } from '@components/pieces'

const Header = () => (
    <header>
        <div className="header-container">
            <div className="header-logo">
                <img src={logoIcon} alt="Ledget Logo" />
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
        <div ref={ref} id="all-items-window" class="window skeleton" >
            <div className="shadow" />
            {[...Array(numberOfItems)].map((_, i) => (
                <>
                    <div
                        className="item-container skeleton"
                        style={{ height: '50px' }}
                        key={i}
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
                </>
            ))}
        </div>
    )
}

const SpendingWindow = () => (
    <div id="spending-window">
        <NewItems />
        <AllItems />
    </div>
)

const Dashboard = () => {
    const [isNarrow, setIsNarrow] = useState(false)
    const ref = useRef(null)

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(ref.current.offsetWidth < 900)
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
                <div className="dashboard" >
                    <div className="window" id="budget-window" />
                    {!isNarrow && <SpendingWindow />}
                </div>
            </div>
        </>
    )
}

export default Dashboard
