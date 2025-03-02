import { useEffect, useRef, useState } from 'react';
import { LogOut, LifeBuoy, Settings } from '@geist-ui/icons';

import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { animated } from '@react-spring/web';
import { DollarSign, User, ChevronDown, Link, Shield } from '@geist-ui/icons';

import styles from './side-nav.module.scss';
import { Institution, Hamburger, LedgetLogoIcon } from '@ledget/media';
import {
  usePillAnimation,
  useScreenContext,
  useColorScheme,
  useSchemeVar,
  useCloseDropdown,
} from '@ledget/ui';
import { setModal } from '@features/modalSlice';
import { useAppDispatch } from '@hooks/store';
import { useGetMeQuery } from '@ledget/shared-features';

const SubProfileSidebar = () => {
  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();

  return (
    <ul className={styles.subNav} role="menu">
      <li
        data-current={
          location.pathname.split('/')[
            location.pathname.split('/').length - 1
          ] === 'profile'
            ? 'page'
            : ''
        }
      >
        <a onClick={() => navigate('/profile')}>
          <Settings className="icon" />
          <span>Settings</span>
        </a>
      </li>
      <li
        data-current={location.pathname.includes('connections') ? 'page' : ''}
      >
        <a onClick={() => navigate('/profile/connections')}>
          <Link className="icon" />
          <span>Connections</span>
        </a>
      </li>
      <li data-current={location.pathname.includes('security') ? 'page' : ''}>
        <a onClick={() => navigate('/profile/security')}>
          <Shield className="icon" />
          <span>Security</span>
        </a>
      </li>
    </ul>
  );
};

const LegalLinks = () => (
  <div className={styles.legalLinks}>
    <RouterLink to={`${import.meta.env.VITE_LANDING}/privacy`}>
      Privacy
    </RouterLink>
    <span>-</span>
    <RouterLink to={`${import.meta.env.VITE_LANDING}/terms`}>Terms</RouterLink>
  </div>
);

const Nav = () => {
  const dispatch = useAppDispatch();
  const ulRef = useRef(null);
  const [updatePill, setUpdatePill] = useState(0);
  const [settingsSubOpen, setSettingsSubOpen] = useState(false);

  const { screenSize } = useScreenContext();
  const { isDark } = useColorScheme();
  const backgroundColor = useSchemeVar('--btn-feather-light-gray');
  const navigate = useNavigate();
  const location = useLocation();

  const [props] = usePillAnimation({
    ref: ulRef,
    update: [location.pathname, updatePill, isDark],
    refresh: [screenSize],
    querySelectall: 'li',
    find: (el, index) => el.getAttribute('data-current') === 'page',
    styles: {
      backgroundColor: backgroundColor,
      borderRadius: '8px',
    },
  });

  useEffect(() => {
    // Set resize observer so that when ulRef changes size, the pill updates
    if (!ulRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setUpdatePill((prev) => prev + 1);
    });
    resizeObserver.observe(ulRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ulRef.current]);

  useEffect(() => {
    setSettingsSubOpen(location.pathname.includes('profile'));
  }, [location.pathname]);

  return (
    <nav className={styles.sideNav} data-size={screenSize}>
      <div className={styles.logoIcon}>
        <LedgetLogoIcon darkMode={isDark} />
      </div>
      <ul ref={ulRef} role="menu">
        <li data-current={location.pathname.includes('budget') ? 'page' : ''}>
          <a
            onClick={() => {
              navigate('budget');
            }}
          >
            <DollarSign className="icon" />
            <span>Budget</span>
          </a>
        </li>
        <li data-current={location.pathname.includes('accounts') ? 'page' : ''}>
          <a
            onClick={() => {
              navigate('accounts/deposits');
            }}
          >
            <Institution className="icon" />
            <span>Accounts</span>
          </a>
        </li>
        <li data-current={location.pathname.includes('profile') ? 'page' : ''}>
          <a
            onClick={() => {
              navigate('/profile');
            }}
          >
            <User className="icon" />
            <span>Profile</span>
            <ChevronDown className="icon" strokeWidth={2} />
          </a>
        </li>
        {settingsSubOpen && <SubProfileSidebar />}
        <animated.span style={props} />
      </ul>
      <ul>
        <li>
          <a onClick={() => dispatch(setModal({ name: 'help' }))}>
            <LifeBuoy className="icon" />
            <span>Help</span>
          </a>
        </li>
        <li>
          <a
            onClick={() =>
              dispatch(
                setModal({ name: 'logout', args: { fromTimeout: false } })
              )
            }
          >
            <LogOut className="icon" />
            <span>Logout</span>
          </a>
        </li>
      </ul>
      <LegalLinks />
    </nav>
  );
};

const Sidebar = () => {
  const { screenSize } = useScreenContext();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const hidingSidebarRef = useRef(null);
  const location = useLocation();
  const { isDark } = useColorScheme();

  useCloseDropdown({
    visible: open,
    setVisible: setOpen,
    refs: [buttonRef, hidingSidebarRef],
  });

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return ['small', 'extra-small', 'medium'].includes(screenSize) ? (
    <>
      <div className={styles.hamburger}>
        <button
          onClick={() => {
            setOpen(!open);
          }}
          ref={buttonRef}
          aria-label="Open Sidebar"
          aria-expanded={open}
          aria-controls="hiding-sidebar"
          aria-haspopup="true"
        >
          <Hamburger size={'1.5em'} strokeWidth={2} />
        </button>
      </div>
      <div
        id="hiding-sidebar"
        className={styles.hidingSidebar}
        ref={hidingSidebarRef}
        data-open={open}
      >
        <Nav />
      </div>
      <div
        className={styles.hidingSidebarBackdrop}
        data-open={open}
        data-dark={isDark}
      />
    </>
  ) : (
    <Nav />
  );
};

export default Sidebar;
