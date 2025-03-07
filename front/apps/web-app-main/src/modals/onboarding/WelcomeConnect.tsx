import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { CheckInCircle, Plus } from '@geist-ui/icons';

import styles from './styles/welcome-connect.module.scss';
import { useBakedPlaidLink } from '@utils/hooks';
import {
  useGetPlaidItemsQuery,
  useGetMeQuery,
  useTransactionsSyncMutation,
} from '@ledget/shared-features';
import {
  Base64Logo,
  Tooltip,
  TextButtonBlue,
  GrayButton,
  NestedWindow2,
  LoadingRingDiv,
  Window,
} from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';

const InstitutionLogos = () => {
  const { data: user } = useGetMeQuery();
  const { data: plaidItems, isLoading } = useGetPlaidItemsQuery({
    userId: user?.id,
  });
  const { open } = useBakedPlaidLink(true);

  return (
    <NestedWindow2 className={styles.connectedInstitutionsContainer}>
      <LoadingRingDiv loading={isLoading}>
        <div className={styles.connectedInstitutions}>
          {plaidItems && plaidItems?.length > 0 ? (
            plaidItems.map((item, index) => (
              <div
                key={item.id}
                className={styles.institutionLogo}
                style={{ zIndex: index }}
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
            <TextButtonBlue
              onClick={() => open()}
              className={styles.emptyConnectButton}
            >
              Connect
              <Plus />
            </TextButtonBlue>
          )}
          {plaidItems && plaidItems?.length > 0 && (
            <div>
              <TextButtonBlue onClick={() => open()}>
                Connect
                <Plus />
              </TextButtonBlue>
            </div>
          )}
        </div>
      </LoadingRingDiv>
    </NestedWindow2>
  );
};

const BottomButtons = ({ continueDisabled }: { continueDisabled: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.btnContainerEnabled}>
      <GrayButton onClick={() => navigate('/welcome/add-categories')}>
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
    <Window>
      <div className={styles.welcomeConnect}>
        <h2 className="spaced-header">Welcome to Ledget!</h2>
        <div>
          <span>Let's get started by connecting your financial accounts.</span>
          <SecurityMessage />
          <InstitutionLogos />
        </div>
        <BottomButtons continueDisabled={false} />
      </div>
    </Window>
  );
};

export default WelcomeConnect;
