import React, { useEffect, useState } from 'react'

import { useTransition, useSpring, useSpringRef, useChain, animated } from '@react-spring/web'
import { Outlet, useSearchParams } from 'react-router-dom'

import './styles/Security.css'
import { QrIcon } from '@ledget/shared-assets'
import { Switch, GrayButton, LoadingRingDiv, NodeImage } from '@ledget/shared-ui'
import { useGetMeQuery, useUpdateUserMutation } from '@features/userSlice'
import { useLazyGetSettingsFlowQuery } from '@features/orySlice'


const QrCodeSetup = ({ flow }) => {
    const [qrNode, setQrNode] = useState(null)

    useEffect(() => {
        console.log(flow.ui.nodes)
        if (flow) {
            setQrNode(flow.ui.nodes.find(node => (node.group === 'totp' && node.type === 'img')))
        }
    }, [flow])

    const containerApi = useSpringRef()
    const containerProps = useSpring({
        height: qrNode ? '300px' : '0px',
        ref: containerApi
    })

    const imgApi = useSpringRef()
    const transitions = useTransition(qrNode, {
        from: {
            opacity: 0,
            borderRadius: 'var(--border-radius3)',
            backgroundColor: 'var(--window)',
            padding: '12px',
            margin: '0 auto'
        },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 200 },
        ref: imgApi
    })

    useChain([containerApi, imgApi], [0, 0])

    return (
        <animated.div style={containerProps}>
            {transitions((style, item) => (
                item &&
                <animated.div style={style}>
                    <NodeImage node={item} attributes={item.attributes} />
                </animated.div>
            ))}
        </animated.div>
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
    const [getSettingsFlow,
        {
            data: flow,
            isLoading: loadingFlow,
            isSuccess: fetchedFlow
        }
    ] = useLazyGetSettingsFlowQuery()

    const [authenticator, setAuthenticator] = useState(user.authenticator_enabled)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (fetchedFlow) {
            setSearchParams({ flow: flow.id })
        }
    }, [fetchedFlow, loadingFlow])

    useEffect(() => {
        if (searchParams.get('flow')) {
            getSettingsFlow({ flowId: searchParams.get('flow') })
            setAuthenticator(true)
        }
    }, [])

    const handleClick = async () => {
        if (!authenticator) {
            const flowId = searchParams.get('flow')
            getSettingsFlow({ flowId: flowId })
        } else {
            updateUser({ authenticator_enabled: false })
            setSearchParams({})
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
                    loading={updatingUser || loadingFlow}
                    color="dark"
                    id="authenticator-settings--container"
                >
                    {flow ? <QrCodeSetup flow={flow} /> : <AuthenticatorInfo />}
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
