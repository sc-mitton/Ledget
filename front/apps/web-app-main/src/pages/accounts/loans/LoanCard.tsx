import { AlertCircle, Calendar } from '@geist-ui/icons';
import Big from 'big.js';
import dayjs from 'dayjs';

import { StudentLoan, Mortgage } from '@ledget/shared-features';
import { InstitutionLogo } from '@components';
import { DollarCents, useColorScheme } from '@ledget/ui';
import styles from './styles/loan-card.module.scss';

const MAX_LIGHT_MODE_OPACITY = 0.6;
const MAX_DARK_MODE_OPACITY = 1;

const LoanCard = ({ liability }: { liability: Mortgage | StudentLoan }) => {
  const daysSinceStart = dayjs().diff(dayjs(liability.origination_date), 'day');
  const loanLength = dayjs(
    liability.expected_payoff_date || liability.last_payment_date
  ).diff(dayjs(liability.origination_date), 'day');
  const { isDark } = useColorScheme();

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <div>
          {liability.is_overdue && (
            <div className={styles.overdueContainer}>
              <AlertCircle size={16} className={styles.alertIcon} />
              <span className={styles.overdueText}>Overdue</span>
            </div>
          )}
          <h2 className={styles.title}>{liability.name}</h2>
          <span className={styles.subtitle}>
            {liability.subtype.charAt(0).toUpperCase() +
              liability.subtype.slice(1)}
            &nbsp;
            {liability.type.charAt(0).toUpperCase() + liability.type.slice(1)}
          </span>
        </div>
        <div className={styles.logo}>
          <InstitutionLogo accountId={liability.account_id} size={'1.75em'} />
        </div>
      </div>
      <hr className={styles.separator} />
      {!liability.product_not_supported ? (
        <>
          <div className={styles.middleRow}>
            <div className={styles.middleRowCell}>
              <span className={styles.label}>Principal</span>
              <DollarCents
                bold
                withCents={false}
                value={Big(liability.origination_principal_amount || 0)
                  .times(100)
                  .toNumber()}
              />
            </div>
            <div className={styles.middleRowCell}>
              <span className={styles.label}>Min. Payment</span>
              {liability.minimum_payment_amount ? (
                <DollarCents
                  bold
                  value={Big(liability.minimum_payment_amount)
                    .times(100)
                    .toNumber()}
                />
              ) : (
                <span className={styles.dash}>&mdash;</span>
              )}
            </div>
            <div className={styles.middleRowCell}>
              <span className={styles.label}>Rate</span>
              {liability.interest_rate_percentage ? (
                <span
                  className={styles.bold}
                >{`${liability.interest_rate_percentage}%`}</span>
              ) : (
                <span className={styles.dash}>&mdash;</span>
              )}
            </div>
          </div>
          <div className={styles.progressBars}>
            {Array.from({ length: 4 }, (_, i) => {
              const lastFraction = i / 4;
              const fraction = (i + 1) / 4;
              const progress = daysSinceStart / loanLength;
              const partialProgress =
                progress > lastFraction && progress < fraction
                  ? (progress - lastFraction) / (fraction - lastFraction)
                  : undefined;
              return (
                <div
                  key={i}
                  className={styles.progressBar}
                  style={{
                    backgroundColor:
                      progress > lastFraction
                        ? liability.institution.primary_color
                        : 'var(--menu-separator)',
                    opacity: partialProgress
                      ? (isDark
                          ? MAX_DARK_MODE_OPACITY
                          : MAX_LIGHT_MODE_OPACITY) * partialProgress
                      : isDark
                      ? MAX_DARK_MODE_OPACITY
                      : MAX_LIGHT_MODE_OPACITY,
                  }}
                />
              );
            })}
          </div>
          <div className={styles.dates}>
            <span>{dayjs(liability.origination_date).format('M/D/YY')}</span>
            <span>
              {dayjs(
                liability.expected_payoff_date || liability.last_payment_date
              ).format('M/D/YY')}
            </span>
          </div>
          <hr className={styles.separator} />
          <div className={styles.lastPayment}>
            <Calendar size={16} />
            <span>
              Last payment on{' '}
              {dayjs(liability.last_payment_date).format('MMM D, YYYY')}
            </span>
          </div>
        </>
      ) : (
        <div className={styles.noData}>No data available</div>
      )}
    </div>
  );
};

export default LoanCard;
