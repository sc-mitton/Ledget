import { useEffect, useState } from 'react'

import { Navigate, Outlet } from 'react-router-dom'

export const AuthenticatedRoute = () => {
    const [identifier, setIdentifier] = useState('')

    useEffect(() => {
        setIdentifier(JSON.parse(sessionStorage.getItem('identifier' || null)))
    }, [])

    return identifier ? <Outlet /> : <Navigate to="/login" />
}

export const UnauthenticatedRoute = () => {
    const [identifier, setIdentifier] = useState('')

    useEffect(() => {
        setIdentifier(JSON.parse(sessionStorage.getItem('identifier' || null)))
    }, [])

    return identifier ? <Navigate to="/checkout" /> : <Outlet />
}
