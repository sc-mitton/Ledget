import { useState, useEffect } from 'react';

import styles from './styles/logout.module.scss';
import { withSmallModal } from '@ledget/ui';
import { SecondaryButton, BlueSubmitButton, GrayButton } from '@ledget/ui';
import {
  useGetLogoutFlowQuery,
  useLazyGetUpdatedLogoutFlowQuery,
} from '@features/orySlice';

const LogoutModal = withSmallModal<{ fromTimeout: boolean }>((props) => {
  const [quedLogout, setQuedLogout] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const { fromTimeout = true } = props;

  const {
    data: flow,
    isSuccess: fetchedFlow,
    isLoading: fetchingFlow,
    isError: errorFetchingFlow,
  } = useGetLogoutFlowQuery({});

  const [
    updateLogoutFlow,
    { isSuccess: logOutSuccess, isLoading: loggingOut },
  ] = useLazyGetUpdatedLogoutFlowQuery();

  // Auto logout feature
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    seconds <= 0 && setQuedLogout(true);
  }, [seconds]);

  useEffect(() => {
    if (quedLogout && fetchedFlow) {
      updateLogoutFlow({ token: flow?.logout_token });
    }
  }, [quedLogout, fetchedFlow]);

  useEffect(() => {
    if (logOutSuccess) {
      window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URL;
    }
  }, [logOutSuccess]);

  useEffect(() => {
    errorFetchingFlow && props.closeModal();
  }, [errorFetchingFlow]);

  return (
    <div>
      <h2>
        {fromTimeout
          ? 'Your session is about to end'
          : 'Sign out of your account?'}
      </h2>
      <div className={styles.countdown}>
        <span>You will be automatically logged out in {seconds} seconds</span>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'end', marginTop: '.5em' }}
      >
        {fromTimeout ? (
          <GrayButton onClick={() => props.closeModal()} aria-label="Cancel">
            Cancel
          </GrayButton>
        ) : (
          <SecondaryButton
            onClick={() => props.closeModal()}
            aria-label="Cancel"
          >
            Cancel
          </SecondaryButton>
        )}
        {!fromTimeout && (
          <BlueSubmitButton
            onClick={() => {
              setQuedLogout(true);
            }}
            submitting={(fetchingFlow && quedLogout) || loggingOut}
            aria-label="Sign out"
          >
            Logout
          </BlueSubmitButton>
        )}
      </div>
    </div>
  );
});

export default LogoutModal;
