import { useState, useRef } from 'react';

import { useAppSelector } from '@hooks/store';
import { Plus, RotateCw } from '@geist-ui/icons';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import styles from './styles/bills.module.scss';
import {
  useGetBillsQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';
import { Filter2 } from '@ledget/media';
import { EditBudgetBills } from '@modals/index';
import { IconButtonBorderedGray, useScreenContext, Window } from '@ledget/ui';
import Calendar from './Calendar';
import SkeletonBills from './Skeleton';
import List from './List';

const BillsWindow = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { isLoading } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );
  const ref = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState(false);
  const { screenSize } = useScreenContext();
  const [searchParams] = useSearchParams();
  const selectedDate = new Date(
    parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
    parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1
  );
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.bills} ref={ref}>
        <div className={styles.header}>
          <h3>
            <RotateCw className="icon" />
            Bills
          </h3>
          <div className={styles.headerButtons}>
            <IconButtonBorderedGray>
              <Filter2 className="icon" />
            </IconButtonBorderedGray>
            <IconButtonBorderedGray
              onClick={() => navigate(`/budget/new-bill${location.search}`)}
            >
              <Plus className="icon" />
            </IconButtonBorderedGray>
          </div>
        </div>
        <Window className={styles.container}>
          {!['extra-small', 'small'].includes(screenSize) && (
            <div className={styles.header}>
              <h4>
                {selectedDate.toLocaleString('en-us', { month: 'short' })}&nbsp;
                {selectedDate.getFullYear()}
              </h4>
            </div>
          )}
          <div>
            {!['extra-small', 'small'].includes(screenSize) && <Calendar />}
            {isLoading ? <SkeletonBills /> : <List />}
          </div>
        </Window>
      </div>
      {modal && <EditBudgetBills onClose={() => setModal(false)} />}
    </>
  );
};

export default BillsWindow;
