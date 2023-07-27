import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'

import { Routes, Outlet, Navigate, Route, useNavigate, useLocation } from 'react-router-dom'

import Header from './Header'
import Dashboard from './Dashboard'
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
    const navigate = useNavigate()
    const location = useLocation()

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(ref.current.offsetWidth < 1050)
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
        <main tabIndex={0} ref={ref}>
            <Header isNarrow={isNarrow} />
            <Routes>
                <Route path="/" element={<PrivateRoute />} >
                    <Route path="/*" element={<Dashboard isNarrow={isNarrow} />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes >
        </main>
    )
}

export default App
