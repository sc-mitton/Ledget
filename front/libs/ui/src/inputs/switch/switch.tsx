import styles from './switch.module.scss';
import { Switch } from '@headlessui/react';

interface DefaultSwitchProps {
  checked?: boolean;
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
}

export const BakedSwitch = ({
  checked,
  className,
  onChange,
  children,
  as = 'div',
  ...rest
}: DefaultSwitchProps) => {
  return (
    <Switch.Group
      className={[styles.switchContainer, className].join(' ')}
      as={as}
    >
      <Switch.Label>{children}</Switch.Label>
      <Switch
        checked={checked}
        onChange={onChange}
        className={styles.switchCrib}
        data-enabled={checked}
        {...rest}
      >
        {({ checked: isChecked }) => (
          <span className={styles.switchPill} data-enabled={isChecked}></span>
        )}
      </Switch>
    </Switch.Group>
  );
};
