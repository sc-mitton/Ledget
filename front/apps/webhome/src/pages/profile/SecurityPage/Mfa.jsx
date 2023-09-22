import React from 'react'

import { useNavigate } from 'react-router-dom'

import { useGetMeQuery } from '@features/userSlice'
import { PlusPill, GrayButton } from '@ledget/shared-ui'
import { QrIcon } from '@ledget/shared-assets'


const AuthenticatorApp = () => {
    const navigate = useNavigate()
    const { data: user } = useGetMeQuery()

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
                    <div>
                        <QrIcon width={'1.25em'} height={'1.25em'} />
                        <span>Added on {formatDate(user.authenticator_enabled_on)}</span>
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

const Mfa = () => (
    <>
        <h3>Multi-Factor Authentication</h3>
        <div className="inner-window">
            <AuthenticatorApp />
        </div>
    </>
)

export default Mfa
