import React, { useEffect, useState } from 'react'

import { Outlet, useSearchParams } from 'react-router-dom'

import './styles/Security.css'
import { QrIcon } from '@ledget/shared-assets'
import { Switch, GrayButton, LoadingRingDiv } from '@ledget/shared-ui'
import { useGetMeQuery, useUpdateUserMutation } from '@features/userSlice'
import { useLazyGetSettingsFlowQuery } from '@features/orySlice'


const QrCodeSetup = ({ flow }) => {
    return (
        <div>
            Qr Code Setup
        </div>
    )
}

const AuthenticatorInfo = () => {
    const { data: user } = useGetMeQuery()

    return (
        <>
            {user.authenticator_enabled
                ?
                <>
                    <div>
                        <QrIcon width={'1.25em'} height={'1.25em'} />
                        <span>Added on {user.authenticator_added_on}</span>
                    </div>
                    <GrayButton>
                        change authenticator
                    </GrayButton>
                </>
                :
                <span className="faded-text">Not set up</span>
            }
        </>
    )
}

const Authenticator = () => {
    const { data: user } = useGetMeQuery()
    const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation()
    const [getSettingsFlow, { data: flow, isLoading: loadingFlow, isSuccess: fetchedFlow }] = useLazyGetSettingsFlowQuery()

    const [authenticator, setAuthenticator] = useState(user.authenticator_enabled)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        fetchedFlow && setSearchParams({ flow: flow.id })
    }, [fetchedFlow, loadingFlow])

    const handleClick = async () => {
        if (!authenticator) {
            const flowId = searchParams.get('flow')
            getSettingsFlow({ flowId: flowId })
        } else {
            updateUser({ authenticator_enabled: false })
        }
        setAuthenticator(!authenticator)
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
                    loading={updatingUser}
                    color="dark"
                    id="authenticator-settings--container"
                >
                    {flow
                        ? <QrCodeSetup flow={flow} />
                        : <AuthenticatorInfo />
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
