import { useEffect, useState, useRef } from 'react';

import { useAppSelector } from '@hooks/store';
import { RotateCw } from '@geist-ui/icons';

import styles from './styles/bills.module.scss';
import {
  useGetBillsQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';
import { EditBudgetBills } from '@modals/index';
import { useScreenContext, Window } from '@ledget/ui';
import Calendar from './Calendar';
import Header from './Header';
import SkeletonBills from './Skeleton';
import List from './List';

const BillsWindow = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { isLoading } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );
  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const { screenSize } = useScreenContext();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setShowCalendar(ref.current?.clientWidth! > 800);
    const observer = new ResizeObserver(() => {
      if (ref.current?.clientWidth! > 800) {
        setShowCalendar(true);
      } else {
        setShowCalendar(false);
      }
    });
    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref.current]);

  return (
    <>
      <div className={styles.bills} data-collapsed={collapsed} ref={ref}>
        <h3>
          <RotateCw className="icon" />
          Bills
        </h3>
        <Window
          className={styles.container}
          data-collapsed={collapsed}
          data-size={screenSize}
        >
          <Header
            showCalendarIcon={!showCalendar}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <div>
            {showCalendar && <Calendar />}
            {isLoading ? <SkeletonBills /> : <List collapsed={collapsed} />}
          </div>
        </Window>
      </div>
      {modal && <EditBudgetBills onClose={() => setModal(false)} />}
    </>
  );
};

export default BillsWindow;
