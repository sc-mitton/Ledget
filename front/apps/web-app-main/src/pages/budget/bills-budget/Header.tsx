import { useEffect, useState, useRef } from 'react';

import { useSearchParams } from 'react-router-dom';

import styles from './styles/header.module.scss';
import { useCloseDropdown, DropdownDiv } from '@ledget/ui';
import Calendar from './Calendar';

const Header = () => {
  const [searchParams] = useSearchParams();
  const selectedDate = new Date(
    parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
    parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1
  );
  const calendarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);

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
    <div className={styles.header} data-show-calendar={showCalendar}>
      <DropdownDiv
        placement="left"
        verticlePlacement="top"
        visible={showCalendar}
        ref={dropdownRef}
      >
        <Calendar ref={calendarRef} />
      </DropdownDiv>
      <h4>
        {selectedDate.toLocaleString('en-us', { month: 'short' })}&nbsp;
        {selectedDate.getFullYear()}
      </h4>
    </div>
  );
};

export default Header;
