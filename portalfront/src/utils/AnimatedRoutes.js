import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import LoginWindow from '../components/forms/Login';
import SignUpWindow from '../components/forms/SignUp';
import Checkout from '../components/forms/Checkout';
import PrivateRoutes from '../utils/PrivateRoutes';


const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
        </div>
    )
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname} >
                <Route element={<PrivateRoutes />} >
                    <Route path="/home" element={<Dashboard />} />
                </Route>
                <Route exact path="/login" element={<LoginWindow />} />
                <Route path="/register" element={<SignUpWindow />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes
