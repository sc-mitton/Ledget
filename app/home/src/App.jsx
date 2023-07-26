import React, { useEffect } from 'react'

import { Routes, Outlet, Navigate, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Dashboard from './windows/Dashboard'
import { fetchUser, selectUser } from './slices/user'


const PrivateRoute = () => {
    const user = useSelector(selectUser)
    return (
        user.hasErrors ? <Navigate to="/login" /> : <Outlet />
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
    const user = useSelector(selectUser)

    const dispatch = useDispatch()

    useEffect(() => {
        if (user.status === 'idle') {
            dispatch(fetchUser())
        }
    }, [])

    return (
        <main tabIndex={0}>
            <Routes>
                <Route path="/" element={<PrivateRoute />} >
                    <Route path="/*" element={<Dashboard />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes >
        </main>
    )
}

export default App
