
import './styles/status-pulse.css'
import { CheckMark, SmsAuthIcon, VerifyEmail } from '@ledget/assets'
import authenticator from 'shared-assets/src/images/authenticator.svg'
import recoveryCodeGraphic from 'shared-assets/src/images/recoveryCodeGraphic.svg'
import { shuffleArray } from '@ledget/utils'

export const StatusPulse = ({ positive, colorDefaultPositive, size }) => (
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

export const TotpAppGraphic = (props) => {
    const { finished } = props

    return (
        <div className="auth-factor-status-graphic">
            {finished &&
                <div id="success-checkmark">
                    <CheckMark
                        stroke={'var(--green-dark'}
                    />
                </div>
            }
            <img src={authenticator} alt="Authenticator" />
            <StatusPulse positive={finished} size="medium-large" />
        </div>
    )
}

export const RecoveryCodeGraphic = (props) => (
    <div className="auth-factor-status-graphic">
        <img src={recoveryCodeGraphic} alt="Authenticator" />
        <StatusPulse positive={props.finished} size="medium" />
    </div>
)


export const KeyPadGraphic = (props) => {
    const { finished } = props
    const nums = Array(10).fill().map((_, index) => index + 1)
    const shuffledNums = shuffleArray(
        Array(10).fill().map((_, index) => index + 1)
    )

    return (
        <div className={`keypad-graphic-status ${finished ? 'finished' : 'unfinished'}`}>
            {nums.map((num, index) => (
                <div
                    key={index}
                    style={{ '--key-animation-delay': shuffledNums[index] }}
                >
                    {num}
                </div>
            ))}
        </div>
    )
}

export const SmsVerifyStatus = (props) => (
    <div className="sms-verify-status">
        {props.finished &&
            <div id="success-checkmark">
                <CheckMark
                    stroke={'var(--green-hlight'}
                />
            </div>
        }
        <SmsAuthIcon
            width={'3.5em'}
            height={'3.5em'}
        />
        <StatusPulse positive={props.finished} size="medium" />
    </div>
)

export const VerificationStatusGraphic = (props) => (
    <div id='verify-graphic--container'>
        <VerifyEmail />
        <div id="verification-pulse-status">
            <StatusPulse
                positive={props.finished}
                colorDefaultPositive={false}
                size={'small'}
            />
        </div>
    </div>
)
