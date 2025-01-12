import { useState } from 'react';
import { Sun, Moon } from '@geist-ui/icons';

import styles from './dark-switch.module.scss';
import { useColorScheme } from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';

const LightDarkSwitch = () => {
  const loaded = useLoaded(1000);
  const { isDark, setDarkMode } = useColorScheme();

  return (
    <button
      onClick={() => setDarkMode(!isDark)}
      className={styles.switch}
      data-loaded={loaded}
      data-mode={isDark ? 'dark' : 'light'}
    >
      <Sun size={'1.5em'} />
      <Moon size={'1.5em'} />
    </button>
  );
};

export default LightDarkSwitch;
