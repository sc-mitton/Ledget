import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './styles/force-verification.module.scss';
import { withModal } from '@ledget/ui';
import { FormError, JiggleDiv, VerificationForm } from '@ledget/ui';
import { useFlow, useVerificationCodeHandler } from '@ledget/ory';
import { apiSlice, useGetMeQuery } from '@ledget/shared-features';
import {
  useLazyGetVerificationFlowQuery,
  useCompleteVerificationFlowMutation,
} from '@features/orySlice';
import { useAppDispatch } from '@hooks/store';

export const ForceVerification = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data: user } = useGetMeQuery();
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

  const { jiggle, unhandledIdMessage, refreshSuccess } =
    useVerificationCodeHandler({
      dependencies: [isCompleteSuccess],
      onExpired: () => navigate(0),
      onSuccess,
      result,
    });

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
  const dispatch = useAppDispatch();

  return (
    <ForceVerification
      onSuccess={() => {
        props.closeModal();
        dispatch(apiSlice.util.invalidateTags(['user']));
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
