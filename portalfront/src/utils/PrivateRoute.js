import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const PrivateRoute = () => {
    const { user } = useContext(AuthContext)
    return user ? <Navigate to="/login" /> : <Outlet />
}

export default PrivateRoute;
