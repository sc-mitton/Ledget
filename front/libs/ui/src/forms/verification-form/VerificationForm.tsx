import { useState, useEffect, useRef } from 'react';

import styles from './verification-form.module.scss';
import { MainButton, ResendButton } from '../../buttons/specialty-buttons';
import { Otc } from '../../inputs/one-time-code/Otc';

interface VerificationFormProps {
  flow: any;
  submit: (event: React.FormEvent<HTMLFormElement>) => void;
  identifier: string;
  refreshSuccess: boolean;
  loading: boolean;
  submitting: boolean;
}

export const VerificationForm = (props: VerificationFormProps) => {
  const { flow, submit, identifier, refreshSuccess, loading, submitting } =
    props;
  const [otcDisabled, setOtcDisabled] = useState(false);
  const resendRef = useRef<HTMLButtonElement>(null);
  const [hasInitialSent, setHasInitialSent] = useState(false);

  useEffect(() => {
    flow ? setOtcDisabled(false) : setOtcDisabled(true);
  }, [flow]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (flow && resendRef?.current) {
        resendRef?.current.click();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [flow]);

  useEffect(() => {
    refreshSuccess && setHasInitialSent(true);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <form
          action={flow?.ui.action}
          method={flow?.ui.method}
          onSubmit={submit}
        >
          <Otc codeLength={6} />
          <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
          <input type="hidden" name="email" value={identifier} />
          <MainButton
            type="submit"
            name="method"
            value="code"
            disabled={otcDisabled}
            loading={hasInitialSent && loading}
            submitting={hasInitialSent && submitting}
          >
            Submit
          </MainButton>
        </form>
        <form
          action={flow?.ui.action}
          method={flow?.ui.method}
          onSubmit={submit}
        >
          <ResendButton
            success={hasInitialSent && refreshSuccess}
            aria-label="Resend email"
            type="submit"
            name="method"
            value="code"
            ref={resendRef}
          />
          <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
          <input type="hidden" name="email" value={identifier} />
        </form>
      </div>
    </>
  );
};
