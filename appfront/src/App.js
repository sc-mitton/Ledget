import React, { useRef, useLayoutEffect, useEffect } from 'react'

import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import './style/dashboard.css'
import Header from './Header'
import Spending from './components/windows/Spending'
import Items from './components/windows/Items'
import Settings from './components/windows/Settings'
import Accounts from './components/windows/Accounts'

function App() {
    const dashboardRef = useRef(null)
    const [isNarrow, setIsNarrow] = React.useState(false)

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(dashboardRef.current.offsetWidth < 850)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const Dashboard = () => {
        const navigate = useNavigate()
        const location = useLocation()

        useEffect(() => {
            if (isNarrow && location.pathname === '/items') {
                navigate('/items')
            } else if (isNarrow && location.pathname === '/spending') {
                navigate('/spending')
            } else if (!isNarrow && location.pathname === '/items') {
                navigate('/spending')
            }
        }, [isNarrow, navigate])

        return (
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
        )
    }

    return (
        <main tabIndex={0}>
            <BrowserRouter>
                <Header isNarrow={isNarrow} />
                <div id="dashboard" ref={dashboardRef}>
                    <Dashboard />
                </div>
            </BrowserRouter>
        </main >
    )
}

export default App
