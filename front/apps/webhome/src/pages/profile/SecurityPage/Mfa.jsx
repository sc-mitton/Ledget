import React from 'react'

import { useNavigate } from 'react-router-dom'

import './styles/Mfa.css'
import { useGetMeQuery } from '@features/userSlice'
import { Tooltip } from '@components/pieces'
import { PlusPill, GrayButton, IconScaleButton } from '@ledget/shared-ui'
import { QrIcon, ReplayIcon, ShowIcon } from '@ledget/shared-assets'


const AuthenticatorApp = ({ user }) => {
    const navigate = useNavigate()

    const formatDate = (date) => {
        const d = new Date(date)
        const options = { month: 'short', day: 'numeric', year: 'numeric' }
        return d.toLocaleDateString('en-US', options)
    }

    return (
        <div id="authenticator-settings--container">
            {user.mfa_method === 'authenticator'
                ?
                <>
                    <div id="authenticator-set-up">
                        <QrIcon width={'1.3em'} height={'1.3em'} />
                        <div>
                            <span>Authenticator App</span>
                            <span>Added {formatDate(user.authenticator_enabled_on)}</span>
                        </div>
                    </div>
                    <GrayButton onClick={() => navigate('/profile/security/delete-authenticator')}>
                        remove
                    </GrayButton>
                </>
                :
                <>
                    <div id="authenticator-not-set-up">
                        <QrIcon width={'1.25em'} height={'1.25em'} />
                        <span>Authenticator App</span>
                    </div>
                    <div>
                        <PlusPill onClick={() => navigate('/profile/security/authenticator-setup')} />
                    </div>
                </>
            }
        </div>
    )
}

const RecoveryCodes = () => {
    const navigate = useNavigate()

    return (
        <div id="recovery-codes-buttons--container">
            <span>Recovery Codes</span>
            <div id="recovery-codes-buttons">
                <Tooltip
                    msg={"Generate new codes"}
                    ariaLabel={"Generate new recovery codes"}
                    style={{ left: '-260%' }}
                >
                    <IconScaleButton >
                        <ReplayIcon
                            fill="currentColor"
                            onClick={() => {
                                navigate({
                                    pathname: '/profile/security/recovery-codes',
                                    query: { lookup_secret_regenerate: true },
                                })
                            }}
                        />
                    </IconScaleButton>
                </Tooltip>
                <Tooltip
                    msg={"Show recovery codes"}
                    ariaLabel={"Show recovery codes"}
                    style={{ left: '-220%' }}
                >
                    <IconScaleButton >
                        <ShowIcon
                            stroke="currentColor"
                            onClick={() => {
                                navigate({
                                    pathname: '/profile/security/recovery-codes',
                                    query: { lookup_secret_reveal: true },
                                })
                            }}
                        />
                    </IconScaleButton>
                </Tooltip>
            </div>
        </div>
    )
}

const Mfa = () => {
    const { data: user } = useGetMeQuery()

    return (
        <>
            <div
                className="header2"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
                <h3>Multi-Factor</h3>
                {user.mfa_method && <RecoveryCodes />}
            </div>
            <div className="inner-window">
                <AuthenticatorApp user={user} />
            </div>
        </>
    )
}

export default Mfa
