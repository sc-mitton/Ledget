import { useEffect, useRef, lazy, Suspense } from 'react'

import { Routes, Outlet, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import "./styles/base.scss";
import Header from './Header'
import NotFound from '@pages/notFound/NotFound'
import Budget from '@pages/budget/Window'
import Profile from '@pages/profile/Window'
import Accounts from '@pages/accounts/Window'
import {
    ZoomMotionDiv,
    Toast,
    ColorSchemedMain
} from '@ledget/ui'
import {
    CreateCategory,
    CreateBill,
    ForceVerification,
    BillModal,
    OnboardingModal,
    TransactionItem
} from '@modals/index'
import { useGetMeQuery } from '@features/userSlice'
import { selectTransactionModal, clearTransactionModal } from '@features/uiSlice';
import { toastStackSelector, tossToast } from '@features/toastSlice'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { ScreenProvider } from '@context/index'
import { useScreenContext } from '@context/index';

const PrivateRoute = () => {
    const { isSuccess, isLoading, error } = useGetMeQuery()

    useEffect(() => {
        // Check the condition for redirection here
        if (!isSuccess && !isLoading) {
            window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URL
        }
    }, [isSuccess, isLoading])

    return (
        (isSuccess || isLoading) && <Outlet />
    )
}

const OnboardedRoute = () => {
    const { data: user } = useGetMeQuery()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user?.is_onboarded) {
            navigate('/budget/welcome/connect')
        }
    }, [user?.is_onboarded])

    return user?.is_onboarded && <Outlet />
}

const App = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const ref = useRef<HTMLDivElement>(null)
    const { data: user } = useGetMeQuery()
    const toastStack = useAppSelector(toastStackSelector)
    const transactionModal = useAppSelector(selectTransactionModal)
    const dispatch = useAppDispatch()
    const { screenSize } = useScreenContext()

    // Handling the situations where the user missed the initial email verification
    // or had errors in the checkout process
    useEffect(() => {
        let timeout = setTimeout(() => {
            if (!user?.is_verified) {
                navigate('/budget/verify-email')
            } else if (!user.is_customer || user.service_provisioned_until == 0) {
                window.location.href = import.meta.env.VITE_CHECKOUT_REDIRECT
            } else if (user.service_provisioned_until < Math.floor(Date.now() / 1000)) {
                navigate('/profile/details/update-payment')
            }
        }, 1000)
        return () => { clearTimeout(timeout) }
    }, [location.pathname])

    return (
        <>
            <Header />
            <AnimatePresence mode="wait">
                <ZoomMotionDiv
                    key={location.pathname.split('/')[1]}
                    style={{ flexGrow: '1' }}
                    className={`dashboard ${screenSize ? screenSize : ''}`}
                    ref={ref}
                >
                    <Routes location={location} key={location.pathname.split('/')[1]}>
                        <Route path="/" element={<OnboardedRoute />} >
                            <Route path="budget" element={<Budget />} >
                                <Route path="new-category" element={<CreateCategory />} />
                                <Route path="new-bill" element={<CreateBill />} />
                                <Route path="bill" element={<BillModal />} />
                                <Route path="verify-email" element={<ForceVerification />} />
                                <Route path="welcome/*" element={<OnboardingModal />} />
                            </Route>
                            <Route path="accounts/*" element={<Accounts />} />
                            <Route path="profile/*" element={<Profile />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </ZoomMotionDiv>
            </AnimatePresence>
            {transactionModal.item &&
                <TransactionItem
                    item={transactionModal.item}
                    splitMode={transactionModal.splitMode}
                    onClose={() => dispatch(clearTransactionModal())}
                />}
            <Toast toastStack={toastStack} cleanUp={(toastId) => dispatch(tossToast(toastId))} />
        </>
    )
}

const EnrichedApp = () => {
    const { isLoading } = useGetMeQuery()

    return (
        <ScreenProvider>
            {!isLoading &&
                <ColorSchemedMain>
                    <Routes>
                        <Route path="/" element={<PrivateRoute />} >
                            <Route path="/*" element={<App />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </ColorSchemedMain >
            }
        </ScreenProvider>
    )
}

export default EnrichedApp
