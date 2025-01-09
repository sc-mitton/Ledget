import { Fragment, useState } from 'react';

import { Tab } from '@headlessui/react';
import dayjs from 'dayjs';
import { AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from '@geist-ui/icons';

import styles from './styles/edit-budget-items.module.scss';
import {
  TransformedBill,
  useGetBillsQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';
import { BillModalContent } from '@modals/index';
import { getOrderSuffix } from '@ledget/helpers';
import {
  withModal,
  TabNavList,
  BillCatLabel,
  DollarCents,
  SlideMotionDiv,
  BackButton,
  FilterPillButton,
  NestedWindow2,
} from '@ledget/ui';
import { useAppSelector } from '@hooks/store';

const getScheduleDescription = (
  day?: number,
  week?: number,
  weekDay?: number,
  month?: number,
  year?: number
) => {
  if (day && month && year) {
    return dayjs()
      .date(day)
      .month(month - 1)
      .year(year)
      .format('MMMM Do, YYYY');
  } else if (day && month) {
    return dayjs()
      .date(day)
      .month(month - 1)
      .format('MMMM Do');
  } else if (day) {
    return `${day}${getOrderSuffix(day)} of the month`;
  } else if (week && weekDay) {
    return `Every ${week}${getOrderSuffix(week)} ${dayjs()
      .day(weekDay)
      .format('dddd')}`;
  }
};

const Bills = ({
  period,
  onBillClick,
  billOrder,
}: {
  period: 'month' | 'year';
  onBillClick: (bill: TransformedBill) => void;
  billOrder?: 'amount-desc' | 'amount-asc' | 'alpha-desc' | 'alpha-asc';
}) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: bills } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );

  return (
    <div className={styles.viewAllBills} key="all-bills">
      {bills?.filter((b) => b.period === period)?.length === 0 ? (
        <div style={{ opacity: 0.5 }}>No {period}ly bills to display</div>
      ) : (
        <div className={styles.billsGrid}>
          {bills
            ?.filter((b) => b.period === period)
            .sort((a, b) => {
              if (billOrder === 'amount-desc') {
                return a.upper_amount - b.upper_amount;
              } else if (billOrder === 'amount-asc') {
                return b.upper_amount - a.upper_amount;
              } else if (billOrder === 'alpha-desc') {
                return b.name.localeCompare(a.name);
              } else if (billOrder === 'alpha-asc') {
                return a.name.localeCompare(b.name);
              } else {
                return 0;
              }
            })
            .map((bill) => (
              <>
                <div>
                  <BillCatLabel
                    key={bill.id}
                    labelName={bill.name}
                    emoji={bill.emoji}
                    color={bill.period === 'month' ? 'blue' : 'green'}
                    onClick={() => onBillClick(bill)}
                  />
                </div>
                <div>
                  <div>
                    {bill.lower_amount ? (
                      <div>
                        <DollarCents value={bill.lower_amount} /> -{' '}
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {bill.upper_amount ? (
                      <div>
                        <DollarCents value={bill.upper_amount} />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {
                    <div>
                      {getScheduleDescription(
                        bill.day,
                        bill.week,
                        bill.week_day,
                        bill.month,
                        bill.year
                      )}
                    </div>
                  }
                </div>
              </>
            ))}
        </div>
      )}
    </div>
  );
};

const EditBills = withModal((props) => {
  const [inspectedBill, setInspectedBill] = useState<TransformedBill>();
  const [order, setOrder] = useState<
    'amount-desc' | 'amount-asc' | 'alpha-desc' | 'alpha-asc'
  >();

  return (
    <AnimatePresence mode="wait">
      {!inspectedBill ? (
        <SlideMotionDiv key="view-all-bills" position="first">
          <h2>Bills</h2>
          <Tab.Group
            as={NestedWindow2}
            className={styles.viewAllBillsContainer}
          >
            {({ selectedIndex }) => (
              <>
                <div>
                  <TabNavList
                    selectedIndex={selectedIndex}
                    labels={['Month', 'Year']}
                  />
                </div>
                <Tab.Panels as={Fragment}>
                  <Tab.Panel as={Fragment}>
                    <Bills
                      period={'month'}
                      onBillClick={setInspectedBill}
                      billOrder={order}
                    />
                  </Tab.Panel>
                  <Tab.Panel as={Fragment}>
                    <Bills
                      period={'year'}
                      onBillClick={setInspectedBill}
                      billOrder={order}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </>
            )}
          </Tab.Group>
          <div className={styles.orderButtons}>
            <FilterPillButton
              onClick={() => {
                order === 'amount-desc'
                  ? setOrder('amount-asc')
                  : order === 'amount-asc'
                  ? setOrder(undefined)
                  : setOrder('amount-desc');
              }}
              selected={order === 'amount-desc' || order === 'amount-asc'}
            >
              <span>$</span>
              {order === 'amount-desc' ? (
                <ArrowUp size={'1em'} />
              ) : (
                <ArrowDown size={'1em'} />
              )}
            </FilterPillButton>
            <FilterPillButton
              selected={order === 'alpha-desc' || order === 'alpha-asc'}
              onClick={() => {
                order === 'alpha-desc'
                  ? setOrder(undefined)
                  : order === 'alpha-asc'
                  ? setOrder('alpha-desc')
                  : setOrder('alpha-asc');
              }}
            >
              {order === 'alpha-desc' ? 'z-a' : 'a-z'}
            </FilterPillButton>
          </div>
        </SlideMotionDiv>
      ) : (
        <SlideMotionDiv
          className={styles.inspectBillContainer}
          key={inspectedBill.id}
          position="last"
        >
          <BackButton onClick={() => setInspectedBill(undefined)} />
          <BillModalContent
            bill={inspectedBill}
            onClose={() => setInspectedBill(undefined)}
          />
        </SlideMotionDiv>
      )}
    </AnimatePresence>
  );
});

const EditBudgetCategoriesModal = ({ onClose }: { onClose: () => void }) => {
  const props = { maxWidth: '25em', onClose };
  return <EditBills {...props} />;
};

export default EditBudgetCategoriesModal;
