import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import LoginWindow from './components/forms/Login'
import SignUpWindow from './components/forms/SignUp'
import Checkout from './components/forms/Checkout'
import PrivateRoute from './utils/PrivateRoute'

function AnimatedRoutes() {
    const location = useLocation()

    return (
        <div id="portal">
            <AnimatePresence mode="wait">
                <motion.div
                    className="window-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={location.pathname}
                    transition={{
                        opacity: { duration: .25, ease: "easeIn" }
                    }}
                >
                    <Routes location={location} key={location.pathname} >
                        <Route exact path="/login" element={<LoginWindow />} />
                        <Route path="/register" element={<SignUpWindow />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/" element={<PrivateRoute />}>
                            {/* Change Password page */}
                        </Route>
                        {/* Forgot password page */}
                    </Routes>
                </motion.div >
            </AnimatePresence>
        </div>
    )
}

export default AnimatedRoutes
