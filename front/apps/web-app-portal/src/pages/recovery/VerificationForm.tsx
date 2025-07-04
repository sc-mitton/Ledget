import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import styles from './styles/form.module.scss';
import { BackButton, Otc, MainButton } from '@ledget/ui';
import Error from './Error';
import { MicroAnimation } from './MicroAnimation';

interface Props {
  submit: (e: any) => void;
  flow: any;
  codeSuccess: boolean;
  isCompleteError: boolean;
  errMsg?: string;
}

const RecoveryVerificationForm = ({
  submit,
  flow,
  codeSuccess,
  isCompleteError,
  errMsg,
}: Props) => {
  const [searchParams, setsearchParams] = useSearchParams();
  const [csrfToken, setCsrfToken] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(e);
  };

  useEffect(() => {
    if (flow) {
      flow.ui.nodes.find((n: any) => {
        n.attributes.name === 'csrf_token' && setCsrfToken(n.attributes.value);
      });
    }
  }, [flow]);

  return (
    <>
      <div>
        <div style={{ margin: '0 0 .5em -.25em' }}>
          <BackButton
            onClick={() => {
              searchParams.delete('step');
              setsearchParams(searchParams);
            }}
            style={{ float: 'none' }}
          />
        </div>
        <h2>Recovery Code</h2>
        <div style={{ margin: '.25em 0' }}>
          <span>Enter the code sent to your email </span>
        </div>
        {(isCompleteError || errMsg) && <Error msg={errMsg} />}
      </div>
      <MicroAnimation animate={codeSuccess} />
      <form
        id="recovery-verification-form"
        className={styles.recoveryForm}
        onSubmit={handleSubmit}
      >
        <Otc codeLength={6} />
        <input type="hidden" name="csrf_token" value={csrfToken} />
        <div className={styles.verificationButton}>
          <MainButton name="method" type="submit" value="code">
            Verify Code
          </MainButton>
        </div>
      </form>
    </>
  );
};

export default RecoveryVerificationForm;
