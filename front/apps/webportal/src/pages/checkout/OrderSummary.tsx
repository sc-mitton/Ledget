import dayjs from 'dayjs';

import styles from './styles/order-summary.module.scss';
import { DollarCents } from '@ledget/ui';
import { getDaySuffix } from '@ledget/helpers';

const OrderSummary = ({
  unit_amount,
  trial_period_days
}: {
  unit_amount?: number;
  trial_period_days?: number;
}) => {
  const firstCharge = dayjs().add(trial_period_days || 0, 'day');

  return (
    <>
      <h4>Summary</h4>
      <hr className={styles.line} />
      <div className={styles.orderSummary}>
        <table>
          <tbody>
            <tr>
              <td>First Charge:</td>
              <td>
                {firstCharge.format('MMM, D')}
                {getDaySuffix(firstCharge.date())}
              </td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>
                <DollarCents value={unit_amount || 0} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderSummary;
