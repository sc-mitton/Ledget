import { useEffect, useRef, useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { animated } from '@react-spring/web';

import styles from './styles/nav.module.scss';
import { CreditCard, Clock, TrendingUp, X } from '@geist-ui/icons';

import {
  usePillAnimation,
  useSchemeVar,
  useScreenContext,
  RefreshButton,
  useColorScheme,
} from '@ledget/ui';
import {
  popToast,
  useGetAccountsQuery,
  useTransactionsSyncMutation,
} from '@ledget/shared-features';
import { useAppDispatch } from '@hooks/store';
import { CurrencyNote } from '@ledget/media';

const _getNavIcon = (key = '', isCurrent: boolean) => {
  switch (key) {
    case 'deposits':
      return <CurrencyNote stroke={'currentColor'} size={'1.5em'} />;
    case 'credit':
      return <CreditCard stroke={'currentColor'} className="icon" />;
    case 'investments':
      return <TrendingUp stroke={'currentColor'} className="icon" />;
    case 'loans':
      return <Clock stroke={'currentColor'} className="icon" />;
    default:
      return null;
  }
};

const _getNavLabel = (key = '') => {
  switch (key) {
    case 'deposits':
      return 'Deposits';
    case 'credit':
      return 'Credit';
    case 'investments':
      return 'Investments';
    case 'loans':
      return 'Loans';
    default:
      return null;
  }
};

const TabButtons = ({ showFilters = false }) => {
  const ref = useRef(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[2];
  const { screenSize } = useScreenContext();
  const { isDark } = useColorScheme();
  const [blueMedium, blueSat] = useSchemeVar(['--blue-medium', '--blue-sat']);
  const [updatePill, setUpdatePill] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUpdatePill(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [showFilters]);

  const [props] = usePillAnimation({
    ref: ref,
    update: [location.pathname, windowWidth, updatePill],
    querySelectall: '[role=link]',
    find: (element) => element.getAttribute('aria-current') === 'true',
    styles: {
      backgroundColor: isDark ? blueMedium : blueSat,
      borderRadius: 'var(--border-radius5)',
    },
  });

  // Resize observer to update nav pill when responsive layout changes
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        setWindowWidth(newWidth);
      }
    });

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className={`${screenSize}`}>
        <ul ref={ref} data-screen-size={screenSize}>
          {['deposits', 'credit', 'investments', 'loans'].map((path) => (
            <li
              key={path}
              role="link"
              aria-current={currentPath === path}
              tabIndex={0}
              data-screen-size={screenSize}
              onClick={() =>
                location.pathname !== `/accounts/${path}` &&
                navigate(`/accounts/${path}`)
              }
            >
              {_getNavIcon(path, currentPath === path)}
              <span>{_getNavLabel(path)}</span>
            </li>
          ))}
          <animated.span style={props} />
        </ul>
      </div>
    </>
  );
};

export const Nav = () => {
  const [
    syncTransactions,
    {
      isSuccess: isTransactionsSyncSuccess,
      isError: isTransactionsSyncError,
      data: syncResult,
      isLoading: isSyncing,
    },
  ] = useTransactionsSyncMutation();
  const dispatch = useAppDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const { isDark } = useColorScheme();

  // Dispatch synced toast
  useEffect(() => {
    if (isTransactionsSyncSuccess) {
      dispatch(
        popToast({
          type: 'success',
          message: `Synced${
            syncResult?.added
              ? `, ${syncResult?.added} new transactions`
              : ' successfully'
          }`,
        })
      );
    }
  }, [isTransactionsSyncSuccess]);

  // Dispatch synced error toast
  useEffect(() => {
    if (isTransactionsSyncError) {
      dispatch(
        popToast({
          type: 'error',
          message: 'There was an error syncing your transactions',
        })
      );
    }
  }, [isTransactionsSyncError]);

  return (
    <div className={styles.accountsNav}>
      <div data-dark={isDark}>
        <TabButtons showFilters={showFilters} />
        <RefreshButton
          stroke={'var(--m-text)'}
          loading={isSyncing}
          onClick={() => {
            syncTransactions({});
          }}
        />
      </div>
    </div>
  );
};
