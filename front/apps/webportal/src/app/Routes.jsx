import { useEffect } from 'react'
import { Routes, Route, Outlet, Navigate, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import LoginWindow from '@forms/Login'
import RegisterWindow from '@forms/Register'
import CheckoutWindow from '@forms/Checkout'
import VerificationWindow from '@forms/Verification'
import { RecoveryWindow } from '@forms/recovery'
import { ActivationWindow } from '@forms/activation'
import Header from './header'
import { SendRegisteredToCheckout } from '@utils'
import { useColorScheme } from '@ledget/ui'

export const SendRegisteredToCheckout = () => (
    JSON.parse(sessionStorage.getItem('identifier' || null))
        ? <Navigate to="/checkout" /> : <Outlet />
)

function AnimatedRoutes() {
    const location = useLocation()
    const { isDark } = useColorScheme()

    // Set title to the current page
    useEffect(() => {
        const title = location.pathname.split('/')[1]
        document.title = title.charAt(0).toUpperCase() + title.slice(1)
    }, [location])

    return (
        <>
            <Header />
            <main className={`main ${isDark ? 'dark' : 'light'}`}>
                <div className='page'>
                    <AnimatePresence mode="wait">
                        <motion.div
                            className="page-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={location.pathname}
                            transition={{ opacity: { duration: .15, ease: "easeIn" } }}
                        >
                            <Routes location={location} key={location.pathname.split('/')[1]} >
                                <Route path="/" element={<SendRegisteredToCheckout />}>
                                    <Route exact path="/" element={<Navigate to="/login" />} />
                                    <Route exact path="/login" element={<LoginWindow />} />
                                    <Route exact path="/recovery" element={<RecoveryWindow />} />
                                </Route>
                                <Route exact path="/activation" element={<ActivationWindow />} />
                                <Route path="/register" element={<RegisterWindow />} />
                                <Route path="/verification" element={<VerificationWindow />} />
                                <Route path="/checkout" element={<CheckoutWindow />} />
                            </Routes>
                        </motion.div >
                    </AnimatePresence>
                </div>
            </main>
        </>
    )
}

export default AnimatedRoutes
