import React, { useEffect, useState } from 'react';

import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import styles from './styles/cancel-subscription.module.scss';
import { withModal } from '@ledget/ui';
import { withReAuth } from '@utils';
import {
  RedButton,
  BluePrimaryButton,
  SlideMotionDiv,
  BakedListBox,
} from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';
import {
  useUpdateRestartSubscriptionMutation,
  useGetSubscriptionQuery,
} from '@ledget/shared-features';

export const CancelationWindow = (props) => {
  const [feedback, setFeedback] = useState('');
  const [updateSubscription, { isSuccess, isLoading }] =
    useUpdateRestartSubscriptionMutation();
  const { data: subscription } = useGetSubscriptionQuery();
  const [cancelationReason, setCancelationReason] = React.useState('');

  const [reasonSprings, reasonApi] = useSpring(() => ({
    from: { transform: 'scale(1)' },
  }));
  const [feedbackSprings, feedbackApi] = useSpring(() => ({
    from: { transform: 'scale(1)' },
  }));

  const pulseConfig = {
    to: async (next, cancel) => {
      await next({ transform: 'scale(1)' });
      await next({ transform: 'scale(1.1)' });
      await next({ transform: 'scale(1)' });
    },
    config: { duration: 150 },
  };

  useEffect(() => {
    isSuccess && props.onClose();
  }, [isSuccess]);

  const handleClick = () => {
    if (cancelationReason && feedback) {
      updateSubscription({
        subId: subscription.id,
        cancelAtPeriodEnd: true,
        cancelationReason: cancelationReason,
        feedback: feedback,
      });
      return;
    }
    !cancelationReason && reasonApi.start({ ...pulseConfig });
    !feedback && feedbackApi.start({ ...pulseConfig });
  };

  return (
    <div className={styles.cancelationModalContainer}>
      <h2>Are you sure?</h2>
      <div>
        Before you go, we'd love to hear why you're leaving and what we can do
        to improve.
      </div>
      <div className={styles.cancelationContainer}>
        <div>
          <div>
            <h4>{'Reason for cancellation'}</h4>
          </div>
          <animated.div
            style={{
              position: 'relative',
              zIndex: 1,
              ...reasonSprings,
            }}
          >
            <BakedListBox
              placeholder="Select"
              value={cancelationReason}
              onChange={setCancelationReason}
              options={[
                'Too expensive',
                'Not enough features',
                'Not using it enough',
                'Using another product',
                'Other',
              ]}
            >
              <span>Reason</span>
            </BakedListBox>
          </animated.div>
        </div>
        <div>
          <div>
            <h4>{'What did you like about Ledget?'}</h4>
          </div>
          <animated.div
            style={{
              position: 'relative',
              zIndex: 0,
              ...feedbackSprings,
            }}
          >
            <BakedListBox
              placeholder="Select"
              value={feedback}
              onChange={setFeedback}
              options={[
                "It's easy to use",
                'Beautiful user interface',
                "It's fast",
                'Syncs with my bank',
                'Unique features',
                'Other',
              ]}
            >
              <span>Select&nbsp;&nbsp;</span>
            </BakedListBox>
          </animated.div>
        </div>
        <div>
          <RedButton submitting={isLoading} color="light" onClick={handleClick}>
            Yes, Cancel
          </RedButton>
        </div>
      </div>
    </div>
  );
};

const SuccessWindow = (props) => {
  return (
    <div id="success-window--container">
      <h2>Success</h2>
      <div style={{ margin: '1em 0 1em 0' }}>
        If you change your mind, you can stop the cancellation at any time
        before the end of the current billing cycle. After that, your account
        will be deleted along with all of your account data.
      </div>
      <div></div>
      <div>
        <BluePrimaryButton
          onClick={() => {
            props.closeModal();
          }}
          style={{ float: 'right' }}
        >
          OK
        </BluePrimaryButton>
      </div>
    </div>
  );
};

const CancelationModal = withReAuth(
  withModal((props) => {
    const [{ isSuccess }] = useUpdateRestartSubscriptionMutation();
    const loaded = useLoaded();

    return (
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <SlideMotionDiv position={loaded ? 'first' : 'last'}>
            <SuccessWindow {...props} />
          </SlideMotionDiv>
        ) : (
          <SlideMotionDiv position={'last'}>
            <CancelationWindow {...props} />
          </SlideMotionDiv>
        )}
      </AnimatePresence>
    );
  })
);

export default function () {
  const navigate = useNavigate();

  return (
    <CancelationModal
      onClose={() => navigate('/settings/profile')}
      maxWidth={'22em'}
      blur={2}
    />
  );
}
