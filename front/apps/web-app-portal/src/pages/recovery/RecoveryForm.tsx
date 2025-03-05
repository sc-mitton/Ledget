import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackButton, LightBlueMainButton, PlainTextInput } from '@ledget/ui';
import Error from './Error';
import styles from './styles/form.module.scss';
import { MicroAnimation } from './MicroAnimation';

interface Props {
  flow: any;
  submit: (e: any) => void;
  isCompleteError: boolean;
  errMsg?: string;
}

const RecoveryForm = ({ flow, submit, isCompleteError, errMsg }: Props) => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  return (
    <>
      <div>
        <div style={{ margin: '0 0 .5em -.25em' }}>
          <BackButton
            onClick={() => {
              setAnimate(true);
              setTimeout(() => {
                navigate('/login');
              }, 1000);
            }}
            style={{ float: 'none' }}
          />
        </div>
        <h2>Forgot password?</h2>
        <div style={{ margin: '.5em 0' }}>
          <span>
            Enter the email connected to your account and we'll send you a
            recovery code.
          </span>
        </div>
        {(isCompleteError || errMsg) && <Error msg={errMsg} />}
      </div>
      <MicroAnimation animate={animate} />
      <form onSubmit={submit} className={styles.recoveryForm}>
        <PlainTextInput
          type="email"
          placeholder="Email"
          autoComplete="email"
          name="email"
          autoFocus
          required
        />
        <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
        <LightBlueMainButton name="method" type="submit" value="code">
          Send code
        </LightBlueMainButton>
      </form>
    </>
  );
};

export default RecoveryForm;
