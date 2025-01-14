import { useEffect } from 'react';

import { Outlet } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import styles from './styles/window.module.scss';
import { SpendingCategories } from './categories-budget';
import { MonthPicker } from './MonthPicker';
import { Bills } from './bills-budget';
import { setConfirmedTransactionFilter } from '@ledget/shared-features';
import { useAppDispatch } from '@hooks/store';
import { useScreenContext, MainWindow } from '@ledget/ui';
import { useColorScheme } from '@ledget/ui';

function Window() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { screenSize } = useScreenContext();
  const { isDark } = useColorScheme();

  useEffect(() => {
    // On mount set month and date to current date and month
    if (!searchParams.get('month') || !searchParams.get('year')) {
      const year =
        sessionStorage.getItem(`budget-year`) || new Date().getFullYear();
      const month =
        sessionStorage.getItem(`budget-month`) || new Date().getMonth() + 1;

      searchParams.set('month', `${month}`);
      searchParams.set('year', `${year}`);
    }

    setSearchParams(searchParams);
  }, []);

  // Update session store month and year when pathnames change
  useEffect(() => {
    const year = parseInt(
      searchParams.get('year') || `${new Date().getFullYear()}`
    );
    const month = parseInt(
      searchParams.get('month') || `${new Date().getMonth() + 1}`
    );
    sessionStorage.setItem(`budget-month`, `${month}`);
    sessionStorage.setItem(`budget-year`, `${year}`);

    // Dispatch filter
    dispatch(
      setConfirmedTransactionFilter({
        date_range: [
          Math.floor(new Date(year, month - 1, 1).getTime() / 1000),
          Math.floor(new Date(year, month, 0).getTime() / 1000),
        ],
      })
    );
  }, [searchParams.get('year'), searchParams.get('month')]);

  return (
    <>
      <MainWindow className={styles.window} data-size={screenSize}>
        <div className={styles.header} data-screen-size={screenSize}>
          <MonthPicker
            darkMode={isDark}
            placement={
              ['medium', 'small', 'extra-small'].includes(screenSize)
                ? 'middle'
                : 'left'
            }
            size="medium"
          />
        </div>
        <div>
          <SpendingCategories />
          <Bills />
        </div>
      </MainWindow>
      <Outlet />
    </>
  );
}

export default Window;
