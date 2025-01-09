import { useState, useRef, useEffect } from 'react';

import { useLocation, useSearchParams } from 'react-router-dom';
import { animated } from '@react-spring/web';
import Big from 'big.js';

import styles from './styles/wafers.module.scss';
import {
  DollarCents,
  IconButtonHalfBlue,
  Window2,
  CloseButton,
} from '@ledget/ui';
import { Graph } from '@ledget/media';
import { useAccountsContext } from '../context';
import { BalanceChart } from '../balance-chart/BalanceChart';
import { WaferStyle } from './types';
import pathMappings from '../path-mappings';
import SkeletonWafers from './SkeletonWafers';
import Wafer from './Wafer';
import AccountBalanceTrend from '../Trend';
import useAnimate from './useAnimate';

const waferWidth = 165;
const creditWaferWidth = 175;
const waferPadding = 6;

const WaferList = () => {
  const location = useLocation();
  const { accounts } = useAccountsContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { transitions, bind, click } = useAnimate({
    waferWidth: location.pathname.includes('credit')
      ? creditWaferWidth
      : waferWidth,
    accounts,
    waferPadding,
  });

  const handleClick = (id: string) => {
    searchParams.set('account', id);
    setSearchParams(searchParams);
    click(id);
  };

  return (
    <div className={styles.accountWafers}>
      {transitions(
        (style, account) =>
          account && (
            <animated.div
              style={style}
              className={styles.accountWaferContainer}
              {...bind(account.id)}
            >
              <Wafer
                account={account}
                onClick={handleClick}
                styling={location.pathname.split('/')[2] as WaferStyle}
              />
            </animated.div>
          )
      )}
    </div>
  );
};

function Wafers() {
  const location = useLocation();
  const { accounts } = useAccountsContext();
  const { isLoading: isLoadingAccounts } = useAccountsContext();
  const ref = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(Math.random().toString().slice(2, 8));
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    setKey(Math.random().toString().slice(2, 8));
  }, [accounts]);

  return (
    <>
      <div className={styles.accountWafersContainer} ref={ref} key={key}>
        <Window2>
          <div>
            <div>
              <h4>{pathMappings.getWaferTitle(location)}</h4>
              {location.pathname.includes('deposits') && (
                <IconButtonHalfBlue
                  aria-label="Show balance history"
                  aria-haspopup="true"
                  aria-expanded={showChart}
                  aria-controls="balance-history"
                  onClick={() => setShowChart(!showChart)}
                >
                  <Graph />
                </IconButtonHalfBlue>
              )}
            </div>
            <h1>
              <DollarCents
                value={
                  accounts
                    ?.reduce(
                      (acc, account) => acc.plus(account.balances.current),
                      Big(0)
                    )
                    .times(100)
                    .toNumber() || 0
                }
              />
            </h1>
            {location.pathname.includes('deposits') && <AccountBalanceTrend />}
          </div>
          {isLoadingAccounts ? (
            <SkeletonWafers
              count={
                ref.current?.offsetWidth
                  ? Math.floor(ref.current.offsetWidth / waferWidth) - 1
                  : 0
              }
              width={waferWidth}
            />
          ) : (
            <WaferList />
          )}
        </Window2>
        <Window2 data-collapsed={Boolean(!showChart)}>
          <CloseButton onClick={() => setShowChart(false)} />
          <BalanceChart />
        </Window2>
      </div>
    </>
  );
}

export default Wafers;
