import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import styles from './styles.module.scss';
import { Account, useGetAccountsQuery } from '@ledget/shared-features';
import { InstitutionLogo } from '@components/pieces';

const SelectedCardHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useGetAccountsQuery();
  const [card, setCard] = useState<Account>();

  useEffect(() => {
    if (searchParams.get('accounts') && data?.accounts) {
      setCard(data.accounts.find((a) => a.id === searchParams.get('accounts')));
    }
  }, [searchParams, data]);

  return (
    <div className={styles.container}>
      <InstitutionLogo accountId={card?.id} size={'1.25em'} />
      <span>{card?.name}</span>
    </div>
  );
};
export default SelectedCardHeader;
