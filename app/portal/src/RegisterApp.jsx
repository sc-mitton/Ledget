import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import logoLight from "@assets/images/logoLight.svg"
import SignUpWindow from './components/forms/SignUp'
import CheckoutWindow from './components/forms/Checkout'
import VerificationWindow from './components/forms/Verification'
import { AuthenticatedRoute } from './utils/PrivateRoutes'

function AnimatedRoutes() {

    const SideBarHeader = () => {
        const stepNumber = {
            register: 'Step 1 of 3',
            verification: 'Step 2 of 3',
            checkout: 'Step 3 of 3',
        }

        const header = {
            register: 'Create Account',
            verification: 'Email Verification',
            checkout: 'Checkout',
        }

        const splitPath = useLocation().pathname.split("/")

        return (
            <div>
                <div>
                    <img src={logoLight} alt="Ledget" />
                </div>
                <h1>
                    {header[splitPath[splitPath.length - 1]]}
                </h1>
                <h3>
                    {stepNumber[splitPath[splitPath.length - 1]]}
                </h3>
            </div>
        )
    }

    const location = useLocation()

    return (
        <div className="split-page">
            <AnimatePresence mode="wait">
                <motion.div
                    className="page-half right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={location.pathname}
                    transition={{
                        opacity: { duration: .25, ease: "easeIn" }
                    }}
                >
                    <Routes location={location} key={location.pathname} >
                        <Route path="/" element={<SignUpWindow />} />
                        <Route path="checkout" element={<CheckoutWindow />} />
                        <Route path="verification" element={<VerificationWindow />} />
                        <Route path="/" element={<AuthenticatedRoute />}>

                        </Route>
                    </Routes>
                </motion.div >
            </AnimatePresence>
        </div>
    )
}

export default AnimatedRoutes
