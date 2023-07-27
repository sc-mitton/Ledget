import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useTransition, animated } from '@react-spring/web'
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

    const pages = [
        { path: 'budget', component: <Budget isNarrow={isNarrow} /> },
        { path: 'spending', component: <Spending /> },
        { path: 'accounts', component: <Accounts /> },
        { path: 'profile', component: <Profile /> },
    ]

    const baseStyle = {
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        borderRadius: "12px",
        padding: "12px 20px",
        boxSizing: "border-box",
    }

    const transitions = useTransition(pages, {
        from: { opacity: 0, transform: 'scale(0.95)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.95)' },
        config: {
            tension: 100,
            friction: 20,
            mass: 1,
        },
    })

    return (
        <>
            <Header isNarrow={isNarrow} />
            <div id="dashboard" ref={dashboardRef}>
                <Routes>
                    {pages.map(({ path, component }) => (
                        <Route key={path} path={path} element={component} />
                    ))}
                </Routes>
            </div>
        </>
    )
}

export default Dashboard
