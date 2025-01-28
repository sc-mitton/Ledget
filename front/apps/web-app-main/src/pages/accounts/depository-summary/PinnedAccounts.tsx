import { useEffect, useState } from 'react';
import { Edit2, MoreHorizontal, Pin } from '@geist-ui/icons';
import Big from 'big.js';

import styles from './styles/pinned-accounts.module.scss';
import { DollarCents, Window, TextButton, StyledMenu } from '@ledget/ui';
import {
  selectPinnedAccounts,
  useGetAccountsQuery,
  Account,
} from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { InstitutionLogo } from '@components/pieces';
import { setModal } from '@features/modalSlice';

const PinnedAccounts = () => {
  const dispatch = useAppDispatch();
  const pinnedAccounts = useAppSelector(selectPinnedAccounts);
  const { data } = useGetAccountsQuery();
  const [pinnedAccountsList, setPinnedAccountsList] = useState<Account[]>([]);

  useEffect(() => {
    if (data?.accounts) {
      setPinnedAccountsList(
        data.accounts.reduce((acc, a, i) => {
          if (pinnedAccounts.length > 0 && pinnedAccounts.includes(a.id)) {
            acc.push(a);
          } else if (
            pinnedAccounts.length === 0 &&
            acc.length < 3 &&
            a.type === 'depository'
          ) {
            acc.push(a);
          }
          return acc;
        }, [] as Account[])
      );
    }
  }, [pinnedAccounts]);

  return (
    <Window>
      <div className={styles.header}>
        <h4>
          <Pin className="icon" />
          Accounts
        </h4>
        <StyledMenu>
          <StyledMenu.Button as={TextButton}>
            <MoreHorizontal className="icon" />
          </StyledMenu.Button>
          <StyledMenu.Items>
            <StyledMenu.Item
              label="Edit"
              onClick={() => dispatch(setModal({ name: 'pinAccounts' }))}
              icon={<Edit2 size={'.875rem'} />}
            />
          </StyledMenu.Items>
        </StyledMenu>
      </div>
      <div className={styles.pinnedAccounts}>
        {pinnedAccountsList.map((a) => (
          <>
            <InstitutionLogo accountId={a.id} size={'1.5em'} />
            <div>
              <span>
                {a.name.length > 20 ? `${a.name.slice(0, 20)}...` : a.name}
              </span>
              <span>&nbsp;&bull;&nbsp;&bull;&nbsp;{a.mask}</span>
            </div>
            <div>
              <DollarCents
                value={Big(a.balances.current).times(100).toNumber()}
              />
            </div>
          </>
        ))}
      </div>
    </Window>
  );
};

export default PinnedAccounts;
