import React, { useState } from 'react';
import Big from 'big.js';
import { AlertCircle } from '@geist-ui/icons';

import { HashLink } from 'react-router-hash-link';

import styles from './styles/carousel-view.module.scss';
import { MonthPicker } from './MonthPicker';
import { useAppSelector } from '@hooks/store';
import { AnimatedDollarCents } from '@ledget/ui';
import {
  selectBudgetMonthYear,
  selectCategoryMetaData,
  selectBillMetaData,
  useGetCategoriesQuery,
  useGetBillsQuery
} from '@ledget/shared-features';
import { useColorScheme } from '@ledget/ui';

export const BudgetSummary = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  const { isLoading: loadingCategories } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );
  const { isLoading: loadingBills } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );
  const {
    monthly_spent,
    yearly_spent,
    limit_amount_monthly,
    limit_amount_yearly
  } = useAppSelector(selectCategoryMetaData);
  const {
    monthly_bills_paid,
    yearly_bills_paid,
    number_of_monthly_bills,
    number_of_yearly_bills
  } = useAppSelector(selectBillMetaData);

  const { isDark } = useColorScheme();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const updateCarouselIndex = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    const width = target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCarouselIndex(index);
  };

  return (
    <>
      <div className={styles.container}>
        <div>
          <MonthPicker darkMode={isDark} />
        </div>
        <div className={styles.slider}>
          <div className={styles.slides} onScroll={updateCarouselIndex}>
            <div id="slide-1">
              <div>
                <AnimatedDollarCents
                  value={
                    loadingCategories || loadingBills
                      ? 0
                      : Big(yearly_spent).add(monthly_spent).toNumber()
                  }
                />
              </div>
              <span>total spending</span>
            </div>
            <div id="slide-2">
              <div>
                <AnimatedDollarCents
                  value={Big(limit_amount_monthly || 0)
                    .minus(monthly_spent)
                    .toNumber()}
                  withCents={false}
                />
              </div>
              <div>
                {Big(limit_amount_monthly || 0)
                  .minus(monthly_spent)
                  .toNumber() <= 0 ? (
                  <>
                    <span>over monthly limit</span>
                    <AlertCircle size={'1.125em'} />
                  </>
                ) : (
                  <span>monthly spending left</span>
                )}
              </div>
            </div>
            <div id="slide-3">
              <div>
                <AnimatedDollarCents
                  value={
                    Big(limit_amount_yearly || 0)
                      .minus(yearly_spent)
                      .toNumber() || 0
                  }
                  withCents={false}
                />
              </div>
              <div>
                {Big(limit_amount_yearly || 0)
                  .minus(yearly_spent)
                  .toNumber() <= 0 ? (
                  <>
                    <span>over yearly limit</span>
                    <AlertCircle size={'1.125em'} />
                  </>
                ) : (
                  <span>yearly spending left</span>
                )}
              </div>
            </div>
            <div id="slide-4">
              <div>
                {monthly_bills_paid + yearly_bills_paid}/
                {number_of_monthly_bills + number_of_yearly_bills}
              </div>
              <div>
                <span>bills paid</span>
              </div>
            </div>
          </div>
          <div className={styles.jumpLinks}>
            {Array.from({ length: 4 }, (_, i) => i).map((i) => (
              <HashLink
                smooth
                scroll={(el) =>
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                to={`#slide-${i + 1}`}
                key={`carousel-${i}`}
                data-active={carouselIndex === i}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetSummary;
