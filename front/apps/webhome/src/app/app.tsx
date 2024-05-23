import { useEffect, useRef } from 'react'

import { Routes, Outlet, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import '@styles/base.scss'
import Header from './header'
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
  BillModal,
  OnboardingModal,
  TransactionItem,
  CategoryModal
} from '@modals/index'
import { useGetMeQuery } from '@features/userSlice'
import {
  selectTransactionModal,
  clearTransactionModal,
  selectCategoryModal,
  clearCategoryModal,
  selectBillModal,
  clearBillModal,
  selectReAuthModal,
} from '@features/modalSlice';
import { toastStackSelector, tossToast } from '@features/toastSlice'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { ReAuthModal } from '@utils/withReAuth'

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

  const toastStack = useAppSelector(toastStackSelector)
  const transactionModal = useAppSelector(selectTransactionModal)
  const categoryModal = useAppSelector(selectCategoryModal)
  const billModal = useAppSelector(selectBillModal)
  const reAuthModal = useAppSelector(selectReAuthModal)

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

      {/* Modals */}
      {transactionModal.item &&
        <TransactionItem
          item={transactionModal.item}
          splitMode={transactionModal.splitMode}
          onClose={() => dispatch(clearTransactionModal())}
        />}
      {categoryModal.category &&
        <CategoryModal
          category={categoryModal.category}
          onClose={() => dispatch(clearCategoryModal())}
        />}
      {billModal.bill &&
        <BillModal
          bill={billModal.bill}
          onClose={() => dispatch(clearBillModal())}
        />}
      {reAuthModal &&
        <ReAuthModal />}
      <Toast toastStack={toastStack} cleanUp={(toastId) => dispatch(tossToast(toastId))} />
    </>
  )
}

const EnrichedApp = () => {

  return (
    <ScreenProvider>
      <ColorSchemedDiv className='full-screen-div'>
        <Header />
        <main>
          <Sidenav />
          <Routes>
            <Route path="/*" element={<App />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </ColorSchemedDiv >
    </ScreenProvider>
  )
}

const PrivatizedApp = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute />} >
      <Route path="*" element={<EnrichedApp />} />
    </Route>
  </Routes>
)

export default PrivatizedApp
