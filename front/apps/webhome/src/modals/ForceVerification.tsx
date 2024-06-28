import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './styles/force-verification.module.scss';
import { withModal } from '@ledget/ui';
import { FormError, JiggleDiv, VerificationForm } from '@ledget/ui';
import { useFlow } from '@ledget/ory';
import {
  apiSlice,
  useGetMeQuery,
} from '@ledget/shared-features';
import {
  useLazyGetVerificationFlowQuery,
  useCompleteVerificationFlowMutation
} from '@features/orySlice';

export const ForceVerification = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data: user } = useGetMeQuery();
  const [jiggle, setJiggle] = useState(false);
  const [codeIsCorrect, setCodeIsCorrect] = useState(false);
  const [unhandledIdMessage, setUnhandledIdMessage] = useState('');
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const navigate = useNavigate();
  const { flow, result, fetchFlow, submit, flowStatus } = useFlow(
    useLazyGetVerificationFlowQuery,
    useCompleteVerificationFlowMutation,
    'verification'
  );
  const { errMsg, isGettingFlow, isCompletingFlow, isCompleteSuccess } =
    flowStatus;

  useEffect(() => {
    fetchFlow();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setJiggle(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [jiggle]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (codeIsCorrect) {
      timeout = setTimeout(() => {
        onSuccess();
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [codeIsCorrect]);

  // Lower refreshSuccess flag
  useEffect(() => {
    let timeout = setTimeout(() => {
      setRefreshSuccess(false);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [refreshSuccess]);

  // Response code handler
  useEffect(() => {
    const messages = result?.ui?.messages || [];
    for (const message of messages) {
      switch (message.id) {
        case 4070006:
          // Invalid code
          setJiggle(true);
          break;
        case 407005 || 407003:
          // Expired verification flow
          // Send new email & navigate to verification page
          // which will create a new verification flow
          navigate(0);
          break;
        case 1080002:
          // Successful verification
          setCodeIsCorrect(true);
          break;
        case 1080003:
          // Email w/ code/link sent
          setRefreshSuccess(true);
          break;
        default:
          setUnhandledIdMessage(
            'Well this is awkward... something went wrong.\n Please try back again later.'
          );
          break;
      }
    }
  }, [isCompleteSuccess]);

  return (
    <>
      <div>
        <h2>Verify Your Email Address</h2>
      </div>
      <div className={styles.ForceVerification}>
        {errMsg ? (
          <div>
            {unhandledIdMessage && <FormError msg={unhandledIdMessage} />}
            <FormError msg={errMsg} />
          </div>
        ) : (
          <>
            <div className={styles.subheader}>
              <span>
                Looks like you still need to verify your email address, enter
                the code we sent you below.
              </span>
            </div>
            <JiggleDiv jiggle={jiggle}>
              <VerificationForm
                flow={flow}
                refreshSuccess={refreshSuccess}
                submit={submit}
                identifier={user?.email || ''}
                loading={isGettingFlow}
                submitting={isCompletingFlow}
              />
            </JiggleDiv>
          </>
        )}
      </div>
    </>
  );
};

const ForceVerificationModal = withModal((props) => {
  return (
    <ForceVerification
      onSuccess={() => {
        props.closeModal();
        apiSlice.util.invalidateTags(['User']);
      }}
    />
  );
});

export default function () {
  const navigate = useNavigate();

  return (
    <ForceVerificationModal
      hasExit={false}
      overLayExit={false}
      onClose={() => navigate(-1)}
      disableClose={true}
      maxWidth={'21.875rem'}
      blur={1}
    />
  );
}
