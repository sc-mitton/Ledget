import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export const PrivateRoute = () => {
    const { user } = React.useContext(AuthContext)

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export const UnauthenticatedRoute = () => {
    const { user } = React.useContext(AuthContext)

    return (
        user ? <Navigate to="/checkout" /> : <Outlet />
    )
}
