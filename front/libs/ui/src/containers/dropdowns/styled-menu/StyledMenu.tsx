import { Menu as HeadlessMenu, MenuButtonProps } from '@headlessui/react';

import styles from './styled-menu.module.scss';
import { DropdownDiv } from '../../../animations/dropdowndiv/dropdowndiv';
import { useContext, Provider } from './context';
import { ItemProps } from './types';

const StyledMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeadlessMenu as="div" className={styles.menu}>
      {({ open }) => <Provider open={open}>{children}</Provider>}
    </HeadlessMenu>
  );
};

const Items = ({ children }: { children: React.ReactNode }) => {
  const { open } = useContext();

  return (
    <HeadlessMenu.Items static>
      <DropdownDiv visible={open} placement="auto" className={styles.dropdown}>
        {children}
      </DropdownDiv>
    </HeadlessMenu.Items>
  );
};

const Item = ({ onClick, label, icon, className, ...rest }: ItemProps) => {
  return (
    <HeadlessMenu.Item
      {...rest}
      className={[className, styles.itemContainer].join(' ')}
    >
      {({ active }) => (
        <button onClick={onClick} className={styles.item} data-active={active}>
          <span>{label}</span>
          <div>{icon}</div>
        </button>
      )}
    </HeadlessMenu.Item>
  );
};

StyledMenu.Button = HeadlessMenu.Button;
StyledMenu.Items = Items;
StyledMenu.Item = Item;

export default StyledMenu;
