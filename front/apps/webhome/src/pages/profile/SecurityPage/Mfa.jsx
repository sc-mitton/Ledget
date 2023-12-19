import { useNavigate, createSearchParams } from 'react-router-dom'

import './styles/Mfa.css'
import { useGetMeQuery } from '@features/userSlice'
import { PlusPill, GrayButton, IconScaleButton, DeleteButton, Tooltip } from '@ledget/ui'
import { QrIcon, SmsAuthIcon, ReplayIcon, ShowIcon } from '@ledget/media'


const SmsAuth = ({ user }) => {
    const navigate = useNavigate()

    return (
        <div className="mfa-settings--container">
            {user.mfa_device === 'sms'
                ?
                <>
                    <div id="sms-auth-set-up">
                        <SmsAuthIcon width={'1.5em'} height={'1.5em'} />
                        <div>
                            <span>SMS Verification</span>
                            <span>Added {formatDate(user.mfa_enabled_on)}</span>
                        </div>
                    </div>
                    <GrayButton
                        onClick={() => navigate('/profile/security/delete-sms-verification')}
                    >
                        remove
                    </GrayButton>
                </>
                :
                <>
                    <div id="sms-auth-not-set-up">
                        <SmsAuthIcon width={'1.5em'} height={'1.5em'} />
                        <span
                            style={{ marginLeft: '-.125em' }}
                        >
                            Text Verification
                        </span>
                    </div>
                    <div>
                        <PlusPill
                            onClick={() => navigate('/profile/security/otp-setup')}
                        />
                    </div>
                </>
            }
        </div>
    )
}

const AuthenticatorApp = ({ user }) => {
    const navigate = useNavigate()

    const formatDate = (date) => {
        const d = new Date(date)
        const options = { month: 'short', day: 'numeric', year: 'numeric' }
        return d.toLocaleDateString('en-US', options)
    }

    return (
        <div className="mfa-settings--container">
            {user.mfa_method === 'totp'
                ?
                <>
                    <div id="authenticator-set-up">
                        <QrIcon width={'1.3em'} height={'1.3em'} />
                        <div>
                            <span>Authenticator App</span>
                            <span>Added {formatDate(user.mfa_enabled_on)}</span>
                        </div>
                    </div>
                    <div className="delete-btn--container">
                        <Tooltip
                            msg={"Remove authenticator"}
                            ariaLabel={"Remove authenticator"}
                            style={{ left: '-183%' }}
                        >
                            <DeleteButton
                                className="delete-button-show"
                                onClick={() => navigate('/profile/security/delete-authenticator')}
                                aria-label={"Delete Authenticator"}
                            />
                        </Tooltip>
                    </div>
                </>
                :
                <>
                    <div id="authenticator-not-set-up">
                        <QrIcon width={'1.25em'} height={'1.25em'} />
                        <span>Authenticator App</span>
                    </div>
                    <PlusPill onClick={() => navigate('/profile/security/authenticator-setup')} />
                </>
            }
        </div>
    )
}

const RecoveryCodes = () => {
    const navigate = useNavigate()

    return (
        <div id="recovery-codes-btns--container">
            <span>Recovery Codes</span>
            <div id="recovery-codes-btns">
                <Tooltip
                    msg={"Generate new codes"}
                    ariaLabel={"Generate new recovery codes"}
                    style={{ left: '-168%' }}
                >
                    <IconScaleButton
                        onClick={() => {
                            navigate({
                                pathname: '/profile/security/recovery-codes',
                                search: `?${createSearchParams({ lookup_secret_regenerate: true })}`
                            })
                        }}
                    >
                        <ReplayIcon fill="currentColor" />
                    </IconScaleButton>
                </Tooltip>
                <Tooltip
                    msg={"Show recovery codes"}
                    ariaLabel={"Show recovery codes"}
                    style={{ left: '-147%' }}
                >
                    <IconScaleButton
                        onClick={() => {
                            navigate({
                                pathname: '/profile/security/recovery-codes',
                                search: `?${createSearchParams({ lookup_secret_reveal: true })}`
                            })
                        }}
                    >
                        <ShowIcon stroke="currentColor" />
                    </IconScaleButton>
                </Tooltip>
            </div>
        </div>
    )
}

const Mfa = () => {
    const { data: user } = useGetMeQuery()

    return (
        <section>
            <div
                className="header2"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
                <h3>Multi-Factor</h3>
                {user.mfa_method === 'totp' && <RecoveryCodes />}
            </div>
            <div className="inner-window" id="mfa-options--container">
                <AuthenticatorApp user={user} />
                <SmsAuth user={user} />
            </div>
        </section>
    )
}

export default Mfa
