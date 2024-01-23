
import './status-pulse.scss'
import { CheckMark, SmsAuthIcon, VerifyEmail, AuthenticatorImage, RecoveryCodeImage } from '@ledget/media'
import { shuffleArray } from '../../utils/funcs'


interface StatusPulseProps {
  positive: boolean,
  colorDefaultPositive?: boolean,
  size?: 'small' | 'medium' | 'medium-large' | 'large'
}

export const StatusPulse = ({ positive, colorDefaultPositive = false, size = 'medium' }: StatusPulseProps) => (
  <>
    <div
      id="inner-circle"
      className={`status-circle ${positive ? 'positive' : 'negative'} ${colorDefaultPositive ? 'color-default-positive' : ''} ${size}`}
    />
    <div
      id="outer-circle"
      className={`status-circle ${positive ? 'positive' : 'negative'} ${colorDefaultPositive ? 'color-default-positive' : ''} ${size}`}
    />
  </>
)

export const TotpAppGraphic = ({ finished = false }) => {

  return (
    <div className="auth-factor-status-graphic">
      {finished &&
        <div id="success-checkmark">
          <CheckMark
            stroke={'var(--blue-dark'}
          />
        </div>
      }
      <AuthenticatorImage />
      <StatusPulse positive={finished} size="medium-large" />
    </div>
  )
}

export const RecoveryCodeGraphic = ({ finished = false }) => (
  <div className="auth-factor-status-graphic">
    <RecoveryCodeImage />
    <StatusPulse positive={finished} size="medium" />
  </div>
)

export const KeyPadGraphic = ({ finished = false }) => {
  const nums = Array(10).fill(0).map((_, index) => index + 1)
  const shuffledNums = shuffleArray(
    Array(10).fill(0).map((_, index) => index + 1)
  )

  return (
    <div className={`keypad-graphic-status ${finished ? 'finished' : 'unfinished'}`}>
      {nums.map((num, index) => (
        <div
          key={index}
          style={{ '--key-animation-delay': `${shuffledNums[index]} * 100ms` } as React.CSSProperties}
        >
          {num}
        </div>
      ))}
    </div>
  )

}

export const SmsVerifyStatus = ({ finished = false, }) => (
  <div className="sms-verify-status">
    {finished &&
      <div id="success-checkmark">
        <CheckMark
          stroke={'var(--blue-light'}
        />
      </div>
    }
    <SmsAuthIcon
      width={'3.5em'}
      height={'3.5em'}
      fill={'var(--btn-dark-gray'}
    />
    <StatusPulse positive={finished} size="medium" />
  </div>
)

export const VerificationStatusGraphic = ({ finished = false }) => (
  <div id='verify-graphic--container'>
    <VerifyEmail />
    <div id="verification-pulse-status">
      <StatusPulse
        positive={finished}
        colorDefaultPositive={false}
        size={'small'}
      />
    </div>
  </div>
)
