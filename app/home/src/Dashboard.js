import React, { useRef, useLayoutEffect, useEffect } from 'react'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import Header from './Header'
import Spending from './components/Spending'
import Items from './components/Items'
import Settings from './components/Settings'
import Accounts from './components/Accounts'
import './style/dashboard.css'


const Dashboard = () => {
    const dashboardRef = useRef(null)
    const [isNarrow, setIsNarrow] = React.useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(dashboardRef.current.offsetWidth < 850)
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
            case '/settings':
                navigate('/settings')
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
                    <Route path="settings" element={<Settings />} />
                </Routes >
            </div>
        </>
    )
}

export default Dashboard
