import { Sun, Moon } from '@geist-ui/icons';
import { Switch } from '@headlessui/react';

import styles from './dark-switch.module.scss';
import { useColorScheme } from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';

const LightDarkSwitch = () => {
  const { isDark, setDarkMode } = useColorScheme();

  return (
    <Switch.Group className={styles.darkModeSwitch} as={'div'}>
      <Switch checked={!isDark} onChange={(v) => setDarkMode(!v)}>
        <div>
          <Moon className="icon" />
        </div>
        <div>
          <Sun className="icon" />
        </div>
        <span />
      </Switch>
    </Switch.Group>
  );
};

export default LightDarkSwitch;
