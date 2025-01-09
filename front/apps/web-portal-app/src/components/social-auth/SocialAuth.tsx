import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import styles from './styles.module.scss';
import { FacebookLoginButton, GoogleLoginButton } from '@ledget/ui';

function SocialAuth({
  flow,
  submit,
  className,
}: {
  flow: any;
  submit: any;
  className?: string;
}) {
  const location = useLocation();
  const [socialNodes, setSocialNodes] = useState<any[]>([]);

  useEffect(() => {
    setSocialNodes(
      flow && flow.ui.nodes.filter((node: any) => node.group === 'oidc')
    );
  }, [flow]);

  const SocialLoginButtons = () => {
    return (
      <>
        {socialNodes.map((node) => {
          return (
            (node.attributes.value === 'facebook' && (
              <FacebookLoginButton
                id={node.id}
                {...node.attributes}
                key={'facebook-login'}
                aria-label="facebook login"
              />
            )) ||
            (node.attributes.value === 'google' && (
              <GoogleLoginButton
                id={node.id}
                {...node.attributes}
                key={'google-login'}
                aria-label="google login"
              />
            ))
          );
        })}
      </>
    );
  };

  const DefaultButtons = () => {
    return (
      <>
        <FacebookLoginButton />
        <GoogleLoginButton />
      </>
    );
  };

  return (
    <div className={className}>
      <div className={styles.header}>
        {location.pathname === '/login' ? (
          <span>Or log in with</span>
        ) : (
          <span>Or sign up with</span>
        )}
      </div>
      <form
        action={flow && flow.ui.action}
        method={flow && flow.ui.method}
        className={styles.form}
        onSubmit={submit}
      >
        {socialNodes ? <SocialLoginButtons /> : <DefaultButtons />}
        <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
      </form>
    </div>
  );
}

export default SocialAuth;
