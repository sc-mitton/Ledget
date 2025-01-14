import { HTMLProps, useState, useRef, useEffect, Fragment } from 'react';

import { Tab } from '@headlessui/react';
import Lottie from 'react-lottie';

import styles from './dropdown.module.scss';
import {
  DropdownDiv,
  useCloseDropdown,
  TabNavList,
  useScreenContext,
  useColorScheme,
} from '@ledget/ui';
import { activity } from '@ledget/media/lotties';
import {
  selectNotificationsTabIndex,
  setNotificationsTabIndex,
} from '@features/uiSlice';
import {
  useGetTransactionsCountQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { NeedsConfirmationStack } from './needs-confirmation/Stack';
import { History } from './history/History';

const ActivityDropdown = (props: HTMLProps<HTMLDivElement>) => {
  const dispatch = useAppDispatch();

  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: tCountData } = useGetTransactionsCountQuery(
    { confirmed: false, month, year },
    { skip: !month || !year }
  );
  const notificationTabIndex = useAppSelector(selectNotificationsTabIndex);
  const [animate, setAnimate] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tabIndex, setTabIndex] = useState(notificationTabIndex);
  const { screenSize } = useScreenContext();
  const { isDark } = useColorScheme();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const animationOptions = {
    loop: false,
    autoplay: animate,
    animationData: activity,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useCloseDropdown({
    refs: [dropdownRef, buttonRef],
    visible: showDropdown,
    setVisible: setShowDropdown,
  });

  // track tab index in redux
  useEffect(() => {
    tabIndex && dispatch(setNotificationsTabIndex(tabIndex));
  }, [tabIndex]);

  return (
    <div {...props} className={styles.activityDropdown}>
      <button
        ref={buttonRef}
        data-screen-size={screenSize}
        onMouseEnter={() => setAnimate(true)}
        onMouseLeave={() => setAnimate(false)}
        data-active={Boolean(tCountData?.count)}
        data-dark={isDark}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Lottie
          options={animationOptions}
          speed={animate ? 2 : 1000}
          direction={animate ? 1 : -1}
          style={{ width: 24, height: 24 }}
        />
        <span />
      </button>
      <div data-screen-size={screenSize}>
        <DropdownDiv
          ref={dropdownRef}
          placement="right"
          className={styles.activityDropdownMenu}
          visible={showDropdown}
        >
          <Tab.Group
            as={Fragment}
            defaultIndex={tabIndex}
            onChange={setTabIndex}
          >
            {({ selectedIndex }) => (
              <>
                <div className={styles.activityDropdownHeader}>
                  <div>
                    <TabNavList
                      selectedIndex={selectedIndex}
                      labels={[`${tCountData?.count || 0} New`, 'History']}
                    />
                  </div>
                </div>
                <Tab.Panel>
                  <NeedsConfirmationStack />
                </Tab.Panel>
                <Tab.Panel>
                  <History />
                </Tab.Panel>
              </>
            )}
          </Tab.Group>
        </DropdownDiv>
      </div>
    </div>
  );
};

export default ActivityDropdown;
