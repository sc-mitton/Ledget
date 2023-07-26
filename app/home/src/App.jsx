import React, { useEffect } from 'react'

import { Routes, Outlet, Navigate, Route } from 'react-router-dom'

import Dashboard from './windows/Dashboard'
import { useGetMeQuery } from '@api/apiSlice'
import "./style/style.css";


const PrivateRoute = () => {
    const { isError } = useGetMeQuery()

    return (
        isError ? <Navigate to="/login" /> : <Outlet />
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
