import { useEffect, useLayoutEffect, useState, useRef } from 'react'

import { Routes, Outlet, Navigate, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import "./styles/style.css";
import Header from './Header'
import Budget from '@pages/budget/Window'
import Spending from '@pages/spending/Window'
import Profile from '@pages/profile/Window'
import Accounts from '@pages/accounts/Window'
import NotFound from '@pages/notFound/NotFound'
import { WelcomeConnect, AddCategories, AddBills } from '@pages/onboarding'
import { SkeletonDashboard } from '@pages/onboarding'
import { CreateCategory, CreateBill, ForceVerification } from '@modals'
import { useGetMeQuery } from '@features/userSlice'

const PrivateRoute = () => {
    const { isSuccess, isLoading, isPending } = useGetMeQuery()

    useEffect(() => {
        // Check the condition for redirection here
        if (!isSuccess && !isLoading && !isPending) {
            // Redirect to the specified URL
            window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URL
        }
    }, [isSuccess, isLoading, isPending])

    return (
        (isSuccess || isLoading || isPending) && <Outlet />
    )
}

const OnboardedRoute = () => {
    const { data: user } = useGetMeQuery()

    return user?.is_onboarded ? <Outlet /> : <Navigate to="/welcome/connect" />
}

const OnboardingApp = () => {
    const location = useLocation()

    const config = {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
    }

    return (
        <>
            <SkeletonDashboard />
            <div style={{ ...config, backgroundColor: 'var(--overlay2)' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{
                            opacity: 0,
                            transform:
                                location.pathname === '/welcome/connect'
                                    ? 'translateX(0%)'
                                    : 'translateX(20%)',
                            ...config
                        }}
                        animate={{
                            opacity: 1,
                            transform: 'translateX(0)',
                        }}
                        exit={{ opacity: 0, transform: 'translateX(-20%)' }}
                        key={location.pathname}
                        transition={{ ease: "easeInOut", duration: 0.2 }}
                        id="onboarding-app"
                    >
                        <Routes location={location} key={location.pathname} >
                            <Route path="/connect" element={<WelcomeConnect />} />
                            <Route path="/add-categories" element={<AddCategories />} />
                            <Route path="/add-bills" element={<AddBills />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    )
}

const MainApp = () => {
    const [isNarrow, setIsNarrow] = useState(false)
    const location = useLocation()
    const ref = useRef(null)

    const config = {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        display: 'flex',
    }

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsNarrow(ref.current.offsetWidth < 1000)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            <Header isNarrow={isNarrow} />
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, transform: 'scale(0.98)', ...config }}
                    animate={{ opacity: 1, transform: 'scale(1)' }}
                    exit={{ opacity: 0, transform: 'scale(0.98)' }}
                    key={location.pathname.split('/')[1]}
                    transition={{ duration: 0.2 }}
                >
                    <div className="dashboard" ref={ref}>
                        <Routes location={location} key={location.pathname.split('/')[1]} >
                            <Route
                                path="budget"
                                element={<><Budget />{!isNarrow && <Spending />}</>}
                            >
                                <Route path="new-category" element={<CreateCategory />} />
                                <Route path="new-bill" element={<CreateBill />} />
                                <Route path="edit" element={<div>edit</div>} />
                                <Route path="verify-email" element={<ForceVerification />} />
                            </Route>
                            <Route path="spending" element={
                                isNarrow ? <Spending /> : <Navigate to="/budget" />
                            } />
                            <Route path="accounts/*" element={<Accounts />} />
                            <Route path="profile/*" element={<Profile />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    )
}

const App = () => {
    const { isLoading } = useGetMeQuery()

    return (
        <>
            {!isLoading &&
                <main>
                    <Routes>
                        <Route path="/" element={<PrivateRoute />} >
                            <Route path="/" element={<OnboardedRoute />} >
                                <Route path="/*" element={<MainApp />} />
                            </Route>
                            <Route path="welcome/*" element={<OnboardingApp />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </main >
            }
        </>
    )
}

export default App
