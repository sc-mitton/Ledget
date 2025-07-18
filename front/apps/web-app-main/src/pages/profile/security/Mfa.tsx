import { useNavigate } from 'react-router-dom';

import { Plus } from '@geist-ui/icons';

import styles from './styles/mfa.module.scss';
import { useGetMeQuery } from '@ledget/shared-features';
import {
  CircleIconButton,
  BlueSlimButton,
  Tooltip,
  TextButtonHalfBlue,
  NestedWindow,
} from '@ledget/ui';
import { Qr } from '@ledget/media';

const Mfa = () => {
  const { data: user } = useGetMeQuery();
  const navigate = useNavigate();

  const formatDate = (date?: string | null) => {
    const d = new Date(date || '');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section>
      <h4>Multi-Factor</h4>
      <NestedWindow className={styles.container}>
        {user?.settings.mfa_method === 'totp' ? (
          <>
            <div>
              <Qr width={'1.3em'} height={'1.3em'} />
              <div>
                <span>Authenticator App</span>
                <span>Added {formatDate(user?.settings?.mfa_enabled_on)}</span>
              </div>
            </div>
            <div>
              <Tooltip
                msg={'Remove authenticator'}
                ariaLabel={'Remove authenticator'}
              >
                <BlueSlimButton
                  onClick={() =>
                    navigate('/settings/security/delete-authenticator')
                  }
                  aria-label={'Remove Authenticator'}
                >
                  Remove
                </BlueSlimButton>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <div>
              <Qr width={'1.25em'} height={'1.25em'} />
              <span>Authenticator App</span>
            </div>
            <CircleIconButton
              onClick={() => navigate('/settings/security/authenticator-setup')}
            >
              <Plus size={'.875em'} strokeWidth={2} />
            </CircleIconButton>
          </>
        )}
      </NestedWindow>
      {user?.settings.mfa_method === 'totp' && (
        <div>
          <Tooltip msg={'Recovery codes'} ariaLabel={'Recovery codes'}>
            <TextButtonHalfBlue
              onClick={() => navigate('/profile/security/recovery-codes')}
            >
              Recovery Codes
            </TextButtonHalfBlue>
          </Tooltip>
        </div>
      )}
    </section>
  );
};

export default Mfa;
