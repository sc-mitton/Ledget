import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

import styles from './styles/window.module.scss';
import NotFound from '@pages/notFound';
import { Nav } from './Nav';
import { Transactions } from './transactions';
import { NotImplimentedMessage } from '@components/pieces';
import { useScreenContext, MainWindow } from '@ledget/ui';
import AccountMenu from './account-menu/AccountMenu';
import DepositorySummary from './depository-summary/DepositorySummary';
import CreditCards from './credit-cards/CreditCards';
import SelectedCardHeader from './selected-card-header/SelectedCardHeader';
import InvestmentsTab from './investments/Tab';

const _getNavHeaderPhrase = (key = '') => {
  switch (key) {
    case 'deposits':
      return 'Your Accounts';
    case 'credit':
      return 'Your Cards';
    case 'investments':
      return 'Your Investments';
    case 'loans':
      return 'Your Loans';
    default:
      return null;
  }
};

const Window = () => {
  const { screenSize } = useScreenContext();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2];

  return (
    <MainWindow
      size={screenSize}
      className={styles.window}
      data-screen-size={screenSize}
    >
      <div className={styles.header} data-screen-size={screenSize}>
        <h1>{_getNavHeaderPhrase(currentPath)}</h1>
        <Nav />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname.split('/')[2]}
          initial={{
            opacity: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Routes location={location}>
            <Route path="deposits" element={<DepositorySummary />} />
            <Route path="credit" element={<CreditCards />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <div className={styles.accountMenuContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname.split('/')[2]}
            initial={{
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Routes location={location}>
              <Route path="deposits" element={<AccountMenu />} />
              <Route path="credit" element={<SelectedCardHeader />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname.split('/')[2]}
            initial={{
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Routes location={location} key={location.pathname.split('/')[2]}>
              <Route path="deposits" element={<Transactions />} />
              <Route path="credit" element={<Transactions />} />
              <Route path="investments" element={<InvestmentsTab />} />
              <Route path="loans" element={<NotImplimentedMessage />} />
              <Route path="*" element={<NotFound hasBackground={false} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </MainWindow>
  );
};

export default Window;
