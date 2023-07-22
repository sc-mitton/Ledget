import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import UserContext from '../context/UserContext'

export const PrivateRoute = () => {
    const { user } = useContext(UserContext)

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export const UnauthenticatedRoute = () => {
    const { user } = useContext(UserContext)

    return (
        user ? <Navigate to="/checkout" /> : <Outlet />
    )
}
