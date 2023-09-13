import React, { useState, useEffect } from 'react'

import { Outlet, useSearchParams } from 'react-router-dom'

import './styles/Security.css'
import { QrIcon } from '@ledget/shared-assets'
import { Switch, ExpandableContainer, LoadingRingDiv } from '@ledget/shared-ui'
import { useGetMeQuery, useUpdateUserMutation } from '@features/userSlice'
import { ory } from '@flow/ory'


const QrCodeSetup = ({ flow }) => {
    return (
        <div>Qr Code Setup</div>
    )
}

const Authenticator = () => {
    const { data: user } = useGetMeQuery()
    const [updateUser] = useUpdateUserMutation()
    const [authenticator, setAuthenticator] = useState(user.authenticator_enabled)
    const [searchParams, setSearchParams] = useSearchParams()
    const [flow, setFlow] = useState(null)

    useEffect(() => {
        setAuthenticator(user.authenticator_enabled)
    }, [user])

    const handleClick = () => {
        const flow = searchParams.get('flow')
        if (flow) {
            setFlow(ory.getSettingsFlow())
        } else if (!authenticator) {
            setFlow(ory.createSettingsFlow())
            setSearchParams({ flow: flow.id })
        } else {
            updateUser({ data: { authenticator_enabled: false } })
        }
    }

    return (
        <div>
            <Switch
                checked={authenticator}
                onChange={setAuthenticator}
                onClick={handleClick}
            >
                <h4 className="spaced-header2">Authenticator App</h4>
            </Switch>
            <div className="inner-window body">
                <LoadingRingDiv
                    loading={true}
                    color="dark"
                    id="authenticator-settings--container"
                >
                    {flow
                        ? <QrCodeSetup flow={flow} />
                        : <span className="faded-text">Not set up</span>
                    }
                </LoadingRingDiv>
            </div>
        </div>
    )
}

const Devices = () => {
    return (
        <div>
            <h4 className="spaced-header2">Devices</h4>
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
                <Authenticator />
            </div>
            <Outlet />
        </>
    )
}

export default Security
