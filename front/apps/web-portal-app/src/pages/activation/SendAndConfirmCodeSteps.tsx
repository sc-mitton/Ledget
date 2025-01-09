import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useFlow } from '@ledget/ory';
import { useLoaded } from '@ledget/helpers';
import {
  useLazyGetRecoveryFlowQuery,
  useCompleteRecoveryFlowMutation,
} from '@features/orySlice';
import { SlideMotionDiv, WindowLoading } from '@ledget/ui';
import ConfirmCodeForm from './ConfirmCodeForm';
import SendCodeForm from './SendCodeForm';

const SendAndConfirmCodeSteps = () => {
  const loaded = useLoaded(1000);
  const [searchParams, setSearchParams] = useSearchParams();
  const { flow, fetchFlow, submit, flowStatus } = useFlow(
    useLazyGetRecoveryFlowQuery,
    useCompleteRecoveryFlowMutation,
    'recovery'
  );

  useEffect(() => {
    fetchFlow();
  }, []);

  useEffect(() => {
    if (
      flowStatus.isCompleteSuccess &&
      searchParams.get('step') === 'send-code'
    ) {
      searchParams.set('step', 'confirm-code');
      setSearchParams(searchParams);
    }
  }, [flowStatus.isCompleteSuccess]);

  useEffect(() => {
    if (flowStatus.errId === 'browser_location_change_required') {
      searchParams.set('step', 'set-traits');
      searchParams.delete('flow');
      setSearchParams(searchParams);
    }
  }, [flowStatus.errId]);

  return (
    <>
      <WindowLoading visible={flowStatus.isCompletingFlow} />
      <AnimatePresence mode="wait">
        {searchParams.get('step') === 'send-code' && (
          <SlideMotionDiv key="send-code" position={loaded ? 'first' : 'fixed'}>
            <SendCodeForm submit={submit} csrf_token={flow?.csrf_token} />
          </SlideMotionDiv>
        )}
        {searchParams.get('step') === 'confirm-code' && flow && (
          <SlideMotionDiv key="confirm-code" position="last">
            <ConfirmCodeForm submit={submit} csrf_token={flow.csrf_token} />
          </SlideMotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default SendAndConfirmCodeSteps;
