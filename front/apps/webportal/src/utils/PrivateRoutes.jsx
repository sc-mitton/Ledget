import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthenticatedRoute = () => {
    const [user, setUser] = useState(true)

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem('user' || null)))
    }, [])

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export const UnauthenticatedRoute = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem('user' || null)))
    }, [])

    return (
        user ? <Navigate to="/checkout" /> : <Outlet />
    )
}
