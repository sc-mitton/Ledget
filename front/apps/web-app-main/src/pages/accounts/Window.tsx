import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

import styles from './styles/window.module.scss';
import NotFound from '@pages/notFound';
import { AccountsProvider } from './context';
import { Nav } from './Nav';
import { DepositTransactions } from './transactions';
import { NotImplimentedMessage } from '@components/pieces';
import { useScreenContext, MainWindow } from '@ledget/ui';

const _getNavHeaderPhrase = (key = '') => {
  switch (key) {
    case 'deposits':
      return 'Your Accounts';
    case 'credit':
      return 'Your Credit Cards';
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
      <h1>{_getNavHeaderPhrase(currentPath)}</h1>
      <Nav />
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
              <Route path="deposits" element={<DepositTransactions />} />
              <Route path="credit" element={<DepositTransactions />} />
              <Route path="investments" element={<NotImplimentedMessage />} />
              <Route path="loans" element={<NotImplimentedMessage />} />
              <Route path="*" element={<NotFound hasBackground={false} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </MainWindow>
  );
};

export default function () {
  return (
    <AccountsProvider>
      <Window />
    </AccountsProvider>
  );
}
