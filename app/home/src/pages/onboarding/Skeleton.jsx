import React, { useState, useRef, useLayoutEffect } from 'react'

import logoIcon from '@assets/icons/logoIcon.svg'

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
                    {!isNarrow &&
                        <div id="spending-window">
                            <div id="new-items-container" className="skeleton" >
                                <div
                                    style={{
                                        zIndex: '3',
                                        position: 'relative',
                                    }}
                                    className="skeleton-new-category" />
                                <div
                                    style={{
                                        marginTop: '-55px',
                                        zIndex: '2',
                                        position: 'relative',
                                        transform: 'scale(0.9)'
                                    }}
                                    className="skeleton-new-category" />
                                <div
                                    style={{
                                        marginTop: '-55px',
                                        zIndex: '1',
                                        position: 'relative',
                                        transform: 'scale(0.8)'
                                    }}
                                    className="skeleton-new-category" />
                            </div>
                            <div id="all-items-window" class="window" />
                        </div>}
                </div>
            </div>
        </>
    )
}

export default Dashboard
