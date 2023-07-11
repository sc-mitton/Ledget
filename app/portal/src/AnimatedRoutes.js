import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import LoginWindow from './components/forms/Login'
import SignUpWindow from './components/forms/SignUp'
import CheckoutWindow from './components/forms/Checkout'
import VerificationWindow from './components/forms/Verification'
import RecoveryWindow from './components/forms/Recovery'
import { PrivateRoute, UnauthenticatedRoute } from './utils/PrivateRoutes'

function AnimatedRoutes() {
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
                            <Route exact path="/login" element={<LoginWindow />} />
                            <Route exact path="/recovery" element={<RecoveryWindow />} />
                        </Route>
                        <Route path="/register" element={<SignUpWindow />} />
                        <Route path="/verification" element={<VerificationWindow />} />

                        <Route path="/" element={<PrivateRoute />}>
                            <Route path="/checkout" element={<CheckoutWindow />} />
                        </Route>
                        {/* Forgot password page */}
                    </Routes>
                </motion.div >
            </AnimatePresence>
        </>
    )
}

export default AnimatedRoutes
