import React, { useRef, useLayoutEffect, useEffect } from 'react'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Header from './Header'
import Spending from './windows/Spending'
import Items from './windows/Items'
import Profile from './windows/Profile'
import Accounts from './windows/Accounts'
import './styles/dashboard.css'
import { fetchUser } from './slices/user'


const App = () => {
    const dashboardRef = useRef(null)
    const [isNarrow, setIsNarrow] = React.useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUser())
    }, [])

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
        <main tabIndex={0}>
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
        </main>
    )
}

export default App
