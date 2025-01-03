import { Check } from '@geist-ui/icons';

import styles from './status-pulse.module.scss';
import { AuthenticatorImage, RecoveryCodeImage } from '@ledget/media';
import { shuffleArray } from '@ledget/helpers';
import { EnvelopeImage } from '@ledget/media';

interface StatusPulseProps {
  positive?: boolean;
  colorDefaultPositive?: boolean;
  size?: 'small' | 'medium' | 'medium-large' | 'large';
}

export const StatusPulse = ({
  positive,
  colorDefaultPositive = false,
  size = 'medium',
}: StatusPulseProps) => (
  <>
    <div
      className={[styles.innerCircle, styles.statusCircle].join(' ')}
      data-status={positive ? 'positive' : 'negative'}
      data-default={colorDefaultPositive ? 'positive' : 'negative'}
      data-size={size}
    />
    <div
      className={[styles.outerCircle, styles.statusCircle].join(' ')}
      data-status={positive ? 'positive' : 'negative'}
      data-default={colorDefaultPositive ? 'positive' : 'negative'}
      data-size={size}
    />
  </>
);

export const TotpAppGraphic = ({ finished = false }) => {
  return (
    <div className={styles.authFactorStatusGraphic}>
      {finished && (
        <div className={styles.successCheck}>
          <Check stroke={'var(--blue-dark'} size={'1.5em'} />
        </div>
      )}
      <AuthenticatorImage />
      <StatusPulse positive={finished} size="medium-large" />
    </div>
  );
};

export const RecoveryCodeGraphic = ({ finished = false }) => (
  <div className={styles.authFactorStatusGraphic}>
    <RecoveryCodeImage />
    <StatusPulse positive={finished} size="medium" />
  </div>
);

export const KeyPadGraphic = ({ finished = false }) => {
  const nums = Array(10)
    .fill(0)
    .map((_, index) => index + 1);
  const shuffledNums = shuffleArray(
    Array(10)
      .fill(0)
      .map((_, index) => index + 1)
  );

  return (
    <div className={styles.keypadGraphicStatus} data-finished={finished}>
      {nums.map((num, index) => (
        <div
          key={index}
          style={
            {
              '--key-animation-delay': `${shuffledNums[index]} * 100ms`,
            } as React.CSSProperties
          }
        >
          {num}
        </div>
      ))}
    </div>
  );
};

export const VerificationStatusGraphic = ({
  finished = false,
  dark = false,
}) => {
  return (
    <div className={styles.verifyGraphicContainer}>
      <EnvelopeImage dark={dark} />
      <div>
        <StatusPulse
          positive={finished}
          colorDefaultPositive={false}
          size={'medium-large'}
        />
      </div>
    </div>
  );
};
