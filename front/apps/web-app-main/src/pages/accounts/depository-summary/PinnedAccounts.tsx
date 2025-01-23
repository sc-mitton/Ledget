import { Edit2, MoreHorizontal, Pin } from '@geist-ui/icons';
import Big from 'big.js';

import styles from './styles/pinned-accounts.module.scss';
import { DollarCents, Window, TextButton, StyledMenu } from '@ledget/ui';
import { useGetAccountsQuery } from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { useEffect } from 'react';
import { InstitutionLogo } from '@components/pieces';
import { setModal } from '@features/modalSlice';
import {
  selectPinnedAccounts,
  setPinnedAccount,
} from '@features/depositoryAccountsTabSlice';

const PinnedAccounts = () => {
  const dispatch = useAppDispatch();
  const pinnedAccounts = useAppSelector(selectPinnedAccounts);
  const { data } = useGetAccountsQuery();

  useEffect(() => {
    if (!pinnedAccounts.length) {
      dispatch(
        setPinnedAccount(
          data?.accounts
            .filter((a) => a.type === 'depository')
            .map((a) => a.id)
            ?.slice(0, 3) || []
        )
      );
    }
  }, [data]);

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
              onClick={() => dispatch(setModal('pinAccounts'))}
              icon={<Edit2 size={'.875rem'} />}
            />
          </StyledMenu.Items>
        </StyledMenu>
      </div>
      <div className={styles.pinnedAccounts}>
        {data?.accounts
          .filter((a) => pinnedAccounts.includes(a.id))
          .map((a) => (
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
