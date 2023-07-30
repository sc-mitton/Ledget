import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'

import { Routes, Outlet, Navigate, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Budget from '@pages/budget/Window'
import Spending from '@pages/Spending'
import Profile from '@pages/Profile'
import Accounts from '@pages/accounts/Window'
import NotFound from '@pages/notFound/NotFound'
import Header from './Header'
import { useGetMeQuery } from '@api/apiSlice'
import "./styles/style.css";


const PrivateRoute = () => {
    const { isSuccess, isLoading, isPending } = useGetMeQuery()

    return (
        (isSuccess || isLoading || isPending) ? <Outlet /> : <Navigate to="/login" />
    )
}

const Login = () => {
    useEffect(() => {
        window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URL
    }, [])

    return (
        <></>
    )
}

const App = () => {
    const [isNarrow, setIsNarrow] = useState(false)
    const ref = useRef(null)
    const location = useLocation()

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(ref.current.offsetWidth < 900)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const config = {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        display: 'flex',
    }

    return (
        <main tabIndex={0}>
            <Header isNarrow={isNarrow} />
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, transform: 'scale(0.98)', ...config }}
                    animate={{ opacity: 1, transform: 'scale(1)' }}
                    exit={{ opacity: 0, transform: 'scale(0.98)' }}
                    key={location.pathname.split('/')[1]}
                >
                    <div id="dashboard" ref={ref}>
                        <Routes location={location} key={location.pathname.split('/')[1]} >
                            <Route path="/" element={<PrivateRoute />} >
                                <Route path="/" element={<Navigate to="/budget" />} />
                                <Route path="budget/*" element={
                                    <>
                                        <Budget />
                                        {!isNarrow && <Spending />}
                                    </>
                                } />
                                <Route path="spending" element={
                                    isNarrow ? <Spending /> : <Navigate to="/budget" />
                                } />
                                <Route path="accounts" element={<Accounts />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="login" element={<Login />} />
                                <Route path="/*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </div>
                </motion.div>
            </AnimatePresence>
        </main>
    )
}

export default App
