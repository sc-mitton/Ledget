import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { CheckInCircle } from '@geist-ui/icons';

import styles from './styles/welcome-connect.module.scss';
import { useBakedPlaidLink } from '@utils/hooks';
import {
  useGetPlaidItemsQuery,
  PlaidItem,
  useGetMeQuery,
  useTransactionsSyncMutation,
} from '@ledget/shared-features';
import {
  LoadingRing,
  Base64Logo,
  Tooltip,
  TextButtonBlue,
  GrayButton,
  NestedWindow,
} from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';

const InstitutionLogos = ({ plaidItems }: { plaidItems: PlaidItem[] }) => {
  const { data: user } = useGetMeQuery();
  const { isLoading } = useGetPlaidItemsQuery({ userId: user?.id });
  const { open } = useBakedPlaidLink(true);

  return (
    <div className={styles.connectedInstitutions}>
      <div>
        <span>Your Institutions</span>
        <TextButtonBlue onClick={() => open()}>Connect</TextButtonBlue>
      </div>
      <NestedWindow>
        {plaidItems.length > 0 ? (
          plaidItems.map((item, index) => (
            <div
              key={item.id}
              className={styles.institutionLogo}
              style={{
                marginLeft: index === 0 ? '0' : '-.5rem',
                zIndex: index,
              }}
            >
              <Tooltip msg={item.institution?.name} maxWidth={'100px'}>
                <Base64Logo
                  size="2em"
                  data={item.institution?.logo}
                  alt={item.institution?.name?.charAt(0).toUpperCase()}
                  backgroundColor={item.institution?.primary_color}
                />
              </Tooltip>
            </div>
          ))
        ) : (
          <span>No connected institutions</span>
        )}
        <div style={{ marginLeft: '1em' }}>
          <LoadingRing visible={isLoading} />
        </div>
      </NestedWindow>
    </div>
  );
};

const BottomButtons = ({ continueDisabled }: { continueDisabled: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.btnContainerEnabled}>
      <GrayButton onClick={() => navigate('/welcome/add-bills')}>
        Continue
      </GrayButton>
    </div>
  );
};

const SecurityMessage = () => (
  <div className={styles.checklist}>
    <div>
      <div>
        <CheckInCircle className="icon" />
      </div>
      <div>Ledget doesn't store your credentials</div>
    </div>
    <div>
      <div>
        <CheckInCircle className="icon" />
      </div>
      <div>We use Plaid to connect to your financial institutions</div>
    </div>
    <div>
      <div>
        <CheckInCircle className="icon" />
      </div>
      <div>Disconnect your account and your financial data at any time</div>
    </div>
  </div>
);

const WelcomeConnect = () => {
  const [syncTransactions] = useTransactionsSyncMutation();
  const { data: user } = useGetMeQuery();
  const { data: plaidItems, isSuccess: fetchedPlaidItemsSuccess } =
    useGetPlaidItemsQuery({ userId: user?.id });
  const loaded = useLoaded(0, fetchedPlaidItemsSuccess);

  // We should only sync when there's been a new plaid item added
  // after the initial load
  useEffect(() => {
    if (plaidItems?.length && plaidItems?.length > 0 && loaded) {
      setTimeout(() => {
        syncTransactions({ item: plaidItems[plaidItems.length - 1].id });
      }, 4000);
    }
  }, [plaidItems]);

  return (
    <div className={styles.welcomeConnect}>
      <h2 className="spaced-header">Welcome to Ledget!</h2>
      <div>
        <span>Let's get started by connecting your financial accounts.</span>
        <SecurityMessage />
        {fetchedPlaidItemsSuccess && (
          <InstitutionLogos plaidItems={plaidItems} />
        )}
      </div>
      <BottomButtons continueDisabled={false} />
    </div>
  );
};

export default WelcomeConnect;
