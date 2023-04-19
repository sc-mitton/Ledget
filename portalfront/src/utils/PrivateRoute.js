import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { useContext, } from 'react'

const PrivateRoute = () => {
    const user = sessionStorage.getItem('user')

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoute
