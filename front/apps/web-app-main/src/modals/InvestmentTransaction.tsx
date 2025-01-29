import Big from 'big.js';
import { ArrowUpRight, ArrowDownLeft } from '@geist-ui/icons';
import dayjs from 'dayjs';

import styles from './styles/investment-transaction.module.scss';
import { withModal, DollarCents } from '@ledget/ui';
import type { InvestmentTransaction as InvestmentTransactionT } from '@ledget/shared-features';

const InvestmentTransaction = withModal<{ item: InvestmentTransactionT }>(
  (props) => {
    return (
      <div>
        <div className={styles.header}>
          <h1>
            <DollarCents
              value={Big(props.item?.amount || 0)
                .times(100)
                .toNumber()}
            />
          </h1>
          <div>
            <div>
              {props.item.name?.toLowerCase().includes('buy') && (
                <ArrowDownLeft className="icon" strokeWidth={2} />
              )}
              {props.item.name?.toLowerCase().includes('sell') && (
                <ArrowUpRight className="icon" strokeWidth={2} />
              )}
            </div>
            <h4>{props.item.name}</h4>
          </div>
        </div>
        <div className={styles.boxes}>
          {(props.item.price ||
            props.item.quantity ||
            props.item.fees ||
            props.item.date) && (
            <div>
              {props.item.date !== undefined && (
                <>
                  <div>Date</div>
                  <div>{dayjs(props.item.date).format('MMM D, YYYY')}</div>
                </>
              )}
              {props.item.price !== undefined && (
                <>
                  <div>Price</div>
                  <div>${props.item.price}</div>
                </>
              )}
              {props.item.quantity !== undefined && (
                <>
                  <div>Quantity</div>
                  <div>{props.item.quantity}</div>
                </>
              )}
              {props.item.fees !== undefined && (
                <>
                  <div>Fees</div>
                  <div>${props.item.fees}</div>
                </>
              )}
            </div>
          )}
          {(props.item.type || props.item.subtype) && (
            <div>
              {props.item.quantity !== undefined && (
                <>
                  <div>Type</div>
                  <div>{props.item.type}</div>
                </>
              )}
              {props.item.fees !== undefined && (
                <>
                  <div>Sub Type</div>
                  <div>{props.item.subtype}</div>
                </>
              )}
            </div>
          )}
          {(props.item.security.name || props.item.security.ticker_symbol) && (
            <div>
              {props.item.security.name !== undefined && (
                <>
                  <div>Security Name</div>
                  <div>{props.item.security.name}</div>
                </>
              )}
              {props.item.security.ticker_symbol !== undefined && (
                <>
                  <div>Ticker</div>
                  <div>{props.item.security.ticker_symbol}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
export default InvestmentTransaction;
