import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import logo from "./assets/images/logo.svg"
import LoginWindow from './components/forms/Login'
import SignUpWindow from './components/forms/SignUp'
import Checkout from './components/forms/Checkout'
import PrivateRoute from './utils/PrivateRoute'
import PlansWindow from './components/forms/Plans'

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
                        <Route path="/" element={<PrivateRoute />}>
                            <Route path="/plans" element={<PlansWindow />} />
                            <Route path="/checkout/*" element={<Checkout />} />
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
