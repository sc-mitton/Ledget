import React from 'react'

import { useNavigate, Outlet } from 'react-router-dom'

import './styles/Security.css'
import { QrIcon } from '@ledget/shared-assets'
import { GrayButton, GrnSlimArrowButton } from '@ledget/shared-ui'
import { useGetMeQuery } from '@features/userSlice'


const AuthenticatorInfo = () => {
    const navigate = useNavigate()
    const { data: user } = useGetMeQuery()

    const formatDate = (date) => {
        const d = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' }
        return d.toLocaleDateString('en-US', options)
    }

    return (
        <>
            {user.authenticator_enabled
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
                <span className="faded-text">Not set up</span>
            }
        </>
    )
}

const AuthenticatorApp = () => {
    const navigate = useNavigate()
    const { data: user } = useGetMeQuery()

    return (
        <div>
            <div id="authenticator-settings--header">
                <h3 className="spaced-header2">Authenticator App</h3>
                {!user.authenticator_enabled
                    &&
                    <GrnSlimArrowButton
                        onClick={() => navigate('/profile/authenticator-setup')}
                        stroke={'var(--m-text-gray)'}
                    >
                        Set Up
                    </GrnSlimArrowButton>
                }
            </div>
            <div className="inner-window body">
                <div
                    color="dark"
                    id="authenticator-settings--container"
                >
                    <AuthenticatorInfo />
                </div>
            </div>
        </div>
    )
}

const Devices = () => {
    return (
        <div>
            <h3 className="spaced-header2">Devices</h3>
            <div className="inner-window body">
                <span>Devices</span>
            </div>
        </div>
    )
}

const Security = () => {
    return (
        <>
            <div className="padded-content" id="security-page">
                <h1 className="spaced-header">Security</h1>
                <Devices />
                <AuthenticatorApp />
            </div>
            <Outlet />
        </>
    )
}

export default Security
