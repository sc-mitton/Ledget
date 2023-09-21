import React from 'react'

import { useNavigate, Outlet } from 'react-router-dom'

import './styles/Security.css'
import { QrIcon } from '@ledget/shared-assets'
import { PlusPill, GrayButton, ShimmerDiv } from '@ledget/shared-ui'
import {
    useGetMeQuery,
    useGetDevicesQuery,
    useDeleteRememberedDeviceMutation,
} from '@features/userSlice'



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
    <div>
        <div id="authenticator-settings--header">
            <h3 className="spaced-header2">Multi-Factor Authentication</h3>
        </div>
        <div className="inner-window">
            <AuthenticatorApp />
        </div>
    </div>
)

const Devices = ({ devices }) => {

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
    const { data: devices, isLoading } = useGetDevicesQuery()

    return (
        <ShimmerDiv shimmering={isLoading}>
            <div className="padded-content" id="security-page">
                <h1 className="spaced-header">Security</h1>
                <Devices devices={devices} />
                <Mfa />
            </div>
            <Outlet />
        </ShimmerDiv>
    )
}

export default Security
