import { useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Login,
  Register,
  Checkout,
  Verification,
  Recovery,
  Activation,
} from '@pages/index';
import Header from './header/header';
import { useColorScheme, useScreenContext } from '@ledget/ui';
import { MainDiv } from '@components/index';

function AnimatedRoutes() {
  const location = useLocation();
  const { isDark } = useColorScheme();
  const { screenSize } = useScreenContext();

  // Set title to the current page
  useEffect(() => {
    const title = location.pathname.split('/')[1];
    document.title = title.charAt(0).toUpperCase() + title.slice(1);
  }, [location]);

  return (
    <>
      <Header />
      <main>
        <MainDiv size={screenSize} dark={isDark}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={location.pathname}
              transition={{ opacity: { duration: 0.15, ease: 'easeIn' } }}
            >
              <Routes location={location} key={location.pathname.split('/')[1]}>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/recovery" element={<Recovery />} />
                <Route path="/activation" element={<Activation />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </MainDiv>
      </main>
    </>
  );
}

export default AnimatedRoutes;
