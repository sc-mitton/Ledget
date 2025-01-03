import { useSearchParams, useNavigate } from 'react-router-dom';

import styles from './styles/form-wrapper.module.scss';
import { FormError, BackButton } from '@ledget/ui';

interface OryFormWrapperProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  flow?: { csrf_token: string; [key: string]: any };
  errMsg?: string[];
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const OryFormWrapper = ({
  children,
  onSubmit,
  flow,
  errMsg,
  email,
  setEmail,
}: OryFormWrapperProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className={styles.loginAuthForm}>
      <div className={styles.email}>
        <h3>
          {searchParams.get('mfa') ? '2-Step Verification' : 'Welcome Back'}
        </h3>
        {searchParams.get('mfa') !== 'totp' && (
          <BackButton
            type="button"
            withText={Boolean(searchParams.get('mfa'))}
            onClick={() => {
              if (searchParams.get('mfa')) {
                navigate(-1);
              } else if (searchParams.get('aal') === 'aal1') {
                setEmail(undefined);
              } else {
                navigate('/login');
              }
            }}
          >
            {searchParams.get('mfa') ? '' : email}
          </BackButton>
        )}
      </div>
      <div>
        {errMsg && <FormError msg={errMsg} />}
        {children}
      </div>
      <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
    </form>
  );
};

export default OryFormWrapper;
