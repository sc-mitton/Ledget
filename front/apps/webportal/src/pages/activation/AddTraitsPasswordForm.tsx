import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useFlow } from '@ledget/ory';
import { WindowLoadingBar, SlideMotionDiv } from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';
import {
  useLazyGetSettingsFlowQuery,
  useCompleteSettingsFlowMutation,
} from '@features/orySlice';
import AddTraitsForm from './AddTraitsForm';
import PasswordForm from './PasswordForm';

const AddTraitsAndPasswordSteps = () => {
  const loaded = useLoaded(1000);
  const [searchParams, setSearchParams] = useSearchParams();

  const { flow, fetchFlow, submit, submitData, flowStatus } = useFlow(
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    'settings'
  );

  useEffect(() => {
    fetchFlow();
  }, []);

  useEffect(() => {
    if (flowStatus.isCompleteSuccess) {
      if (searchParams.get('step') === 'set-traits') {
        searchParams.set('step', 'set-password');
        setSearchParams(searchParams);
      } else {
        window.location.href = import.meta.env.VITE_ACTIVATION_REDIRECT;
      }
    }
  }, [flowStatus.isCompleteSuccess]);

  useEffect(() => {
    if (flowStatus.errId === 'session_refresh_required') {
      searchParams.set('step', 'send-code');
      searchParams.delete('flow');
      setSearchParams(searchParams);
    }
  }, [flowStatus.errId]);

  return (
    <>
      <WindowLoadingBar visible={flowStatus.isCompletingFlow} />
      <AnimatePresence mode="wait">
        {searchParams.get('step') === 'set-traits' && (
          <SlideMotionDiv
            key="add-traits"
            position={loaded ? 'first' : 'fixed'}
          >
            <AddTraitsForm submit={submitData} csrf_token={flow?.csrf_token} />
          </SlideMotionDiv>
        )}
        {searchParams.get('step') === 'set-password' && (
          <SlideMotionDiv key="set-password" position="last">
            <PasswordForm submit={submit} csrf_token={flow?.csrf_token} />
          </SlideMotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddTraitsAndPasswordSteps;
