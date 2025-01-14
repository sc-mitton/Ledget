import { Outlet } from 'react-router-dom';

import styles from './styles/security.module.scss';
import { useGetDevicesQuery } from '@ledget/shared-features';
import { LoadingRingDiv, useScreenContext } from '@ledget/ui';
import Devices from './Devices';
import Mfa from './Mfa';
import Authentication from './Authentication';
import Preferences from './Preferences';

const Main = () => {
  const { data: devices, isLoading } = useGetDevicesQuery();
  const { screenSize } = useScreenContext();

  return (
    <>
      <h1 data-size={screenSize} className={styles.header}>
        Security
      </h1>
      <LoadingRingDiv loading={isLoading}>
        <div className={styles.securityPage}>
          <Devices devices={devices} />
          <Authentication />
          <Mfa />
          <Preferences />
        </div>
        <Outlet />
      </LoadingRingDiv>
    </>
  );
};

export default Main;
