import React, { useRef, useLayoutEffect, useEffect } from 'react'

import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import './style/dashboard.css'
import Header from './Header'
import Spending from './components/Spending'
import Items from './components/Items'
import Settings from './components/Settings'
import Accounts from './components/Accounts'
import { UserProvider } from './context/UserContext'

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
            <UserProvider>
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
            </UserProvider>
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
