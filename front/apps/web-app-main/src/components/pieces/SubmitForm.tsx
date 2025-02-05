import { HTMLAttributes } from 'react';

import { SecondaryButton, BlueSubmitButton } from '@ledget/ui';
import styles from './styles/submit-form.module.scss';
interface I {
  submitting: boolean;
  text?: string;
  success?: boolean;
  onCancel: () => void;
}

const SubmitForm: React.FC<I & HTMLAttributes<HTMLButtonElement>> = ({
  submitting,
  text,
  success,
  onCancel,
  ...submitProps
}: I) => {
  return (
    <div className={styles.submitForm}>
      <SecondaryButton
        type="button"
        onClick={onCancel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onCancel();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Cancel"
        aria-roledescription="button"
        style={{ cursor: 'pointer', borderRadius: '8px' }}
      >
        Cancel
      </SecondaryButton>
      <BlueSubmitButton
        success={success}
        submitting={submitting}
        {...submitProps}
      >
        {text ? `${text}` : 'Save'}
      </BlueSubmitButton>
    </div>
  );
};

export default SubmitForm;
