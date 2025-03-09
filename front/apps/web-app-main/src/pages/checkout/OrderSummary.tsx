import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import styles from './styles/order-summary.module.scss';
import { DollarCents } from '@ledget/ui';
import { getOrderSuffix } from '@ledget/helpers';
import { useCheckout } from './Context';
import { useGetPricesQuery } from '@ledget/shared-features';

const OrderSummary = () => {
  const { price } = useCheckout();
  const { data: prices } = useGetPricesQuery();
  const [trial_period_days, setTrialPeriodDays] = useState(0);
  const [unit_amount, setUnitAmount] = useState(0);

  useEffect(() => {
    if (prices) {
      const foundPrice = prices.find((p) => p.id === price);
      setTrialPeriodDays(foundPrice?.metadata.trial_period_days || 0);
      setUnitAmount(foundPrice?.unit_amount || 0);
    }
  }, [prices]);

  const firstCharge = dayjs().add(trial_period_days || 0, 'day');
  return (
    <div className={styles.container}>
      <span>Summary</span>
      <hr className={styles.line} />
      <div className={styles.orderSummary}>
        <table>
          <tbody>
            <tr>
              <td>First Charge</td>
              <td>
                {firstCharge.format('MMM, D')}
                {getOrderSuffix(firstCharge.date())}
              </td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>
                <DollarCents value={unit_amount || 0} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderSummary;
