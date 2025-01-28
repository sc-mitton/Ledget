import { useEffect, useState } from 'react';
import { Pin } from '@geist-ui/icons';
import { animated, useTransition } from '@react-spring/web';
import Big from 'big.js';

import styles from './styles/pin-accounts.module.scss';
import { withModal } from '@ledget/ui';
import { DollarCents } from '@ledget/ui';
import { InstitutionLogo } from '@components/pieces';

import {
  useGetAccountsQuery,
  setPinAccount,
  unPinAccount,
  useUpdateAccountsMutation,
  selectPinnedAccounts,
  Account,
} from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { useLoaded } from '@ledget/helpers';

const PinnedAccounts = withModal((props) => {
  const loaded = useLoaded(1000);
  const dispatch = useAppDispatch();
  const [updateAccount] = useUpdateAccountsMutation();
  const { data } = useGetAccountsQuery();
  const pinnedAccounts = useAppSelector(selectPinnedAccounts);
  const [pinnedAccountsList, setPinnedAccountsList] = useState<Account[]>();

  useEffect(() => {
    const currendIdsSet = new Set(pinnedAccountsList?.map((a) => a.id));
    const newIdsSet = new Set(pinnedAccounts);

    if (
      pinnedAccountsList?.some((a) => !newIdsSet.has(a.id)) ||
      pinnedAccounts.some((pId) => !currendIdsSet.has(pId))
    ) {
      setPinnedAccountsList(
        data?.accounts.filter((a) => pinnedAccounts.includes(a.id))
      );
    }
  }, [pinnedAccounts]);

  const transitions = useTransition(pinnedAccountsList, {
    from: {
      opacity: 0,
      maxWidth: 0,
    },
    enter: {
      opacity: 1,
      maxWidth: 400,
    },
    leave: {
      opacity: 0,
      maxWidth: 0,
    },
    config: {
      duration: 500,
    },
    immediate: !loaded,
  });

  return (
    <div>
      <h4 className={styles.header}>
        <Pin className="icon" />
        Accounts
      </h4>
      <div className={styles.pinnedList}>
        {transitions((style, pinned) => (
          <animated.button
            style={style}
            onClick={() => {
              if (pinned) {
                dispatch(unPinAccount(pinned.id));
                updateAccount([{ account: pinned.id, pinned: null }]);
              }
            }}
          >
            <InstitutionLogo accountId={pinned?.id} size={'1.5em'} />
            <div>
              <span>
                {pinned?.name.length || 0 > 20
                  ? `${pinned?.name.slice(0, 20)}...`
                  : pinned?.name}
              </span>
              <span>&nbsp;&bull;&nbsp;&bull;&nbsp;{pinned?.mask}</span>
            </div>
            <div>
              <DollarCents
                value={Big(pinned?.balances.current || 0)
                  .times(100)
                  .toNumber()}
              />
            </div>
            <div>
              <Pin className="icon" />
            </div>
          </animated.button>
        ))}
      </div>
      <div className={styles.list}>
        {data?.accounts
          .filter((a) => a.type === 'depository')
          .filter((a) => !pinnedAccounts?.some((p) => p === a.id))
          .map((a) => (
            <button
              onClick={() => {
                updateAccount([
                  {
                    account: a.id,
                    pinned: pinnedAccounts.length + 1,
                  },
                ]);
                dispatch(setPinAccount(a.id));
              }}
              className={styles.account}
            >
              <div>
                <InstitutionLogo accountId={a.id} size={'1.5em'} />
              </div>
              <div>
                <span>
                  {a.name.length > 20 ? `${a.name.slice(0, 20)}...` : a.name}
                </span>
                <span>&nbsp;&bull;&nbsp;&bull;&nbsp;{a.mask}</span>
              </div>
              <div>
                <Pin className="icon" />
              </div>
              <div>
                <div>
                  <DollarCents
                    value={Big(a.balances.current).times(100).toNumber()}
                  />
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
});

export default PinnedAccounts;
