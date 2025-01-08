import { useSearchParams } from 'react-router-dom';

import styles from './styles/auth.module.scss';
import {
  MainButton,
  PlainTextInput,
  RecoveryCodeGraphic,
  TotpAppGraphic,
  PasswordInput,
} from '@ledget/ui';
import { PasskeySignIn } from '@components/index';

export const LookupSecretPrompt = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className={styles.mfa}>
      <span>Or use a&nbsp;</span>
      <button
        type="button"
        onClick={() => {
          searchParams.set('mfa', 'lookup_secret');
          setSearchParams(searchParams);
        }}
      >
        recovery code
      </button>
    </div>
  );
};

export const TotpMfa = ({ finished }: { finished: boolean }) => {
  const [searchParams] = useSearchParams();

  return (
    <>
      <div>
        <TotpAppGraphic finished={finished} />
        <h4>Enter your authenticator code</h4>
        <LookupSecretPrompt />
      </div>
      <div style={{ margin: '1.25em 0' }}>
        <PlainTextInput name="totp_code" placeholder="Code" />
      </div>
      <MainButton name="method" value={searchParams.get('mfa') || ''}>
        Submit
      </MainButton>
    </>
  );
};

export const LookupSecretMfa = ({ finished }: { finished: boolean }) => {
  const [searchParams] = useSearchParams();

  return (
    <>
      <div>
        <RecoveryCodeGraphic finished={finished} />
        <h4>Enter your recovery code</h4>
      </div>
      <div style={{ margin: '1.25em 0' }}>
        <PlainTextInput name="lookup_secret" placeholder="Code" />
      </div>
      <MainButton name="method" value={searchParams.get('mfa') || ''}>
        Submit
      </MainButton>
    </>
  );
};

export const Password = () => (
  <div className={styles.passwordAuth}>
    <div className={styles.passwordInputContainer}>
      <PasswordInput autoFocus required />
    </div>
    <MainButton name="method" value="password">
      Submit
    </MainButton>
    {typeof PublicKeyCredential != 'undefined' && <PasskeySignIn />}
  </div>
);
