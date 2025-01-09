import { useEffect, useState, useRef } from 'react';

import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Plus } from '@geist-ui/icons';

import styles from './styles/header.module.scss';
import {
  CircleIconButton,
  useCloseDropdown,
  Tooltip,
  ExpandButton,
  useScreenContext,
  TextButton,
  DropdownDiv,
} from '@ledget/ui';
import Calendar from './Calendar';

const Header = ({
  collapsed,
  setCollapsed,
  showCalendarIcon = false,
}: {
  collapsed: boolean;
  showCalendarIcon: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [searchParams] = useSearchParams();
  const selectedDate = new Date(
    parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
    parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1
  );
  const calendarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { screenSize } = useScreenContext();

  useEffect(() => {
    if (showCalendar) {
      calendarRef.current?.focus();
    }
  }, [showCalendar]);

  useCloseDropdown({
    refs: [dropdownRef, buttonRef],
    visible: showCalendar,
    setVisible: setShowCalendar,
  });

  return (
    <div
      className={styles.header}
      data-show-calendar={showCalendar}
      data-size={screenSize}
    >
      <DropdownDiv
        placement="left"
        verticlePlacement="top"
        visible={showCalendar}
        ref={dropdownRef}
      >
        <Calendar ref={calendarRef} />
      </DropdownDiv>
      <TextButton
        onClick={() => setShowCalendar(!showCalendar)}
        tabIndex={0}
        aria-label="Show calendar"
        disabled={screenSize !== 'extra-small'}
        ref={buttonRef}
      >
        <h4>
          {selectedDate.toLocaleString('en-us', { month: 'short' })}&nbsp;
          {selectedDate.getFullYear()}
        </h4>
      </TextButton>
      <div>
        <Tooltip msg={collapsed ? 'Expand' : 'Collapse'}>
          <ExpandButton
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            flipped={collapsed}
          />
        </Tooltip>
        <Tooltip msg="Add bill">
          <CircleIconButton
            onClick={() => {
              navigate({
                pathname: '/budget/new-bill',
                search: location.search,
              });
            }}
            aria-label="Add bill"
          >
            <Plus size="1em" />
          </CircleIconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Header;
