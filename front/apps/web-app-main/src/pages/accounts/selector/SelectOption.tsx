import { Listbox } from '@headlessui/react';
import { Account } from '@ledget/shared-features';
import Big from 'big.js';

import styles from './styles/option.module.scss';
import { InstitutionLogo } from '@components/pieces';
import { DollarCents, GripButton } from '@ledget/ui';

const SelectOption = ({ account }: { account: Account }) => (
  <div className={styles.option}>
    <GripButton />
    <Listbox.Option key={account.id} value={account} as="div">
      <InstitutionLogo accountId={account.id} />
      <div>
        <span>{account.name}</span>
        <span>
          &bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;{account.mask}
        </span>
      </div>
      <div>
        <DollarCents
          value={Big(account.balances.current).times(100).toNumber()}
        />
      </div>
    </Listbox.Option>
  </div>
);

export default SelectOption;
