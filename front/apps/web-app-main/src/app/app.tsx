import { useEffect, useRef, useState } from 'react';

import {
  Routes,
  Outlet,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import '@styles/base.scss';
import styles from './styles/app.module.scss';
import NotFound from '@pages/notFound';
import Budget from '@pages/budget/Window';
import Profile from '@pages/profile/Window';
import Accounts from '@pages/accounts/Window';
import Home from '@pages/home/Window';
import SideNav from './side-nav/SideNav';
import Header from './header/header';
import Checkout from '@pages/checkout/Window';
import {
  ZoomMotionDiv,
  Toast,
  ColorSchemedDiv,
  useScreenContext,
} from '@ledget/ui';
import {
  CreateCategory,
  CreateBill,
  ForceVerification,
  OnboardingModal,
  AccountErrorModal,
} from '@modals/index';
import {
  useGetMeQuery,
  useDisableSessionMutation,
  toastStackSelector,
  tossToast,
} from '@ledget/shared-features';
import { setModal, selectModal } from '@features/modalSlice';
import { refreshLogoutTimer, selectLogoutTimerEnd } from '@features/authSlice';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import Modals from './modals';
import Providers from './providers';

const PrivateRoute = () => {
  const { isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isError) {
      window.location.href = `${
        import.meta.env.VITE_LOGOUT_REDIRECT_URL
      }?redirect=${window.location.href}`;
    }
  }, [isError]);

  return isSuccess ? <Outlet /> : null;
};

const IsVerified = () => {
  const { data: user } = useGetMeQuery();
  return !user?.is_verified ? <Navigate to="/verify-email" /> : <Outlet />;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [disableSession] = useDisableSessionMutation();

  const ref = useRef<HTMLDivElement>(null);
  const { screenSize } = useScreenContext();
  const { data: user } = useGetMeQuery();
  const [isActivityDetected, setIsActivityDetected] = useState(false);

  const toastStack = useAppSelector(toastStackSelector);
  const modal = useAppSelector(selectModal);
  const logoutTimerEnd = useAppSelector(selectLogoutTimerEnd);

  // Automatically disable session on tab close
  useEffect(() => {
    if (!user?.settings.automatic_logout) return;

    window.addEventListener('beforeunload', async () => {
      await disableSession();
    });

    return () => {
      window.removeEventListener('beforeunload', async () => {
        await disableSession();
      });
    };
  }, []);

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
        } else if (
          (logoutTimerEnd || 0) < new Date().getTime() &&
          modal?.name !== 'logout'
        ) {
          dispatch(setModal({ name: 'logout', args: { fromTimeout: true } }));
        }
        setIsActivityDetected(false);
      }, 3000); // Poll every 3 seconds

      return () => {
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    } else if (!user.is_onboarded) {
      navigate('/welcome/connect');
    } else if (
      user.account.service_provisioned_until &&
      user.account.service_provisioned_until < Math.floor(Date.now() / 1000)
    ) {
      navigate('/settings/profile/update-payment');
    } else if (
      !user.account.has_customer ||
      user.account.service_provisioned_until == 0
    ) {
      window.location.href = import.meta.env.VITE_CHECKOUT_REDIRECT;
    } else if (user.account.subscription_status === 'past_due') {
      navigate('/settings/profile/update-payment');
    } else if (
      user.account.service_provisioned_until <
      new Date().getTime() / 1000
    ) {
      navigate('/budget/error');
    }
  }, [user]);

  return (
    <ColorSchemedDiv className={styles.app}>
      <Header />
      <main>
        <SideNav />
        <AnimatePresence mode="wait">
          <ZoomMotionDiv
            key={location.pathname.split('/')[1]}
            className={styles.dashboard}
            data-screen-size={screenSize}
            ref={ref}
          >
            <Routes location={location} key={location.pathname.split('/')[1]}>
              <Route path="/" element={<IsVerified />}>
                <Route path="budget" element={<Budget />}>
                  <Route path="new-category" element={<CreateCategory />} />
                  <Route path="new-bill" element={<CreateBill />} />
                  <Route path="error" element={<AccountErrorModal />} />
                </Route>
                <Route path="accounts/*" element={<Accounts />} />
                <Route path="profile/*" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="verify-email" element={<ForceVerification />} />
              <Route path="welcome/*" element={<OnboardingModal />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ZoomMotionDiv>
        </AnimatePresence>
        <Modals />
        <Toast
          toastStack={toastStack as any}
          cleanUp={(toastId) => dispatch(tossToast(toastId))}
        />
      </main>
    </ColorSchemedDiv>
  );
};

const PrivatizedApp = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute />}>
      <Route path="*" element={<App />} />
    </Route>
  </Routes>
);

const EnrichedApp = () => (
  <Providers>
    <PrivatizedApp />
  </Providers>
);

export default EnrichedApp;
