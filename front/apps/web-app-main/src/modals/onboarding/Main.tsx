import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

import { withModal } from '@ledget/ui';
import { SlideMotionDiv } from '@ledget/ui';
import AddBills from './add-bills/AddBills';
import AddCategories from './add-categories/AddCategories';
import WelcomeConnect from './Connect';
import Message from './Message';
import styles from './styles/main.module.scss';

const Main = () => {
  const location = useLocation();

  return (
    <div className={styles.onboardingApp}>
      <div className={styles.overlay} />
      <div className={styles.routes}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <SlideMotionDiv>
                  <Message />
                </SlideMotionDiv>
              }
            />
            <Route
              path="message"
              element={
                <SlideMotionDiv>
                  <Message />
                </SlideMotionDiv>
              }
            />
            <Route
              path="add-categories"
              element={
                <SlideMotionDiv>
                  <AddCategories />
                </SlideMotionDiv>
              }
            />
            <Route
              path="connect"
              element={
                <SlideMotionDiv>
                  <WelcomeConnect />
                </SlideMotionDiv>
              }
            />
            <Route
              path="add-bills"
              element={
                <SlideMotionDiv>
                  <AddBills />
                </SlideMotionDiv>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Main;
