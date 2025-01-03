import { AlertCircle } from '@geist-ui/icons';

import styles from './error-banner.module.scss';

export const ErrorBanner = ({
  title,
  msg,
}: {
  title?: string;
  msg?: string;
}) => {
  return (
    <div className={styles.errorBanner}>
      <AlertCircle size={'2em'} />
      <div>
        <h4>{title}</h4>
        <span>{msg}</span>
      </div>
    </div>
  );
};
