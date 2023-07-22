import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import LoginWindow from './components/forms/Login'
import SignUpWindow from './components/forms/SignUp'
import CheckoutWindow from './components/forms/Checkout'
import VerificationWindow from './components/forms/Verification'
import RecoveryWindow from './components/forms/Recovery'
import { PrivateRoute, UnauthenticatedRoute } from './utils/PrivateRoutes'

function AnimatedRoutes() {
    // Animated routes for the portal app
    // The login and recovery page are protected against authenticated users
    // and redirected to the dashboard if the user is already logged in
    //
    // The checkout and verification pages are protected against unauthenticated users
    // and redirected to the login page if the user is not logged in
    //
    // The register does not have a protected route and instead handles redirects in the
    // flow context provider

    const location = useLocation()

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    className='page'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={location.pathname}
                    transition={{
                        opacity: { duration: .25, ease: "easeIn" }
                    }}
                >
                    <Routes location={location} key={location.pathname} >
                        <Route path="/" element={<UnauthenticatedRoute />}>
                            <Route exact path="/" element={<Navigate to="/login" />} />
                            <Route exact path="/login" element={<LoginWindow />} />
                            <Route exact path="/recovery" element={<RecoveryWindow />} />
                        </Route>
                        <Route path="/register" element={<SignUpWindow />} />
                        <Route path="/" element={<PrivateRoute />}>
                            <Route path="/verification" element={<VerificationWindow />} />
                            <Route path="/checkout" element={<CheckoutWindow />} />
                        </Route>
                    </Routes>
                </motion.div >
            </AnimatePresence>
        </>
    )
}

export default AnimatedRoutes
