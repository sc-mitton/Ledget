import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const PrivateRoutes = () => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <Navigate to="/login" />
    } else {
        return <Outlet />
    }
}

export default PrivateRoutes;
