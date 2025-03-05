import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';

import styles from './verification.module.scss';
import {
  FormError,
  JiggleDiv,
  VerificationForm,
  ColumnWindowHeader,
  PortalWindow,
  useScreenContext,
  WindowLoading,
} from '@ledget/ui';
import { useFlow } from '@ledget/ory';
import {
  useLazyGetVerificationFlowQuery,
  useCompleteVerificationFlowMutation,
} from '@features/orySlice';
import { mail } from '@ledget/media/lotties';

const Verification = () => {
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
  const { screenSize } = useScreenContext();
  const [animate, setAnimate] = useState(false);

  const animationOptions = {
    loop: false,
    autoplay: animate,
    animationData: mail,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(!animate);
    }, 2000);
    return () => clearInterval(interval);
  }, [animate]);

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
    if (codeIsCorrect) {
      const timeout = setTimeout(() => {
        navigate('/checkout');
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [codeIsCorrect]);

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
    <JiggleDiv className={styles.window} jiggle={jiggle} data-size={screenSize}>
      <PortalWindow maxWidth={26}>
        <WindowLoading visible={isGettingFlow || isCompletingFlow} />
        <ColumnWindowHeader>
          <h2>Verify Email Address</h2>
          <div>Step 3 of 4</div>
        </ColumnWindowHeader>
        <div className={styles.animationContainer}>
          <Lottie
            options={animationOptions}
            direction={animate ? 1 : -1}
            style={{ width: 44, height: 44 }}
            speed={0.5}
          />
        </div>
        <div className={styles.verificationContainer}>
          {errMsg ? (
            <div>
              {unhandledIdMessage && <FormError msg={unhandledIdMessage} />}
              <FormError msg={errMsg} />
            </div>
          ) : (
            <>
              <span>
                Enter the code we sent to your email address to verify your
                account:
              </span>
              <VerificationForm
                flow={flow}
                refreshSuccess={refreshSuccess}
                submit={submit}
                identifier={sessionStorage.getItem('identifier') || ''}
                loading={isGettingFlow}
                submitting={isCompletingFlow}
              />
            </>
          )}
        </div>
      </PortalWindow>
    </JiggleDiv>
  );
};

export default Verification;
