import { useState, useRef, useEffect } from 'react';
import Lottie from 'react-lottie';
import { Dayjs } from 'dayjs';

import { filter } from '@ledget/media/lotties';
import styles from './styles/transactions-filter.module.scss';
import { DatePicker, DropdownDiv, useCloseDropdown } from '@ledget/ui';

const Filter = ({
  value,
  onChange,
}: {
  value?: [Dayjs, Dayjs];
  onChange: React.Dispatch<React.SetStateAction<[Dayjs, Dayjs] | undefined>>;
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [animate, setAnimate] = useState(false);

  useCloseDropdown({
    refs: [ref, buttonRef],
    visible: showDropDown,
    setVisible: setShowDropDown,
  });

  useEffect(() => {
    if (value && value.length && showDropDown) {
      setShowDropDown(false);
    }
  }, [value]);

  const animationOptions = {
    loop: false,
    autoplay: animate,
    animationData: filter,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={styles.filter} ref={ref}>
      <button
        onMouseEnter={() => setAnimate(true)}
        onMouseLeave={() => setAnimate(false)}
        onClick={() => setShowDropDown(!showDropDown)}
        aria-label="Filter transactions"
        aria-haspopup="true"
        aria-expanded={showDropDown}
        aria-controls="transactions-filter-dropdown"
        className={styles.filterButton}
        data-filtered={isFiltered}
        ref={buttonRef}
      >
        <Lottie
          options={animationOptions}
          speed={animate ? 2 : 20000}
          direction={animate ? 1 : -1}
          style={{ width: 24, height: 24 }}
        />
      </button>
      <DropdownDiv
        placement="right"
        id="transactions-filter-dropdown"
        visible={showDropDown}
        className={styles.datePickerDropdown}
      >
        <DatePicker
          pickerType="range"
          placement="right"
          verticlePlacement="bottom"
          aria-label="Filter transactions"
          placeholder={['Start', 'End']}
          defaultValue={value}
          onChange={(date) => {
            onChange(date);
            date && date.length ? setIsFiltered(true) : setIsFiltered(false);
          }}
        />
      </DropdownDiv>
    </div>
  );
};

export default Filter;
