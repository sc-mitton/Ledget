import { Fragment } from 'react';
import styles from './form-errors.module.scss';

import { AlertCircle, AlertCircleFill } from '@geist-ui/icons';

export interface Error {
  message?: string;
  type: string;
}

export const FormErrorTip = ({ error }: { error?: Error }) => (
  <>
    {(error?.type === 'required' ||
      error?.message?.toLowerCase() === 'required') && (
      <div className={styles.errorTip}>
        <AlertCircleFill
          stroke={'var(--m-invert-text)'}
          strokeWidth={2}
          size="1.375em"
        />
      </div>
    )}
  </>
);

export const FormError = ({
  msg,
  insideForm = true,
}: {
  msg: string | string[];
  insideForm?: boolean;
}) => {
  const renderLines = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  return (
    <>
      {msg && (
        <>
          {typeof msg === 'string'
            ? !msg.includes('required') && (
                <div
                  className={styles.formErrorContainer}
                  data-inside={insideForm}
                >
                  <AlertCircle size={'1.5em'} />
                  <div className={styles.formError}>{renderLines(msg)}</div>
                </div>
              )
            : msg.map(
                (m, index) =>
                  !m.includes('required') && (
                    <div className={styles.formErrorContainer} key={index}>
                      <AlertCircle size={'1.5em'} />
                      <div className={styles.formError}>{renderLines(m)}</div>
                    </div>
                  )
              )}
        </>
      )}
    </>
  );
};
