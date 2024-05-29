import { useEffect, useRef, useState } from 'react'

import { Routes, Outlet, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import '@styles/base.scss'
import Header from './header/header'
import NotFound from '@pages/notFound'
import Budget from '@pages/budget/Window'
import Profile from '@pages/settings/Window'
import Accounts from '@pages/accounts/Window'
import Sidenav from './sidenav'
import {
  ZoomMotionDiv,
  Toast,
  ColorSchemedDiv,
  ScreenProvider,
  useScreenContext
} from '@ledget/ui'
import {
  CreateCategory,
  CreateBill,
  ForceVerification,
  OnboardingModal,
} from '@modals/index'
import { useGetMeQuery } from '@features/userSlice'
import {
  selectLogoutModal,
  setLogoutModal,
  refreshLogoutTimer
} from '@features/modalSlice';
import { toastStackSelector, tossToast } from '@features/toastSlice'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import Modals from './modals'

const PrivateRoute = () => {
  const { isSuccess, isError } = useGetMeQuery()

  useEffect(() => {

    // Check the condition for redirection here
    if (isError) {
      window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URL
    }
  }, [isError])

  return isSuccess && <Outlet />
}

const IsVerified = () => {
  const { data: user } = useGetMeQuery()
  return !user?.is_verified ? <Navigate to="/verify-email" /> : <Outlet />
}

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const ref = useRef<HTMLDivElement>(null)
  const { screenSize } = useScreenContext()
  const { data: user } = useGetMeQuery()
  const [isActivityDetected, setIsActivityDetected] = useState(false);

  const toastStack = useAppSelector(toastStackSelector)
  const logoutModal = useAppSelector(selectLogoutModal)

  // Handle automatic logout
  useEffect(() => {
    if (user?.settings.automatic_logout) {
      const handleUserActivity = () => {
        setIsActivityDetected(true);
      };

      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);

      const interval = setInterval(() => {

        if (isActivityDetected) {
          dispatch(refreshLogoutTimer());
        } else if (((logoutModal.logoutTimerEnd || 0) < new Date().getTime()) && !logoutModal.open) {
          dispatch(setLogoutModal({ open: true, fromTimeout: true }));
        }
        setIsActivityDetected(false);
      }, 3000); // Poll every 3 seconds

      return () => {
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        clearInterval(interval);
      };
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return
    } else if (!user.is_onboarded) {
      navigate('/welcome/connect')
    } else if (user.account.service_provisioned_until && user.account.service_provisioned_until < Math.floor(Date.now() / 1000)) {
      navigate('/settings/profile/update-payment')
    } else if (!user.account.has_customer || user.account.service_provisioned_until == 0) {
      window.location.href = import.meta.env.VITE_CHECKOUT_REDIRECT
    }
  }, [user])

  return (
    <>
      <AnimatePresence mode="wait">
        <ZoomMotionDiv
          key={location.pathname.split('/')[1]}
          className={`dashboard ${screenSize ? screenSize : ''}`}
          ref={ref}
        >
          <Routes location={location} key={location.pathname.split('/')[1]}>
            <Route path="/" element={<IsVerified />} >
              <Route path="budget" element={<Budget />} >
                <Route path="new-category" element={<CreateCategory />} />
                <Route path="new-bill" element={<CreateBill />} />
              </Route>
              <Route path="accounts/*" element={<Accounts />} />
              <Route path="settings/*" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="verify-email" element={<ForceVerification />} />
            <Route path="welcome/*" element={<OnboardingModal />} />
          </Routes>
        </ZoomMotionDiv>
      </AnimatePresence>
      <Modals />
      <Toast toastStack={toastStack} cleanUp={(toastId) => dispatch(tossToast(toastId))} />
    </>
  )
}

const AppWithNav = () => {
  const { screenSize } = useScreenContext()

  return (
    <ColorSchemedDiv className={`app ${screenSize ? screenSize : ''}`}>
      <Header />
      <main>
        <Sidenav />
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </ColorSchemedDiv >
  )
}

const EnrichedApp = () => (
  <ScreenProvider>
    <AppWithNav />
  </ScreenProvider>
)

const PrivatizedApp = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute />} >
      <Route path="*" element={<EnrichedApp />} />
    </Route>
  </Routes>
)

export default PrivatizedApp
