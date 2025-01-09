import React from 'react';

import { Menu } from '@headlessui/react';
import { Switch } from '@headlessui/react';

import styles from './styles/header.module.scss';
import { LedgetLogoIcon2 } from '@ledget/media';
import { setLogoutModal, setModal } from '@features/modalSlice';
import { useAppDispatch } from '@hooks/store';
import { User, LifeBuoy, LogOut, Sun, Moon } from '@geist-ui/icons';
import {
  DropdownItem,
  DropdownDiv,
  useScreenContext,
  useColorScheme,
} from '@ledget/ui';
import ActivityDropdown from './activity/Dropdown';

const LightDarkSwitch = () => {
  const { isDark, setDarkMode } = useColorScheme();

  return (
    <Switch.Group className={styles.darkModeSwitch} as={'div'}>
      <Switch checked={isDark} onChange={setDarkMode}>
        <div>
          <Sun className="icon" />
        </div>
        <div>
          <Moon className="icon" />
        </div>
        <span />
      </Switch>
    </Switch.Group>
  );
};

const ProfileDropdownMenu = () => {
  const dispatch = useAppDispatch();

  const Wrapper = ({
    onClick,
    children,
  }: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
  }) => {
    return (
      <Menu.Item as={React.Fragment}>
        {({ active }) => (
          <DropdownItem as="button" active={active} onClick={onClick}>
            {children}
          </DropdownItem>
        )}
      </Menu.Item>
    );
  };

  return (
    <Menu>
      {({ open }) => (
        <div className={styles.profileDropdown}>
          <Menu.Button className={styles.profileButton}>
            <User className="icon" stroke={'var(--white)'} />
          </Menu.Button>
          <DropdownDiv placement="right" arrow="right" visible={open}>
            <Menu.Items static>
              <Wrapper onClick={() => dispatch(setModal('help'))}>
                <LifeBuoy className="icon" />
                Help
              </Wrapper>
              <Wrapper onClick={() => dispatch(setLogoutModal({ open: true }))}>
                <LogOut className="icon" />
                Log out
              </Wrapper>
            </Menu.Items>
          </DropdownDiv>
        </div>
      )}
    </Menu>
  );
};

function Header() {
  const { screenSize } = useScreenContext();

  return (
    <>
      <header className={styles.header} data-size={screenSize}>
        <div>
          <div>
            <LedgetLogoIcon2 />
          </div>
          <div>
            <LightDarkSwitch />
            <ActivityDropdown id="notifications" />
            <ProfileDropdownMenu />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
