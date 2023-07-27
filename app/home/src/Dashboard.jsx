import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { useTransition, animated } from '@react-spring/web'

import Header from './Header'
import Spending from './windows/Spending'
import Items from './windows/Items'
import Profile from './windows/Profile'
import Accounts from './windows/Accounts'
import './styles/dashboard.css'


const Dashboard = () => {
    const dashboardRef = useRef(null)
    const navigate = useNavigate()
    const [isNarrow, setIsNarrow] = useState(false)
    const location = useLocation()

    const transitions = useTransition(location, {
        from: { opacity: 0, transform: 'scale(.95)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(.95)' },
    })

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
            case '/spending':
                navigate('/spending')
                break
            case '/items':
                isNarrow ? navigate('/items') : navigate('/spending')
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
            <div id="dashboard" ref={dashboardRef}>
                <Routes>
                    <Route path="spending" element={
                        <>
                            <Spending />
                            {!isNarrow && <Items />}
                        </>
                    }>
                    </Route>
                    {isNarrow && <Route path="items" element={<Items />} />}
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="profile" element={<Profile />} />
                </Routes >
            </div>
        </>
    )
}

export default Dashboard
