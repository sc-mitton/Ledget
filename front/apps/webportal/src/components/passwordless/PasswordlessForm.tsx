import React, { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import {
  filterNodesByGroups,
  isUiNodeInputAttributes,
} from '@ory/integrations/ui';
import { HelpCircle, Key } from '@geist-ui/icons';

import styles from './passwordless-form.module.scss';
import { GrayMainButton } from '@ledget/ui';

const WrappedHelpIcon = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleClick = () => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('help', 'true');
    setSearchParams(updatedSearchParams.toString());
  };

  return (
    <button
      className={styles.helpIconTip}
      aria-label="Learn more about authentication with passkeys"
      onClick={handleClick}
      tabIndex={0}
      type="button"
    >
      <HelpCircle size={'1.25em'} />
    </button>
  );
};

const PasswordlessOptionsHeader = () => {
  return (
    <div className={styles.passwordlessOptionHeader}>
      <div>or</div>
    </div>
  );
};

const Nodes = ({ flow, helpIcon = true }: { flow: any; helpIcon: boolean }) => {
  return (
    <>
      {filterNodesByGroups({
        nodes: flow.ui.nodes,
        groups: ['webauthn'],
        attributes: ['submit', 'button', 'hidden'],
      }).map((node) => {
        if (isUiNodeInputAttributes(node.attributes)) {
          const attrs = node.attributes;
          const nodeType = attrs.type;
          const submit = {
            type: attrs.type,
            name: attrs.name,
            ...(attrs.value && { value: attrs.value }),
          };
          switch (nodeType) {
            case 'button':
              if (attrs.onclick) {
                // This is a bit hacky but it wouldn't work otherwise.
                const oc = attrs.onclick;
                submit.onClick = () => {
                  eval(oc);
                };
              }
              return (
                <div
                  className={styles.passwordlessButtonContainer}
                  key={attrs.name}
                >
                  <GrayMainButton disabled={attrs.disabled} {...submit}>
                    <Key className="icon" />
                    <div style={{ marginLeft: '.25em' }}>Passkey</div>
                  </GrayMainButton>
                  {helpIcon && <WrappedHelpIcon />}
                </div>
              );
            default:
              return (
                <input
                  key={attrs.name}
                  name={attrs.name}
                  type={attrs.type}
                  defaultValue={attrs.value}
                  required={attrs.required}
                  disabled={attrs.disabled}
                />
              );
          }
        }
      })}
    </>
  );
};

const PasswordlessForm = ({
  flow,
  helpIcon = true,
  children,
}: {
  flow: any;
  helpIcon?: boolean;
  children?: React.ReactNode;
}) => {
  useEffect(() => {
    const scriptNodes = filterNodesByGroups({
      nodes: flow.ui.nodes,
      groups: 'webauthn',
      attributes: 'text/javascript',
      withoutDefaultGroup: true,
      withoutDefaultAttributes: true,
    }).map((node: any) => {
      const attr = node.attributes;
      const script = document.createElement('script');
      script.src = attr.src;
      script.type = attr.type;
      script.async = attr.async;
      script.referrerPolicy = attr.referrerpolicy;
      script.crossOrigin = attr.crossorigin;
      script.integrity = attr.integrity;
      document.body.appendChild(script);
      return script;
    });

    // cleanup
    return () => {
      scriptNodes.forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, [flow.ui.nodes]);

  return (
    <>
      <form action={flow.ui.action} method={flow.ui.method}>
        <div className={styles.passwordlessFormSectionContainer}>
          <PasswordlessOptionsHeader />
          <div className={styles.passwordlessInputsContainer}>
            <Nodes flow={flow} helpIcon={helpIcon} />
            {children}
          </div>
        </div>
      </form>
    </>
  );
};

export const PasskeySignIn = () => {
  return (
    <div className={styles.passwordlessFormSectionContainer}>
      <PasswordlessOptionsHeader />
      <div className={styles.passwordlessInputsContainer}>
        <GrayMainButton name="webauthn_register_trigger" value="webauthn">
          <Key className="icon" />
          <div style={{ marginLeft: '.25em' }}>Passkey</div>
        </GrayMainButton>
      </div>
    </div>
  );
};

export default PasswordlessForm;
