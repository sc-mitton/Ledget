import { useState, useEffect } from 'react';
import type { VerificationFlow } from '@ory/client';
import type { Flow } from './types';

interface Args {
  result?: Flow<VerificationFlow>;
  dependencies: any[];
  onExpired: () => void;
  onSuccess: () => void;
}

export const useVerificationCodeHandler = ({
  result,
  dependencies,
  onExpired,
  onSuccess,
}: Args) => {
  const [jiggle, setJiggle] = useState(false);
  const [codeIsCorrect, setCodeIsCorrect] = useState(false);
  const [unhandledIdMessage, setUnhandledIdMessage] = useState('');
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setJiggle(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [jiggle]);

  // Lower refreshSuccess flag
  useEffect(() => {
    let timeout = setTimeout(() => {
      setRefreshSuccess(false);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [refreshSuccess]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (codeIsCorrect) {
      timeout = setTimeout(() => {
        onSuccess();
      }, 1000);
    }
    return () => clearTimeout(timeout);
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
        case 407003:
        case 407005:
          // Expired verification flow
          // Send new email & navigate to verification page
          // which will create a new verification flow
          onExpired();
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
  }, [...dependencies]);

  return { jiggle, codeIsCorrect, unhandledIdMessage, refreshSuccess };
};
