import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import styles from './styles/window.module.scss';
import ProfilePage from './Profile';
import ConnectionsPage from './Connections';
import SecurityPage from './security/Security';
import {
  UpdatePayment,
  CancelSubscription,
  ChangeBillCycle,
  DeactivateAuthentictor,
  ChangePassword,
  AuthenticatorSetup,
  RecoveryCodes,
} from '@modals/index';
import { useScreenContext } from '@ledget/ui';

function Profile() {
  const location = useLocation();
  const { screenSize } = useScreenContext();

  return (
    <div className={styles.mainWindow}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={location.pathname.split('/')[2]}
          data-size={screenSize}
        >
          <Routes location={location} key={location.pathname.split('/')[2]}>
            <Route path="/" element={<ProfilePage />}>
              <Route path="update-payment" element={<UpdatePayment />} />
              <Route
                path="cancel-subscription"
                element={<CancelSubscription />}
              />
              <Route path="change-bill-cycle" element={<ChangeBillCycle />} />
            </Route>
            <Route path="connections" element={<ConnectionsPage />} />
            <Route path="security" element={<SecurityPage />}>
              <Route
                path="delete-authenticator"
                element={<DeactivateAuthentictor />}
              />
              <Route
                path="authenticator-setup"
                element={<AuthenticatorSetup />}
              />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="recovery-codes" element={<RecoveryCodes />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Profile;
