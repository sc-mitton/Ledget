import { useNavigate } from 'react-router-dom'

import './styles/Mfa.scss'
import { useGetMeQuery } from '@features/userSlice'
import { useLazyGetSettingsFlowQuery } from '@features/orySlice'
import { CircleIconButton, BlueSlimButton, Tooltip, BlueTextButton } from '@ledget/ui'
import { QrIcon } from '@ledget/media'
import { useEffect } from 'react'

const AuthenticatorApp = ({ user }) => {
    const navigate = useNavigate()

    const formatDate = (date) => {
        const d = new Date(date)
        const options = { month: 'short', day: 'numeric', year: 'numeric' }
        return d.toLocaleDateString('en-US', options)
    }

    useEffect(() => { console.log('useLazyGetSettingsFlowQuery', useLazyGetSettingsFlowQuery) }, [])

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
                        >
                            <BlueSlimButton
                                onClick={() => navigate('/profile/security/delete-authenticator')}
                                aria-label={"Remove Authenticator"}>
                                Remove
                            </BlueSlimButton>
                        </Tooltip>
                    </div>
                </>
                :
                <>
                    <div id="authenticator-not-set-up">
                        <QrIcon width={'1.25em'} height={'1.25em'} />
                        <span>Authenticator App</span>
                    </div>
                    <CircleIconButton onClick={() => navigate('/profile/security/authenticator-setup')} darker={true} >
                        <Plus size={'1em'} />
                    </CircleIconButton>
                </>
            }
        </div>
    )
}

const Mfa = () => {
    const { data: user } = useGetMeQuery()
    const navigate = useNavigate()

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
                <h4>Multi-Factor</h4>
            </div>
            <div className="inner-window" id="mfa-options--container">
                <AuthenticatorApp user={user} />
            </div>
            {user.mfa_method === 'totp' &&
                <div><Tooltip msg={'Recovery codes'} ariaLabel={'Recovery codes'}>
                    <BlueTextButton onClick={() => navigate('/profile/security/recovery-codes')} >
                        Recovery Codes</BlueTextButton>
                </Tooltip></div>}
        </section>
    )
}

export default Mfa
