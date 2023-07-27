import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'


import Header from './Header'
import Budget from './windows/Budget'
import Spending from './windows/Spending'
import Profile from './windows/Profile'
import Accounts from './windows/Accounts'
import './styles/dashboard.css'


const Dashboard = () => {
    const dashboardRef = useRef(null)
    const navigate = useNavigate()
    const [isNarrow, setIsNarrow] = useState(false)
    const location = useLocation()

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(dashboardRef.current.offsetWidth < 950)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        switch (location.pathname) {
            case '/budget':
                navigate('/budget')
                break
            case '/spending':
                isNarrow ? navigate('/spending') : navigate('/budget')
                break
            case '/accounts':
                navigate('/accounts')
                break
            case '/profile':
                navigate('/profile')
                break
            default:
                navigate('/spending')
        }
    }, [isNarrow, navigate])

    return (
        <>
            <Header isNarrow={isNarrow} />
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={location.pathname}
                    timeout={300}
                    classNames="fade"
                    nodeRef={dashboardRef}
                >
                    <div id="dashboard" ref={dashboardRef}>
                        <Routes>
                            <Route path="budget" element={
                                <>
                                    <Budget />
                                    {!isNarrow && <Spending />}
                                </>
                            }>
                            </Route>
                            {isNarrow && <Route path="spending" element={<Spending />} />}
                            <Route path="accounts" element={<Accounts />} />
                            <Route path="profile" element={<Profile />} />
                        </Routes >
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </>
    )
}

export default Dashboard
