import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import LoginWindow from '@forms/Login'
import SignUpWindow from '@forms/SignUp'
import CheckoutWindow from '@forms/Checkout'
import VerificationWindow from '@forms/Verification'
import RecoverWindow from '@forms/Recovery'
import Header from './Header'
import { SendRegisteredToCheckout, ProtectedCheckout } from '@utils'

function AnimatedRoutes() {
    const location = useLocation()

    return (
        <>
            <Header />
            <AnimatePresence mode="wait">
                <motion.div
                    className='page'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={location.pathname}
                    transition={{
                        opacity: { duration: .15, ease: "easeIn" }
                    }}
                >
                    <Routes location={location} key={location.pathname.split('/')[1]} >
                        <Route path="/" element={<SendRegisteredToCheckout />}>
                            <Route exact path="/" element={<Navigate to="/login" />} />
                            <Route exact path="/login" element={<LoginWindow />} />
                            <Route exact path="/recovery" element={<RecoverWindow />} />
                        </Route>
                        <Route path="/register" element={<SignUpWindow />} />
                        <Route path="/verification" element={<VerificationWindow />} />
                        <Route path="/checkout" element={<CheckoutWindow />} />
                        <Route path="/" element={<ProtectedCheckout />}>
                        </Route>
                    </Routes>
                </motion.div >
            </AnimatePresence>
        </>
    )
}

export default AnimatedRoutes
